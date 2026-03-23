"use client"

import { useEffect, useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { getVisibleGalleryCategories, getPublicGalleries } from "@/app/actions/public-actions"
import { Loader2 } from "lucide-react"
import Link from "next/link"

const baseCategories = [
  { id: "wszystkie", label: "Wszystkie" },
]

export default function GaleriaPage() {
  const [galleries, setGalleries] = useState<any[]>([])
  const [categories, setCategories] = useState<Array<{ id: string; label: string; slug?: string }>>(baseCategories)
  const [selectedCategory, setSelectedCategory] = useState("wszystkie")
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  useEffect(() => {
    fetchCategories()
    fetchGalleries("wszystkie", 1)
  }, [])

  useEffect(() => {
    // reset when category changes
    setPage(1)
    setHasMore(true)
    setGalleries([])
    fetchGalleries(selectedCategory, 1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory])

  useEffect(() => {
    const onScroll = () => {
      if (loadingMore || !hasMore) return
      const scrollY = window.scrollY
      const vh = window.innerHeight
      const full = document.body.scrollHeight
      if (scrollY + vh + 200 >= full) {
        setLoadingMore(true)
        const next = page + 1
        fetchGalleries(selectedCategory, next).finally(() => {
          setPage(next)
          setLoadingMore(false)
        })
      }
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [page, selectedCategory, hasMore, loadingMore])

  const fetchCategories = async () => {
    try {
      const rows = await getVisibleGalleryCategories()
      const mapped = baseCategories.concat(rows.map((r: any) => ({ id: r.slug, label: r.name })))
      setCategories(mapped)
    } catch (e) {}
  }

  const fetchGalleries = async (category: string, pageNum: number) => {
    setIsLoading(true)
    try {
      const LIMIT = 12
      const rows = await getPublicGalleries(category, pageNum, LIMIT)
      if (pageNum === 1) {
        setGalleries(rows || [])
      } else {
        setGalleries((prev) => prev.concat(rows || []))
      }
      if (!rows || rows.length < LIMIT) {
        setHasMore(false)
      }
    } catch (error) {
      console.error("[v0] Error fetching galleries:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen relative overflow-hidden bg-[#fcfaf8] text-[#443b32]">
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full gradient-3 blur-3xl animate-gradient" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full gradient-1 blur-3xl animate-gradient animation-delay-400" />
      </div>

      <Navigation />

      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 relative">
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-12">
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#443b32] leading-tight">Galeria</h1>
          <p className="text-[#443b32]/70 text-lg leading-relaxed">Zdjęcia z życia naszego przedszkola</p>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-2.5 rounded-full font-medium transition-all ${
                selectedCategory === category.id
                  ? "bg-[#2f67ab] text-white shadow-lg"
                  : "bg-white text-[#443b32] hover:bg-[#2f67ab]/10 border border-[#2f67ab]/20"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Gallery grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#2f67ab]" />
          </div>
        ) : galleries.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#443b32]/60 text-lg">Brak zdjęć w tej kategorii</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {galleries.map((g) => (
              <Link key={g.id} href={`/galeria/${g.slug}`} className="group block rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all">
                <div className="relative aspect-square">
                  {g.cover_image_url ? (
                    <img src={g.cover_image_url} alt={g.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-white">Brak okładki</div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white text-sm px-3 py-2 flex items-center justify-between">
                    <span className="line-clamp-1">{g.description || g.title}</span>
                    {typeof g.image_count !== 'undefined' && (
                      <span className="text-xs bg-white/20 rounded-full px-2 py-0.5">{g.image_count}</span>
                    )}
                  </div>
                  <div className="absolute top-2 left-2 px-2 py-1 rounded bg-blue-600/80 text-white text-xs font-semibold">Ogólna</div>
                </div>
                <div className="p-4 text-center font-medium">{g.title}</div>
              </Link>
            ))}
          </div>
        )}

        {loadingMore && (
          <div className="flex items-center justify-center mt-10">
            <Loader2 className="w-6 h-6 animate-spin text-[#2f67ab]" />
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}
