import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Home, ArrowLeft } from 'lucide-react'
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <div className="flex-1 bg-gradient-to-br from-background via-muted to-secondary/20 flex items-center justify-center px-4 py-16">
        <div className="max-w-2xl w-full text-center">
          {/* Logo */}
          <div className="flex justify-center mb-8 animate-float">
            <Image
              src="/logo.jpg"
              alt="Logo Przedszkola Nazaret"
              width={120}
              height={120}
              className="rounded-full shadow-lg"
              priority
            />
          </div>

          {/* 404 Number */}
          <div className="mb-6 animate-fade-in">
            <h1 className="text-6xl sm:text-9xl lg:text-[12rem] font-bold text-primary/20 leading-none">404</h1>
          </div>

          {/* Message */}
          <div className="space-y-4 mb-8 animate-fade-in-up animation-delay-200">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">Ups! Strona nie znaleziona</h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-md mx-auto">
              Przepraszamy, ale strona której szukasz nie istnieje lub została przeniesiona.
            </p>
          </div>

          {/* Decorative elements */}
          <div className="flex justify-center gap-4 mb-8 animate-fade-in animation-delay-400">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-3xl">🎨</span>
            </div>
            <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center">
              <span className="text-3xl">📚</span>
            </div>
            <div className="w-16 h-16 rounded-full bg-accent/30 flex items-center justify-center">
              <span className="text-3xl">🎈</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-scale-in animation-delay-600">
            <Button asChild size="lg" className="min-w-[200px]">
              <Link href="/">
                <Home className="mr-2 h-5 w-5" />
                Strona Główna
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="min-w-[200px] bg-transparent">
              <Link href="/kontakt">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Kontakt
              </Link>
            </Button>
          </div>

          {/* Additional info */}
          <p className="mt-12 text-sm text-muted-foreground animate-fade-in animation-delay-800">
            Placówka Edukacyjna przy Parafii NMP w Mieście
          </p>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
