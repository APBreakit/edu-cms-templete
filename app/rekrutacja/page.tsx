"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, FileText, Users, CheckCircle2, Download, Phone, Mail, MapPin, Clock, Info, AlertCircle } from 'lucide-react'
import { useEffect, useRef, useState } from "react"
import { Footer } from "@/components/footer"
import { Navigation } from "@/components/navigation"

export default function RekrutacjaPage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen bg-[#fcfaf8]">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2f67ab]/5 via-transparent to-[#6fc0e8]/5" />
        <div className="container mx-auto relative">
          <div
            className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <div className="inline-flex items-center gap-2 bg-[#f2c91f]/20 text-[#443b32] px-4 py-2 rounded-full mb-6">
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-semibold">Rok szkolny 2026/2027</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#443b32] mb-6 text-balance">
              Rekrutacja do Przedszkola
            </h1>
            <p className="text-xl text-[#443b32]/70 mb-8 leading-relaxed max-w-3xl mx-auto text-pretty">
              Dyrektor ogłasza rekrutację na rok 2026/2027
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild className="bg-[#2f67ab] hover:bg-[#2f67ab]/90 text-white px-8 py-6 text-lg">
                <a href="#dokumenty">
                  <Download className="w-5 h-5 mr-2" />
                  Pobierz dokumenty
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-[#443b32] text-[#443b32] hover:bg-[#443b32] hover:text-white px-8 py-6 text-lg bg-transparent"
              >
                <a href="/kontakt">
                  <Phone className="w-5 h-5 mr-2" />
                  Skontaktuj się
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section id="harmonogram" className="py-12 sm:py-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#443b32] mb-4">Harmonogram rekrutacji</h2>
            <p className="text-lg text-[#443b32]/70">Poznaj kluczowe daty procesu rekrutacyjnego</p>
          </div>

          <TimelineSection />
        </div>
      </section>

      {/* Important Info Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#443b32] mb-4">Ważne informacje</h2>
            <p className="text-lg text-[#443b32]/70">Wszystko, co musisz wiedzieć o rekrutacji</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="border-[#2f67ab]/20 hover:border-[#2f67ab] transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-2xl bg-[#2f67ab]/10 flex items-center justify-center mb-4">
                  <Users className="w-7 h-7 text-[#2f67ab]" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#443b32] mb-4">Wiek dzieci</h3>
                <p className="text-[#443b32]/70 leading-relaxed mb-4">
                  Do przedszkola przyjmowane są dzieci od <strong>3 do 6 roku życia</strong> (roczniki 2020, 2021, 2022,
                  2023).
                </p>
                <p className="text-[#443b32]/70 leading-relaxed">
                  W wyjątkowych sytuacjach, w przypadku wolnych miejsc, dzieci które ukończyły <strong>2,5 roku</strong>
                  .
                </p>
              </CardContent>
            </Card>

            <Card className="border-[#6fc0e8]/20 hover:border-[#6fc0e8] transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-2xl bg-[#6fc0e8]/10 flex items-center justify-center mb-4">
                  <Info className="w-7 h-7 text-[#6fc0e8]" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#443b32] mb-4">Opłaty</h3>
                <ul className="space-y-3 text-[#443b32]/70">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#6fc0e8] flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Wyżywienie:</strong> 10 zł dziennie (płatne z wyprzedzeniem do 15-go każdego miesiąca)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#6fc0e8] flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Pobyt 8:00-13:00:</strong> Bezpłatnie
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#6fc0e8] flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Dodatkowe godziny:</strong> 1,44 zł za godzinę (płatne po zakończeniu miesiąca)
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-[#f2c91f]/5 border-[#f2c91f]/30">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#f2c91f]/20 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-6 h-6 text-[#443b32]" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#443b32] mb-2">Uwaga!</h3>
                  <p className="text-[#443b32]/80 leading-relaxed">
                    Nasze przedszkole <strong>nie uczestniczy w rekrutacji elektronicznej Urzędu Miasta Mieście</strong>.
                    Kartę zgłoszenia dziecka oraz załączniki można pobrać ze strony internetowej lub z sekretariatu
                    przedszkola.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Criteria Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#443b32] mb-4">Kryteria rekrutacji</h2>
            <p className="text-lg text-[#443b32]/70">System punktowy w procesie rekrutacji</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="border-[#2f67ab]/30">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-[#2f67ab] text-white flex items-center justify-center font-bold text-xl">
                    I
                  </div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#443b32]">
                    Etap I - Kryteria ustawowe
                  </h3>
                </div>
                <ul className="space-y-4">
                  {[
                    "Wielodzietność rodziny kandydata",
                    "Niepełnosprawność kandydata",
                    "Niepełnosprawność jednego lub obojga rodziców",
                    "Niepełnosprawność rodzeństwa kandydata",
                    "Samotne wychowywanie kandydata",
                    "Objęcie kandydata pieczą zastępczą",
                  ].map((criterion, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#2f67ab] flex-shrink-0 mt-0.5" />
                      <span className="text-[#443b32]/80">{criterion}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-[#6fc0e8]/30">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-[#6fc0e8] text-white flex items-center justify-center font-bold text-xl">
                    II
                  </div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#443b32]">
                    Etap II - Kryteria dodatkowe
                  </h3>
                </div>
                <ul className="space-y-4">
                  {[
                    "Rodzeństwo uczęszczające do Szkoły Podstawowej w Mieście",
                    "Dziecko obojga rodziców pracujących",
                    "Dzieci przynależące do Parafii NMP w Mieście",
                  ].map((criterion, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#6fc0e8] flex-shrink-0 mt-0.5" />
                      <span className="text-[#443b32]/80">{criterion}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 p-4 bg-[#6fc0e8]/10 rounded-xl">
                  <p className="text-sm text-[#443b32]/70">
                    <strong>Uwaga:</strong> Etap II następuje po zakończeniu etapu I lub gdy przedszkole dysponuje
                    wolnymi miejscami
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Documents Section */}
      <section id="dokumenty" className="py-12 sm:py-20 px-4 sm:px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">Dokumenty do pobrania</h2>
            <p className="text-lg text-muted-foreground">Wszystkie niezbędne formularze i załączniki</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <a href="/documents/WNIOSEK-O-PRZYJECIE-DZIECKA.docx" target="_blank" rel="noopener noreferrer" className="block">
              <Card className="group hover:border-primary transition-all duration-300 hover:shadow-lg cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 group-hover:bg-primary flex items-center justify-center transition-colors">
                      <FileText className="w-7 h-7 text-primary group-hover:text-white transition-colors" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base sm:text-lg font-bold text-foreground mb-1">
                        Wniosek o przyjęcie dziecka
                      </h3>
                      <p className="text-sm text-muted-foreground">Formularz rekrutacyjny 2026/2027</p>
                    </div>
                    <Download className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </CardContent>
              </Card>
            </a>

            <a href="#" target="_blank" rel="noopener noreferrer" className="block">
              <Card className="group hover:border-accent transition-all duration-300 hover:shadow-lg cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-accent/10 group-hover:bg-accent flex items-center justify-center transition-colors">
                      <FileText className="w-7 h-7 text-accent group-hover:text-white transition-colors" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base sm:text-lg font-bold text-foreground mb-1">Załącznik Nr 3</h3>
                      <p className="text-sm text-muted-foreground">Oświadczenie o wielodzietności rodziny</p>
                    </div>
                    <Download className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" />
                  </div>
                </CardContent>
              </Card>
            </a>

            <a href="#" target="_blank" rel="noopener noreferrer" className="block">
              <Card className="group hover:border-secondary transition-all duration-300 hover:shadow-lg cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-secondary/10 group-hover:bg-secondary flex items-center justify-center transition-colors">
                      <FileText className="w-7 h-7 text-secondary-foreground group-hover:text-white transition-colors" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base sm:text-lg font-bold text-foreground mb-1">Załącznik Nr 2</h3>
                      <p className="text-sm text-muted-foreground">Oświadczenie o samotnym wychowywaniu</p>
                    </div>
                    <Download className="w-5 h-5 text-muted-foreground group-hover:text-secondary transition-colors" />
                  </div>
                </CardContent>
              </Card>
            </a>

            <a href="#" target="_blank" rel="noopener noreferrer" className="block">
              <Card className="group hover:border-primary transition-all duration-300 hover:shadow-lg cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 group-hover:bg-primary flex items-center justify-center transition-colors">
                      <FileText className="w-7 h-7 text-primary group-hover:text-white transition-colors" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base sm:text-lg font-bold text-foreground mb-1">Załącznik Nr 3</h3>
                      <p className="text-sm text-muted-foreground">Oświadczenie o zatrudnieniu rodziców</p>
                    </div>
                    <Download className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </CardContent>
              </Card>
            </a>
          </div>

          <div className="mt-8">
            <Card className="bg-muted/50 border-border">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Info className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">
                      Informacja o dokumentach
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Wszystkie dokumenty są dostępne do pobrania w formacie PDF. Można je również odebrać osobiście w
                      sekretariacie przedszkola podczas godzin pracy: poniedziałek–piątek 6:30–16:30.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-4xl">
          <Card className="bg-gradient-to-br from-[#2f67ab] to-[#6fc0e8] border-0 text-white">
            <CardContent className="p-6 sm:p-12 text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Masz pytania?</h2>
              <p className="text-xl text-white/90 mb-8">Skontaktuj się z nami - chętnie pomożemy!</p>
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <Phone className="w-6 h-6" />
                  </div>
                  <a href="tel:690471187" className="text-sm underline-offset-2 hover:underline">123 456 789</a>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div className="text-sm">kontakt@educms-szablon.pl</div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <a href="https://maps.app.goo.gl/6Z9mCKKgDxNnzAkv8" target="_blank" rel="noopener noreferrer" className="text-sm underline-offset-2 hover:underline">ul. Edukacyjna 1, 00-000 Miasto</a>
                </div>
              </div>
              <Button asChild className="bg-white text-[#2f67ab] hover:bg-white/90 px-8 py-6 text-lg">
                <a href="tel:690471187">
                  <Phone className="w-5 h-5 mr-2" />
                  Zadzwoń teraz
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  )
}

