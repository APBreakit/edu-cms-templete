"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { createAdminUser } from "@/app/actions/admin-actions"
import { toast } from "sonner"

const SECTIONS = [
  { key: "all", label: "Wszystkie sekcje" },
  { key: "posts", label: "Posty" },
  { key: "galleries", label: "Galerie" },
  { key: "media", label: "Media" },
  { key: "groups", label: "Grupy" },
  { key: "meal_plans", label: "Jadłospis" },
  { key: "rada_rodzicow", label: "Rada Rodziców" },
]

export default function AdminUserForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [perms, setPerms] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const togglePerm = (key: string) => {
    setPerms((prev) => {
      if (prev.includes(key)) return prev.filter((k) => k !== key)
      return key === "all" ? ["all"] : [...prev.filter((k) => k !== "all"), key]
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!email || !password || !confirm) {
      setError("Wypełnij wymagane pola")
      return
    }
    if (password !== confirm) {
      setError("Hasła nie są zgodne")
      return
    }
    setLoading(true)
    const result = await createAdminUser({ email, password, name: name || null, permissions: perms })
    setLoading(false)
    if (!result.success) {
      setError(result.error || "Nie udało się utworzyć użytkownika")
      return
    }
    toast.success("Zapisano")
    router.push("/admin")
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="p-6 space-y-6">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="name">Imię (opcjonalnie)</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="password">Hasło *</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="confirm">Potwierdź hasło *</Label>
              <Input id="confirm" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
            </div>
          </div>

          <div>
            <Label>Uprawnienia sekcji</Label>
            <div className="grid md:grid-cols-3 gap-3 mt-2">
              {SECTIONS.map((s) => (
                <label key={s.key} className="flex items-center gap-2">
                  <input type="checkbox" checked={perms.includes(s.key)} onChange={() => togglePerm(s.key)} />
                  <span className="text-sm">{s.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading}>{loading ? "Tworzenie..." : "Utwórz administratora"}</Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
