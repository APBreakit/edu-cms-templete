"use client"

import type React from "react"
import Image from "next/image"
import { Upload, X, FileText } from "lucide-react"
import { optimizeImage } from "@/lib/utils/image-optimizer"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createGallery, updateGallery, getGalleryCategories, getMediaFiles } from "@/app/actions/admin-actions"
import { getGroupsPublic } from "@/app/actions/public-actions"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

interface Gallery {
  id: string
  title: string
  slug: string
  description: string | null
  category: string | null
  cover_image_url: string | null
  status: string | null
}

interface MediaFile {
  id: string
  file_url: string
  file_name: string
  created_at: string
}

export default function GalleryForm({ gallery, userId }: { gallery?: Gallery; userId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>(gallery?.cover_image_url || "")
  const [galleryImages, setGalleryImages] = useState<Array<{ url: string; file?: File; title?: string }>>([])
  const [uploadingGallery, setUploadingGallery] = useState(false)
  const [categories, setCategories] = useState<Array<{ id: string; name: string; slug: string; visible: boolean }>>([])
  const [groups, setGroups] = useState<Array<{ slug: string; name: string }>>([])
  const [groupSlug, setGroupSlug] = useState<string>("")

  const [showMediaPicker, setShowMediaPicker] = useState(false)
  const [existingMedia, setExistingMedia] = useState<MediaFile[]>([])
  const [loadingMedia, setLoadingMedia] = useState(false)

  const [formData, setFormData] = useState({
    title: gallery?.title || "",
    slug: gallery?.slug || "",
    description: gallery?.description || "",
    categories: (gallery as any)?.categories || (gallery?.category ? [gallery.category] : ["inne"]),
    cover_image_url: gallery?.cover_image_url || "",
    status: gallery?.status || "draft",
  })

  useEffect(() => {
    const loadExistingMedia = async () => {
      if (!showMediaPicker) return

      setLoadingMedia(true)
      try {
        const rows = await getMediaFiles()
        const normalized = (rows || []).filter((m: any) => (m.file_type || '').toLowerCase() === 'image').map((m: any) => ({
          id: m.id,
          file_url: m.file_url || m.image_url || m.url,
          file_name: m.file_name || 'plik',
          created_at: m.created_at || new Date().toISOString(),
        }))
        setExistingMedia(normalized)
      } catch (error) {
        console.error("[v0] Error loading media:", error)
      } finally {
        setLoadingMedia(false)
      }
    }

    loadExistingMedia()
  }, [showMediaPicker])

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const rows = await getGalleryCategories()
        setCategories(rows as any)
      } catch (e) {}
    }
    loadCategories()
    ;(async () => {
      try {
        const rows = await getGroupsPublic()
        setGroups((rows || []).map((g: any) => ({ slug: String(g.slug), name: String(g.name) })))
      } catch {}
    })()
  }, [])

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/ą/g, "a")
      .replace(/ć/g, "c")
      .replace(/ę/g, "e")
      .replace(/ł/g, "l")
      .replace(/ń/g, "n")
      .replace(/ó/g, "o")
      .replace(/ś/g, "s")
      .replace(/ź|ż/g, "z")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
  }

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: gallery ? prev.slug : generateSlug(title),
    }))
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      alert("Proszę wybrać plik graficzny")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Plik jest zbyt duży. Maksymalny rozmiar to 5MB")
      return
    }

    setUploading(true)

    try {
      const optimizedFile = await optimizeImage(file, 1920, 0.85)

      const formData = new FormData()
      formData.append("file", optimizedFile)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        console.error("[v0] Upload failed:", error)
        throw new Error(error.details || "Upload failed")
      }

      const data = await response.json()
      const publicUrl = data.url

      setFormData((prev) => ({ ...prev, cover_image_url: publicUrl }))
      setImagePreview(publicUrl)
    } catch (err) {
      console.error("[v0] Upload error:", err)
      alert(err instanceof Error ? err.message : "Błąd podczas wgrywania pliku")
    } finally {
      setUploading(false)
    }
  }

  const handleGalleryImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        alert(`${file.name} nie jest plikiem graficznym`)
        return false
      }
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} jest zbyt duży. Maksymalny rozmiar to 5MB`)
        return false
      }
      return true
    })

    if (validFiles.length === 0) return

    const optimizedPromises = validFiles.map(async (file) => {
      const optimized = await optimizeImage(file, 1920, 0.85)
      return {
        url: URL.createObjectURL(optimized),
        file: optimized,
        title: file.name,
      }
    })

    const newPreviews = await Promise.all(optimizedPromises)
    console.log("[v0] Gallery images optimized and ready")
    setGalleryImages((prev) => [...prev, ...newPreviews])
  }

  const handleSelectExistingMedia = (mediaUrl: string) => {
    if (galleryImages.some((img) => img.url === mediaUrl)) {
      alert("To zdjęcie już zostało dodane")
      return
    }

    setGalleryImages((prev) => [...prev, { url: mediaUrl }])
  }

  const removeGalleryImage = (index: number) => {
    setGalleryImages((prev) => {
      const newImages = [...prev]
      if (newImages[index].url.startsWith("blob:")) {
        URL.revokeObjectURL(newImages[index].url)
      }
      newImages.splice(index, 1)
      return newImages
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Prepare images array for gallery creation
      const imagesForGallery = []

      if (galleryImages.length > 0) {
        setUploadingGallery(true)
        console.log("[v0] Uploading", galleryImages.length, "gallery images")

        for (const imageData of galleryImages) {
          try {
            let imageUrl = imageData.url

            // If it's a new file (blob URL), upload it first
            if (imageData.file) {
              const formData = new FormData()
              formData.append("file", imageData.file)

              const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
              })

              if (!response.ok) {
                console.error("[v0] Error uploading image file")
                continue
              }

              const data = await response.json()
              imageUrl = data.url
              console.log("[v0] Image uploaded:", imageUrl)
            }

            imagesForGallery.push({
              url: imageUrl,
              title: imageData.title || null,
            })
          } catch (error) {
            console.error("[v0] Error processing image:", error)
            continue
          }
        }

        setUploadingGallery(false)
      }

      let result
      if (gallery) {
        result = await updateGallery(gallery.id, {
          ...formData,
          categories: Array.from(new Set([...(formData as any).categories, ...(groupSlug ? ["grupa-" + groupSlug] : [])])),
        })
      } else {
        result = await createGallery(
          {
            ...formData,
            category: groupSlug ? "grupa-" + groupSlug : (formData as any).category,
            categories: Array.from(new Set([...(formData as any).categories, ...(groupSlug ? ["grupa-" + groupSlug] : [])])),
            created_by: userId,
          },
          imagesForGallery,
        )
      }

      if (!result.success) {
        throw new Error(result.error)
      }

      toast.success("Zapisano")
      router.push("/admin/galleries")
      router.refresh()
    } catch (err) {
      console.error("[v0] Error saving gallery:", err)
      alert(err instanceof Error ? err.message : "Błąd podczas zapisywania galerii")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="title">Tytuł galerii *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          required
          placeholder="np. Wycieczka do zoo"
        />
      </div>

      <div>
        <Label htmlFor="slug">Slug (URL)</Label>
        <Input
          id="slug"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          required
          placeholder="wycieczka-do-zoo"
        />
        <p className="text-sm text-gray-600 mt-1">Adres URL galerii (generowany automatycznie)</p>
      </div>

      <div>
        <Label htmlFor="description">Opis</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Krótki opis galerii..."
          rows={3}
        />
      </div>

      <div>
        <Label>Kategorie *</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {(categories.length > 0 ? categories : [
            { id: 'wydarzenia', name: 'Wydarzenia', slug: 'wydarzenia', visible: true },
            { id: 'przedszkole', name: 'Przedszkole', slug: 'przedszkole', visible: true },
            { id: 'sale', name: 'Sale', slug: 'sale', visible: true },
            { id: 'zajecia', name: 'Zajęcia', slug: 'zajecia', visible: true },
            { id: 'zajecia-tematyczne', name: 'Zajęcia tematyczne', slug: 'zajecia-tematyczne', visible: true },
            { id: 'inne', name: 'Inne', slug: 'inne', visible: true },
          ]).map((c) => (
            <label key={c.slug} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={(formData as any).categories.includes(c.slug)}
                onChange={(e) => {
                  const checked = e.target.checked
                  const current = (formData as any).categories || []
                  const next = checked ? Array.from(new Set([...current, c.slug])) : current.filter((x: string) => x !== c.slug)
                  setFormData({ ...(formData as any), categories: next })
                }}
              />
              {c.name}
            </label>
          ))}
        </div>
      </div>

      <div>
        <Label>Powiąż z grupą (opcjonalnie)</Label>
        <select
          value={groupSlug}
          onChange={(e) => setGroupSlug(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Brak</option>
          {groups.map((g) => (
            <option key={g.slug} value={g.slug}>Grupa {g.name}</option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-1">Wybranie grupy doda kategorię „grupa-{groupSlug}” i umożliwi wyświetlenie galerii na stronie grupy.</p>
      </div>

      <div>
        <Label>Zdjęcie okładki</Label>
        <div className="space-y-3">
          {imagePreview && (
            <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200">
              <Image src={imagePreview || "/placeholder.svg"} alt="Podgląd" fill className="object-cover" />
            </div>
          )}
          <label>
            <Button type="button" variant="outline" className="w-full bg-transparent" disabled={uploading} asChild>
              <span>
                <Upload className="w-4 h-4 mr-2" />
                {uploading ? "Wgrywanie..." : "Wgraj zdjęcie"}
              </span>
            </Button>
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" disabled={uploading} />
          </label>

          <div>
            <Label htmlFor="cover_image_url">Lub wklej URL zdjęcia</Label>
            <Input
              id="cover_image_url"
              value={formData.cover_image_url}
              onChange={(e) => {
                setFormData({ ...formData, cover_image_url: e.target.value })
                setImagePreview(e.target.value)
              }}
              placeholder="https://..."
            />
          </div>
        </div>
      </div>

      <div>
        <Label>Zdjęcia galerii</Label>
        <p className="text-sm text-gray-600 mb-3">Dodaj nowe zdjęcia do galerii</p>

        {galleryImages.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {galleryImages.map((image, index) => (
              <div key={index} className="relative group">
                <div className="relative w-full h-32 rounded-lg overflow-hidden border border-gray-200">
                  <Image
                    src={image.url || "/placeholder.svg"}
                    alt={`Zdjęcie ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeGalleryImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <label className="flex-1">
            <Button
              type="button"
              variant="outline"
              className="w-full bg-transparent"
              disabled={uploadingGallery}
              asChild
            >
              <span>
                <Upload className="w-4 h-4 mr-2" />
                {uploadingGallery ? "Wgrywanie..." : "Wgraj nowe zdjęcia"}
              </span>
            </Button>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleGalleryImagesUpload}
              className="hidden"
              disabled={uploadingGallery}
            />
          </label>

          <Button
            type="button"
            variant="outline"
            onClick={() => setShowMediaPicker(true)}
            disabled={uploadingGallery}
            className="flex-1"
          >
            <FileText className="w-4 h-4 mr-2" />
            Wybierz z biblioteki
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Możesz wgrać nowe zdjęcia lub wybrać z już dodanych. Maksymalny rozmiar pojedynczego pliku: 5MB
        </p>
      </div>

      <div>
        <Label htmlFor="status">Status *</Label>
        <select
          id="status"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        >
          <option value="draft">Szkic</option>
          <option value="published">Opublikowana</option>
        </select>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {gallery ? "Zapisz zmiany" : "Utwórz galerię"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
          Anuluj
        </Button>
      </div>

      {showMediaPicker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold">Wybierz zdjęcia z biblioteki</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowMediaPicker(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {loadingMedia ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                </div>
              ) : existingMedia.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p>Brak zdjęć w bibliotece</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {existingMedia.map((media) => (
                    <button
                      key={media.id}
                      type="button"
                      onClick={() => {
                        handleSelectExistingMedia(media.file_url)
                        setShowMediaPicker(false)
                      }}
                      className="relative group aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-blue-500 transition-colors"
                    >
                      <Image
                        src={media.file_url || "/placeholder.svg"}
                        alt={media.file_name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity flex items-center justify-center">
                        <span className="text-white opacity-0 group-hover:opacity-100 text-sm font-medium">
                          Wybierz
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </form>
  )
}
