"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

const teamSlides = [
  {
    id: 1,
    title: "Grono Pedagogiczne",
    description: "Nauczyciele, którzy codziennie wspierają rozwój naszych dzieci",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1-61BLB7kQUC4R8ksjLbVe8PH3ndxs95.jpg",
    alt: "Grono pedagogiczne naszej placówki",
  },
  {
    id: 2,
    title: "Zespół Wspierający",
    description: "Personel odpowiedzialny za wyżywienie, czystość i bezpieczeństwo przedszkola",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2-9BEq7uPSqJL2aD2H9qszlfdPb2CRHw.jpg",
    alt: "Zespół wspierający naszej placówki",
  },
]

export function TeamCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % teamSlides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
  }

  return (
    <div className="relative rounded-3xl overflow-hidden group h-full min-h-[600px]">
      {/* Slides */}
      <div className="relative h-full">
        {teamSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={slide.image || "/placeholder.svg"}
              alt={slide.alt}
              fill
              priority={index === 0}
              loading={index === 0 ? undefined : "lazy"}
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />

            {/* Slide Info */}
            <div className="absolute bottom-0 left-0 right-0 bg-card p-6 lg:p-8">
              <h4 className="text-2xl lg:text-3xl text-primary mb-2 font-semibold">{slide.title}</h4>
              <p className="text-sm lg:text-base text-muted-foreground">{slide.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-36 lg:bottom-44 left-1/2 -translate-x-1/2 flex gap-2.5 z-10">
        {teamSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`rounded-full transition-all duration-500 ease-out ${
              index === currentSlide
                ? "bg-card shadow-lg w-8 h-2.5"
                : "bg-card/60 hover:bg-card/80 w-2.5 h-2.5 hover:scale-110"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
