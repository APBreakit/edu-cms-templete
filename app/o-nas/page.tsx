"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Heart, MapPin, Users, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function ONasPage() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-background text-foreground">
      {/* Animated gradient background */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full gradient-3 blur-3xl animate-gradient" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full gradient-1 blur-3xl animate-gradient animation-delay-400" />
      </div>

      <Navigation />

      <div className="container mx-auto px-4 sm:px-6 py-12 relative space-y-24">
        {/* Hero Section */}
        <section className="text-center space-y-6 opacity-0 animate-fade-in-up">
          <Badge className="bg-primary/10 text-primary border-0 px-6 py-2.5 rounded-full text-sm font-semibold">
            <Heart className="w-4 h-4 mr-2 inline" />O Nas
          </Badge>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-foreground leading-tight text-balance">
            Placówka Edukacyjna
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">przy Parafii NMP w Mieście</p>
        </section>

        {/* Historia Section */}
        <section className="space-y-12 opacity-0 animate-fade-in-up animation-delay-200">
          <div className="text-center space-y-4">
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-foreground leading-tight">
              Nasza Historia
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="relative rounded-3xl overflow-hidden group">
                <img
                  src="/children-performance.jpg"
                  alt="Dzieci podczas występu w przedszkolu"
                  className="w-full h-[300px] sm:h-[500px] object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <Badge className="bg-card/95 backdrop-blur-sm text-card-foreground border-0 px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg">
                    <MapPin className="w-4 h-4 mr-2 inline text-primary" />
                    Od 1991 roku
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p className="text-lg">
                Przedszkole przy Parafii NMP w Mieście prowadzone przez{" "}
                <strong>Organ prowadzący placówkę</strong>. Powstało w{" "}
                <strong>1991 roku</strong>.
              </p>
              <p className="text-lg">
                Jest to przedszkole katolickie, instytucja opiekuńczo-wychowawcza dla dzieci w wieku od trzech lat do
                rozpoczęcia obowiązku szkolnego. Wspiera ona wychowanie rodzinne, której nadrzędnym celem jest
                harmonijny rozwój dziecka jako osoby – w myśl zasad personalizmu i pedagogiki chrześcijańskiej.
              </p>
              <p className="text-lg">
                <strong>Przedszkole jest dostępne dla wszystkich dzieci.</strong>
              </p>
              <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-6 border border-primary/10">
                <p className="text-lg">
                  Miejsce lokalizacyjne jest bardzo korzystne, gdyż przedszkole znajduje się w{" "}
                  <strong>centrum miasta</strong>. Uzupełnieniem bazy lokalnej jest plac zabaw z odpowiednim
                  wyposażeniem.
                </p>
              </div>
              <p className="text-lg">
                Zajęcia odbywają się w sali i na placu zabaw. O wyborze miejsca decydują cele wychowawczo-dydaktyczne,
                treści oraz warunki atmosferyczne. Właściwie urządzone przedszkole zapewnia wychowankom bezpieczeństwo
                oraz stwarza możliwości wszechstronnego rozwoju, a nauczycielom ułatwia osiąganie zamierzonych celów
                wychowawczo-dydaktycznych.
              </p>
            </div>
          </div>
        </section>

        {/* Dyrekcja Section */}

        <section id="grono-pedagogiczne" className="space-y-12 opacity-0 animate-fade-in-up animation-delay-600">
          <div className="text-center space-y-4">
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-foreground leading-tight">
              Grono Pedagogiczne
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Nasz zespół wykwalifikowanych nauczycieli z pasją wspiera rozwój każdego dziecka
            </p>
          </div>

          <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
            <img
              src="/images/design-mode/1.jpg"
              alt="Grono pedagogiczne - zdjęcie zespołu przed bazyliką"
              className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="hidden md:block absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
            <div className="hidden md:block absolute bottom-8 left-8 right-8">
              <Badge className="bg-card/95 backdrop-blur-sm text-card-foreground border-0 px-6 py-3 rounded-full text-base font-semibold shadow-lg">
                <Users className="w-5 h-5 mr-2 inline text-primary" />
                Nasz Zespół Pedagogiczny
              </Badge>
              <p className="mt-4 text-white text-lg font-medium drop-shadow-lg">
                Wykwalifikowany zespół nauczycieli z wieloletnim doświadczeniem w pracy z dziećmi
              </p>
            </div>
          </div>

          <div className="md:hidden space-y-4 px-4">
            <Badge className="bg-primary/10 text-primary border-0 px-6 py-3 rounded-full text-base font-semibold">
              <Users className="w-5 h-5 mr-2 inline" />
              Nasz Zespół Pedagogiczny
            </Badge>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Wykwalifikowany zespół nauczycieli z wieloletnim doświadczeniem w pracy z dziećmi
            </p>
          </div>
        </section>

        <section id="zespol-wspierajacy" className="space-y-12 opacity-0 animate-fade-in-up animation-delay-800">
          <div className="text-center space-y-4">
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-foreground leading-tight">
              Zespół Wspierający
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-secondary to-accent mx-auto rounded-full" />
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Nasz zespół odpowiedzialny za wyżywienie, czystość i wsparcie w codziennym funkcjonowaniu przedszkola
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
              <img
                src="/images/design-mode/2.jpg"
                alt="Zespół wspierający - kuchnia, sprzątanie, wsparcie"
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="hidden md:block absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
              <div className="hidden md:block absolute bottom-8 left-8 right-8">
                <Badge className="bg-card/95 backdrop-blur-sm text-card-foreground border-0 px-6 py-3 rounded-full text-base font-semibold shadow-lg">
                  <Sparkles className="w-5 h-5 mr-2 inline text-secondary" />
                  Nasz Zespół Wspierający
                </Badge>
                <p className="mt-4 text-white text-lg font-medium drop-shadow-lg">
                  Doświadczeni pracownicy dbający o wyżywienie, higienę i wsparcie w codziennej opiece nad dziećmi
                </p>
              </div>
            </div>

            <div className="md:hidden space-y-4 px-4 mt-6">
              <Badge className="bg-secondary/10 text-secondary border-0 px-6 py-3 rounded-full text-base font-semibold">
                <Sparkles className="w-5 h-5 mr-2 inline" />
                Nasz Zespół Wspierający
              </Badge>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Doświadczeni pracownicy dbający o wyżywienie, higienę i wsparcie w codziennej opiece nad dziećmi
              </p>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  )
}
