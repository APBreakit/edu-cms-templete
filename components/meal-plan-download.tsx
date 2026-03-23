"use client"

import { useEffect, useState } from "react"
import { getLatestMealPlan } from "@/app/actions/admin-actions"
import { Download } from "lucide-react"

export default function MealPlanDownload() {
  const [mealPlan, setMealPlan] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMealPlan()
  }, [])

  const fetchMealPlan = async () => {
    try {
      setLoading(true)
      const plan = await getLatestMealPlan()
      setMealPlan(plan)
    } catch (err) {
      console.error("[v0] Error fetching meal plan:", err)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !mealPlan) return null

  return (
    <a
      href={mealPlan.pdfUrl || mealPlan.imageUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl font-medium transition-all hover:scale-105"
    >
      <Download className="w-5 h-5" />
      Pobierz jadłospis
    </a>
  )
}