function TimelineSection() {
  const [visibleItems, setVisibleItems] = useState<number[]>([])
  const timelineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"))
            setVisibleItems((prev) => [...prev, index])
          }
        })
      },
      { threshold: 0.2 },
    )

    const items = timelineRef.current?.querySelectorAll(".timeline-item")
    items?.forEach((item) => observer.observe(item))

    return () => observer.disconnect()
  }, [])

  const timelineData = [
    {
      date: "2 marca 2026",
      title: "Start rekrutacji",
      description:
        "Rozpoczęcie przyjmowania wniosków o przyjęcie dziecka do przedszkola od godziny 6:30. Wnioski można składać w sekretariacie (pon.–pt. 6:30–16:30).",
      icon: Calendar,
      color: "bg-[#2f67ab]",
    },
    {
      date: "2-20 marca 2026",
      title: "Składanie wniosków",
      description:
        "Okres składania dokumentów. Wnioski wraz z załącznikami należy złożyć w sekretariacie przedszkola w godz. 6:30–16:30 (poniedziałek–piątek).",
      icon: FileText,
      color: "bg-[#6fc0e8]",
    },
    {
      date: "20 marca 2026",
      title: "Koniec rekrutacji",
      description:
        "Ostatni dzień przyjmowania wniosków (do godziny 16:30). Po tej dacie komisja rekrutacyjna rozpocznie weryfikację dokumentów.",
      icon: Clock,
      color: "bg-[#f2c91f]",
    },
    {
      date: "Kwiecień 2026",
      title: "Posiedzenie komisji",
      description:
        "Komisja rekrutacyjna ustala wyniki postępowania i publikuje listę dzieci zakwalifikowanych oraz niezakwalifikowanych.",
      icon: Users,
      color: "bg-[#2f67ab]",
    },
    {
      date: "Maj 2026",
      title: "Potwierdzenie miejsca",
      description:
        "Rodzice potwierdzają wolę uczęszczania dziecka do przedszkola telefonicznie (123 456 789) lub osobiście w sekretariacie.",
      icon: CheckCircle2,
      color: "bg-[#6fc0e8]",
    },
  ]

  return (
    <div ref={timelineRef} className="relative">
      {/* Timeline line */}
      <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-[#443b32]/10" />

      <div className="space-y-12">
        {timelineData.map((item, index) => {
          const Icon = item.icon
          const isVisible = visibleItems.includes(index)
          const isEven = index % 2 === 0

          return (
            <div
              key={index}
              data-index={index}
              className={`timeline-item relative transition-all duration-700 ${
                isVisible ? "opacity-100 translate-x-0" : `opacity-0 ${isEven ? "-translate-x-10" : "translate-x-10"}`
              }`}
            >
              <div className="flex flex-col md:flex-row gap-8 items-center">
                {/* Left side (desktop) */}
                <div className={`flex-1 ${isEven ? "md:text-right" : "md:order-2"}`}>
                  <Card className="hover:shadow-lg transition-all duration-300 border-[#443b32]/10 hover:border-[#2f67ab]/30">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-3 md:hidden">
                        <div
                          className={`w-10 h-10 rounded-xl ${item.color} text-white flex items-center justify-center`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="font-bold text-[#2f67ab]">{item.date}</div>
                      </div>
                      <div className="hidden md:block font-bold text-[#2f67ab] mb-3">{item.date}</div>
                      <h3 className="text-lg sm:text-xl font-bold text-[#443b32] mb-2">{item.title}</h3>
                      <p className="text-[#443b32]/70 leading-relaxed">{item.description}</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Center icon */}
                <div className="hidden md:flex relative z-10">
                  <div
                    className={`w-16 h-16 rounded-2xl ${item.color} text-white flex items-center justify-center shadow-lg transition-transform duration-300 hover:scale-110`}
                  >
                    <Icon className="w-8 h-8" />
                  </div>
                </div>

                {/* Right side (desktop) */}
                <div className={`flex-1 ${isEven ? "" : "md:order-1"}`}>{/* Empty space for alternating layout */}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
