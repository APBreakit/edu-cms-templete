"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { updateGroup } from "@/app/actions/admin-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Save, ArrowLeft, Upload, X, FileText, Plus } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { optimizeImage } from "@/lib/utils/image-optimizer"
import { toast } from "sonner"

interface GroupFormProps {
  group: {
    id: string
    name: string
    slug: string
    color: string | null
    password: string | null
    teacher_name: string | null
    teacher_email?: string | null
    teacher_phone?: string | null
    teacher_photo: string | null
    schedule: any
    meal_plan_url: string | null
    documents: any
    age_group?: string | null
    hours?: string | null
    number_of_children?: number | string | null
    description?: string | null
    contact_hours?: string | null
  }
}

interface Document {
  title: string
  url: string
}

export default function GroupForm({ group }: GroupFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Parse documents from JSON if exists
  const initialDocuments = Array.isArray(group.documents) ? group.documents : []
  const [documents, setDocuments] = useState<Document[]>(initialDocuments)
  const [newDocTitle, setNewDocTitle] = useState("")
  const [uploadingDoc, setUploadingDoc] = useState(false)

  const [formData, setFormData] = useState({
    password: group.password || "",
    teacher_name: group.teacher_name || "",
    teacher_email: group.teacher_email || "",
    teacher_phone: group.teacher_phone || "",
    teacher_photo: group.teacher_photo || "",
    // meal_plan_url is managed centrally; removed from group settings
    age_group: group.age_group || "",
    hours: group.hours || "",
    number_of_children: group.number_of_children?.toString() || "",
    description: group.description || "",
    contact_hours: group.contact_hours || "",
    color: group.color || "#E5E7EB",
  })

  const initialTeachers = Array.isArray((group as any).teachers) ? (group as any).teachers : []
  const [teachers, setTeachers] = useState<Array<{ name: string; email?: string; phone?: string }>>(
    initialTeachers.length > 0 ? initialTeachers.slice(0, 2) : [{ name: "", email: "", phone: "" }]
  )

  const handleFileUpload = async (file: File, type: "photo" | "document") => {
    try {
      if (type === "photo" && !file.type.startsWith("image/")) {
        throw new Error("Proszę wybrać plik graficzny")
      }

      const allowedDocs = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "text/plain",
      ]
      if (type === "document" && !allowedDocs.includes(file.type)) {
        throw new Error("Nieobsługiwany typ pliku")
      }

      if (type !== "photo" && file.size > 10 * 1024 * 1024) {
        throw new Error("Plik jest zbyt duży (max 10MB)")
      }

      let fileToUpload = file
      if (type === "photo") {
        setUploadingPhoto(true)
        fileToUpload = await optimizeImage(file, 800, 0.85)
      } else {
        setUploadingDoc(true)
      }

      const formData = new FormData()
      formData.append("file", fileToUpload)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Upload failed")

      const data = await response.json()

      if (type === "photo") {
        setFormData((prev) => ({ ...prev, teacher_photo: data.url }))
      } else {
        return data.url
      }
    } catch (err) {
      console.error("Upload error:", err)
      setError(err instanceof Error ? err.message : "Błąd przesyłania pliku")
    } finally {
      setUploadingPhoto(false)
      setUploadingDoc(false)
    }
  }

  const handleAddDocument = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !newDocTitle.trim()) {
      if (!newDocTitle.trim()) alert("Wprowadź nazwę dokumentu")
      return
    }

    const url = await handleFileUpload(file, "document")
    if (url) {
      setDocuments((prev) => [...prev, { title: newDocTitle, url }])
      setNewDocTitle("")
    }
  }

  const removeDocument = (index: number) => {
    setDocuments((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const result = await updateGroup(group.slug, {
        name: group.name,
        password: formData.password,
        teacher_name: formData.teacher_name || null,
        email: formData.teacher_email || null,
        phone: formData.teacher_phone || null,
        teacher_photo: formData.teacher_photo || null,
        meal_plan_url: null,
        age_group: formData.age_group || null,
        hours: formData.hours || null,
        number_of_children: formData.number_of_children ? Number.parseInt(formData.number_of_children) : null,
        description: formData.description || null,
        contact_hours: formData.contact_hours || null,
        color: formData.color,
        documents: documents,
        schedule: group.schedule,
        teachers: teachers.filter(t => (t.name || "").trim().length > 0),
      })

      if (!result.success) {
        console.error("[v0] Error updating group:", result.error)
        throw new Error(result.error)
      }

      toast.success("Zapisano")
      router.push("/admin/groups")
      router.refresh()
    } catch (err) {
      console.error("[v0] Failed to update group:", err)
      setError(err instanceof Error ? err.message : "Wystąpił błąd")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b">
            <div className="w-12 h-12 rounded-lg" style={{ backgroundColor: formData.color || "#E5E7EB" }} />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{group.name}</h3>
              <p className="text-sm text-gray-600">Slug: {group.slug}</p>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
          )}

          <div>
            <h4 className="font-medium text-gray-900 mb-4">Hasło dostępu</h4>
            <div>
              <Label htmlFor="password">Hasło *</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={4}
                  placeholder="Wprowadź hasło dla grupy"
                  className="flex-1"
                />
                <Button type="button" variant="outline" size="sm" onClick={() => setShowPassword((v) => !v)}>
                  {showPassword ? "Ukryj" : "Pokaż"}
                </Button>
              </div>
              <p className="text-xs text-gray-600 mt-1">Minimalnie 4 znaki. Hasło będzie używane przez rodziców.</p>
            </div>
          </div>

          <div className="border-t pt-6">
            <h4 className="font-medium text-gray-900 mb-4">Wygląd</h4>
            <div>
              <Label htmlFor="color">Kolor grupy</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="color"
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-20 h-10"
                />
                <span className="text-sm text-gray-600">{formData.color}</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">Kolor używany w interfejsie grupy</p>
            </div>
          </div>

          <div className="border-t pt-6">
            <h4 className="font-medium text-gray-900 mb-4">Informacje o nauczycielu</h4>
            <div className="grid gap-6">
              <div className="flex items-start gap-6">
                <div className="space-y-3">
                  <Label>Zdjęcie nauczyciela</Label>
                  <div className="relative w-32 h-32 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                    {formData.teacher_photo ? (
                      <Image
                        src={formData.teacher_photo || "/placeholder.svg"}
                        alt="Nauczyciel"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Upload className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                  <label className="block">
                    <Button type="button" variant="outline" size="sm" disabled={uploadingPhoto} asChild>
                      <span>{uploadingPhoto ? "Wgrywanie..." : "Zmień zdjęcie"}</span>
                    </Button>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], "photo")}
                      disabled={uploadingPhoto}
                    />
                  </label>
                </div>

                <div className="flex-1 grid gap-4">
                  <div>
                    <Label htmlFor="teacher_name">Imię i nazwisko</Label>
                    <Input
                      id="teacher_name"
                      value={formData.teacher_name}
                      onChange={(e) => setFormData({ ...formData, teacher_name: e.target.value })}
                      placeholder="Pani Anna Kowalska"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="teacher_email">Email</Label>
                      <Input
                        id="teacher_email"
                        type="email"
                        value={formData.teacher_email}
                        onChange={(e) => setFormData({ ...formData, teacher_email: e.target.value })}
                        placeholder="anna.kowalska@educms-szablon.pl"
                      />
                    </div>
                    <div>
                      <Label htmlFor="teacher_phone">Telefon</Label>
                      <Input
                        id="teacher_phone"
                        type="tel"
                        value={formData.teacher_phone}
                        onChange={(e) => setFormData({ ...formData, teacher_phone: e.target.value })}
                        placeholder="+48 123 456 789"
                        pattern="^[+0-9\s-]{6,}$"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h4 className="font-medium text-gray-900 mb-4">Dodatkowi nauczyciele (opcjonalnie)</h4>
            <div className="space-y-4">
              {teachers.map((t, idx) => (
                <div key={idx} className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor={`teacher_${idx}_name`}>Imię i nazwisko</Label>
                    <Input
                      id={`teacher_${idx}_name`}
                      value={t.name || ""}
                      onChange={(e) => {
                        const next = [...teachers]
                        next[idx] = { ...next[idx], name: e.target.value }
                        setTeachers(next)
                      }}
                      placeholder="np. Pani Maria Nowak"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`teacher_${idx}_email`}>Email</Label>
                    <Input
                      id={`teacher_${idx}_email`}
                      type="email"
                      value={t.email || ""}
                      onChange={(e) => {
                        const next = [...teachers]
                        next[idx] = { ...next[idx], email: e.target.value }
                        setTeachers(next)
                      }}
                      placeholder="maria.nowak@educms-szablon.pl"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`teacher_${idx}_phone`}>Telefon</Label>
                    <Input
                      id={`teacher_${idx}_phone`}
                      type="tel"
                      value={t.phone || ""}
                      onChange={(e) => {
                        const next = [...teachers]
                        next[idx] = { ...next[idx], phone: e.target.value }
                        setTeachers(next)
                      }}
                      placeholder="+48 555 444 333"
                      pattern="^[+0-9\s-]{6,}$"
                    />
                  </div>
                </div>
              ))}
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setTeachers((prev) => (prev.length < 2 ? [...prev, { name: "", email: "", phone: "" }] : prev))}
                  disabled={teachers.length >= 2}
                >
                  Dodaj kolejnego nauczyciela
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setTeachers((prev) => (prev.length > 1 ? prev.slice(0, prev.length - 1) : prev))}
                  disabled={teachers.length <= 1}
                >
                  Usuń ostatniego
                </Button>
              </div>
              <p className="text-xs text-gray-600">Maksymalnie dwóch dodatkowych nauczycieli.</p>
            </div>
          </div>

          <div className="border-t pt-6">
            <h4 className="font-medium text-gray-900 mb-4">Informacje o grupie</h4>
            <div className="grid gap-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="age_group">Grupa wiekowa</Label>
                  <Input
                    id="age_group"
                    value={formData.age_group}
                    onChange={(e) => setFormData({ ...formData, age_group: e.target.value })}
                    placeholder="np. 3-4 lata"
                  />
                </div>
                <div>
                  <Label htmlFor="number_of_children">Liczba dzieci</Label>
                  <Input
                    id="number_of_children"
                    type="number"
                    value={formData.number_of_children}
                    onChange={(e) => setFormData({ ...formData, number_of_children: e.target.value })}
                    placeholder="np. 25"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="hours">Godziny pracy grupy</Label>
                  <Input
                    id="hours"
                    value={formData.hours}
                    onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                    placeholder="np. 7:00 - 17:00"
                  />
                  <p className="text-xs text-gray-600 mt-1">Wpisz przedział godzin, np. 7:00–17:00</p>
                </div>
                <div>
                  <Label htmlFor="contact_hours">Godziny kontaktu z nauczycielem</Label>
                  <Input
                    id="contact_hours"
                    value={formData.contact_hours}
                    onChange={(e) => setFormData({ ...formData, contact_hours: e.target.value })}
                    placeholder="np. 7:30-8:00 i 15:30-16:30"
                  />
                  <p className="text-xs text-gray-600 mt-1">Możesz podać kilka przedziałów rozdzielonych przecinkami</p>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Opis grupy</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Krótki opis grupy"
                />
                <p className="text-xs text-gray-600 mt-1">{(formData.description || "").length} znaków</p>
              </div>
            </div>
          </div>

            {/* Jadłospis zarządzany centralnie w panelu Jadłospis */}

          <div className="border-t pt-6">
            <h4 className="font-medium text-gray-900 mb-4">Dokumenty do pobrania</h4>
            <div className="space-y-4">
              {documents.map((doc, index) => (
                <div key={index} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{doc.title}</p>
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Zobacz plik
                    </a>
                  </div>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeDocument(index)}>
                    <X className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              ))}

              <div className="flex gap-3 items-end p-4 border border-dashed rounded-lg">
                <div className="flex-1">
                  <Label htmlFor="new-doc-title">Nazwa dokumentu</Label>
                  <Input
                    id="new-doc-title"
                    value={newDocTitle}
                    onChange={(e) => setNewDocTitle(e.target.value)}
                    placeholder="np. Wyprawka"
                  />
                </div>
                <label>
                  <Button type="button" variant="secondary" disabled={uploadingDoc || !newDocTitle}>
                    <Plus className="w-4 h-4 mr-2" />
                    {uploadingDoc ? "Wgrywanie..." : "Dodaj plik"}
                  </Button>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleAddDocument}
                    disabled={uploadingDoc || !newDocTitle}
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-6 border-t">
            <Button type="submit" disabled={isLoading}>
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? "Zapisywanie..." : "Zapisz zmiany"}
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link href="/admin/groups">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Powrót
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
