"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { addGalleryImage, deleteGalleryImage, moveGalleryImage } from "@/app/actions/admin-actions"
import { useRouter } from "next/navigation"
import { Plus, Trash2, MoveUp, MoveDown, Loader2, Upload } from "lucide-react"
import { optimizeImage } from "@/lib/utils/image-optimizer"
import { toast } from "sonner"

interface GalleryImage {
  id: string
  image_url: string
  caption?: string | null
  sort_order: number | null
}

export default function GalleryImagesManager({
  galleryId,
  images,
}: {
  galleryId: string
  images: GalleryImage[]
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [newImageUrl, setNewImageUrl] = useState("")
  const [newImageCaption, setNewImageCaption] = useState("")
  const [uploading, setUploading] = useState(false)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    setUploading(true)
    const maxOrder = images.length > 0 ? Math.max(...images.map((img) => (img.sort_order ?? 0))) : 0

    let currentOrder = maxOrder + 1
    let successCount = 0

    try {
      for (const file of files) {
        if (!file.type.startsWith("image/")) continue

        // Optimize image
        const optimizedFile = await optimizeImage(file, 1920, 0.85)

        // Upload to Blob
        const formData = new FormData()
        formData.append("file", optimizedFile)

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          console.error(`Failed to upload ${file.name}`)
          continue
        }

        const data = await response.json()

        const result = await addGalleryImage(galleryId, data.url, null, currentOrder++)

        if (result.success) successCount++
      }

      if (successCount > 0) {
        toast.success("Zapisano")
        router.refresh()
      } else {
        toast.error("Błąd")
      }
    } catch (error) {
      console.error("Error uploading images:", error)
      toast.error("Błąd")
    } finally {
      setUploading(false)
    }
  }

  const handleAddImage = async () => {
    if (!newImageUrl.trim()) return

    setLoading(true)
    const maxOrder = images.length > 0 ? Math.max(...images.map((img) => (img.sort_order ?? 0))) : 0

    const result = await addGalleryImage(galleryId, newImageUrl, newImageCaption || null, maxOrder + 1)

    if (!result.success) {
      console.error("Error adding image:", result.error)
      toast.error("Błąd")
    } else {
      setNewImageUrl("")
      setNewImageCaption("")
      toast.success("Zapisano")
      router.refresh()
    }
    setLoading(false)
  }

  const handleDeleteImage = async (id: string) => {
    if (!confirm("Czy na pewno chcesz usunąć to zdjęcie?")) return

    const result = await deleteGalleryImage(id, galleryId)

    if (!result.success) {
      console.error("Error deleting image:", result.error)
      toast.error("Błąd")
    } else {
      toast.success("Usunięto")
      router.refresh()
    }
  }

  const handleMoveImage = async (id: string, direction: "up" | "down") => {
    const currentIndex = images.findIndex((img) => img.id === id)
    if (currentIndex === -1) return
    if (direction === "up" && currentIndex === 0) return
    if (direction === "down" && currentIndex === images.length - 1) return

    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1
    const currentImage = images[currentIndex]
    const targetImage = images[targetIndex]

    const curOrder = currentImage.sort_order ?? currentIndex
    const tgtOrder = targetImage.sort_order ?? targetIndex
    await moveGalleryImage(currentImage.id, curOrder, tgtOrder, galleryId)

    router.refresh()
  }

  return (
    <div className="space-y-6">
      {/* Add new image form */}
      <div className="border rounded-lg p-4 bg-gray-50">
        <h3 className="font-semibold text-gray-900 mb-3">Dodaj nowe zdjęcia</h3>

        <div className="space-y-4">
          {/* File Upload Section */}
          <div>
            <Label className="mb-2 block">Wgraj z komputera</Label>
            <div className="flex items-center gap-4">
              <label className="cursor-pointer">
                <Button
                  variant="outline"
                  type="button"
                  disabled={uploading}
                  className="pointer-events-none bg-transparent"
                >
                  {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                  {uploading ? "Wgrywanie..." : "Wybierz pliki"}
                </Button>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
              <span className="text-sm text-gray-500">Możesz wybrać wiele plików jednocześnie</span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-gray-50 px-2 text-gray-500">Lub dodaj z URL</span>
            </div>
          </div>

          {/* URL Input Section */}
          <div className="space-y-3">
            <div>
              <Label htmlFor="image_url">URL zdjęcia</Label>
              <Input
                id="image_url"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="https://..."
                disabled={loading || uploading}
              />
            </div>
            <div>
              <Label htmlFor="image_caption">Podpis (opcjonalny)</Label>
              <Input
                id="image_caption"
                value={newImageCaption}
                onChange={(e) => setNewImageCaption(e.target.value)}
                placeholder="Opis zdjęcia..."
                disabled={loading || uploading}
              />
            </div>
            <Button onClick={handleAddImage} disabled={loading || uploading || !newImageUrl.trim()}>
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
              Dodaj z URL
            </Button>
          </div>
        </div>
      </div>

      {/* Images grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div key={image.id} className="border rounded-lg overflow-hidden">
            <div className="aspect-square bg-gray-100 relative">
              <img
                src={image.image_url || "/placeholder.svg"}
                alt={image.caption || ""}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-3 space-y-2">
              {image.caption && <p className="text-sm text-gray-700">{image.caption}</p>}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleMoveImage(image.id, "up")}
                  disabled={index === 0}
                >
                  <MoveUp className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleMoveImage(image.id, "down")}
                  disabled={index === images.length - 1}
                >
                  <MoveDown className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDeleteImage(image.id)} className="ml-auto">
                  <Trash2 className="w-4 h-4 text-red-600" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {images.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>Brak zdjęć w galerii. Dodaj pierwsze zdjęcie powyżej.</p>
        </div>
      )}
    </div>
  )
}
