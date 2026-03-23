"use client"

import type React from "react"
import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createMedia } from "@/app/actions/admin-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, X } from "lucide-react"
import { optimizeImage } from "@/lib/utils/image-optimizer"
import { toast } from "sonner"

export default function MediaUpload({ userId = 'system', defaultCategory = 'gallery', defaultSubcategory = 'wydarzenia' }: { userId?: string, defaultCategory?: string, defaultSubcategory?: string }) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [fileUrl, setFileUrl] = useState("")
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    filename: "",
    file_type: "image",
    category: defaultCategory,
    subcategory: defaultSubcategory,
    alt_text: "",
  })

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const allowedDocs = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/plain",
    ]

    const isImage = file.type.startsWith("image/")
    const isAllowedDoc = allowedDocs.includes(file.type)
    if (!isImage && !isAllowedDoc) {
      setError("Nieobsługiwany typ pliku")
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Plik jest zbyt duży. Maksymalny rozmiar to 10MB")
      return
    }

    setUploading(true)
    setError(null)

    try {
      let fileToUpload = file

      if (isImage) {
        fileToUpload = await optimizeImage(file, 1920, 0.85)
      }

      const formData = new FormData()
      formData.append("file", fileToUpload)

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

      setFileUrl(publicUrl)
      if (isImage) {
        setFilePreview(publicUrl)
      }
      setFormData((prev) => ({
        ...prev,
        filename: file.name,
        file_type: isImage ? "image" : file.type === "application/pdf" ? "pdf" : "document",
      }))
    } catch (err) {
      console.error("[v0] Upload error:", err)
      setError(err instanceof Error ? err.message : "Błąd podczas wgrywania pliku")
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const result = await createMedia({
        file_name: formData.filename,
        file_url: fileUrl,
        file_type: formData.file_type,
        category: formData.category,
        subcategory: formData.category === "gallery" ? formData.subcategory : null,
        uploaded_by: userId,
      })

      if (!result.success) throw new Error(result.error)

      toast.success("Plik dodany")
      setIsOpen(false)
      setFileUrl("")
      setFilePreview(null)
      setFormData({
        filename: "",
        file_type: "image",
        category: defaultCategory,
        subcategory: defaultSubcategory,
        alt_text: "",
      })
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Wystąpił błąd")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)}>
        <Upload className="w-4 h-4 mr-2" />
        Dodaj plik
      </Button>
    )
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Dodaj nowy plik</h3>
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
          )}

          <div>
            <Label>Wgraj plik z komputera</Label>
            <div className="space-y-3">
              {filePreview && (
                <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200">
                  <Image src={filePreview || "/placeholder.svg"} alt="Podgląd" fill className="object-cover" />
                </div>
              )}
              <label>
                <Button type="button" variant="outline" className="w-full bg-transparent" disabled={uploading} asChild>
                  <span>
                    <Upload className="w-4 h-4 mr-2" />
                    {uploading ? "Wgrywanie..." : "Wybierz plik"}
                  </span>
                </Button>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={uploading}
                  accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                />
              </label>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Lub</span>
            </div>
          </div>

          <div>
            <Label htmlFor="file_url">Wklej URL pliku</Label>
            <Input
              id="file_url"
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              placeholder="https://example.com/file.jpg"
            />
          </div>

          <div>
            <Label htmlFor="filename">Nazwa pliku *</Label>
            <Input
              id="filename"
              value={formData.filename}
              onChange={(e) => setFormData({ ...formData, filename: e.target.value })}
              required
              placeholder="moje-zdjecie.jpg"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="file_type">Typ pliku *</Label>
              <select
                id="file_type"
                value={formData.file_type}
                onChange={(e) => setFormData({ ...formData, file_type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="image">Zdjęcie</option>
                <option value="pdf">PDF</option>
                <option value="document">Dokument</option>
              </select>
            </div>

            <div>
              <Label htmlFor="category">Kategoria *</Label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="gallery">Galeria</option>
                <option value="document">Dokument</option>
                <option value="menu">Jadłospis</option>
                <option value="post">Post</option>
              </select>
            </div>
          </div>

          {formData.category === "gallery" && (
            <div>
              <Label htmlFor="subcategory">Podkategoria galerii *</Label>
              <select
                id="subcategory"
                value={formData.subcategory}
                onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="wydarzenia">Wydarzenia</option>
                <option value="przedszkole">Przedszkole</option>
                <option value="sale">Sale</option>
                <option value="zajecia">Zajęcia</option>
                <option value="zajecia-tematyczne">Zajęcia tematyczne</option>
                <option value="rada-rodzicow">Rada Rodziców</option>
                <option value="rada-rodzicow-wazne">Rada Rodziców – Ważne</option>
              </select>
            </div>
          )}

          <div>
            <Label htmlFor="alt_text">Tekst alternatywny (dla zdjęć)</Label>
            <Input
              id="alt_text"
              value={formData.alt_text}
              onChange={(e) => setFormData({ ...formData, alt_text: e.target.value })}
              placeholder="Opis zdjęcia dla czytników ekranu"
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Dodawanie..." : "Dodaj plik"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Anuluj
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
