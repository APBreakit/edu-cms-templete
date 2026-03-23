"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { deleteMedia } from "@/app/actions/admin-actions"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Copy, FileText, Trash2, Check } from "lucide-react"

export default function MediaGrid({ media }: { media: any[] }) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm("Czy na pewno chcesz usunąć ten plik?")) return

    setDeletingId(id)
    const result = await deleteMedia(id)

    if (!result.success) {
      toast.error("Błąd")
      console.error(result.error)
    } else {
      toast.success("Usunięto")
      router.refresh()
    }

    setDeletingId(null)
  }

  const handleCopyUrl = async (url: string, id: string) => {
    try {
      await navigator.clipboard.writeText(url)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  if (media.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Brak plików do wyświetlenia</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {media.map((item) => (
        <div key={item.id} className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden">
          {item.file_type === "image" ? (
            <div className="aspect-square bg-gray-100">
              <img
                src={item.file_url || "/placeholder.svg"}
                alt={item.alt_text || item.filename}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="aspect-square bg-gray-100 flex items-center justify-center">
              <FileText className="w-16 h-16 text-gray-400" />
            </div>
          )}

          <div className="p-3">
            <p className="text-sm font-medium text-gray-900 truncate" title={item.filename}>
              {item.filename}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-gray-600">{item.file_type}</span>
              <span className="text-gray-300">•</span>
              <span className="text-xs text-gray-600">{item.category}</span>
            </div>
          </div>

          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleCopyUrl(item.file_url, item.id)}
              className="h-8 w-8 p-0"
            >
              {copiedId === item.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleDelete(item.id)}
              disabled={deletingId === item.id}
              className="h-8 w-8 p-0"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
