"use client"

import { useState } from "react"
import Link from "next/link"
import { Edit, Trash2, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { deleteGallery } from "@/app/actions/admin-actions"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface Gallery {
  id: string
  title: string
  slug: string
  category: string | null
  status: string | null
  cover_image_url: string | null
  created_at: string
  image_count?: number | null
}

export default function GalleriesTable({ galleries }: { galleries: Gallery[] }) {
  const router = useRouter()
  const [deleting, setDeleting] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm("Czy na pewno chcesz usunąć tę galerię?")) return

    setDeleting(id)
    const result = await deleteGallery(id)

    if (!result.success) {
      console.error("Error deleting gallery:", result.error)
      toast.error("Błąd")
    } else {
      toast.success("Usunięto")
      router.refresh()
    }
    setDeleting(null)
  }

  const categories = {
    wycieczki: "Wycieczki",
    uroczystosci: "Uroczystości",
    zajecia: "Zajęcia",
    konkursy: "Konkursy",
    inne: "Inne",
  }

  return (
    <div className="space-y-4">
      {galleries.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Brak galerii. Utwórz pierwszą galerię.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {galleries.map((gallery) => {
            const imageCount = gallery.image_count || 0
            return (
              <div key={gallery.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gray-100 relative">
                  {gallery.cover_image_url ? (
                    <img
                      src={gallery.cover_image_url || "/placeholder.svg"}
                      alt={gallery.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${
                        gallery.status === "published" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {gallery.status === "published" ? "Opublikowana" : "Szkic"}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{gallery.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                      {categories[gallery.category as keyof typeof categories] || gallery.category}
                    </span>
                    <span className="text-xs">• {imageCount} zdjęć</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/galleries/${gallery.id}/edit`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full bg-transparent">
                        <Edit className="w-4 h-4 mr-1" />
                        Edytuj
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(gallery.id)}
                      disabled={deleting === gallery.id}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
