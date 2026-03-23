"use client"

import {
  Star,
  Play,
  Sparkles,
  Heart,
  Users,
  ArrowUpRight,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Clock,
  Award,
  BookOpen,
  Palette,
  Music,
  Baby,
  Send,
  Calendar,
  Bell,
  FileText,
  Download,
  ExternalLink,
  Shield,
  CheckCircle,
  Utensils,
  Home,
  GraduationCap,
  Building2,
  Code,
  Brain,
  Trophy,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect } from "react" // Added useEffect
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { HeroCarousel } from "@/components/hero-carousel"
import Link from "next/link"
import { TeamCarousel } from "@/components/team-carousel"
import { AnimatedCounter } from "@/components/animated-counter"
import Image from "next/image" // Added Image import
import { getPublicPosts, getMealPlan, getGroupsPublic } from "@/app/actions/public-actions"

export default function ClientPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [aktualnosci, setAktualnosci] = useState<any[]>([]) // Added state for aktualnosci
  const [ogloszenia, setOgloszenia] = useState<any[]>([]) // Added state for ogloszenia
  const [loading, setLoading] = useState(true) // Added loading state
  const [mealPlanUrl, setMealPlanUrl] = useState<string | null>(null)
  const [groups, setGroups] = useState<any[]>([])

  useEffect(() => {
    async function fetchPosts() {
      try {
        const [aktualnosciData, ogloszeniaData, mealPlan, groupsData] = await Promise.all([
          getPublicPosts("aktualnosci", 6),
          getPublicPosts("ogloszenia", 3),
          getMealPlan(),
          getGroupsPublic(),
        ])

        setAktualnosci(aktualnosciData || [])
        setOgloszenia(ogloszeniaData || [])
        setMealPlanUrl(mealPlan?.pdf_url || mealPlan?.image_url || null)
        setGroups(groupsData || [])
      } catch (error) {
        console.error("[v0] Failed to fetch posts:", error)
        // Leave empty arrays if there's an error
        setAktualnosci([])
        setOgloszenia([])
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  return (
    <main className="min-h-screen relative overflow-hidden bg-background text-foreground">
      {/* Animated gradient background */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full gradient-3 blur-3xl animate-gradient" />
        <div className="absolute bottom-0 left-0 w-500px h-500px rounded-full gradient-1 blur-3xl animate-gradient animation-delay-400" />
      </div>

      {/* Navigation */}
      <Navigation />

      {/* Demo Admin Panel Banner */}
      <div className="bg-primary text-white text-center py-3 px-4 shadow-md relative z-50">
        <p className="font-medium text-sm sm:text-base">
          To jest wersja demonstracyjna EduCMS. Zobacz pełne możliwości zarządzania treścią w 
          <Link href="/admin" className="underline font-bold ml-1 hover:text-accent transition-colors">Panelu Administracyjnym</Link>.
        </p>
      </div>

      {/* First container - Hero and About sections */}
      <div className="container mx-auto px-4 sm:px-6 py-12 relative space-y-24">
        {/* Hero Section */}
        <section className="grid lg:grid-cols-2 gap-12 items-center min-h-[600px]">
          {/* Left Content */}
          <div className="space-y-8 opacity-0 animate-fade-in-up">
            <Badge className="gradient-4 text-primary-foreground border-0 px-6 py-3 rounded-full text-sm font-medium inline-flex items-center gap-2">
              <Star className="w-4 h-4 fill-current" />
              Przedszkole Parafialne w Mieście
            </Badge>

            {/* Making hero H1 responsive for mobile - smaller on mobile, larger on desktop */}
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.1] text-foreground text-balance opacity-0 animate-fade-in-up animation-delay-200">
              Miejsce Pełne Ciepła i Radości
            </h1>

            <p className="text-muted-foreground text-xl leading-relaxed max-w-xl opacity-0 animate-fade-in animation-delay-400">
              Placówka Edukacyjna przy Parafii NMP w Mieście - oferujemy ciepłą, rodzinną atmosferę i
              wszechstronny rozwój Waszych dzieci.
            </p>

            <div className="flex flex-row gap-2 sm:gap-4 items-center sm:items-start w-full">
              <Link href="/rekrutacja" className="flex-1 sm:flex-initial">
                <Button
                  size="lg"
                  className="gradient-1 text-primary-foreground rounded-full w-full sm:w-auto px-4 sm:px-8 py-4 sm:py-6 text-sm sm:text-base font-medium transition-all hover:scale-105 hover:shadow-xl"
                >
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                  <span className="whitespace-nowrap">Zapisz Dziecko</span>
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-primary text-primary hover:bg-blue-50 rounded-full flex-1 sm:flex-initial w-full sm:w-auto px-4 sm:px-8 py-4 sm:py-6 text-sm sm:text-base font-medium transition-all hover:scale-105 bg-transparent"
              >
                <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                {/* removed extra space before " Zobacz Film" */}
                <span className="whitespace-nowrap"> Zobacz Film</span>
              </Button>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-4 opacity-0 animate-fade-in animation-delay-800">
              <div>
                <div className="text-4xl font-bold text-primary">{"12+"}</div>
                <div className="text-sm text-muted-foreground">Zajęć kreatywnych </div>
              </div>
              <div>
                <div className="text-4xl font-bold text-accent">150+</div>
                <div className="text-sm text-muted-foreground">Szczęśliwych Dzieci</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-secondary">15+</div>
                <div className="text-sm text-muted-foreground">Lat doświadczenia kadry </div>
              </div>
            </div>
          </div>

          {/* Right Image - Replaced static image with carousel */}
          <HeroCarousel />
        </section>

        {/* About Section - REDESIGNED to match reference image */}
        <section className="space-y-16" id="o-nas">
          <div className="grid lg:grid-cols-[1fr_1.2fr_1fr] gap-8 items-stretch">
            {/* Left Card - Image with badges and title below */}
            <div className="flex flex-col space-y-6 opacity-0 animate-slide-in-left animation-delay-200">
              <div className="relative rounded-3xl overflow-hidden group flex-shrink-0">
                <img
                  src="/blessed-franciszka-siedliska-holy-family.jpg"
                  alt="Patron placówki"
                  loading="lazy"
                  width="800"
                  height="500"
                  className="w-full h-[400px] lg:h-[500px] object-cover transition-transform duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#443b32]/60 via-transparent to-transparent" />

                <button className="absolute top-4 right-4 sm:top-6 sm:right-6 w-14 h-14 rounded-2xl bg-white/95 backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-xl hover:rotate-45">
                  <ArrowUpRight className="w-6 h-6 text-[#443b32]" />
                </button>

                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex gap-3">
                  {/* Using bg-card with subtle borders and semantic text tokens */}
                  <Badge className="bg-card/95 backdrop-blur-sm text-foreground border-0 px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg">
                    <BookOpen className="w-4 h-4 mr-2 inline text-primary" />
                    Edukacja
                  </Badge>
                  <Badge className="bg-card/95 backdrop-blur-sm text-foreground border-0 px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg">
                    <Sparkles className="w-4 h-4 mr-2 inline text-secondary" />
                    Rozwój
                  </Badge>
                </div>
              </div>

              <div className="space-y-3 flex-grow">
                {/* Making H3 responsive for small screens */}
                <h3 className="font-serif text-xl sm:text-2xl lg:text-3xl text-foreground leading-tight text-center">
                  Bł. Franciszka Siedliska
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm lg:text-base text-left">
                  Założycielka naszej placówki, wzór miłości i oddania w służbie
                  rodziny.
                </p>
              </div>
            </div>

            {/* Center Content - REDESIGNED: Minimalistic, Professional, Emphasizing Patron & Public Status */}
            <div className="flex flex-col space-y-6 lg:space-y-8 opacity-0 animate-fade-in-up animation-delay-400">
              <div className="space-y-4 lg:space-y-6 text-center">
                {/* Making H2 responsive - smaller on mobile */}
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-foreground leading-tight text-balance">
                  Przedszkole Publiczne
                </h2>
                <p className="text-muted-foreground text-sm lg:text-base max-w-md mx-auto leading-relaxed">
                  im. Naszej Placówki przy Parafii NMP w Mieście
                </p>
              </div>

              <div className="space-y-4 flex-grow flex flex-col">
                {/* Patron Block - Minimalistic & Professional */}
                <div className="relative rounded-2xl bg-card/60 backdrop-blur-sm border border-border p-6 lg:p-8 transition-all duration-500 hover:shadow-lg hover:border-foreground/20 group flex-1">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                      <Heart className="w-6 h-6 lg:w-7 lg:h-7 text-primary" />
                    </div>
                    <div className="space-y-2 flex-1">
                      <div className="text-xs lg:text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                        własna kuchnia
                      </div>
                      {/* Making card H3 titles responsive */}
                      <h3 className="font-serif text-lg sm:text-xl lg:text-2xl text-foreground leading-tight">
                        Posiłki dla dzieci
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Każdy posiłek jest przygotowywany na miejscu przez nasze Panie, bohaterki smaku i małych
                        brzuszków.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Public Kindergarten Block - Minimalistic & Professional */}
                <div className="relative rounded-2xl bg-primary/5 border border-primary/10 p-6 lg:p-8 transition-all duration-500 hover:shadow-lg hover:border-primary/20 group flex-1">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl bg-card/80 backdrop-blur-sm flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300 shadow-sm">
                      <Building2 className="w-6 h-6 lg:w-7 lg:h-7 text-primary" />
                    </div>
                    <div className="space-y-2 flex-1">
                      <div className="text-xs lg:text-sm font-semibold text-primary/70 uppercase tracking-wider">
                        Status Placówki
                      </div>
                      {/* Making card H3 titles responsive */}
                      <h3 className="font-serif text-lg sm:text-xl lg:text-2xl text-foreground leading-tight">
                        Przedszkole Publiczne
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Zapewniamy bezpłatną, wysokiej jakości edukację przedszkolną w atmosferze wartości
                        chrześcijańskich.
                      </p>
                      <div className="flex items-center gap-2 pt-2">
                        <Badge className="bg-primary/10 text-primary border-0 px-3 py-1 rounded-full text-xs font-semibold">
                          8 Grup
                        </Badge>
                        <Badge className="bg-secondary/10 text-primary border-0 px-3 py-1 rounded-full text-xs font-semibold">
                          Bezpłatne
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Card - Heading + Stats + Image */}
            <div className="flex flex-col space-y-6 opacity-0 animate-slide-in-right animation-delay-600">
              <div className="relative flex-grow">
                <TeamCarousel />

                <Link href="/o-nas">
                  <button className="absolute top-4 right-4 w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-card shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-45 z-20">
                    <ArrowUpRight className="w-4 h-4 lg:w-5 lg:h-5 text-foreground" />
                  </button>
                </Link>
              </div>

              {/* Stats Badges */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-card rounded-2xl p-4 sm:p-6 shadow-lg text-center">
                  <AnimatedCounter
                    end={34}
                    className="font-serif text-4xl lg:text-5xl text-accent-foreground font-bold mb-2"
                  />
                  <p className="text-muted-foreground text-sm lg:text-base leading-tight">lata działania placówki</p>
                </div>
                <div className="bg-card rounded-2xl p-4 sm:p-6 shadow-lg text-center">
                  <AnimatedCounter
                    end={25}
                    suffix="+"
                    className="font-serif text-4xl lg:text-5xl text-accent-foreground font-bold mb-2"
                  />
                  <p className="text-muted-foreground text-sm lg:text-base leading-tight">wykwalifikowanej kadry</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Aktualności Section - WIDER, FULL-WIDTH DESIGN */}
        <section
          className="w-full opacity-0 animate-fade-in-up animation-delay-200 bg-gradient-to-b from-transparent via-background/50 to-transparent py-10"
          id="aktualnosci"
        >
          <div className="max-w-[98%] mx-auto space-y-12">
            <div className="text-center space-y-4 max-w-3xl mx-auto px-2 sm:px-6">
              {/* Making H2 responsive */}
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-foreground leading-tight">Aktualności</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Bieżące informacje z życia naszego przedszkola
              </p>
            </div>

            <div className="relative group">
              <div className="absolute left-0 top-0 bottom-0 w-2 md:w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-2 md:w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

              <div className="overflow-x-auto scrollbar-hide scroll-smooth touch-pan-x">
                {loading ? (
                  <div className="flex gap-6 px-2 sm:px-8 py-2.5">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex-shrink-0 w-[400px] h-[400px] bg-card rounded-3xl animate-pulse" />
                    ))}
                  </div>
                ) : aktualnosci.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    Brak aktualności. Dodaj pierwszą w panelu administracyjnym.
                  </div>
                ) : (
                  <div className="flex gap-6 animate-scroll-left group-hover:animation-play-state-paused w-max px-2 sm:px-8 py-2.5">
                    {[...aktualnosci, ...aktualnosci].map((post, index) => (
                      <Link
                        key={`${post.id}-${index}`}
                        href={`/${post.type}/${post.slug}`}
                        className="bg-card rounded-3xl overflow-hidden transition-all hover:shadow-xl hover:scale-[1.02] flex-shrink-0 w-[400px]"
                      >
                        <div className="relative h-48 bg-gradient-to-br from-primary to-secondary">
                          {post.image_url ? (
                            <Image
                              src={post.image_url || "/placeholder.svg"}
                              alt={post.title}
                              fill
                              className="object-cover"
                              sizes="400px"
                              loading="lazy"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Calendar className="w-16 h-16 text-white/30" />
                            </div>
                          )}
                        </div>
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
                          <h3 className="font-serif text-xl sm:text-2xl text-foreground font-bold">{post.title}</h3>
                          <div
                            className="text-muted-foreground leading-relaxed line-clamp-3"
                            dangerouslySetInnerHTML={{ __html: post.excerpt || post.content || "" }}
                          />
                          <Button
                            variant="ghost"
                            className="text-primary hover:text-secondary p-0 h-auto font-medium group"
                          >
                            Czytaj więcej
                            <ArrowUpRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                          </Button>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* CHANGE: Added subtle " Zobacz więcej" button below announcements */}
          <div className="flex justify-center pt-6">
            <Link
              href="/aktualnosci"
              className="group inline-flex items-center gap-2 px-6 py-3 text-muted-foreground hover:text-foreground transition-all duration-300 rounded-full hover:bg-blue-50 border border-border/50"
            >
              <span className="text-sm font-medium"> Zobacz więcej</span>
              <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </section>
      </div>

      {/* Second container - All remaining sections */}
      <div className="container mx-auto px-6 py-12 relative space-y-24">
        {/* Ogłoszenia Section */}
        <section className="max-w-6xl mx-auto px-2 sm:px-6 py-16 space-y-12 opacity-0 animate-fade-in-up animation-delay-400">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-foreground leading-tight">Ogłoszenia</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">Ważne informacje dla rodziców</p>
          </div>

          {loading ? (
            <div className="space-y-6 px-2 sm:px-0">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card rounded-3xl p-6 sm:p-8 h-40 animate-pulse" />
              ))}
            </div>
          ) : ogloszenia.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Brak ogłoszeń. Dodaj pierwsze w panelu administracyjnym.
            </div>
          ) : (
            <div className="space-y-6 px-2 sm:px-0">
              {ogloszenia.map((post, index) => (
                <div
                  key={post.id}
                  className={`bg-card rounded-3xl p-6 sm:p-8 border-l-4 border-${index === 0 ? "accent" : index === 1 ? "primary" : "secondary"
                    } transition-all hover:shadow-xl opacity-0 animate-slide-in-left animation-delay-${200 + index * 200}`}
                >
                  <div className="flex items-start gap-6">
                    <div
                      className={`w-16 h-16 rounded-2xl bg-${index === 0 ? "accent" : index === 1 ? "primary" : "secondary"
                        }/10 flex items-center justify-center flex-shrink-0`}
                    >
                      <Bell className="w-8 h-8 text-accent" />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-serif text-2xl text-foreground">{post.title}</h3>
                        <Badge
                          className={`bg-${index === 0 ? "accent" : index === 1 ? "primary" : "secondary"
                            }/10 text-${index === 0 ? "accent" : index === 1 ? "primary" : "secondary"} border-0`}
                        >
                          Ważne
                        </Badge>
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
                          <div className="flex items-center gap-2 text-sm text-purple-600 font-medium mt-1">
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
              ))}
            </div>
          )}

          <div className="flex justify-center pt-6">
            <Link
              href="/aktualnosci"
              className="group inline-flex items-center gap-2 px-6 py-3 text-muted-foreground hover:text-foreground transition-all duration-300 rounded-full hover:bg-blue-50 border border-border/50"
            >
              <span className="text-sm font-medium"> Zobacz więcej</span>
              <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </section>

        {/* Grupy Section - CAROUSEL WITH COLOR-BASED GROUPS */}
        <section
          className="w-full opacity-0 animate-fade-in-up animation-delay-200 bg-gradient-to-b from-transparent via-background/50 to-transparent py-16"
          id="grupy"
        >
          <div className="max-w-[98%] mx-auto space-y-12">
            <div className="text-center space-y-4 max-w-3xl mx-auto px-6">
              {/* Making Nasze Grupy H2 responsive */}
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-foreground leading-tight">Nasze Grupy</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Osiem kolorowych grup, w których każde dziecko znajduje swoje miejsce
              </p>
            </div>

            <div className="relative group">
              <div className="absolute left-0 top-0 bottom-0 w-2 md:w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-2 md:w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

              <div className="overflow-x-auto scrollbar-hide scroll-smooth touch-pan-x">
                {groups.length > 0 && (
                  <div className="flex gap-6 animate-scroll-left group-hover:animation-paused w-max px-6 md:px-8 py-2.5">
                    {[...groups, ...groups].map((group: any, index: number) => (
                      <Link key={`${group.slug}-${index}`} href={`/grupy/${group.slug}`} className="block">
                        <div className="bg-card rounded-3xl p-8 space-y-6 transition-all hover:shadow-xl hover:scale-[1.02] flex-shrink-0 w-[350px]">
                          <div className={`w-16 h-16 rounded-2xl ${String(group.color || '').includes('from-') ? `bg-gradient-to-br ${group.color}` : ''} flex items-center justify-center shadow-lg`}
                            style={String(group.color || '').includes('from-') ? undefined : { background: group.color || '#3b82f6' }}>
                            <Users className="w-8 h-8 text-white" />
                          </div>
                          <div className="space-y-3">
                            <h3 className="font-serif text-2xl sm:text-3xl text-foreground">{group.name}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="w-4 h-4" />
                              <span>Wiek: {group.age_group || ''}</span>
                            </div>
                            <p className="text-muted-foreground leading-relaxed line-clamp-3">{group.description || ''}</p>
                          </div>
                          <Button variant="ghost" className="text-primary hover:text-secondary p-0 h-auto font-medium group">
                            Zobacz więcej
                            <ArrowUpRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                          </Button>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
                <div className="flex gap-6 animate-scroll-left group-hover:animation-paused w-max px-6 md:px-8 py-2.5" style={{ display: groups.length > 0 ? 'none' : undefined }}>
                  {/* GRUPA CZERWONA */}
                  <Link href="/grupy/czerwona" className="block">
                    <div className="bg-card rounded-3xl p-8 space-y-6 transition-all hover:shadow-xl hover:scale-[1.02] flex-shrink-0 w-[350px]">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg">
                        <Heart className="w-8 h-8 text-white" fill="currentColor" />
                      </div>
                      <div className="space-y-3">
                        {/* Making group name H3 responsive */}
                        <h3 className="font-serif text-2xl sm:text-3xl text-foreground">Grupa Czerwona</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>Wiek: 6 latki</span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                          Energiczna grupa pełna pasji i radości. Dzieci rozwijają swoją kreatywność i pewność siebie.
                        </p>
                      </div>
                      {/* Using red color for button */}
                      <Button
                        variant="ghost"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 p-0 h-auto font-medium group"
                      >
                        Zobacz więcej
                        <ArrowUpRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </Button>
                    </div>
                  </Link>

                  {/* GRUPA LAWENDOWA */}
                  <Link href="/grupy/lawendowa" className="block">
                    <div className="bg-card rounded-3xl p-8 space-y-6 transition-all hover:shadow-xl hover:scale-[1.02] flex-shrink-0 w-[350px]">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-400 to-purple-500 flex items-center justify-center shadow-lg">
                        <Sparkles className="w-8 h-8 text-white" />
                      </div>
                      <div className="space-y-3">
                        <h3 className="font-serif text-2xl sm:text-3xl text-foreground">Grupa Lawendowa</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>Wiek: 5 latki</span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                          Spokojna i harmonijna grupa, gdzie dzieci uczą się empatii i współpracy w przyjaznej
                          atmosferze.
                        </p>
                      </div>
                      {/* Using purple color for button */}
                      <Button
                        variant="ghost"
                        className="text-purple-500 hover:text-purple-600 hover:bg-purple-50 p-0 h-auto font-medium group"
                      >
                        Zobacz więcej
                        <ArrowUpRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </Button>
                    </div>
                  </Link>

                  {/* GRUPA NIEBIESKA */}
                  <Link href="/grupy/niebieska" className="block">
                    <div className="bg-card rounded-3xl p-8 space-y-6 transition-all hover:shadow-xl hover:scale-[1.02] flex-shrink-0 w-[350px]">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                        <Users className="w-8 h-8 text-white" />
                      </div>
                      <div className="space-y-3">
                        <h3 className="font-serif text-2xl sm:text-3xl text-foreground">Grupa Niebieska</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>Wiek: 4 latki</span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                          Grupa pełna ciekawości świata. Dzieci odkrywają nowe umiejętności poprzez eksperymenty i
                          zabawę.
                        </p>
                      </div>
                      {/* Using blue color for button */}
                      <Button
                        variant="ghost"
                        className="text-blue-500 hover:text-blue-600 hover:bg-blue-50 p-0 h-auto font-medium group"
                      >
                        Zobacz więcej
                        <ArrowUpRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </Button>
                    </div>
                  </Link>

                  {/* GRUPA PASTELOWA */}
                  <Link href="/grupy/pastelowa" className="block">
                    <div className="bg-card rounded-3xl p-8 space-y-6 transition-all hover:shadow-xl hover:scale-[1.02] flex-shrink-0 w-[350px]">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-300 to-pink-400 flex items-center justify-center shadow-lg">
                        <Baby className="w-8 h-8 text-white" />
                      </div>
                      <div className="space-y-3">
                        <h3 className="font-serif text-2xl sm:text-3xl text-foreground">Grupa Pastelowa</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>Wiek: 3 latki</span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                          Delikatna i ciepła grupa, gdzie najmłodsze dzieci czują się bezpiecznie i rozwijają się w
                          swoim tempie.
                        </p>
                      </div>
                      {/* Using pink color for button */}
                      <Button
                        variant="ghost"
                        className="text-pink-400 hover:text-pink-500 hover:bg-pink-50 p-0 h-auto font-medium group"
                      >
                        Zobacz więcej
                        <ArrowUpRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </Button>
                    </div>
                  </Link>

                  {/* GRUPA POMARAŃCZOWA */}
                  <Link href="/grupy/pomaranczowa" className="block">
                    <div className="bg-card rounded-3xl p-8 space-y-6 transition-all hover:shadow-xl hover:scale-[1.02] flex-shrink-0 w-[350px]">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
                        <Palette className="w-8 h-8 text-white" />
                      </div>
                      <div className="space-y-3">
                        <h3 className="font-serif text-2xl sm:text-3xl text-foreground">Grupa Pomarańczowa</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>Wiek: 6 latki</span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                          Twórcza i artystyczna grupa, gdzie dzieci wyrażają siebie poprzez sztukę, muzykę i ruch.
                        </p>
                      </div>
                      {/* Using orange color for button */}
                      <Button
                        variant="ghost"
                        className="text-orange-500 hover:text-orange-600 hover:bg-orange-50 p-0 h-auto font-medium group"
                      >
                        Zobacz więcej
                        <ArrowUpRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </Button>
                    </div>
                  </Link>

                  {/* GRUPA TURKUSOWA */}
                  <Link href="/grupy/turkusowa" className="block">
                    <div className="bg-card rounded-3xl p-8 space-y-6 transition-all hover:shadow-xl hover:scale-[1.02] flex-shrink-0 w-[350px]">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-lg">
                        <BookOpen className="w-8 h-8 text-white" />
                      </div>
                      <div className="space-y-3">
                        <h3 className="font-serif text-2xl sm:text-3xl text-foreground">Grupa Turkusowa</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>Wiek: 5 latki</span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                          Grupa odkrywców i badaczy. Dzieci poznają świat przyrody i rozwijają myślenie logiczne.
                        </p>
                      </div>
                      {/* Using teal color for button */}
                      <Button
                        variant="ghost"
                        className="text-teal-500 hover:text-teal-600 hover:bg-teal-50 p-0 h-auto font-medium group"
                      >
                        Zobacz więcej
                        <ArrowUpRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </Button>
                    </div>
                  </Link>

                  {/* GRUPA WANILIOWA */}
                  <Link href="/grupy/waniliowa" className="block">
                    <div className="bg-card rounded-3xl p-8 space-y-6 transition-all hover:shadow-xl hover:scale-[1.02] flex-shrink-0 w-[350px]">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-200 to-amber-300 flex items-center justify-center shadow-lg">
                        <Award className="w-8 h-8 text-amber-700" />
                      </div>
                      <div className="space-y-3">
                        <h3 className="font-serif text-2xl sm:text-3xl text-foreground">Grupa Waniliowa</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>Wiek: 3 latki</span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                          Ciepła i przytulna grupa, gdzie dzieci uczą się samodzielności i odpowiedzialności w
                          atmosferze akceptacji.
                        </p>
                      </div>
                      {/* Using amber color for button */}
                      <Button
                        variant="ghost"
                        className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 p-0 h-auto font-medium group"
                      >
                        Zobacz więcej
                        <ArrowUpRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </Button>
                    </div>
                  </Link>

                  {/* GRUPA ZIELONA */}
                  <Link href="/grupy/zielona" className="block">
                    <div className="bg-card rounded-3xl p-8 space-y-6 transition-all hover:shadow-xl hover:scale-[1.02] flex-shrink-0 w-[350px]">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
                        <Music className="w-8 h-8 text-white" />
                      </div>
                      <div className="space-y-3">
                        <h3 className="font-serif text-2xl sm:text-3xl text-foreground">Grupa Zielona</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>Wiek: 4-5 lat</span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                          Aktywna i dynamiczna grupa. Dzieci rozwijają sprawność fizyczną i uczą się zdrowych nawyków.
                        </p>
                      </div>
                      {/* Using green color for button */}
                      <Button
                        variant="ghost"
                        className="text-green-500 hover:text-green-600 hover:bg-green-50 p-0 h-auto font-medium group"
                      >
                        Zobacz więcej
                        <ArrowUpRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </Button>
                    </div>
                  </Link>

                  {/* Duplicate set for seamless loop */}
                  {/* GRUPA CZERWONA - Duplicate */}
                  <Link href="/grupy/czerwona" className="block">
                    <div className="bg-card rounded-3xl p-8 space-y-6 transition-all hover:shadow-xl hover:scale-[1.02] flex-shrink-0 w-[350px]">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg">
                        <Heart className="w-8 h-8 text-white" fill="currentColor" />
                      </div>
                      <div className="space-y-3">
                        <h3 className="font-serif text-2xl sm:text-3xl text-foreground">Grupa Czerwona</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>Wiek: 6 latki</span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                          Energiczna grupa pełna pasji i radości. Dzieci rozwijają swoją kreatywność i pewność siebie.
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 p-0 h-auto font-medium group"
                      >
                        Zobacz więcej
                        <ArrowUpRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </Button>
                    </div>
                  </Link>

                  {/* GRUPA LAWENDOWA - Duplicate */}
                  <Link href="/grupy/lawendowa" className="block">
                    <div className="bg-card rounded-3xl p-8 space-y-6 transition-all hover:shadow-xl hover:scale-[1.02] flex-shrink-0 w-[350px]">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-400 to-purple-500 flex items-center justify-center shadow-lg">
                        <Sparkles className="w-8 h-8 text-white" />
                      </div>
                      <div className="space-y-3">
                        <h3 className="font-serif text-2xl sm:text-3xl text-foreground">Grupa Lawendowa</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>Wiek: 5 latki</span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                          Spokojna i harmonijna grupa, gdzie dzieci uczą się empatii i współpracy w przyjaznej
                          atmosferze.
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        className="text-purple-500 hover:text-purple-600 hover:bg-purple-50 p-0 h-auto font-medium group"
                      >
                        Zobacz więcej
                        <ArrowUpRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </Button>
                    </div>
                  </Link>

                  {/* GRUPA NIEBIESKA - Duplicate */}
                  <Link href="/grupy/niebieska" className="block">
                    <div className="bg-card rounded-3xl p-8 space-y-6 transition-all hover:shadow-xl hover:scale-[1.02] flex-shrink-0 w-[350px]">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                        <Users className="w-8 h-8 text-white" />
                      </div>
                      <div className="space-y-3">
                        <h3 className="font-serif text-2xl sm:text-3xl text-foreground">Grupa Niebieska</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>Wiek: 4 latki</span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                          Grupa pełna ciekawości świata. Dzieci odkrywają nowe umiejętności poprzez eksperymenty i
                          zabawę.
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        className="text-blue-500 hover:text-blue-600 hover:bg-blue-50 p-0 h-auto font-medium group"
                      >
                        Zobacz więcej
                        <ArrowUpRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </Button>
                    </div>
                  </Link>

                  {/* GRUPA PASTELOWA - Duplicate */}
                  <Link href="/grupy/pastelowa" className="block">
                    <div className="bg-card rounded-3xl p-8 space-y-6 transition-all hover:shadow-xl hover:scale-[1.02] flex-shrink-0 w-[350px]">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-300 to-pink-400 flex items-center justify-center shadow-lg">
                        <Baby className="w-8 h-8 text-white" />
                      </div>
                      <div className="space-y-3">
                        <h3 className="font-serif text-2xl sm:text-3xl text-foreground">Grupa Pastelowa</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>Wiek: 3 latki</span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                          Delikatna i ciepła grupa, gdzie najmłodsze dzieci czują się bezpiecznie i rozwijają się w
                          swoim tempie.
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        className="text-pink-400 hover:text-pink-500 hover:bg-pink-50 p-0 h-auto font-medium group"
                      >
                        Zobacz więcej
                        <ArrowUpRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </Button>
                    </div>
                  </Link>

                  {/* GRUPA POMARAŃCZOWA - Duplicate */}
                  <Link href="/grupy/pomaranczowa" className="block">
                    <div className="bg-card rounded-3xl p-8 space-y-6 transition-all hover:shadow-xl hover:scale-[1.02] flex-shrink-0 w-[350px]">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
                        <Palette className="w-8 h-8 text-white" />
                      </div>
                      <div className="space-y-3">
                        <h3 className="font-serif text-2xl sm:text-3xl text-foreground">Grupa Pomarańczowa</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>Wiek: 6 latki</span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                          Twórcza i artystyczna grupa, gdzie dzieci wyrażają siebie poprzez sztukę, muzykę i ruch.
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        className="text-orange-500 hover:text-orange-600 hover:bg-orange-50 p-0 h-auto font-medium group"
                      >
                        Zobacz więcej
                        <ArrowUpRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </Button>
                    </div>
                  </Link>

                  {/* GRUPA TURKUSOWA - Duplicate */}
                  <Link href="/grupy/turkusowa" className="block">
                    <div className="bg-card rounded-3xl p-8 space-y-6 transition-all hover:shadow-xl hover:scale-[1.02] flex-shrink-0 w-[350px]">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-lg">
                        <BookOpen className="w-8 h-8 text-white" />
                      </div>
                      <div className="space-y-3">
                        <h3 className="font-serif text-2xl sm:text-3xl text-foreground">Grupa Turkusowa</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>Wiek: 5 latki</span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                          Grupa odkrywców i badaczy. Dzieci poznają świat przyrody i rozwijają myślenie logiczne.
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        className="text-teal-500 hover:text-teal-600 hover:bg-teal-50 p-0 h-auto font-medium group"
                      >
                        Zobacz więcej
                        <ArrowUpRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </Button>
                    </div>
                  </Link>

                  {/* GRUPA WANILIOWA - Duplicate */}
                  <Link href="/grupy/waniliowa" className="block">
                    <div className="bg-card rounded-3xl p-8 space-y-6 transition-all hover:shadow-xl hover:scale-[1.02] flex-shrink-0 w-[350px]">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-200 to-amber-300 flex items-center justify-center shadow-lg">
                        <Award className="w-8 h-8 text-amber-700" />
                      </div>
                      <div className="space-y-3">
                        <h3 className="font-serif text-2xl sm:text-3xl text-foreground">Grupa Waniliowa</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>Wiek: 3 latki</span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                          Ciepła i przytulna grupa, gdzie dzieci uczą się samodzielności i odpowiedzialności w
                          atmosferze akceptacji.
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 p-0 h-auto font-medium group"
                      >
                        Zobacz więcej
                        <ArrowUpRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </Button>
                    </div>
                  </Link>

                  {/* GRUPA ZIELONA - Duplicate */}
                  <Link href="/grupy/zielona" className="block">
                    <div className="bg-card rounded-3xl p-8 space-y-6 transition-all hover:shadow-xl hover:scale-[1.02] flex-shrink-0 w-[350px]">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
                        <Music className="w-8 h-8 text-white" />
                      </div>
                      <div className="space-y-3">
                        <h3 className="font-serif text-2xl sm:text-3xl text-foreground">Grupa Zielona</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>Wiek: 4-5 lat</span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                          Aktywna i dynamiczna grupa. Dzieci rozwijają sprawność fizyczną i uczą się zdrowych nawyków.
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        className="text-green-500 hover:text-green-600 hover:bg-green-50 p-0 h-auto font-medium group"
                      >
                        Zobacz więcej
                        <ArrowUpRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </Button>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Activities Section */}
        <section className="space-y-12 opacity-0 animate-fade-in-up animation-delay-200">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            {/* Making activities H2 responsive */}
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground leading-tight">
              Dzieci je uwielbiają
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Bogaty program zajęć wspierających wszechstronny rozwój dziecka
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* STANDARDOWE ACTIVITIES */}

            {/* Activity 1 - Zajęcia Plastyczne - Standardowe */}
            <div className="bg-card rounded-3xl p-6 space-y-4 transition-all hover:shadow-xl hover:scale-[1.02] opacity-0 animate-slide-in-up animation-delay-200">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl gradient-1 flex items-center justify-center">
                  <Palette className="w-6 h-6 text-white" />
                </div>
                <Badge className="bg-green-50 text-green-700 border-green-200 text-xs px-3 py-1">Standardowe</Badge>
              </div>
              {/* Making activity card titles responsive */}
              <h3 className="font-serif text-lg sm:text-xl text-foreground">Zajęcia Plastyczne</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Rozwijamy kreatywność i wyobraźnię poprzez różnorodne techniki artystyczne.
              </p>
            </div>

            {/* Activity 2 - Zajęcia Muzyczne - Standardowe */}
            <div className="bg-card rounded-3xl p-6 space-y-4 transition-all hover:shadow-xl hover:scale-[1.02] opacity-0 animate-slide-in-up animation-delay-300">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl gradient-2 flex items-center justify-center">
                  <Music className="w-6 h-6 text-white" />
                </div>
                <Badge className="bg-green-50 text-green-700 border-green-200 text-xs px-3 py-1">Standardowe</Badge>
              </div>
              <h3 className="font-serif text-lg sm:text-xl text-foreground">Zajęcia Muzyczne</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Nauka przez muzykę, rytm i taniec wspiera rozwój emocjonalny dzieci.
              </p>
            </div>

            {/* Activity 3 - Zajęcia Ruchowe - Standardowe */}
            <div className="bg-card rounded-3xl p-6 space-y-4 transition-all hover:shadow-xl hover:scale-[1.02] opacity-0 animate-slide-in-up animation-delay-400">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl gradient-4 flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <Badge className="bg-green-50 text-green-700 border-green-200 text-xs px-3 py-1">Standardowe</Badge>
              </div>
              <h3 className="font-serif text-lg sm:text-xl text-foreground">Zajęcia Ruchowe</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Aktywność fizyczna i zabawy ruchowe dla zdrowego rozwoju.
              </p>
            </div>

            {/* Activity 4 - Język Angielski - CHANGED to Standardowe */}
            <div className="bg-card rounded-3xl p-6 space-y-4 transition-all hover:shadow-xl hover:scale-[1.02] opacity-0 animate-slide-in-up animation-delay-500">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl gradient-3 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <Badge className="bg-green-50 text-green-700 border-green-200 text-xs px-3 py-1">Standardowe</Badge>
              </div>
              <h3 className="font-serif text-lg sm:text-xl text-foreground">Język Angielski</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Wczesna nauka języka obcego w formie zabawy i piosenki.
              </p>
            </div>

            {/* Activity 5 - Religia - Standardowe */}
            <div className="bg-card rounded-3xl p-6 space-y-4 transition-all hover:shadow-xl hover:scale-[1.02] opacity-0 animate-slide-in-up animation-delay-600">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" fill="currentColor" />
                </div>
                <Badge className="bg-green-50 text-green-700 border-green-200 text-xs px-3 py-1">Standardowe</Badge>
              </div>
              <h3 className="font-serif text-lg sm:text-xl text-foreground">Religia</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Wychowanie w duchu wartości chrześcijańskich i poznawanie Boga.
              </p>
            </div>

            {/* Activity 6 - Logopedia - CHANGED to Standardowe */}
            <div className="bg-card rounded-3xl p-6 space-y-4 transition-all hover:shadow-xl hover:scale-[1.02] opacity-0 animate-slide-in-up animation-delay-700">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <Badge className="bg-green-50 text-green-700 border-green-200 text-xs px-3 py-1">Standardowe</Badge>
              </div>
              <h3 className="font-serif text-lg sm:text-xl text-foreground">Logopedia</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Indywidualne zajęcia z logopedą wspierające prawidłowy rozwój mowy.
              </p>
            </div>

            {/* Activity 7 - Rytmika - Standardowe */}
            <div className="hidden bg-card rounded-3xl p-6 space-y-4 transition-all hover:shadow-xl hover:scale-[1.02] opacity-0 animate-slide-in-up animation-delay-800">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
                  <Music className="w-6 h-6 text-white" />
                </div>
                <Badge className="bg-green-50 text-green-700 border-green-200 text-xs px-3 py-1">Standardowe</Badge>
              </div>
              <h3 className="font-serif text-lg sm:text-xl text-foreground">Rytmika</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Zajęcia rozwijające poczucie rytmu, koordynację i ekspresję ruchową.
              </p>
            </div>

            {/* Pedagogika - Bezpłatne */}
            <div className="bg-card rounded-3xl p-6 space-y-4 transition-all hover:shadow-xl hover:scale-[1.02] opacity-0 animate-slide-in-up animation-delay-800">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <Badge className="bg-green-50 text-green-700 border-green-200 text-xs px-3 py-1">Bezpłatne</Badge>
              </div>
              <h3 className="font-serif text-lg sm:text-xl text-foreground">Pedagogika</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Indywidualne wsparcie pedagogiczne dla wszechstronnego rozwoju dziecka.
              </p>
            </div>

            {/* Programowanie - Bezpłatne */}
            <div className="bg-card rounded-3xl p-6 space-y-4 transition-all hover:shadow-xl hover:scale-[1.02] opacity-0 animate-slide-in-up animation-delay-900">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <Badge className="bg-green-50 text-green-700 border-green-200 text-xs px-3 py-1">Bezpłatne</Badge>
              </div>
              <h3 className="font-serif text-lg sm:text-xl text-foreground">Programowanie</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Wprowadzenie do podstaw programowania poprzez zabawę i kreatywne projekty.
              </p>
            </div>

            {/* Kodowanie - Bezpłatne */}
            <div className="bg-card rounded-3xl p-6 space-y-4 transition-all hover:shadow-xl hover:scale-[1.02] opacity-0 animate-slide-in-up animation-delay-1000">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <Badge className="bg-green-50 text-green-700 border-green-200 text-xs px-3 py-1">Bezpłatne</Badge>
              </div>
              <h3 className="font-serif text-lg sm:text-xl text-foreground">Kodowanie</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Rozwijanie myślenia algorytmicznego i umiejętności rozwiązywania problemów.
              </p>
            </div>

            {/* Basen - Płatne */}
            <div className="bg-card rounded-3xl p-6 space-y-4 transition-all hover:shadow-xl hover:scale-[1.02] opacity-0 animate-slide-in-up animation-delay-1100">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 10h.01M10 10h.01M14 10c0 2.71-2.24 4.9-4.98 4.9-2.74 0-4.98-2.19-4.98-4.95"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                    />
                  </svg>
                </div>
                <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-xs px-3 py-1">Płatne</Badge>
              </div>
              <h3 className="font-serif text-lg sm:text-xl text-foreground">Basen</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Zajęcia na basenie rozwijające sprawność fizyczną i umiejętności pływackie.
              </p>
            </div>

            <div className="bg-card rounded-3xl p-6 space-y-4 transition-all hover:shadow-xl hover:scale-[1.02] opacity-0 animate-slide-in-up animation-delay-1150">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-xs px-3 py-1">Płatne</Badge>
              </div>
              <h3 className="font-serif text-lg sm:text-xl text-foreground">Szachy</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Nauka gry w szachy rozwijająca logiczne myślenie i koncentrację.
              </p>
            </div>

            {/* Piłka Nożna - Płatne */}
            <div className="bg-card rounded-3xl p-6 space-y-4 transition-all hover:shadow-xl hover:scale-[1.02] opacity-0 animate-slide-in-up animation-delay-1200">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 3.3l1.35-.95c1.82.56 3.37 1.76 4.38 3.34l-.39 1.34-1.35.46L15 6.7V5.3zm-3.35-.95L11 5.3v1.4L9 9.49l-1.99-2.79-.39-1.34c1.01-1.58 2.56-2.78 4.38-3.34zM7.5 17.5c-1.66-1.66-2.5-3.88-2.5-6.12 0-.34.03-.68.08-1.01l1.5.5 2.5 3.5v3.5l-1.58 1.13zm9 0l-1.58-1.13v-3.5l2.5-3.5 1.5-.5c.05.33.08.67.08 1.01 0 2.24-.84 4.46-2.5 6.12z" />
                  </svg>
                </div>
                <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-xs px-3 py-1">Płatne</Badge>
              </div>
              <h3 className="font-serif text-lg sm:text-xl text-foreground">Piłka Nożna</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Zajęcia piłkarskie rozwijające koordynację ruchową i umiejętności zespołowe.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-12 opacity-0 animate-fade-in-up animation-delay-200" id="dla-rodzicow">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h2 className="font-serif text-5xl text-foreground leading-tight lg:text-5xl">Dla Rodziców</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Przydatne informacje i dokumenty dla rodziców
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center max-w-6xl mx-auto">
            {/* Parent Resource 1 */}
            <div className="bg-card rounded-3xl p-8 space-y-6 transition-all hover:shadow-xl hover:scale-[1.02] opacity-0 animate-slide-in-up animation-delay-200 w-full">
              <div className="w-16 h-16 rounded-2xl gradient-1 flex items-center justify-center mx-auto">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div className="space-y-3">
                <h3 className="font-serif text-2xl text-foreground">Dokumenty do Pobrania</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Formularze zgłoszeniowe, oświadczenia i inne niezbędne dokumenty
                </p>
              </div>
              <div className="space-y-2">
                <a
                  href="#"
                  className="flex items-center justify-between p-3 rounded-xl bg-primary/5 hover:bg-blue-50 transition-colors group"
                >
                  <span className="text-sm text-foreground">Karta zgłoszenia dziecka</span>
                  <Download className="w-4 h-4 text-primary group-hover:translate-y-1 transition-transform" />
                </a>
                <a
                  href="#"
                  className="flex items-center justify-between p-3 rounded-xl bg-primary/5 hover:bg-blue-50 transition-colors group"
                >
                  <span className="text-sm text-foreground">{"Upoważnienie do odbioru dziecka"}</span>
                  <Download className="w-4 h-4 text-primary group-hover:translate-y-1 transition-transform" />
                </a>
                <a
                  href="#"
                  className="flex items-center justify-between p-3 rounded-xl bg-primary/5 hover:bg-blue-50 transition-colors group"
                >
                  <span className="text-sm text-foreground">Standardy Ochrony Małoletnich</span>
                  <Download className="w-4 h-4 text-primary group-hover:translate-y-1 transition-transform" />
                </a>
              </div>
              <Button
                asChild
                variant="ghost"
                className="text-primary hover:text-secondary p-0 h-auto font-medium group w-full justify-start"
              >
                <a href="/bip">
                  Zobacz dokumenty
                  <ArrowUpRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </a>
              </Button>
            </div>

            {/* Parent Resource 2 */}
            <div className="bg-card rounded-3xl p-8 space-y-6 transition-all hover:shadow-xl hover:scale-[1.02] opacity-0 animate-slide-in-up animation-delay-400 w-full">
              <div className="w-16 h-16 rounded-2xl gradient-4 flex items-center justify-center mx-auto">
                <Utensils className="w-8 h-8 text-white" />
              </div>
              <div className="space-y-3">
                <h3 className="font-serif text-2xl text-foreground">Menu i Wyżywienie</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Jadłospis, informacje o dietach i alergii pokarmowych
                </p>
              </div>
              <div className="space-y-3">
                {/* Using accent color for card */}
                <div className="p-4 rounded-xl bg-accent/10">
                  <div className="font-semibold text-foreground mb-2">Aktualne Menu - Styczeń 2025</div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Zdrowe, zbilansowane posiłki przygotowane przez naszego kucharza
                  </p>
                  <Button
                    asChild
                    variant="ghost"
                    className="text-accent hover:text-foreground p-0 h-auto font-medium group"
                  >
                    <a href={mealPlanUrl || "/documents/jadlospis.pdf"} target="_blank" rel="noopener noreferrer">
                      Zobacz jadłospis
                      <ExternalLink className="w-4 h-4 ml-1" />
                    </a>
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground text-justify">
                  Uwzględniamy diety eliminacyjne i alergie pokarmowe. Prosimy o zgłaszanie wszelkich ograniczeń
                  żywieniowych.
                </p>
              </div>
            </div>

            {/* Parent Resource 3 */}
            <div className="bg-card rounded-3xl p-8 space-y-6 transition-all hover:shadow-xl hover:scale-[1.02] opacity-0 animate-slide-in-up animation-delay-600 w-full">
              <div className="w-16 h-16 rounded-2xl gradient-3 flex items-center justify-center mx-auto">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div className="space-y-3">
                <h3 className="font-serif text-2xl text-foreground">Organizacja Dnia</h3>
                <p className="text-muted-foreground leading-relaxed">Plan dnia i harmonogram zajęć w przedszkolu</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">Przyjmowanie dzieci</span>
                  <span className="text-sm font-semibold text-foreground">6:30 - 8:30</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">Śniadanie</span>
                  <span className="text-sm font-semibold text-foreground">8:15 - 9:00</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">Zajęcia, Spacery </span>
                  <span className="text-sm font-semibold text-foreground">9:00 - 12:00</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">Obiad</span>
                  <span className="text-sm font-semibold text-foreground">11:30 - 13:00</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-muted-foreground">Odpoczynek i zabawy</span>
                  <span className="text-sm font-semibold text-foreground">13:00 - 16:15</span>
                </div>
              </div>
              <Button
                asChild
                variant="ghost"
                className="text-primary hover:text-secondary p-0 h-auto font-medium group w-full justify-start"
              >
                <a href="/aktualnosci">
                  Zobacz kalendarz
                  <ArrowUpRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </a>
              </Button>
            </div>

            {/* Parent Resource 4 */}
            <div className="bg-card rounded-3xl p-8 space-y-6 transition-all hover:shadow-xl hover:scale-[1.02] opacity-0 animate-slide-in-up animation-delay-800 w-full">
              <div className="w-16 h-16 rounded-2xl gradient-2 flex items-center justify-center">
                <Home className="w-8 h-8 text-white" />
              </div>
              <div className="space-y-3">
                <h3 className="font-serif text-xl sm:text-2xl text-foreground mb-4">Adaptacja</h3>
                <div
                  className="text-muted-foreground leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: "Wskazówki dla rodziców - jak przygotować dziecko do przedszkola" }}
                />
              </div>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Stopniowe przyzwyczajanie do nowego środowiska</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Rozmowy o przedszkolu w pozytywnym tonie</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Ulubiona zabawka jako element bezpieczeństwa</span>
                </li>
              </ul>
              <Link href="/adaptacja" className="text-primary hover:text-secondary font-medium inline-flex items-center group">
                Czytaj więcej
                <ArrowUpRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>
            </div>

            {/* Parent Resource 5 */}
            <div className="bg-card rounded-3xl p-8 space-y-6 transition-all hover:shadow-xl hover:scale-[1.02] opacity-0 animate-slide-in-up animation-delay-1000 w-full">
              <div className="w-16 h-16 rounded-2xl gradient-1 flex items-center justify-center">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <div className="space-y-3">
                <h3 className="font-serif text-2xl text-foreground">Program Edukacyjny</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Szczegółowy opis programu wychowawczo-dydaktycznego
                </p>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed text-justify">
                Nasz program opiera się na podstawie programowej wychowania przedszkolnego i uwzględnia indywidualne
                potrzeby każdego dziecka.
              </p>
            </div>

            {/* Parent Resource 6 */}
            <div className="bg-card rounded-3xl p-8 space-y-6 transition-all hover:shadow-xl hover:scale-[1.02] opacity-0 animate-slide-in-up animation-delay-1200 w-full">
              <div className="w-16 h-16 rounded-2xl gradient-4 flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div className="space-y-3">
                <h3 className="font-serif text-2xl text-foreground">Bezpieczeństwo</h3>
                <p className="text-muted-foreground leading-relaxed text-justify">
                  Informacje o zasadach bezpieczeństwa w przedszkolu
                </p>
              </div>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Monitoring wizyjny na terenie przedszkola</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Bezpieczne place zabaw i sale</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Wykwalifikowana kadra z pierwszą pomocą</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* CHILD PROTECTION STANDARDS AND DOCUMENTS SECTION */}
        <section className="space-y-8 opacity-0 animate-fade-in-up animation-delay-200">
          {/* Documents to Download Section */}
        </section>

        {/* Testimonials Section - AUTO-SCROLLING CAROUSEL */}
        <section className="space-y-12 opacity-0 animate-fade-in-up animation-delay-200 overflow-hidden">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h2 className="font-serif text-5xl lg:text-6xl text-foreground leading-tight">Opinie Rodziców</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Co mówią o nas rodzice naszych przedszkolaków
            </p>
          </div>

          <div className="relative py-4 group">
            {/* Gradient overlays for fade effect */}
            <div className="absolute left-0 top-0 bottom-0 w-4 md:w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-4 md:w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

            <div className="overflow-x-auto scrollbar-hide scroll-smooth touch-pan-x">
              {/* Auto-scrolling container */}
              <div className="flex gap-6 animate-scroll-left group-hover:animation-paused">
                {/* First set of testimonials */}
                {/* Google Review 1 */}
                <div className="bg-card rounded-3xl p-8 space-y-6 shadow-lg hover:shadow-xl transition-shadow flex-shrink-0 w-[400px]">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-[#f2c91f] text-[#f2c91f]" />
                      ))}
                    </div>
                    {/* Using Google's colors for badge */}
                    <Badge className="bg-white border border-foreground/10 text-foreground text-xs px-3 py-1">
                      <svg className="w-3 h-3 mr-1.5 inline" viewBox="0 0 24 24" fill="currentColor">
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                      </svg>
                      Google
                    </Badge>
                  </div>
                  <p className="text-muted-foreground leading-relaxed italic">
                    "Wspaniałe przedszkole! Moja córka chodzi tu z radością każdego dnia. Nauczyciele są ciepli,
                    profesjonalni i naprawdę dbają o dzieci."
                  </p>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground">
                        AK
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-foreground">Anna Kowalska</div>
                      <div className="text-sm text-muted-foreground">Mama Zosi, 4 latki</div>
                    </div>
                  </div>
                </div>

                {/* Facebook Review 1 */}
                {/* Using Facebook's blue for badge */}
                <div className="bg-card rounded-3xl p-8 space-y-6 shadow-lg hover:shadow-xl transition-shadow flex-shrink-0 w-[400px]">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-[#f2c91f] text-[#f2c91f]" />
                      ))}
                    </div>
                    <Badge className="bg-[#1877F2] text-white text-xs px-3 py-1 border-0">
                      <Facebook className="w-3 h-3 mr-1.5 inline" fill="currentColor" />
                      Facebook
                    </Badge>
                  </div>
                  <p className="text-muted-foreground leading-relaxed italic">
                    "EduCMS to drugie dom dla naszego syna. Rodzinna atmosfera i wartości chrześcijańskie
                    są dla nas bardzo ważne. Polecamy z całego serca!"
                  </p>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-gradient-to-br from-accent to-foreground text-primary-foreground">
                        MN
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-foreground">Marek Nowak</div>
                      <div className="text-sm text-muted-foreground">Tata Kuby, 5 latki</div>
                    </div>
                  </div>
                </div>

                {/* Website Review 1 */}
                {/* Using primary/secondary gradient for badge */}
                <div className="bg-card rounded-3xl p-8 space-y-6 shadow-lg hover:shadow-xl transition-shadow flex-shrink-0 w-[400px]">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-[#f2c91f] text-[#f2c91f]" />
                      ))}
                    </div>
                    <Badge className="bg-gradient-to-r from-primary to-secondary text-primary-foreground text-xs px-3 py-1 border-0">
                      <Home className="w-3 h-3 mr-1.5 inline" />
                      Strona
                    </Badge>
                  </div>
                  <p className="text-muted-foreground leading-relaxed italic">
                    "Bogaty program zajęć i indywidualne podejście do każdego dziecka. Nasza córka świetnie się tu
                    rozwija i każdego dnia wraca z nowymi umiejętnościami!"
                  </p>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-gradient-to-br from-secondary to-primary text-primary-foreground">
                        KW
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-foreground">Katarzyna Wiśniewska</div>
                      <div className="text-sm text-muted-foreground">Mama Oli, 6 latki</div>
                    </div>
                  </div>
                </div>

                {/* Google Review 2 */}
                <div className="bg-card rounded-3xl p-8 space-y-6 shadow-lg hover:shadow-xl transition-shadow flex-shrink-0 w-[400px]">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-[#f2c91f] text-[#f2c91f]" />
                      ))}
                    </div>
                    <Badge className="bg-white border border-foreground/10 text-foreground text-xs px-3 py-1">
                      <svg className="w-3 h-3 mr-1.5 inline" viewBox="0 0 24 24" fill="currentColor">
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                      </svg>
                      Google
                    </Badge>
                  </div>
                  <p className="text-muted-foreground leading-relaxed italic">
                    "Najlepsze przedszkole w Mieście! Dzieci uczą się przez zabawę, a nauczyciele mają niesamowite
                    podejście. Nasz syn nie może się doczekać każdego dnia w przedszkolu."
                  </p>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground">
                        PZ
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-foreground">Piotr Zieliński</div>
                      <div className="text-sm text-muted-foreground">Tata Mateusza, 3 latki</div>
                    </div>
                  </div>
                </div>

                {/* Facebook Review 2 */}
                <div className="bg-card rounded-3xl p-8 space-y-6 shadow-lg hover:shadow-xl transition-shadow flex-shrink-0 w-[400px]">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-[#f2c91f] text-[#f2c91f]" />
                      ))}
                    </div>
                    <Badge className="bg-[#1877F2] text-white text-xs px-3 py-1 border-0">
                      <Facebook className="w-3 h-3 mr-1.5 inline" fill="currentColor" />
                      Facebook
                    </Badge>
                  </div>
                  <p className="text-muted-foreground leading-relaxed italic">
                    "Wspaniała kadra pedagogiczna, która traktuje każde dziecko indywidualnie. Czujemy się jak rodzina.
                    Dziękujemy za troskę i zaangażowanie!"
                  </p>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-gradient-to-br from-accent to-foreground text-primary-foreground">
                        EK
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-foreground">Ewa Kamińska</div>
                      <div className="text-sm text-muted-foreground">Mama Julii, 4 latki</div>
                    </div>
                  </div>
                </div>

                {/* Website Review 2 */}
                <div className="bg-card rounded-3xl p-8 space-y-6 shadow-lg hover:shadow-xl transition-shadow flex-shrink-0 w-[400px]">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-[#f2c91f] text-[#f2c91f]" />
                      ))}
                    </div>
                    <Badge className="bg-gradient-to-r from-primary to-secondary text-primary-foreground text-xs px-3 py-1 border-0">
                      <Home className="w-3 h-3 mr-1.5 inline" />
                      Strona
                    </Badge>
                  </div>
                  <p className="text-muted-foreground leading-relaxed italic">
                    "Przedszkole z duszą! Piękne wartości, wspaniała atmosfera i profesjonalna opieka. Nasze dzieci
                    rozwijają się tutaj w każdym wymiarze."
                  </p>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-gradient-to-br from-secondary to-primary text-primary-foreground">
                        TW
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-foreground">Tomasz Wójcik</div>
                      <div className="text-sm text-muted-foreground">Tata Ani i Janka, 5 i 6 latki</div>
                    </div>
                  </div>
                </div>

                {/* Duplicate set for seamless loop */}
                {/* Google Review 1 - Duplicate */}
                <div className="bg-card rounded-3xl p-8 space-y-6 shadow-lg hover:shadow-xl transition-shadow flex-shrink-0 w-[400px]">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-[#f2c91f] text-[#f2c91f]" />
                      ))}
                    </div>
                    <Badge className="bg-white border border-foreground/10 text-foreground text-xs px-3 py-1">
                      <svg className="w-3 h-3 mr-1.5 inline" viewBox="0 0 24 24" fill="currentColor">
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                      </svg>
                      Google
                    </Badge>
                  </div>
                  <p className="text-muted-foreground leading-relaxed italic">
                    "Wspaniałe przedszkole! Moja córka chodzi tu z radością każdego dnia. Nauczyciele są ciepli,
                    profesjonalni i naprawdę dbają o dzieci."
                  </p>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground">
                        AK
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-foreground">Anna Kowalska</div>
                      <div className="text-sm text-muted-foreground">Mama Zosi, 4 latki</div>
                    </div>
                  </div>
                </div>

                {/* Facebook Review 1 - Duplicate */}
                <div className="bg-card rounded-3xl p-8 space-y-6 shadow-lg hover:shadow-xl transition-shadow flex-shrink-0 w-[400px]">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-[#f2c91f] text-[#f2c91f]" />
                      ))}
                    </div>
                    <Badge className="bg-[#1877F2] text-white text-xs px-3 py-1 border-0">
                      <Facebook className="w-3 h-3 mr-1.5 inline" fill="currentColor" />
                      Facebook
                    </Badge>
                  </div>
                  <p className="text-muted-foreground leading-relaxed italic">
                    "EduCMS to drugie dom dla naszego syna. Rodzinna atmosfera i wartości chrześcijańskie
                    są dla nas bardzo ważne. Polecamy z całego serca!"
                  </p>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-gradient-to-br from-accent to-foreground text-primary-foreground">
                        MN
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-foreground">Marek Nowak</div>
                      <div className="text-sm text-muted-foreground">Tata Kuby, 5 latki</div>
                    </div>
                  </div>
                </div>

                {/* Website Review 1 - Duplicate */}
                <div className="bg-card rounded-3xl p-8 space-y-6 shadow-lg hover:shadow-xl transition-shadow flex-shrink-0 w-[400px]">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-[#f2c91f] text-[#f2c91f]" />
                      ))}
                    </div>
                    <Badge className="bg-gradient-to-r from-primary to-secondary text-primary-foreground text-xs px-3 py-1 border-0">
                      <Home className="w-3 h-3 mr-1.5 inline" />
                      Strona
                    </Badge>
                  </div>
                  <p className="text-muted-foreground leading-relaxed italic">
                    "Bogaty program zajęć i indywidualne podejście do każdego dziecka. Nasza córka świetnie się tu
                    rozwija i każdego dnia wraca z nowymi umiejętnościami!"
                  </p>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-gradient-to-br from-secondary to-primary text-primary-foreground">
                        KW
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-foreground">Katarzyna Wiśniewska</div>
                      <div className="text-sm text-muted-foreground">Mama Oli, 6 latki</div>
                    </div>
                  </div>
                </div>

                {/* Google Review 2 - Duplicate */}
                <div className="bg-card rounded-3xl p-8 space-y-6 shadow-lg hover:shadow-xl transition-shadow flex-shrink-0 w-[400px]">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-[#f2c91f] text-[#f2c91f]" />
                      ))}
                    </div>
                    <Badge className="bg-white border border-foreground/10 text-foreground text-xs px-3 py-1">
                      <svg className="w-3 h-3 mr-1.5 inline" viewBox="0 0 24 24" fill="currentColor">
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                      </svg>
                      Google
                    </Badge>
                  </div>
                  <p className="text-muted-foreground leading-relaxed italic">
                    "Najlepsze przedszkole w Mieście! Dzieci uczą się przez zabawę, a nauczyciele mają niesamowite
                    podejście. Nasz syn nie może się doczekać każdego dnia w przedszkolu."
                  </p>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground">
                        PZ
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-foreground">Piotr Zieliński</div>
                      <div className="text-sm text-muted-foreground">Tata Mateusza, 3 latki</div>
                    </div>
                  </div>
                </div>

                {/* Facebook Review 2 - Duplicate */}
                <div className="bg-card rounded-3xl p-8 space-y-6 shadow-lg hover:shadow-xl transition-shadow flex-shrink-0 w-[400px]">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-[#f2c91f] text-[#f2c91f]" />
                      ))}
                    </div>
                    <Badge className="bg-[#1877F2] text-white text-xs px-3 py-1 border-0">
                      <Facebook className="w-3 h-3 mr-1.5 inline" fill="currentColor" />
                      Facebook
                    </Badge>
                  </div>
                  <p className="text-muted-foreground leading-relaxed italic">
                    "Wspaniała kadra pedagogiczna, która traktuje każde dziecko indywidualnie. Czujemy się jak rodzina.
                    Dziękujemy za troskę i zaangażowanie!"
                  </p>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-gradient-to-br from-accent to-foreground text-primary-foreground">
                        EK
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-foreground">Ewa Kamińska</div>
                      <div className="text-sm text-muted-foreground">Mama Julii, 4 latki</div>
                    </div>
                  </div>
                </div>

                {/* Website Review 2 - Duplicate */}
                <div className="bg-card rounded-3xl p-8 space-y-6 shadow-lg hover:shadow-xl transition-shadow flex-shrink-0 w-[400px]">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-[#f2c91f] text-[#f2c91f]" />
                      ))}
                    </div>
                    <Badge className="bg-gradient-to-r from-primary to-secondary text-primary-foreground text-xs px-3 py-1 border-0">
                      <Home className="w-3 h-3 mr-1.5 inline" />
                      Strona
                    </Badge>
                  </div>
                  <p className="text-muted-foreground leading-relaxed italic">
                    "Przedszkole z duszą! Piękne wartości, wspaniała atmosfera i profesjonalna opieka. Nasze dzieci
                    rozwijają się tutaj w każdym wymiarze."
                  </p>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-gradient-to-br from-secondary to-primary text-primary-foreground">
                        TW
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-foreground">Tomasz Wójcik</div>
                      <div className="text-sm text-muted-foreground">Tata Ani i Janka, 5 i 6 latki</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="opacity-0 animate-fade-in-up animation-delay-200" id="kontakt">
          {/* Using gradient-1 for background */}
          <div className="gradient-1 rounded-[4rem] p-12 lg:p-16">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="text-white space-y-4">
                {/* Using semantic tokens for headings and text */}
                <h2 className="font-serif text-5xl leading-tight lg:text-5xl">Skontaktuj się z nami</h2>
                <p className="text-white/90 text-lg leading-relaxed">
                  Masz pytania? Chcesz zapisać dziecko? Zapraszamy do kontaktu!
                </p>

                <div className="space-y-4 pt-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-medium">Adres</div>
                      <div className="text-white/80">ul. Edukacyjna 1, 00-000 Miasto</div>
                      <div className="text-white/80">00-000 Miasto</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-medium">Telefon</div>
                      <div className="text-white/80">123 456 789</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-medium">Email</div>
                      <div className="text-white/80 text-sm">kontakt@educms-szablon.pl</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-medium">Godziny otwarcia</div>
                      <div className="text-white/80">Pon-Pt: 6:30 - 16:30</div>
                      <div className="text-white/60 text-sm">Przyjmowanie dzieci od 6:30</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Form */}
              <div className="bg-card rounded-3xl p-8 space-y-6">
                <h3 className="font-serif text-2xl text-foreground">Wyślij wiadomość</h3>

                <div className="space-y-4">
                  {/* Using border-foreground/20 for inputs */}
                  <div>
                    <Input placeholder="Imię i nazwisko" className="h-12 rounded-xl border-foreground/20" />
                  </div>
                  <div>
                    <Input type="email" placeholder="Email" className="h-12 rounded-xl border-foreground/20" />
                  </div>
                  <div>
                    <Input type="tel" placeholder="Telefon" className="h-12 rounded-xl border-foreground/20" />
                  </div>
                  <div>
                    <Textarea
                      placeholder="Wiadomość"
                      className="min-h-[120px] rounded-xl border-foreground/20 resize-none"
                    />
                  </div>
                  {/* Using gradient-2 for button */}
                  <Button className="w-full gradient-2 text-white rounded-xl h-12 text-base font-medium transition-all hover:scale-105">
                    <Send className="w-5 h-5 mr-2" />
                    Wyślij wiadomość
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              name: "Placówka Edukacyjna",
              alternateName: "EduCMS",
              url: "https://educms-szablon.pl",
              logo: "https://educms-szablon.pl/logoduze-2.jpg",
              description:
                "Przedszkole parafialne przy Parafii NMP w Mieście z 34-letnim doświadczeniem w edukacji przedszkolnej",
              address: {
                "@type": "PostalAddress",
                streetAddress: "ul. Promienna 11",
                addressLocality: "Mieściea",
                postalCode: "81-507",
                addressCountry: "PL",
              },
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+48-58-623-22-65",
                contactType: "customer service",
                availableLanguage: "Polish",
              },
              sameAs: ["https://www.facebook.com/przedszkolenazaret", "https://educms-szablon.pl"],
              foundingDate: "1991",
              areaServed: {
                "@type": "City",
                name: "Mieściea",
              },
            }),
          }}
        />

        <Footer />
      </div>
    </main>
  )
}
