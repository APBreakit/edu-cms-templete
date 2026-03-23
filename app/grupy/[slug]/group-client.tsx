"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Lock, Users, Calendar, FileText, Loader2, ArrowLeft, Mail, Phone } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
// fetch via API endpoints to ensure server-side data access in production
 
import GroupPostsSection from "@/components/group-posts-section"
import Link from "next/link"

export default function GroupClient({ 
  initialGroupData, 
  initialMealPlanUrl, 
  initialGalleries,
  slug
}: { 
  initialGroupData: any, 
  initialMealPlanUrl: string | null, 
  initialGalleries: any[],
  slug: string
}) {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [error, setError] = useState("")
  const [honeypot, setHoneypot] = useState("")
  const [num1, setNum1] = useState(0)
  const [num2, setNum2] = useState(0)
  const [captcha, setCaptcha] = useState("")
  const [startTime, setStartTime] = useState<number>(0)
  
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 6
  
  const groupData = initialGroupData
  const mealPlanUrl = initialMealPlanUrl
  const galleries = initialGalleries || []
  
  const totalPages = Math.ceil(galleries.length / ITEMS_PER_PAGE)
  const currentGalleries = galleries.slice(
    (currentPage - 1) * ITEMS_PER_PAGE, 
    currentPage * ITEMS_PER_PAGE
  )

  useEffect(() => {
    const authKey = `group-${slug}-authenticated`
    const cookieFlag = `group_auth_${slug}=true`
    const hasCookie = typeof document !== 'undefined' && document.cookie.includes(cookieFlag)
    if (hasCookie) {
      setIsAuthenticated(true)
    } else {
      const auth = sessionStorage.getItem(authKey)
      if (auth === "true") {
        try { sessionStorage.removeItem(authKey) } catch {}
      }
      setIsAuthenticated(false)
    }

    const a = Math.floor(Math.random() * 9) + 1
    const b = Math.floor(Math.random() * 9) + 1
    setNum1(a)
    setNum2(b)
    setStartTime(Date.now())
    setCurrentPage(1)
  }, [slug])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (!groupData) {
      setError("Nie można załadować danych grupy")
      return
    }

    if (honeypot) {
      setError("Wykryto bot")
      return
    }

    const expected = num1 + num2
    if (Number.parseInt(captcha) !== expected) {
      setError("Nieprawidłowa odpowiedź weryfikacyjna")
      return
    }

    if (Date.now() - startTime < 800) {
      setError("Formularz wypełniony zbyt szybko")
      return
    }

    if (password === groupData.password) {
      setIsAuthenticated(true)
      sessionStorage.setItem(`group-${slug}-authenticated`, "true")
      try {
        document.cookie = `group_auth_${slug}=true; path=/; max-age=${60 * 60 * 6}`
      } catch {}
    } else {
      setError("Nieprawidłowe hasło")
    }
  }

  if (!groupData) {
    return (
      <main className="min-h-screen bg-[#fcfaf8] flex flex-col">
        <Navigation />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
          <h1 className="text-3xl font-bold text-[#443b32]">Nie znaleziono grupy</h1>
          <p className="text-[#6b5f52]">Grupa o podanym adresie nie istnieje.</p>
          <Link href="/grupy">
            <Button variant="outline">Powrót do listy grup</Button>
          </Link>
        </div>
        <Footer />
      </main>
    )
  }

  // Define colors based on slug or use default
  // This is a simple mapping to keep the visual identity consistent with the cards
  const getGroupColor = (slug: string) => {
    const colors: Record<string, string> = {
      czerwona: "from-red-500 to-rose-600",
      lawendowa: "from-purple-400 to-purple-600",
      niebieska: "from-blue-500 to-blue-700",
      pastelowa: "from-pink-300 to-pink-500",
      pomaranczowa: "from-orange-400 to-orange-600",
      turkusowa: "from-cyan-400 to-cyan-600",
      waniliowa: "from-amber-200 to-amber-400",
      zielona: "from-green-500 to-green-700",
    }
    return colors[slug] || "from-[#2f67ab] to-[#6fc0e8]" // Default blue
  }

  const groupGradient = getGroupColor(slug)
  const mainColor = slug === "zielona" ? "text-green-600" : slug === "czerwona" ? "text-red-600" : "text-[#2f67ab]"
  // Simplified color logic for icons/buttons - can be expanded

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#fcfaf8] flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center p-6">
          <Card className="w-full max-w-md p-8 space-y-8 border-[#e5dfd8] shadow-lg">
            <div className="text-center space-y-4">
              <div
                className={`w-20 h-20 bg-gradient-to-br ${groupGradient} rounded-full flex items-center justify-center mx-auto shadow-md`}
              >
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h1 className="font-serif text-3xl text-[#443b32]">{groupData.name}</h1>
              <p className="text-[#6b5f52]">Strefa dla rodziców. Wpisz hasło, aby uzyskać dostęp.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="hidden" aria-hidden="true">
                <Input id="website" name="website" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
              </div>
              <div>
                <Input
                  type="password"
                  placeholder="Hasło grupy"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 rounded-xl"
                />
                {error && <p className="text-sm text-red-600 mt-2 px-1">{error}</p>}
              </div>
              <div>
                <Label htmlFor="captcha">Weryfikacja: Ile to {num1} + {num2}?</Label>
                <Input id="captcha" type="number" value={captcha} onChange={(e) => setCaptcha(e.target.value)} placeholder="Twoja odpowiedź" />
              </div>
              <Button
                type="submit"
                className={`w-full h-12 bg-gradient-to-r ${groupGradient} hover:opacity-90 transition-opacity text-white rounded-xl font-medium text-lg`}
              >
                Zaloguj się
              </Button>
            </form>

            <div className="pt-6 border-t border-[#e5dfd8]">
              <div className="grid grid-cols-2 gap-4 text-center text-sm text-[#6b5f52]">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#fcfaf8] flex items-center justify-center border border-[#e5dfd8]">
                    <Mail className="w-4 h-4 text-[#2f67ab]" />
                  </div>
                  <span>Kontakt z wychowawcą</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#fcfaf8] flex items-center justify-center border border-[#e5dfd8]">
                    <Phone className="w-4 h-4 text-[#2f67ab]" />
                  </div>
                  <span>Sekretariat</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#fcfaf8]">
      <Navigation />
      
      {/* Hero Section with Group Info */}
      <section className={`relative py-20 overflow-hidden`}>
        <div className={`absolute inset-0 bg-gradient-to-br ${groupGradient} opacity-10`} />
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className={`inline-flex items-center justify-center p-3 rounded-full bg-white shadow-md mb-4`}>
              <Users className={`w-8 h-8 ${mainColor}`} />
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#443b32] mb-4">
              {groupData.name}
            </h1>
            <p className="text-xl text-[#6b5f52] max-w-2xl mx-auto">
              {groupData.description || `Witajcie w ${groupData.name}! Tutaj znajdziecie wszystkie aktualności i zdjęcia z życia naszej grupy.`}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 text-left">
              <Card className="p-6 border-none shadow-md bg-white/80 backdrop-blur">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${groupGradient} text-white`}>
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#443b32] mb-1">Nauczyciele</h3>
                    <p className="text-[#6b5f52] text-sm">{groupData.teacher_name}</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6 border-none shadow-md bg-white/80 backdrop-blur">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${groupGradient} text-white`}>
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#443b32] mb-1">Wiek dzieci</h3>
                    <p className="text-[#6b5f52] text-sm">{groupData.age_group}</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6 border-none shadow-md bg-white/80 backdrop-blur">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${groupGradient} text-white`}>
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#443b32] mb-1">Godziny</h3>
                    <p className="text-[#6b5f52] text-sm">{groupData.hours}</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <div className="container mx-auto px-4 sm:px-6 py-12 space-y-16">
        
        {/* Posts & Announcements */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-3xl text-[#443b32]">Aktualności grupowe</h2>
          </div>
          <GroupPostsSection groupSlug={slug} />
        </section>

        {/* Gallery Preview */}
        {galleries && galleries.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-serif text-3xl text-[#443b32]">Nasze zdjęcia</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {currentGalleries.map((gallery: any) => (
                <Link key={gallery.id} href={`/galeria/${gallery.slug}`}>
                  <div className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300">
                    <img 
                      src={gallery.cover_image_url || "/placeholder.svg"} 
                      alt={gallery.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                      <h3 className="text-white font-bold text-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        {gallery.title}
                      </h3>
                      <p className="text-white/80 text-sm mt-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                        Kliknij, aby zobaczyć zdjęcia
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center mt-8 gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 p-0 rounded-full ${
                      currentPage === page 
                        ? "bg-[#2f67ab] text-white hover:bg-[#25528a]" 
                        : "text-[#443b32] hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </Button>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Meal Plan Shortcut */}
        {mealPlanUrl && (
          <section className="bg-[#fff9f0] rounded-3xl p-8 md:p-12 border border-[#e5dfd8]">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-4 text-center md:text-left">
                <h2 className="font-serif text-3xl text-[#443b32]">Jadłospis na ten tydzień</h2>
                <p className="text-[#6b5f52] max-w-xl">
                  Sprawdź co pysznego przygotowaliśmy dla naszych przedszkolaków w tym tygodniu. Dbamy o zbilansowaną i zdrową dietę.
                </p>
              </div>
              <a href={mealPlanUrl} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-[#2f67ab] hover:bg-[#25528a] text-white rounded-xl h-14 px-8 text-lg shadow-lg hover:shadow-xl transition-all">
                  Pobierz jadłospis
                </Button>
              </a>
            </div>
          </section>
        )}
      </div>
      
      <Footer />
    </main>
  )
}
