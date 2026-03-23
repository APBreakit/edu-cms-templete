"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  getRadaRodzicowData,
  createRadaRodzicowDocument,
  deleteRadaRodzicowDocument,
  createPost,
  updatePost,
  deletePost,
  getRRInfo,
  updateRRInfo,
} from "@/app/actions/admin-actions"
import { Button } from "@/components/ui/button"
import { Plus, FileText, Trash2, Edit, ImageIcon, Calendar } from "lucide-react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { optimizeImage } from "@/lib/utils/image-optimizer"
export const dynamic = "force-dynamic"
import MediaUpload from "@/components/admin/media-upload"

interface Document {
  id: string
  title: string
  description: string | null
  file_url: string | null
  file_name: string | null
  display_order: number
  created_at: string
  published_at: string | null
}

interface Post {
  id: string
  title: string
  excerpt: string
  content: string
  image_url: string | null
  status: string
  created_at: string
  published_at: string | null
}

export default function RadaRodzicowAdminPage() {
  const router = useRouter()
  const [documents, setDocuments] = useState<any[]>([])
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false)
  const [editingDoc, setEditingDoc] = useState<Document | null>(null)
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [uploading, setUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [rrInfo, setRrInfo] = useState({ chairperson: "", vice_chairperson: "", treasurer: "", secretary: "" })
  const [savingInfo, setSavingInfo] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    file: null as File | null,
  })

  const [postFormData, setPostFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    image_url: "",
    status: "draft" as "draft" | "published",
  })

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    const data = await getRadaRodzicowData()
    setDocuments(data.documents || [])
    setPosts(data.posts || [])
    const info = await getRRInfo()
    if (info) setRrInfo({
      chairperson: info.chairperson || "",
      vice_chairperson: info.vice_chairperson || "",
      treasurer: info.treasurer || "",
      secretary: info.secretary || "",
    })
    setLoading(false)
  }

  async function handleFileUpload(file: File): Promise<string | null> {
    try {
      const allowedDocs = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "image/bmp",
        "image/svg+xml",
        "image/tiff",
      ]
      if (!file.type.startsWith("image/") && !allowedDocs.includes(file.type)) {
        toast.error("Nieobsługiwany typ pliku")
        return null
      }
      if (file.size > 15 * 1024 * 1024) {
        toast.error("Plik jest zbyt duży (max 15MB)")
        return null
      }

      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.details || "Upload failed")
      }

      const data = await response.json()
      return data.url
    } catch (error: any) {
      console.error("[v0] Upload error:", error)
      toast.error(`Błąd podczas wgrywania: ${error.message}`)
      return null
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("Proszę wybrać plik graficzny")
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Zdjęcie jest zbyt duże (max 5MB)")
      return
    }

    setUploading(true)

    try {
      const optimizedFile = await optimizeImage(file, 1920, 0.85)

      const uploadedUrl = await handleFileUpload(optimizedFile)
      if (uploadedUrl) {
        setPostFormData((prev) => ({ ...prev, image_url: uploadedUrl }))
        setImagePreview(uploadedUrl)
      }
    } catch (error) {
      console.error("[v0] Image upload error:", error)
      toast.error("Błąd podczas wgrywania zdjęcia")
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmitDocument(e: React.FormEvent) {
    e.preventDefault()

    if (!formData.file) {
      console.error("[v0] No file selected")
      toast.error("Wybierz plik")
      return
    }

    setUploading(true)

    const fileUrl = await handleFileUpload(formData.file)
    if (!fileUrl) {
      console.error("[v0] File upload failed")
      setUploading(false)
      return
    }

    console.log("[v0] File uploaded successfully, saving to database:", fileUrl)

    const result = await createRadaRodzicowDocument({
      title: formData.title || formData.file.name,
      url: fileUrl,
      display_order: 0,
    })

    if (!result.success) {
      console.error("[v0] Database error:", result.error)
      toast.error("Błąd")
    } else {
      console.log("[v0] Document saved successfully")
      toast.success("Zapisano")
      fetchData()
      handleCloseDialog()
    }

    setUploading(false)
  }

  async function handleSubmitPost(e: React.FormEvent) {
    e.preventDefault()

    console.log("[v0] Starting post submission")

    setUploading(true)

    try {
      const postData = {
        title: postFormData.title,
        excerpt: postFormData.excerpt || "",
        content: postFormData.content,
        image_url: postFormData.image_url || null,
        type: "rada-rodzicow",
        status: postFormData.status,
        published: postFormData.status === "published",
        slug: postFormData.title
          .toLowerCase()
          .replace(/ /g, "-")
          .replace(/[^\w-]+/g, ""),
        user_id: "system", // Will be handled by server
      }

      console.log("[v0] Post data to be saved:", postData)

      let result
      if (editingPost) {
        console.log("[v0] Updating post:", editingPost.id)
        result = await updatePost(editingPost.id, postData)
      } else {
        console.log("[v0] Inserting new post")
        result = await createPost(postData)
      }

      if (!result.success) {
        throw new Error(result.error)
      }

      console.log("[v0] Post saved successfully")
      toast.success("Zapisano")
      fetchData()
      handleClosePostDialog()
    } catch (error: any) {
      console.error("[v0] Error saving post:", error)
      toast.error(`Błąd podczas zapisywania postu: ${error.message || "Nieznany błąd"}`)
    } finally {
      setUploading(false)
    }
  }

  async function handleDeleteDocument(id: string) {
    if (!confirm("Czy na pewno chcesz usunąć ten dokument?")) return

    console.log("[v0] Deleting document:", id)

    const result = await deleteRadaRodzicowDocument(id)

    if (!result.success) {
      console.error("[v0] Delete error:", result.error)
      toast.error("Błąd")
    } else {
      console.log("[v0] Document deleted successfully")
      toast.success("Usunięto")
      fetchData()
    }
  }

  async function handleDeletePost(id: string) {
    if (!confirm("Czy na pewno chcesz usunąć ten post?")) return

    const result = await deletePost(id)

    if (!result.success) {
      toast.error("Błąd")
    } else {
      toast.success("Usunięto")
      fetchData()
    }
  }

  function handleCloseDialog() {
    setIsDialogOpen(false)
    setEditingDoc(null)
    setFormData({ title: "", description: "", file: null })
  }

  function handleClosePostDialog() {
    setIsPostDialogOpen(false)
    setEditingPost(null)
    setPostFormData({ title: "", excerpt: "", content: "", image_url: "", status: "draft" })
    setImagePreview("")
  }

  function handleEditPost(post: Post) {
    setEditingPost(post)
    setPostFormData({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      image_url: post.image_url || "",
      status: post.status as "draft" | "published",
    })
    setImagePreview(post.image_url || "")
    setIsPostDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Rada Rodziców</h1>
        <p className="text-gray-600 mt-1">Zarządzaj postami, dokumentami i składem Rady Rodziców</p>
      </div>

      <Tabs defaultValue="posts" className="space-y-6">
        <TabsList>
          <TabsTrigger value="posts">Posty</TabsTrigger>
          <TabsTrigger value="documents">Dokumenty</TabsTrigger>
          <TabsTrigger value="members">Skład</TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-gray-600">Aktualności wyświetlane na stronie Rady Rodziców</p>
            <Dialog open={isPostDialogOpen} onOpenChange={setIsPostDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingPost(null)} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Dodaj post
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingPost ? "Edytuj post" : "Dodaj nowy post"}</DialogTitle>
                  <DialogDescription>Utwórz post który będzie wyświetlany na stronie Rady Rodziców</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmitPost} className="space-y-4">
                  <div>
                    <Label htmlFor="post_title">Tytuł *</Label>
                    <Input
                      id="post_title"
                      value={postFormData.title}
                      onChange={(e) => setPostFormData({ ...postFormData, title: e.target.value })}
                      placeholder="np. Zebranie Rady Rodziców"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="post_excerpt">Krótki opis</Label>
                    <Textarea
                      id="post_excerpt"
                      value={postFormData.excerpt}
                      onChange={(e) => setPostFormData({ ...postFormData, excerpt: e.target.value })}
                      placeholder="Krótki opis wyświetlany na karcie postu (opcjonalnie)"
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="post_content">Treść *</Label>
                    <Textarea
                      id="post_content"
                      value={postFormData.content}
                      onChange={(e) => setPostFormData({ ...postFormData, content: e.target.value })}
                      placeholder="Pełna treść postu"
                      rows={8}
                      required
                    />
                  </div>
                  <div>
                    <Label>Zdjęcie</Label>
                    <div className="space-y-3">
                      {imagePreview && (
                        <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200">
                          <Image src={imagePreview || "/placeholder.svg"} alt="Podgląd" fill className="object-cover" />
                        </div>
                      )}
                      <label className="block">
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full bg-transparent"
                          disabled={uploading}
                          asChild
                        >
                          <span>{uploading ? "Wgrywanie..." : "Wgraj zdjęcie"}</span>
                        </Button>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          disabled={uploading}
                        />
                      </label>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="post_status">Status *</Label>
                    <select
                      id="post_status"
                      value={postFormData.status}
                      onChange={(e) =>
                        setPostFormData({ ...postFormData, status: e.target.value as "draft" | "published" })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="draft">Szkic</option>
                      <option value="published">Opublikowany</option>
                    </select>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button type="button" variant="outline" onClick={handleClosePostDialog} disabled={uploading}>
                      Anuluj
                    </Button>
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={uploading}>
                      {uploading ? "Zapisywanie..." : editingPost ? "Zaktualizuj" : "Dodaj"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Brak postów</p>
              <p className="text-sm text-gray-500 mt-1">Dodaj pierwszy post klikając przycisk powyżej</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tytuł
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Akcje
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {posts.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {post.image_url && <ImageIcon className="w-5 h-5 text-blue-600" />}
                          <div className="font-medium text-gray-900">{post.title}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            post.status === "published" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {post.status === "published" ? "Opublikowany" : "Szkic"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(post.created_at).toLocaleDateString("pl-PL")}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditPost(post)}
                            className="text-blue-600"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeletePost(post.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-gray-600">Dokumenty dostępne dla rodziców</p>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingDoc(null)} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Dodaj dokument
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Dodaj nowy dokument</DialogTitle>
                  <DialogDescription>Wgraj dokument lub zdjęcie dla Rady Rodziców</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmitDocument} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Tytuł dokumentu</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="np. Regulamin Rady Rodziców"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Opcjonalne - zostanie użyta nazwa pliku jeśli pozostawisz puste
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="file">Plik *</Label>
                    <Input
                      id="file"
                      type="file"
                      onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.webp,.bmp,.svg,.tiff"
                      required
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Akceptowane formaty: PDF, DOC, DOCX, JPG, JPEG, PNG, GIF, WEBP, BMP, SVG, TIFF
                    </p>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button type="button" variant="outline" onClick={handleCloseDialog} disabled={uploading}>
                      Anuluj
                    </Button>
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={uploading}>
                      {uploading ? "Wgrywanie..." : "Dodaj"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Ważne – obrazy</h3>
                <p className="text-sm text-gray-600">Dodaj zdjęcia do sekcji „Ważne” na stronie Rady Rodziców</p>
              </div>
              <MediaUpload defaultCategory="gallery" defaultSubcategory="rada-rodzicow-wazne" />
            </div>
            <p className="text-xs text-gray-500">Wgraj dwie grafiki „Ulotka 1” i „Ulotka 2”. Zostaną wyświetlone w sekcji „Ważne”.</p>
          </div>

          {documents.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Brak dokumentów</p>
              <p className="text-sm text-gray-500 mt-1">Dodaj pierwszy dokument klikając przycisk powyżej</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dokument
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Typ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data dodania
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Akcje
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {documents.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {doc.file_name?.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i) ? (
                            <ImageIcon className="w-5 h-5 text-blue-600" />
                          ) : (
                            <FileText className="w-5 h-5 text-blue-600" />
                          )}
                          <div className="font-medium text-gray-900">{doc.title}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {doc.file_name?.split(".").pop()?.toUpperCase() || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(doc.created_at).toLocaleDateString("pl-PL")}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(doc.file_url || "#", "_blank")}
                            className="text-blue-600"
                          >
                            Podgląd
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteDocument(doc.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="members" className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4 max-w-xl">
            <div>
              <Label htmlFor="chairperson">Przewodnicząca</Label>
              <Input id="chairperson" value={rrInfo.chairperson} onChange={(e) => setRrInfo({ ...rrInfo, chairperson: e.target.value })} placeholder="Imię i Nazwisko" />
            </div>
            <div>
              <Label htmlFor="vice_chairperson">Wiceprzewodnicząca</Label>
              <Input id="vice_chairperson" value={rrInfo.vice_chairperson} onChange={(e) => setRrInfo({ ...rrInfo, vice_chairperson: e.target.value })} placeholder="Imię i Nazwisko" />
            </div>
            <div>
              <Label htmlFor="treasurer">Skarbnik</Label>
              <Input id="treasurer" value={rrInfo.treasurer} onChange={(e) => setRrInfo({ ...rrInfo, treasurer: e.target.value })} placeholder="Imię i Nazwisko" />
            </div>
            <div>
              <Label htmlFor="secretary">Sekretarz</Label>
              <Input id="secretary" value={rrInfo.secretary} onChange={(e) => setRrInfo({ ...rrInfo, secretary: e.target.value })} placeholder="Imię i Nazwisko" />
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                onClick={async () => {
                  setSavingInfo(true)
                  const res = await updateRRInfo(rrInfo)
                  setSavingInfo(false)
                  if (!res.success) {
                    toast.error("Błąd")
                  } else {
                    toast.success("Zapisano")
                    router.refresh()
                  }
                }}
                className="bg-blue-600 hover:bg-blue-700"
                disabled={savingInfo}
              >
                {savingInfo ? "Zapisywanie..." : "Zapisz"}
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
