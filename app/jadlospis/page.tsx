"use client"

import { useState, useEffect } from "react"
import { getMealPlan } from "@/app/actions/public-actions"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { FileText, Download, Calendar, ChefHat } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function JadlospisPage() {
  const [mealPlan, setMealPlan] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMealPlan()
  }, [])

  const fetchMealPlan = async () => {
    try {
      setLoading(true)

      // Using Server Action
      const data = await getMealPlan()
      setMealPlan(data)
    } catch (err) {
      console.error("Error fetching meal plan:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-12 sm:py-16">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">
                <Calendar className="w-4 h-4" />
                Jadłospis
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">Aktualny Jadłospis</h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Poznaj zdrowe i smaczne posiłki, które przygotowujemy dla naszych podopiecznych
              </p>
            </div>

            <div className="mb-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
              <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <ChefHat className="w-8 h-8" />
                </div>
                <div className="text-center sm:text-left">
                  <h2 className="text-2xl font-bold">Profesjonalna Własna Kuchnia</h2>
                  <p className="text-orange-100 mt-1">
                    Wszystkie posiłki są przygotowywane na miejscu w naszej kuchni, która mieści się w budynku
                    przedszkola
                  </p>
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-3xl mb-2">🍳</div>
                  <div className="font-semibold">Świeże Składniki</div>
                  <div className="text-sm text-orange-100">Codziennie świeże produkty</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-3xl mb-2">👨‍🍳</div>
                  <div className="font-semibold">Doświadczony Zespół</div>
                  <div className="text-sm text-orange-100">Profesjonalni kucharze</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-3xl mb-2">🏠</div>
                  <div className="font-semibold">W Budynku Przedszkola</div>
                  <div className="text-sm text-orange-100">Kuchnia na miejscu</div>
                </div>
              </div>
            </div>

            {/* Meal Plan Display */}
            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                <p className="mt-4 text-gray-600">Ładowanie jadłospisu...</p>
              </div>
            ) : mealPlan ? (
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 sm:p-8 text-white">
                  <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                      <FileText className="w-8 h-8" />
                    </div>
                    <div className="text-center sm:text-left">
                      <h2 className="text-2xl font-bold">{mealPlan.file_name}</h2>
                      <p className="text-blue-100 mt-1">
                        Zaktualizowano:{" "}
                        {new Date(mealPlan.created_at).toLocaleDateString("pl-PL", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 sm:p-8">
                  {/* PDF Preview or Image */}
                  {mealPlan.file_url.toLowerCase().endsWith(".pdf") ? (
                    <div className="mb-6">
                      <iframe
                        src={mealPlan.file_url}
                        className="w-full h-[400px] sm:h-[600px] rounded-lg border border-gray-200"
                        title="Jadłospis PDF"
                      />
                    </div>
                  ) : (
                    <div className="mb-6">
                      <img
                        src={mealPlan.file_url || "/placeholder.svg"}
                        alt="Jadłospis"
                        className="w-full rounded-lg border border-gray-200"
                      />
                    </div>
                  )}

                  {/* Download Button */}
                  <div className="flex justify-center">
                    <a href={mealPlan.file_url} download={mealPlan.file_name} target="_blank" rel="noopener noreferrer">
                      <Button size="lg" className="gap-2">
                        <Download className="w-5 h-5" />
                        Pobierz Jadłospis
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-12 text-center">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Brak aktualnego jadłospisu</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Jadłospis nie został jeszcze udostępniony. Sprawdź ponownie wkrótce.
                </p>
              </div>
            )}

            {/* Info Section */}
            <div className="mt-12 grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mb-4">
                  <span className="text-2xl">🥗</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Zdrowe Posiłki</h3>
                <p className="text-gray-600 text-sm">
                  Wszystkie posiłki przygotowywane są ze świeżych, wysokiej jakości składników
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                  <span className="text-2xl">👨‍🍳</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Profesjonalna Kuchnia</h3>
                <p className="text-gray-600 text-sm">Posiłki przygotowywane przez doświadczonych kucharzy z pasją</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                  <span className="text-2xl">📅</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Regularne Aktualizacje</h3>
                <p className="text-gray-600 text-sm">
                  Jadłospis aktualizowany regularnie z uwzględnieniem preferencji dzieci
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
