"use client"

import type React from "react"
import { optimizeImage } from "@/lib/utils/image-optimizer"
import { getGroupsPublic } from "@/app/actions/public-actions"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createPost, updatePost } from "@/app/actions/admin-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Save, Upload, X, Image as ImageIcon } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { MediaPicker } from "@/components/admin/media-picker"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { FileEdit, Eye, History, CheckCircle2 } from "lucide-react"

interface PostFormProps {
  userId: string
  post?: {
    id: string
    title: string
    content: string | null
    excerpt: string | null
    type: string
    status: string | null
    image_url: string | null
    add_to_calendar: boolean | null
    calendar_date: string | null | Date
    calendar_end_date: string | null | Date
    competition_status: string | null
    competition_start_date: string | null | Date
    competition_end_date: string | null | Date
    group_category: string | null // Added group_category field
    images?: string[] | null
  }
}

export default function PostForm({ userId, post }: PostFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>(post?.image_url || "")
  const [images, setImages] = useState<string[]>(() => {
    let parsed = post?.images || []
    if (typeof parsed === 'string') {
      try { parsed = JSON.parse(parsed) } catch (e) { parsed = [] }
    }
    if (typeof parsed === 'string') {
      try { parsed = JSON.parse(parsed) } catch (e) { parsed = [] }
    }
    return Array.isArray(parsed) ? parsed : []
  })
  const [groups, setGroups] = useState<Array<{ slug: string; name: string }>>([])
  const allowedPostTypes = ["aktualnosci", "ogloszenia", "konkursy", "rada-rodzicow", "okiem-specjalisty"]

  const toInputDate = (v: any) => {
    if (!v) return ""
    try {
      const d = typeof v === "string" ? new Date(v) : new Date(v)
      const iso = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString()
      return iso.slice(0, 16)
    } catch {
      return typeof v === "string" ? v : ""
    }
  }

  const [formData, setFormData] = useState({
    title: post?.title || "",
    content: post?.content || "",
    excerpt: post?.excerpt || "",
    type: post?.type && allowedPostTypes.includes(post.type) ? post.type : "aktualnosci",
    status: post?.status || "draft",
    image_url: post?.image_url || "",
    add_to_calendar: post?.add_to_calendar || false,
    calendar_date: toInputDate(post?.calendar_date || ""),
    calendar_end_date: toInputDate(post?.calendar_end_date || ""),
    competition_status: post?.competition_status || "",
    competition_start_date: toInputDate(post?.competition_start_date || ""),
    competition_end_date: toInputDate(post?.competition_end_date || ""),
    group_category: post?.group_category || "",
  })

  useEffect(() => {
    ; (async () => {
      try {
        const rows = await getGroupsPublic()
        setGroups((rows || []).map((g: any) => ({ slug: String(g.slug), name: String(g.name) })))
      } catch { }
    })()
  }, [])

  // Auto-save logic
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  useEffect(() => {
    if (!post) { // Only auto-save for new posts to avoid overwriting existing ones accidentally
      const timer = setTimeout(() => {
        const draft = JSON.stringify(formData)
        localStorage.setItem(`post_draft_${userId}`, draft)
        setLastSaved(new Date())
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [formData, userId, post])

  useEffect(() => {
    if (!post) {
      const saved = localStorage.getItem(`post_draft_${userId}`)
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          setFormData(prev => ({ ...prev, ...parsed }))
          toast.info("Wczytano ostatnią wersję roboczą")
        } catch (e) {
          console.error("Failed to load draft:", e)
        }
      }
    }
  }, [userId, post])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setError("Proszę wybrać plik graficzny")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Plik jest zbyt duży. Maksymalny rozmiar to 5MB")
      return
    }

    setUploading(true)
    setError(null)

    try {
      const optimizedFile = await optimizeImage(file, 1920, 0.85)

      const formDataFile = new FormData()
      formDataFile.append("file", optimizedFile)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formDataFile,
      })

      if (!response.ok) {
        const error = await response.json()
        console.error("[v0] Upload failed:", error)
        throw new Error(error.details || "Upload failed")
      }

      const data = await response.json()
      const publicUrl = data.url

      setFormData((prev) => ({ ...prev, image_url: publicUrl }))
      setImagePreview(publicUrl)
    } catch (err) {
      console.error("[v0] Upload error:", err)
      setError(err instanceof Error ? err.message : "Błąd podczas wgrywania pliku")
    } finally {
      setUploading(false)
    }
  }

  const handleMultipleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    setUploading(true)
    setError(null)

    try {
      const uploadedUrls: string[] = []

      for (const file of files) {
        if (!file.type.startsWith("image/")) continue
        if (file.size > 5 * 1024 * 1024) continue

        const optimizedFile = await optimizeImage(file, 1920, 0.85)
        const formDataFile = new FormData()
        formDataFile.append("file", optimizedFile)

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formDataFile,
        })

        if (response.ok) {
          const data = await response.json()
          uploadedUrls.push(data.url)
        }
      }

      setImages((prev) => [...prev, ...uploadedUrls])
    } catch (err) {
      console.error("[v0] Multiple upload error:", err)
      setError(err instanceof Error ? err.message : "Błąd podczas wgrywania plików")
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setFormData({ ...formData, image_url: "" })
    setImagePreview("")
  }

  const handleRemoveAdditionalImage = (indexToRemove: number) => {
    setImages(images.filter((_, i) => i !== indexToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const postData = {
      title: formData.title,
      content: formData.content,
      excerpt: formData.excerpt,
      type: formData.type,
      status: formData.status,
      image_url: formData.image_url || null,
      add_to_calendar: formData.add_to_calendar,
      calendar_date: formData.calendar_date || null,
      calendar_end_date: formData.calendar_end_date || null,
      competition_status: formData.type === "konkursy" ? formData.competition_status || null : null,
      competition_start_date: formData.type === "konkursy" ? formData.competition_start_date || null : null,
      competition_end_date: formData.type === "konkursy" ? formData.competition_end_date || null : null,
      group_category: formData.group_category || null,
      user_id: userId,
      published: formData.status === "published",
      images: images.length > 0 ? images : null,
    }

    try {
      let result
      if (post) {
        result = await updatePost(post.id, postData)
      } else {
        result = await createPost(postData)
      }

      if (!result.success) {
        throw new Error(result.error || "Failed to save post")
      }

      // Clear draft on successful save
      if (!post) {
        localStorage.removeItem(`post_draft_${userId}`)
      }

      toast.success("Zapisano")
      router.push("/admin/posts")
      router.refresh()
    } catch (err) {
      console.error("[v0] Error saving post:", err)
      setError(err instanceof Error ? err.message : "Wystąpił błąd")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="p-0">
          <Tabs defaultValue="edit" className="w-full">
            <div className="px-6 py-4 border-b flex items-center justify-between bg-gray-50/50 sticky top-0 z-20">
              <TabsList className="grid w-[400px] grid-cols-2">
                <TabsTrigger value="edit" className="flex items-center gap-2">
                  <FileEdit className="w-4 h-4" />
                  Edycja
                </TabsTrigger>
                <TabsTrigger value="preview" className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Podgląd
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-3">
                {lastSaved && (
                  <div className="flex items-center gap-1.5 text-[10px] text-gray-400 bg-white px-3 py-1 rounded-full border shadow-sm animate-in fade-in slide-in-from-right-2">
                    <CheckCircle2 className="w-3 h-3 text-green-500" />
                    <span>Auto-zapis: {lastSaved.toLocaleTimeString()}</span>
                  </div>
                )}
                <Button type="submit" disabled={isLoading} size="sm">
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Save className="w-4 h-4 animate-spin" />
                      Zapisywanie...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Save className="w-4 h-4" />
                      Zapisz post
                    </span>
                  )}
                </Button>
              </div>
            </div>

            <TabsContent value="edit" className="p-6 space-y-6 mt-0">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
              )}

              <div className="grid gap-4">
                <div>
                  <Label htmlFor="title">Tytuł *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    placeholder="Wprowadź tytuł postu"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Typ *</Label>
                    <select
                      id="type"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="aktualnosci">Aktualność</option>
                      <option value="ogloszenia">Ogłoszenie</option>
                      <option value="konkursy">Konkurs</option>
                      <option value="rada-rodzicow">Rada Rodziców</option>
                      <option value="okiem-specjalisty">Okiem specjalisty</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="status">Status *</Label>
                    <select
                      id="status"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="draft">Szkic</option>
                      <option value="published">Opublikowany</option>
                      <option value="archived">Zarchiwizowany</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="group_category">Kategoria grupy (opcjonalnie)</Label>
                  <select
                    id="group_category"
                    value={formData.group_category}
                    onChange={(e) => setFormData({ ...formData, group_category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Brak - post ogólny</option>
                    {groups.map((g) => (
                      <option key={g.slug} value={g.slug}>Grupa {g.name}</option>
                    ))}
                  </select>
                  <p className="text-sm text-gray-500 mt-1">
                    Wybierz grupę, jeśli post ma być widoczny tylko dla tej grupy. Pozostaw puste dla ogólnych postów.
                  </p>
                </div>

                <div>
                  <Label htmlFor="excerpt">Krótki opis</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    placeholder="Krótki opis postu (wyświetlany na liście)"
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="content">Treść *</Label>
                  <RichTextEditor
                    content={formData.content || ""}
                    onChange={(content) => setFormData({ ...formData, content })}
                    placeholder="Pełna treść postu"
                  />
                </div>

                <div>
                  <Label>Zdjęcie</Label>
                  <div className="space-y-3">
                    {imagePreview && (
                      <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200">
                        <Image src={imagePreview || "/placeholder.svg"} alt="Podgląd" fill className="object-cover" />
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <MediaPicker
                        onSelect={(url) => {
                          setFormData({ ...formData, image_url: url })
                          setImagePreview(url)
                        }}
                        trigger={
                          <Button type="button" variant="outline">
                            <ImageIcon className="w-4 h-4 mr-2" />
                            Biblioteka
                          </Button>
                        }
                      />

                      <label className="flex-1">
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full bg-transparent"
                          disabled={uploading}
                          asChild
                        >
                          <span>
                            <Upload className="w-4 h-4 mr-2" />
                            {uploading ? "Wgrywanie..." : "Wgraj nowe"}
                          </span>
                        </Button>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                          disabled={uploading}
                        />
                      </label>
                    </div>

                    <div>
                      <Label htmlFor="image_url">Lub wklej URL zdjęcia</Label>
                      <Input
                        id="image_url"
                        value={formData.image_url}
                        onChange={(e) => {
                          setFormData({ ...formData, image_url: e.target.value })
                          setImagePreview(e.target.value)
                        }}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Dodatkowe zdjęcia w poście</Label>
                  <div className="space-y-4 mt-2">
                    {images.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {images.map((img, idx) => (
                          <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                            <Image src={img} alt={`Zdjęcie ${idx + 1}`} fill className="object-cover" />
                            <button
                              type="button"
                              onClick={() => handleRemoveAdditionalImage(idx)}
                              className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition shadow-sm z-10"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-3">
                      <label className="flex-1 cursor-pointer">
                        <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                          <Upload className="w-6 h-6 text-gray-400 mb-2" />
                          <span className="text-sm font-medium text-gray-700">
                            {uploading ? "Wgrywanie..." : "Kliknij, aby dodać kolejne zdjęcia"}
                          </span>
                          <span className="text-xs text-gray-500 mt-1">Możesz zaznaczyć wiele plików na raz</span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleMultipleFileUpload}
                          className="hidden"
                          disabled={uploading}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <input
                    type="checkbox"
                    id="add_to_calendar"
                    checked={formData.add_to_calendar}
                    onChange={(e) => setFormData({ ...formData, add_to_calendar: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <Label htmlFor="add_to_calendar" className="cursor-pointer">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Dodaj do kalendarza
                  </Label>
                </div>

                {formData.add_to_calendar && (
                  <div className="grid md:grid-cols-2 gap-4 ml-6">
                    <div>
                      <Label htmlFor="calendar_date">Data rozpoczęcia</Label>
                      <Input
                        type="datetime-local"
                        id="calendar_date"
                        value={formData.calendar_date}
                        onChange={(e) => setFormData({ ...formData, calendar_date: e.target.value })}
                        required={formData.add_to_calendar} // Make required if added to calendar
                      />
                    </div>
                    <div>
                      <Label htmlFor="calendar_end_date">Data zakończenia (opcjonalnie)</Label>
                      <Input
                        type="datetime-local"
                        id="calendar_end_date"
                        value={formData.calendar_end_date}
                        onChange={(e) => setFormData({ ...formData, calendar_end_date: e.target.value })}
                      />
                    </div>
                  </div>
                )}
              </div>

              {formData.type === "konkursy" && (
                <div className="border-t pt-6">
                  <h3 className="font-medium text-gray-900 mb-4">Ustawienia konkursu</h3>
                  <div className="grid gap-4">
                    <div>
                      <Label htmlFor="competition_status">Status konkursu</Label>
                      <select
                        id="competition_status"
                        value={formData.competition_status}
                        onChange={(e) => setFormData({ ...formData, competition_status: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Wybierz status</option>
                        <option value="upcoming">Nadchodzący</option>
                        <option value="ongoing">Trwa</option>
                        <option value="completed">Zakończony</option>
                      </select>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="competition_start_date">Data rozpoczęcia konkursu</Label>
                        <Input
                          type="datetime-local"
                          id="competition_start_date"
                          value={formData.competition_start_date}
                          onChange={(e) => setFormData({ ...formData, competition_start_date: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="competition_end_date">Data zakończenia konkursu</Label>
                        <Input
                          type="datetime-local"
                          id="competition_end_date"
                          value={formData.competition_end_date}
                          onChange={(e) => setFormData({ ...formData, competition_end_date: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-6 border-t">
                <Button type="submit" disabled={isLoading}>
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? "Zapisywanie..." : post ? "Zaktualizuj post" : "Utwórz post"}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Anuluj
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="preview" className="p-0 mt-0">
              <div className="max-w-4xl mx-auto p-8 bg-white min-h-[600px] shadow-inner">
                {/* Header Preview */}
                <div className="mb-8">
                  <Badge variant="outline" className="mb-4 uppercase tracking-wider text-[10px] font-bold">
                    {formData.type}
                  </Badge>
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">{formData.title || "Tytuł posta"}</h1>
                  <div className="flex items-center gap-4 text-sm text-gray-500 border-b pb-6">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date().toLocaleDateString('pl-PL')}</span>
                    </div>
                    {formData.group_category && (
                      <Badge variant="secondary">Grupa: {groups.find(g => g.slug === formData.group_category)?.name || formData.group_category}</Badge>
                    )}
                  </div>
                </div>

                {/* Content Preview */}
                <div className="prose prose-blue lg:prose-lg max-w-none">
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Featured"
                      className="w-full aspect-video object-cover rounded-2xl mb-8"
                    />
                  )}
                  {formData.content ? (
                    <div dangerouslySetInnerHTML={{ __html: formData.content }} />
                  ) : (
                    <p className="text-gray-400 italic text-center py-20">Brak treści do wyświetlenia...</p>
                  )}
                </div>

                {/* Gallery Preview */}
                {images.length > 0 && (
                  <div className="mt-12 pt-8 border-t">
                    <h3 className="text-xl font-bold mb-6">Galeria zdjęć</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {images.map((img, i) => (
                        <div key={i} className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                          <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </form>
  )
}
