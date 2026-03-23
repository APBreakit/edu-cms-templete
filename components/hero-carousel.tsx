"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Heart, Sparkles, Award } from "lucide-react"
import Image from "next/image"

const images = [
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1-Dx86g3h4biuy2CHYw6ACIr5tqYXPJ4.png",
    alt: "Dzieci karmiące alpaki podczas wycieczki",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2-8qteaCw0kMgUnN5QHcfVYF1oovvP48.png",
    alt: "Zajęcia edukacyjne z siostrą w przedszkolu",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/4-kYTw08hVGgPrk6KBAoHw4U5OxJw25z.png",
    alt: "Występ patriotyczny dzieci na scenie",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3-dpZ4MYHywTjhNmPoXWCLjXUws6BpAn.png",
    alt: "Dzieci modlące się przy figurze Matki Boskiej",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/6-9s4ZS7Cvdunhg2qP30U2tUQ3NSbP6C.png",
    alt: "Dzieci podczas urodzinowego przyjęcia",
  },
]

export function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Auto-play functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  return (
    <div className="relative opacity-0 animate-scale-in animation-delay-400">
      <div className="relative rounded-[3rem] overflow-hidden gradient-3 p-2 transition-all hover:scale-[1.02] hover:shadow-2xl">
        {/* Images - Using Next.js Image for optimization */}
        <div className="relative w-full h-[700px] rounded-[3rem] overflow-hidden">
          {images.map((image, index) => (
            <Image
              key={index}
              src={image.src || "/placeholder.svg"}
              alt={image.alt}
              fill
              priority={index === 0}
              loading={index === 0 ? undefined : "lazy"}
              sizes="(max-width: 768px) 100vw, 50vw"
              className={`object-cover transition-opacity duration-1000 ${
                index === currentIndex ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </div>

        {/* Floating badges */}
        <Badge className="absolute top-8 right-8 bg-card/95 backdrop-blur-sm text-foreground border-0 px-5 py-3 rounded-full text-sm font-medium animate-float shadow-lg">
          <Heart className="w-4 h-4 text-primary mr-2 inline" fill="currentColor" />
          Rodzinna Atmosfera
        </Badge>

        <Badge className="absolute bottom-32 left-8 bg-card/95 backdrop-blur-sm text-foreground border-0 px-5 py-3 rounded-full text-sm font-medium animate-float animation-delay-400 shadow-lg">
          <Sparkles className="w-4 h-4 text-secondary mr-2 inline" />
          Kreatywna Nauka
        </Badge>

        <Badge className="absolute bottom-16 right-12 bg-card/95 backdrop-blur-sm text-foreground border-0 px-5 py-3 rounded-full text-sm font-medium animate-float animation-delay-600 shadow-lg">
          <Award className="w-4 h-4 text-accent mr-2 inline" />
          Certyfikowane
        </Badge>

        {/* Dot navigation */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex ? "bg-primary w-8" : "bg-muted hover:bg-muted-foreground"
              }`}
              aria-label={`Przejdź do zdjęcia ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full gradient-2 opacity-20 blur-2xl animate-pulse-soft" />
      <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full gradient-4 opacity-20 blur-2xl animate-pulse-soft animation-delay-400" />
    </div>
  )
}
