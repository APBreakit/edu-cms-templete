"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { FileText, Trash2, Download, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
// session is validated in server actions; no next-auth in client
import { createMealPlan, deleteMealPlan, getLatestMealPlan, getMealPlans, setCurrentMealPlan } from "@/app/actions/admin-actions"
import { toast } from "sonner"

export default function MealPlanAdminPage() {
  const [mealPlan, setMealPlan] = useState<any>(null)
  const [mealPlans, setMealPlans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  useEffect(() => {
    fetchMealPlan()
  }, [])

  const fetchMealPlan = async () => {
    try {
      setLoading(true)

      const plan = await getLatestMealPlan()
      const list = await getMealPlans()

      setMealPlan(plan)
      setMealPlans(list || [])
      setError("")
    } catch (err) {
      console.error("[v0] Failed to fetch meal plan:", err)
      setError("Błąd podczas pobierania jadłospisu")
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploading(true)
      setError("")
      setSuccess("")

      const formData = new FormData()
      formData.append("file", file)

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!uploadRes.ok) {
        const errorData = await uploadRes.json()
        throw new Error(errorData.message || "Błąd podczas wgrywania pliku")
      }

      const { url } = await uploadRes.json()

      // Delete old meal plan if exists
      if (mealPlan?.id) {
        await deleteMealPlan(mealPlan.id)
      }

      // Insert new meal plan
      const result = await createMealPlan({
        file_url: url,
        file_name: file.name,
        file_size: file.size,
      })

      if (!result.success) {
        throw new Error(result.error || "Błąd zapisu do bazy")
      }

      setMealPlan(result.data)
      setSuccess("Zapisano")
      toast.success("Zapisano")
      router.refresh()

      if (e.target) e.target.value = ""
    } catch (err) {
      console.error("[v0] Error uploading meal plan:", err)
      setError(err instanceof Error ? err.message : "Błąd podczas wgrywania jadłospisu")
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async () => {
    if (!mealPlan?.id) return

    if (!confirm("Czy na pewno chcesz usunąć jadłospis?")) return

    try {
      setUploading(true)
      setError("")
      setSuccess("")

      console.log("[v0] Deleting meal plan:", mealPlan.id)

      const result = await deleteMealPlan(mealPlan.id)

      if (!result.success) {
        throw new Error(result.error || "Błąd usuwania")
      }

      console.log("[v0] Meal plan deleted successfully")
      setMealPlan(null)
      setSuccess("Usunięto")
      toast.success("Usunięto")
      router.refresh()
    } catch (err) {
      console.error("[v0] Error deleting meal plan:", err)
      setError("Błąd podczas usuwania jadłospisu")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Zarządzanie Jadłospisem</h1>
        <p className="text-gray-600 mt-2">Wgraj jadłospis dostępny dla wszystkich grup i strony głównej</p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="text-red-800">{error}</div>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200">
          <div className="text-green-800">{success}</div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-600">Ładowanie...</div>
      ) : mealPlan ? (
        <div className="mb-8 p-6 rounded-lg border border-gray-200 bg-white">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Obecny Jadłospis</h3>
                <p className="text-sm text-gray-600 mt-1">Plik jadłospisu</p>
                <p className="text-xs text-gray-500 mt-1">
                  Wgrany: {new Date(mealPlan.created_at).toLocaleDateString("pl-PL")}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <a
                href={mealPlan.pdf_url || mealPlan.image_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-sm font-medium"
              >
                <Download className="w-4 h-4" />
                Pobierz
              </a>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                disabled={uploading}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-8 p-6 rounded-lg border border-dashed border-gray-300 bg-gray-50 text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">Brak aktualnego jadłospisu</p>
        </div>
      )}

      <div className="p-6 rounded-lg border border-gray-200 bg-white">
        <h2 className="font-semibold text-gray-900 mb-4">{mealPlan ? "Zamień jadłospis" : "Wgraj jadłospis"}</h2>
        <div className="flex items-center gap-3">
          <label className="flex-1">
            <input
              type="file"
              accept=".pdf,.doc,.docx,.xls,.xlsx,image/*"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
            />
            <div className="flex items-center gap-2 px-4 py-3 rounded-lg border border-gray-300 hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-colors text-gray-700 font-medium">
              <FileText className="w-5 h-5" />
              Wybierz plik
            </div>
          </label>
          {uploading && <div className="text-gray-600 text-sm">Wgrywanie...</div>}
        </div>
        <p className="text-xs text-gray-500 mt-3">Obsługiwane formaty: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG</p>
      </div>

      {mealPlans.length > 0 && (
        <div className="mt-8 p-6 rounded-lg border border-gray-200 bg-white">
          <h2 className="font-semibold text-gray-900 mb-4">Lista jadłospisów</h2>
          <div className="space-y-3">
            {mealPlans.map((mp) => (
              <div key={mp.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className={`h-2.5 w-2.5 rounded-full ${mp.is_current ? 'bg-green-500' : 'bg-gray-300'}`} />
                  <div className="text-sm text-gray-700">
                    {new Date(mp.created_at).toLocaleDateString('pl-PL')}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={mp.pdf_url || mp.image_url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700 hover:underline text-sm"
                  >
                    Podgląd
                  </a>
                  {!mp.is_current && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        const res = await setCurrentMealPlan(mp.id)
                        if (res.success) {
                          setSuccess('Zapisano')
                          toast.success('Zapisano')
                          fetchMealPlan()
                        } else {
                          setError(res.error || 'Nie udało się ustawić jako aktualny')
                        }
                      }}
                    >
                      Ustaw jako aktualny
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
