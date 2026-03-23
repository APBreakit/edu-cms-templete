"use client"

import {
  BookOpen,
  Heart,
  Users,
  Calendar,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Award,
  ChevronRight,
  Camera,
  Newspaper,
  Cross,
  Star,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { getPublicPosts } from "@/app/actions/public-actions"
import siteConfig from "../site.json"

export default function SchoolHomePage() {
  const [aktualnosci, setAktualnosci] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPosts() {
      try {
        const data = await getPublicPosts("aktualnosci", 4)
        setAktualnosci(data || [])
      } catch (error) {
        console.error("Failed to fetch posts:", error)
        setAktualnosci([])
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [])

  return (
    <div className="min-h-screen">
      <div className="relative h-[600px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-1" />
        <div className="absolute inset-0 bg-black/20" />

        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-secondary/20 blur-3xl" />

        <div className="relative z-10 container mx-auto px-6 h-full flex flex-col justify-center">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Razem tworzymy przyjazną przestrzeń do nauki i rozwoju
            </h1>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Witamy na stronie naszej Szkoły. Sprawdź, co się u nas działo i przekonaj się, że warto tutaj być!
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/aktualnosci">
                <Button size="lg" className="glass-strong text-primary hover:bg-white/90 angular-rounded text-base">
                  <Newspaper className="w-5 h-5 mr-2" />
                  Sprawdź aktualności
                </Button>
              </Link>
              <Link href="/galeria">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/50 text-white hover:bg-white/20 angular-rounded text-base"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  Zobacz galerię
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Miłości, wiary wzorem być, uczyć się pilnie i godnie żyć</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Słowa te pochodzą z hymnu naszej Szkoły i płynie z nich nauka na temat wartości, które tutaj wyznajemy.
              Każdego dnia uczniowie naszej Szkoły podejmują wyzwania, z pasją ucząc się nowych rzeczy.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass angular-rounded-lg p-8 hover:shadow-xl transition-all group">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Nauka i rozwój</h3>
              <p className="text-muted-foreground leading-relaxed">
                Wysoki poziom kształcenia i wszechstronny rozwój ucznia w duchu chrześcijańskich wartości, to aspekty,
                na które kładziemy szczególny nacisk.
              </p>
            </div>

            <div className="glass angular-rounded-lg p-8 hover:shadow-xl transition-all group">
              <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Heart className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Wspólne pasje</h3>
              <p className="text-muted-foreground leading-relaxed">
                Koła zainteresowań i zajęcia pozalekcyjne pozwalają odnajdywać oraz rozwijać pasje i talenty uczniów.
                Każdy znajdzie coś dla siebie!
              </p>
            </div>

            <div className="glass angular-rounded-lg p-8 hover:shadow-xl transition-all group">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Cross className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Chrześcijańskie wartości</h3>
              <p className="text-muted-foreground leading-relaxed">
                Nasza Szkoła funkcjonuje w duchu wartości chrześcijańskich, kształtując w uczniach postawę otwartości i
                zaangażowania w życie Kościoła.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-2">Aktualności i ostatnie wydarzenia</h2>
              <p className="text-muted-foreground">Zobacz, co się dzieje w naszej szkole</p>
            </div>
            <Link href="/aktualnosci">
              <Button variant="outline" className="angular-rounded">
                Zobacz wszystkie
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="glass angular-rounded-lg p-6 animate-pulse">
                  <div className="w-full h-48 bg-muted angular-rounded mb-4" />
                  <div className="h-4 bg-muted angular-rounded mb-2 w-3/4" />
                  <div className="h-3 bg-muted angular-rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : aktualnosci.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {aktualnosci.map((post) => (
                <Link key={post.id} href={`/aktualnosci#${post.slug}`}>
                  <div className="glass angular-rounded-lg overflow-hidden hover:shadow-xl transition-all group h-full">
                    {post.image_url && (
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={post.image_url}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="text-xs text-primary font-semibold mb-2">
                        {new Date(post.published_at).toLocaleDateString("pl-PL")}
                      </div>
                      <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 glass angular-rounded-lg">
              <Newspaper className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Brak aktualności do wyświetlenia</p>
            </div>
          )}
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">W obiektywie aparatu i oku kamery</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <Link href="/galeria">
              <div className="relative h-64 glass angular-rounded-lg overflow-hidden group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-2 opacity-80 group-hover:opacity-90 transition-opacity" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <Camera className="w-16 h-16 mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-2xl font-bold">Galeria zdjęć</h3>
                  <p className="text-sm opacity-90 mt-2">Zobacz nasze wspomnienia</p>
                </div>
              </div>
            </Link>

            <Link href="/galeria">
              <div className="relative h-64 glass angular-rounded-lg overflow-hidden group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-1 opacity-80 group-hover:opacity-90 transition-opacity" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <Award className="w-16 h-16 mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-2xl font-bold">Nasze osiągnięcia</h3>
                  <p className="text-sm opacity-90 mt-2">Zobacz nasze sukcesy</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">Warto mieć pod ręką</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <Link href="https://portal.librus.pl/rodzina" target="_blank">
              <div className="glass angular-rounded-lg p-8 hover:shadow-xl transition-all group h-full">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Dziennik elektroniczny</h3>
                <p className="text-muted-foreground">
                  Zaloguj się do dziennika elektronicznego. Sprawdź oceny i frekwencję.
                </p>
              </div>
            </Link>

            <Link href="/o-nas#kalendarz">
              <div className="glass angular-rounded-lg p-8 hover:shadow-xl transition-all group h-full">
                <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Calendar className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Kalendarz wydarzeń</h3>
                <p className="text-muted-foreground">
                  W naszej Szkole wiele się dzieje! Sprawdź, jakie wydarzenia będą miały miejsce w najbliższym czasie.
                </p>
              </div>
            </Link>

            <Link href="/o-nas#zajecia">
              <div className="glass angular-rounded-lg p-8 hover:shadow-xl transition-all group h-full">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-xl font-bold mb-3">Zajęcia pozalekcyjne</h3>
                <p className="text-muted-foreground">
                  Doskonały sposób na rozwijanie pasji i zainteresowań. Sprawdź harmonogram zajęć.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-4 opacity-10" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Dołącz do naszej społeczności</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Zapisy na rok szkolny {new Date().getFullYear()}/{new Date().getFullYear() + 1} trwają
            </p>
            <Link href="/rekrutacja">
              <Button size="lg" className="angular-rounded text-base">
                <GraduationCap className="w-5 h-5 mr-2" />
                Zobacz informacje o rekrutacji
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
