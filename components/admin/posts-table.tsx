"use client"

import { Pencil, Trash2, Eye } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { deletePost } from "@/app/actions/admin-actions"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useState } from "react"

interface Post {
  id: string
  title: string
  type: string
  status: string
  created_at: string
  published_at: string | null
}

export default function PostsTable({ posts }: { posts: Post[] }) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm("Czy na pewno chcesz usunąć ten post?")) return

    setDeletingId(id)
    const result = await deletePost(id)

    if (!result.success) {
      toast.error("Błąd")
      console.error(result.error)
    } else {
      toast.success("Usunięto")
      router.refresh()
    }

    setDeletingId(null)
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "aktualnosci":
        return "Aktualność"
      case "ogloszenia":
        return "Ogłoszenie"
      case "konkursy":
        return "Konkurs"
      case "rada-rodzicow":
        return "Rada Rodziców"
      case "okiem-specjalisty":
        return "Okiem specjalisty"
      default:
        return type
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return (
          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">Opublikowany</span>
        )
      case "draft":
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">Szkic</span>
      case "archived":
        return (
          <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">Zarchiwizowany</span>
        )
      default:
        return status
    }
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Brak postów do wyświetlenia</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Tytuł</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Typ</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Data utworzenia</th>
            <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">Akcje</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-3 px-4">
                <div className="font-medium text-gray-900">{post.title}</div>
              </td>
              <td className="py-3 px-4">
                <span className="text-sm text-gray-600">{getTypeLabel(post.type)}</span>
              </td>
              <td className="py-3 px-4">{getStatusBadge(post.status)}</td>
              <td className="py-3 px-4">
                <span className="text-sm text-gray-600">{new Date(post.created_at).toLocaleDateString("pl-PL")}</span>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center justify-end gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/admin/posts/${post.id}`}>
                      <Eye className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/admin/posts/${post.id}/edit`}>
                      <Pencil className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(post.id)}
                    disabled={deletingId === post.id}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
