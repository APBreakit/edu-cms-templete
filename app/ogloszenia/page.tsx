"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Bell, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { getPublicPosts } from "@/app/actions/public-actions"

export default function OgloszeniaPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPosts() {
      try {
        // Using Server Action
        const data = await getPublicPosts("ogloszenia")
        setPosts(data || [])
      } catch (error) {
        console.error("[v0] Failed to fetch posts:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  return (
    <main className="min-h-screen relative overflow-hidden bg-background text-foreground">
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full gradient-3 blur-3xl animate-gradient" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full gradient-1 blur-3xl animate-gradient animation-delay-400" />
      </div>

      <Navigation />

      <div className="container mx-auto px-6 py-12 relative">
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-foreground leading-tight">Ogłoszenia</h1>
          <p className="text-muted-foreground text-lg leading-relaxed">Ważne informacje dla rodziców</p>
        </div>

        <div className="space-y-6 max-w-4xl mx-auto">
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Ładowanie ogłoszeń...</div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Brak ogłoszeń. Dodaj pierwsze w panelu administracyjnym.
            </div>
          ) : (
            posts.map((post) => (
              <div
                key={post.id}
                className="bg-card rounded-3xl p-6 sm:p-8 border-l-4 border-accent transition-all hover:shadow-xl"
              >
                <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Bell className="w-6 h-6 sm:w-8 sm:h-8 text-accent" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <h3 className="font-serif text-xl sm:text-2xl text-foreground">{post.title}</h3>
                      <Badge className="bg-accent/10 text-accent border-0">Ważne</Badge>
                    </div>
                    <div
                      className="text-muted-foreground leading-relaxed prose prose-neutral max-w-none prose-sm"
                      dangerouslySetInnerHTML={{ __html: post.content || "" }}
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
              </div>
            ))
          )}
        </div>
      </div>

      <Footer />
    </main>
  )
}
