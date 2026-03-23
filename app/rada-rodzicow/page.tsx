"use client"
import { Users, Mail, Phone, Calendar, FileText, Heart, ArrowUpRight, Check } from "lucide-react"
import Link from "next/link"
import { Footer } from "@/components/footer"
import { Navigation } from "@/components/navigation"
import { getRadaRodzicowData, getRRInfoPublic, getPublicGalleryImages } from "@/app/actions/public-actions"
import GalleryImagesGrid from "@/components/gallery-images-grid"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface Post {
  id: string
  title: string
  excerpt: string
  content: string
  created_at: string
  image_url: string | null
  type: string
  slug: string
  add_to_calendar?: boolean
  calendar_date?: string | null
  calendar_end_date?: string | null
}

interface Document {
  id: string
  title: string
  url: string | null
  display_order: number
}

export default function RadaRodzicowPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [rrPublic, setRrPublic] = useState<{ chairperson?: string; vice_chairperson?: string; treasurer?: string; secretary?: string }>({})
  const [gallery, setGallery] = useState<Array<{ id: string; file_url: string; file_name: string | null }>>([])

  useEffect(() => {
    async function fetchData() {
      try {
        // Using Server Action
        const { posts, documents } = await getRadaRodzicowData()

        setPosts((posts || []).map((p: any) => ({
          id: String(p.id),
          title: String(p.title || ""),
          excerpt: String(p.excerpt || ""),
          content: String(p.content || ""),
          created_at: String(p.created_at || new Date().toISOString()),
          image_url: p.image_url ?? null,
          type: String(p.type || "rada-rodzicow"),
          slug: String(p.slug || ""),
          add_to_calendar: Boolean(p.add_to_calendar),
          calendar_date: p.calendar_date ? String(p.calendar_date) : null,
          calendar_end_date: p.calendar_end_date ? String(p.calendar_end_date) : null,
        })))

        setDocuments((documents || []).map((d: any) => ({
          id: String(d.id),
          title: String(d.title || "Dokument"),
          url: d.url ?? null,
          display_order: Number(d.display_order ?? 0),
        })))
        const rr = await getRRInfoPublic()
        if (rr) setRrPublic(rr as any)
        const imgs = await getPublicGalleryImages("rada-rodzicow-wazne")
        setGallery((imgs || []).map((i: any) => ({ id: i.id, file_url: i.file_url, file_name: i.file_name || null })))
      } catch (error) {
        console.error("[v0] Error in fetchData:", error)
      }

      setLoading(false)
    }

    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#f8f9fa]">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-12 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2f67ab]/5 to-[#4a90e2]/5" />
        <div className="container mx-auto px-4 sm:px-6 relative">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#2f67ab] to-[#4a90e2] mb-6">
              <Users className="w-10 h-10 text-white" />
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#443b32] font-bold">Rada Rodziców</h1>
            <p className="text-lg text-[#443b32]/70 leading-relaxed max-w-2xl mx-auto">
              Rada Rodziców jest organem reprezentującym ogół rodziców dzieci uczęszczających do naszego przedszkola
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto space-y-12">
            {/* Ważne */}
            {/* Składki */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#443b32]/5">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2f67ab] to-[#4a90e2] flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <h2 className="font-serif text-2xl text-[#443b32] font-bold">Składki Rady Rodziców</h2>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {/* First Child */}
                <div className="relative bg-gradient-to-br from-[#2f67ab]/5 to-[#4a90e2]/5 rounded-2xl p-6 border-2 border-[#2f67ab]/20">
                  <div className="text-center space-y-4">
                    <div className="text-sm font-medium text-[#2f67ab] uppercase tracking-wide">Pierwsze dziecko</div>
                    <div className="space-y-1">
                      <div className="text-4xl font-bold text-[#443b32]">45 zł</div>
                      <div className="text-sm text-[#443b32]/60">miesięcznie</div>
                    </div>
                  </div>
                </div>

                {/* Second Child - Highlighted */}
                <div className="relative bg-gradient-to-br from-[#2f67ab] to-[#4a90e2] rounded-2xl p-6 border-2 border-[#2f67ab] shadow-lg transform scale-105">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#443b32] text-white text-xs font-bold px-3 py-1 rounded-full">
                    POPULARNE
                  </div>
                  <div className="text-center space-y-4">
                    <div className="text-sm font-medium text-white uppercase tracking-wide">Drugie dziecko</div>
                    <div className="space-y-1">
                      <div className="text-4xl font-bold text-white">25 zł</div>
                      <div className="text-sm text-white/80">miesięcznie</div>
                    </div>
                  </div>
                </div>

                {/* Third Child */}
                <div className="relative bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
                  <div className="text-center space-y-4">
                    <div className="text-sm font-medium text-green-700 uppercase tracking-wide">Trzecie dziecko</div>
                    <div className="space-y-1">
                      <div className="text-4xl font-bold text-green-700">0 zł</div>
                      <div className="text-sm text-green-600">bezpłatnie</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#f8f9fa] rounded-2xl p-6">
                <h3 className="font-semibold text-[#443b32] mb-4">Na co przeznaczane są składki?</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#2f67ab] flex-shrink-0 mt-0.5" />
                    <span className="text-[#443b32]/70">Organizacja imprez i uroczystości przedszkolnych</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#2f67ab] flex-shrink-0 mt-0.5" />
                    <span className="text-[#443b32]/70">Zakup pomocy dydaktycznych i zabawek</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#2f67ab] flex-shrink-0 mt-0.5" />
                    <span className="text-[#443b32]/70">Dofinansowanie wycieczek i wyjść edukacyjnych</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#2f67ab] flex-shrink-0 mt-0.5" />
                    <span className="text-[#443b32]/70">Wsparcie działalności statutowej przedszkola</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#2f67ab] flex-shrink-0 mt-0.5" />
                    <span className="text-[#443b32]/70">Prezenty dla dzieci z okazji świąt</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cele i Zadania */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#443b32]/5">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2f67ab] to-[#4a90e2] flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <h2 className="font-serif text-2xl text-[#443b32] font-bold">Cele i Zadania</h2>
              </div>
              <div className="space-y-4 text-[#443b32]/70">
                <p className="leading-relaxed">
                  Rada Rodziców działa na podstawie ustawy o systemie oświaty oraz regulaminu uchwalonego przez ogół
                  rodziców.
                </p>
                <ul className="space-y-3 ml-6">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#2f67ab] mt-2 flex-shrink-0" />
                    <span>
                      Reprezentowanie ogółu rodziców oraz podejmowanie działań zmierzających do doskonalenia statutowej
                      działalności przedszkola
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#2f67ab] mt-2 flex-shrink-0" />
                    <span>Gromadzenie funduszy z dobrowolnych składek rodziców oraz innych źródeł</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#2f67ab] mt-2 flex-shrink-0" />
                    <span>Współpraca z Dyrektorem przedszkola i Radą Pedagogiczną</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#2f67ab] mt-2 flex-shrink-0" />
                    <span>Organizacja imprez i uroczystości przedszkolnych</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#2f67ab] mt-2 flex-shrink-0" />
                    <span>Wspieranie działalności statutowej przedszkola</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Skład Rady */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#443b32]/5">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2f67ab] to-[#4a90e2] flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h2 className="font-serif text-2xl text-[#443b32] font-bold">Skład Rady Rodziców</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-gradient-to-br from-[#2f67ab]/5 to-[#4a90e2]/5 border border-[#2f67ab]/10">
                  <div className="font-semibold text-[#443b32] mb-2">Przewodnicząca</div>
                  <div className="text-[#443b32]/70">{rrPublic.chairperson || "Imię i Nazwisko"}</div>
                </div>
                <div className="p-6 rounded-2xl bg-gradient-to-br from-[#2f67ab]/5 to-[#4a90e2]/5 border border-[#2f67ab]/10">
                  <div className="font-semibold text-[#443b32] mb-2">Wiceprzewodnicząca</div>
                  <div className="text-[#443b32]/70">{rrPublic.vice_chairperson || "Imię i Nazwisko"}</div>
                </div>
                <div className="p-6 rounded-2xl bg-gradient-to-br from-[#2f67ab]/5 to-[#4a90e2]/5 border border-[#2f67ab]/10">
                  <div className="font-semibold text-[#443b32] mb-2">Skarbnik</div>
                  <div className="text-[#443b32]/70">{rrPublic.treasurer || "Imię i Nazwisko"}</div>
                </div>
                <div className="p-6 rounded-2xl bg-gradient-to-br from-[#2f67ab]/5 to-[#4a90e2]/5 border border-[#2f67ab]/10">
                  <div className="font-semibold text-[#443b32] mb-2">Sekretarz</div>
                  <div className="text-[#443b32]/70">{rrPublic.secretary || "Imię i Nazwisko"}</div>
                </div>
              </div>
              <p className="text-sm text-[#443b32]/60 mt-6 italic">
                * Skład Rady Rodziców jest wybierany na zebraniu ogólnym rodziców na początku każdego roku szkolnego
              </p>
            </div>

            {/* Aktualności */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#443b32]/5">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2f67ab] to-[#4a90e2] flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <h2 className="font-serif text-2xl text-[#443b32] font-bold">Aktualności Rady Rodziców</h2>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block w-8 h-8 border-4 border-[#2f67ab]/20 border-t-[#2f67ab] rounded-full animate-spin" />
                  <p className="text-[#443b32]/60 mt-4">Ładowanie aktualności...</p>
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-[#443b32]/20 mx-auto mb-4" />
                  <p className="text-[#443b32]/60">Brak aktualności od Rady Rodziców</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {posts.map((post) => (
                    <div
                      key={post.id}
                      className="bg-gradient-to-br from-[#f8f9fa] to-white rounded-2xl p-6 border border-[#443b32]/5 hover:shadow-lg transition-all"
                    >
                      <div className="space-y-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-sm text-[#2f67ab]">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(post.created_at).toLocaleDateString("pl-PL")}</span>
                          </div>
                          {post.add_to_calendar && post.calendar_date && (
                            <div className="flex items-center gap-2 text-sm text-[#2f67ab] font-medium">
                              <Calendar className="w-4 h-4" />
                              <span>
                                Wydarzenie: {new Date(post.calendar_date).toLocaleDateString("pl-PL")}
                                {post.calendar_end_date && ` - ${new Date(post.calendar_end_date).toLocaleDateString("pl-PL")}`}
                              </span>
                            </div>
                          )}
                        </div>
                        <h3 className="font-serif text-xl text-[#443b32] font-bold">{post.title}</h3>
                        <div
                          className="text-[#443b32]/70 leading-relaxed line-clamp-3"
                          dangerouslySetInnerHTML={{ __html: post.excerpt || post.content || "" }}
                        />
                        <Link
                          href={`/${post.type}/${post.slug}`}
                          className="inline-flex items-center text-[#2f67ab] hover:text-[#4a90e2] font-medium group"
                        >
                          Czytaj więcej
                          <ArrowUpRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Kontakt */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#443b32]/5">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2f67ab] to-[#4a90e2] flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <h2 className="font-serif text-2xl text-[#443b32] font-bold">Kontakt z Radą Rodziców</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#f8f9fa]">
                  <Mail className="w-5 h-5 text-[#2f67ab]" />
                  <div>
                    <div className="text-sm text-[#443b32]/60 mb-1">Email</div>
                    <a href="mailto:kontakt@educms-szablon.pl" className="text-[#2f67ab] hover:underline">
                      kontakt@educms-szablon.pl
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#f8f9fa]">
                  <Phone className="w-5 h-5 text-[#2f67ab]" />
                  <div>
                    <div className="text-sm text-[#443b32]/60 mb-1">Telefon</div>
                    <a href="tel:690471187" className="text-[#2f67ab] hover:underline">
                      123 456 789
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Ważne */}
            {gallery.length > 0 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#443b32]/5">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2f67ab] to-[#4a90e2] flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="font-serif text-2xl text-[#443b32] font-bold">Ważne</h2>
                </div>
                <div>
                  <GalleryImagesGrid
                    images={gallery.slice(0, 2).map((img) => ({ id: img.id, image_url: img.file_url, title: img.file_name || "Ważne" }))}
                  />
                </div>
              </div>
            )}

            {/* Dokumenty */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#443b32]/5">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2f67ab] to-[#4a90e2] flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h2 className="font-serif text-2xl text-[#443b32] font-bold">Dokumenty</h2>
              </div>
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block w-8 h-8 border-4 border-[#2f67ab]/20 border-t-[#2f67ab] rounded-full animate-spin" />
                </div>
              ) : documents.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-[#443b32]/20 mx-auto mb-4" />
                  <p className="text-[#443b32]/60">Brak dokumentów</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {documents.map((doc) => (
                    <a
                      key={doc.id}
                      href={doc.url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 rounded-2xl bg-[#f8f9fa] hover:bg-[#2f67ab]/5 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-[#2f67ab]" />
                        <div>
                          <span className="text-[#443b32] group-hover:text-[#2f67ab] transition-colors block">
                            {doc.title}
                          </span>
                          <span className="text-sm text-[#443b32]/60 block mt-1">Dokument do pobrania</span>
                        </div>
                      </div>
                      <span className="text-sm text-[#443b32]/40">{(doc.url?.split('.').pop() || 'plik').toUpperCase()}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
