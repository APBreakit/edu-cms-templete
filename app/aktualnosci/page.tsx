"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { Calendar, ArrowUpRight, Bell, Megaphone, Trophy, Users, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import CalendarView from "@/components/admin/calendar-view"
import { getPublicPosts } from "@/app/actions/public-actions"

type EventType = "aktualnosci" | "ogloszenia" | "konkursy" | "rada-rodzicow" | "okiem-specjalisty"

interface CalendarEvent {
  date: number
  type: EventType
  title: string
  endDate?: number
  articleId?: string
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

function getDaysUntil(targetDate: number, currentDate: number) {
  return targetDate - currentDate
}

export default function AktualnosciPage() {
  const [activeTab, setActiveTab] = useState<"aktualnosci" | "ogloszenia" | "konkursy" | "rada-rodzicow" | "okiem-specjalisty">(
    "aktualnosci"
  )
  const [currentDate, setCurrentDate] = useState(new Date())
  const [currentDay, setCurrentDay] = useState(new Date().getDate())
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPosts() {
      try {
        // Using Server Action
        const data = await getPublicPosts()

        setPosts(data || [])
      } catch (error) {
        console.error("[v0] Failed to fetch posts:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [currentDate])

  const filteredPosts = posts.filter((post) => post.type === activeTab)

  return (
    <main className="min-h-screen relative overflow-hidden bg-background text-foreground">
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full gradient-3 blur-3xl animate-gradient" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full gradient-1 blur-3xl animate-gradient animation-delay-400" />
      </div>

      <Navigation />

      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 relative">
        <div className="text-center space-y-8 max-w-4xl mx-auto mb-16">
          <div className="space-y-4">
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-foreground leading-tight">Aktualności</h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Bieżące informacje i ważne komunikaty z życia przedszkola
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mb-16">
          <CalendarView events={posts.filter((p) => p.add_to_calendar && p.calendar_date)} />
        </div>

        <div className="flex items-center justify-center gap-4 flex-wrap mb-12">
          <button
            onClick={() => setActiveTab("aktualnosci")}
            className={`px-4 py-3 sm:px-8 sm:py-4 rounded-2xl font-medium transition-all ${activeTab === "aktualnosci"
              ? "bg-primary text-primary-foreground shadow-lg scale-105"
              : "bg-card text-foreground hover:shadow-md"
              }`}
          >
            <Calendar className="w-5 h-5 inline mr-2" />
            Aktualności
          </button>
          <button
            onClick={() => setActiveTab("ogloszenia")}
            className={`px-4 py-3 sm:px-8 sm:py-4 rounded-2xl font-medium transition-all ${activeTab === "ogloszenia"
              ? "bg-purple-50 text-purple-700 border border-purple-200 shadow-md scale-105"
              : "bg-card text-foreground hover:shadow-md"
              }`}
          >
            <Megaphone className="w-5 h-5 inline mr-2" />
            Ogłoszenia
          </button>
          <button
            onClick={() => setActiveTab("konkursy")}
            className={`px-4 py-3 sm:px-8 sm:py-4 rounded-2xl font-medium transition-all ${activeTab === "konkursy"
              ? "bg-amber-50 text-amber-700 border border-amber-200 shadow-md scale-105"
              : "bg-card text-foreground hover:shadow-md"
              }`}
          >
            <Trophy className="w-5 h-5 inline mr-2" />
            Konkursy
          </button>
          <button
            onClick={() => setActiveTab("rada-rodzicow")}
            className={`px-4 py-3 sm:px-8 sm:py-4 rounded-2xl font-medium transition-all ${activeTab === "rada-rodzicow"
              ? "bg-muted text-muted-foreground shadow-lg scale-105"
              : "bg-card text-foreground hover:shadow-md"
              }`}
          >
            <Users className="w-5 h-5 inline mr-2" />
            Rada Rodziców
          </button>
          <button
            onClick={() => setActiveTab("okiem-specjalisty")}
            className={`px-4 py-3 sm:px-8 sm:py-4 rounded-2xl font-medium transition-all ${activeTab === "okiem-specjalisty"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-md scale-105"
              : "bg-card text-foreground hover:shadow-md"
              }`}
          >
            <Eye className="w-5 h-5 inline mr-2" />
            Okiem specjalisty
          </button>
        </div>

        {activeTab === "aktualnosci" && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-0 animate-fade-in-up">
            {loading ? (
              <div className="col-span-full text-center py-12 text-muted-foreground">Ładowanie aktualności...</div>
            ) : filteredPosts.length === 0 ? (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                Brak aktualności. Dodaj pierwszą w panelu administracyjnym.
              </div>
            ) : (
              filteredPosts.map((post) => (
                <div
                  key={post.id}
                  id={post.id}
                  className="bg-card rounded-3xl overflow-hidden transition-all hover:shadow-xl hover:scale-[1.02]"
                >
                  {post.image_url ? (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={post.image_url || "/placeholder.svg"}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="relative h-48 bg-gradient-to-br from-primary to-secondary">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Calendar className="w-16 h-16 text-primary-foreground/30" />
                      </div>
                    </div>
                  )}
                  <div className="p-6 space-y-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-sm text-primary">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(post.created_at).toLocaleDateString("pl-PL")}</span>
                      </div>
                      {post.add_to_calendar && post.calendar_date && (
                        <div className="flex items-center gap-2 text-sm text-blue-600 font-medium mt-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            Wydarzenie: {new Date(post.calendar_date).toLocaleDateString("pl-PL")}
                            {post.calendar_end_date && ` - ${new Date(post.calendar_end_date).toLocaleDateString("pl-PL")}`}
                          </span>
                        </div>
                      )}
                    </div>
                    <h3 className="font-serif text-2xl text-foreground">{post.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {post.excerpt || post.content?.replace(/<[^>]*>?/gm, '').substring(0, 150) + "..."}
                    </p>
                    <Link href={`/${activeTab}/${post.slug}`} className="inline-flex items-center text-primary hover:text-secondary font-medium">
                      Czytaj więcej
                      <ArrowUpRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "okiem-specjalisty" && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-0 animate-fade-in-up">
            {loading ? (
              <div className="col-span-full text-center py-12 text-muted-foreground">Ładowanie artykułów...</div>
            ) : filteredPosts.length === 0 ? (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                Brak artykułów. Dodaj pierwszy w panelu administracyjnym.
              </div>
            ) : (
              filteredPosts.map((post) => (
                <div
                  key={post.id}
                  id={post.id}
                  className="bg-card rounded-3xl overflow-hidden transition-all hover:shadow-xl hover:scale-[1.02]"
                >
                  {post.image_url ? (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={post.image_url || "/placeholder.svg"}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="relative h-48 bg-gradient-to-br from-emerald-500 to-emerald-700">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Eye className="w-16 h-16 text-white/30" />
                      </div>
                    </div>
                  )}
                  <div className="p-6 space-y-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-sm text-emerald-700">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(post.created_at).toLocaleDateString("pl-PL")}</span>
                      </div>
                      {post.add_to_calendar && post.calendar_date && (
                        <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium mt-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            Wydarzenie: {new Date(post.calendar_date).toLocaleDateString("pl-PL")}
                            {post.calendar_end_date && ` - ${new Date(post.calendar_end_date).toLocaleDateString("pl-PL")}`}
                          </span>
                        </div>
                      )}
                    </div>
                    <h3 className="font-serif text-2xl text-foreground">{post.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {post.excerpt || post.content?.replace(/<[^>]*>?/gm, '').substring(0, 150) + "..."}
                    </p>
                    <Link
                      href={`/${activeTab}/${post.slug}`}
                      className="inline-flex items-center text-emerald-700 hover:text-emerald-900 font-medium"
                    >
                      Czytaj więcej
                      <ArrowUpRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "ogloszenia" && (
          <div className="space-y-6 max-w-4xl mx-auto opacity-0 animate-fade-in-up">
            {loading ? (
              <div className="text-center py-12 text-muted-foreground">Ładowanie ogłoszeń...</div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                Brak ogłoszeń. Dodaj pierwsze w panelu administracyjnym.
              </div>
            ) : (
              filteredPosts.map((post) => (
                <Link
                  key={post.id}
                  id={post.id}
                  href={`/${activeTab}/${post.slug}`}
                  className="bg-card rounded-3xl p-6 sm:p-8 border-l-4 border-purple-200 transition-all hover:shadow-xl block"
                >
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-purple-50 hidden sm:flex items-center justify-center flex-shrink-0">
                      <Bell className="w-8 h-8 text-purple-600" />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <h3 className="font-serif text-2xl text-foreground">{post.title}</h3>
                        <Badge className="bg-purple-50 text-purple-700 border-0">Ważne</Badge>
                      </div>
                      <div
                        className="text-muted-foreground leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: post.excerpt || post.content || "" }}
                      />
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>Opublikowano: {new Date(post.created_at).toLocaleDateString("pl-PL")}</span>
                        </div>
                        {post.add_to_calendar && post.calendar_date && (
                          <div className="flex items-center gap-2 text-sm text-purple-600 font-medium">
                            <Calendar className="w-4 h-4" />
                            <span>
                              Wydarzenie: {new Date(post.calendar_date).toLocaleDateString("pl-PL")}
                              {post.calendar_end_date && ` - ${new Date(post.calendar_end_date).toLocaleDateString("pl-PL")}`}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}

        {activeTab === "konkursy" && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 opacity-0 animate-fade-in-up">
            {loading ? (
              <div className="col-span-full text-center py-12 text-muted-foreground">Ładowanie konkursów...</div>
            ) : filteredPosts.length === 0 ? (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                Brak konkursów. Dodaj pierwszy w panelu administracyjnym.
              </div>
            ) : (
              filteredPosts.map((post) => {
                const startDate = post.competition_start_date ? new Date(post.competition_start_date) : null
                const endDate = post.competition_end_date ? new Date(post.competition_end_date) : null
                const daysUntil = endDate ? Math.ceil((endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null
                const isActive = post.competition_status === "active"
                const isUpcoming = post.competition_status === "upcoming"
                const isFinished = post.competition_status === "finished"

                return (
                  <div
                    key={post.id}
                    id={post.id}
                    className={`relative bg-gradient-to-br from-card ${isActive
                      ? "to-accent/5 border-accent/20"
                      : isUpcoming
                        ? "to-primary/5 border-primary/20"
                        : "to-secondary/5 border-secondary/20 opacity-75"
                      } rounded-3xl overflow-hidden transition-all hover:shadow-2xl hover:scale-[1.05] group border-2`}
                  >
                    {isActive && (
                      <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden">
                        <div className="absolute top-4 right-[-32px] bg-gradient-to-r from-accent to-accent-foreground text-white text-xs font-bold py-1 px-8 rotate-45 shadow-lg">
                          TRWA
                        </div>
                      </div>
                    )}

                    {isUpcoming && (
                      <div className="absolute top-0 right-0 w-28 h-28 overflow-hidden">
                        <div className="absolute top-5 right-[-36px] bg-gradient-to-r from-primary to-secondary text-white text-xs font-bold py-1 px-10 rotate-45 shadow-lg">
                          WKRÓTCE
                        </div>
                      </div>
                    )}

                    {isFinished && (
                      <div className="absolute top-0 right-0 w-32 h-32 overflow-hidden">
                        <div className="absolute top-6 right-[-40px] bg-gradient-to-r from-muted to-secondary text-white text-xs font-bold py-1 px-12 rotate-45 shadow-lg">
                          ZAKOŃCZONY
                        </div>
                      </div>
                    )}

                    {post.image_url ? (
                      <div className="relative h-56 overflow-hidden">
                        <img
                          src={post.image_url || "/placeholder.svg"}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div
                        className={`relative h-56 bg-gradient-to-br ${isActive
                          ? "from-accent via-secondary to-primary"
                          : isUpcoming
                            ? "from-primary via-secondary to-accent"
                            : "from-secondary via-accent to-muted"
                          } overflow-hidden`}
                      >
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Trophy className="w-32 h-32 text-primary-foreground/20 group-hover:scale-110 transition-transform duration-500" />
                        </div>
                      </div>
                    )}

                    <div className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-10 h-10 rounded-full bg-gradient-to-br ${isActive
                              ? "from-accent to-accent-foreground"
                              : isUpcoming
                                ? "from-primary to-secondary"
                                : "from-secondary to-muted"
                              } flex items-center justify-center shadow-lg`}
                          >
                            <Trophy className="w-5 h-5 text-primary-foreground" />
                          </div>
                          <Badge
                            className={`bg-gradient-to-r ${isActive
                              ? "from-accent to-accent-foreground"
                              : isUpcoming
                                ? "from-primary to-secondary"
                                : "from-secondary to-muted"
                              } text-white border-0 shadow-md`}
                          >
                            {isActive ? "Trwa" : isUpcoming ? "Nadchodzący" : "Zakończony"}
                          </Badge>
                        </div>
                        {daysUntil !== null && daysUntil >= 0 && isActive && (
                          <div className="text-right">
                            <div className="text-2xl font-bold text-accent">{daysUntil}</div>
                            <div className="text-xs text-muted-foreground">dni do końca</div>
                          </div>
                        )}
                      </div>

                      <h3 className="font-serif text-2xl text-foreground">{post.title}</h3>

                      <div
                        className="text-muted-foreground leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: post.excerpt || post.content || "" }}
                      />

                      {startDate && endDate && (
                        <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-xl">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span className="text-sm text-muted-foreground">
                            {startDate.toLocaleDateString("pl-PL")} - {endDate.toLocaleDateString("pl-PL")}
                          </span>
                        </div>
                      )}

                      {post.add_to_calendar && post.calendar_date && (
                        <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-xl">
                          <Calendar className="w-4 h-4 text-amber-700" />
                          <span className="text-sm text-amber-700 font-medium">
                            Wydarzenie: {new Date(post.calendar_date).toLocaleDateString("pl-PL")}
                            {post.calendar_end_date && ` - ${new Date(post.calendar_end_date).toLocaleDateString("pl-PL")}`}
                          </span>
                        </div>
                      )}

                      <Button
                        variant="ghost"
                        className="text-primary hover:text-secondary p-0 h-auto font-bold group/btn"
                      >
                        Regulamin konkursu
                        <ArrowUpRight className="w-4 h-4 ml-1 transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
                      </Button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}

        {activeTab === "rada-rodzicow" && (
          <div className="space-y-6 max-w-4xl mx-auto opacity-0 animate-fade-in-up">
            {loading ? (
              <div className="text-center py-12 text-muted-foreground">Ładowanie ogłoszeń Rady Rodziców...</div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                Brak ogłoszeń Rady Rodziców. Dodaj pierwsze w panelu administracyjnym.
              </div>
            ) : (
              filteredPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/${activeTab}/${post.slug}`}
                  className="bg-card rounded-3xl p-8 border-l-4 border-primary transition-all hover:shadow-xl block"
                >
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Users className="w-8 h-8 text-primary" />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <h3 className="font-serif text-2xl text-foreground">{post.title}</h3>
                        <Badge className="bg-primary/10 text-primary border-0">Rada Rodziców</Badge>
                      </div>
                      <div
                        className="text-muted-foreground leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: post.excerpt || post.content || "" }}
                      />
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(post.created_at).toLocaleDateString("pl-PL")}</span>
                        </div>
                        {post.add_to_calendar && post.calendar_date && (
                          <div className="flex items-center gap-2 text-sm text-primary font-medium">
                            <Calendar className="w-4 h-4" />
                            <span>
                              Wydarzenie: {new Date(post.calendar_date).toLocaleDateString("pl-PL")}
                              {post.calendar_end_date && ` - ${new Date(post.calendar_end_date).toLocaleDateString("pl-PL")}`}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}
