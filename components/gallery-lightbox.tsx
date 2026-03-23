"use client"

import type React from "react"

import { useState } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface GalleryLightboxProps {
  images: Array<{ id: string; file_url: string; file_name: string }>
  currentIndex: number
  onClose: () => void
}

export function GalleryLightbox({ images, currentIndex, onClose }: GalleryLightboxProps) {
  const [index, setIndex] = useState(currentIndex)

  const goToPrevious = () => {
    setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onClose()
    if (e.key === "ArrowLeft") goToPrevious()
    if (e.key === "ArrowRight") goToNext()
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
      onClick={onClose}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 text-white hover:bg-white/10"
        onClick={onClose}
      >
        <X className="w-6 h-6" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 text-white hover:bg-white/10"
        onClick={(e) => {
          e.stopPropagation()
          goToPrevious()
        }}
      >
        <ChevronLeft className="w-8 h-8" />
      </Button>

      <div className="max-w-7xl max-h-[90vh] px-16" onClick={(e) => e.stopPropagation()}>
        <img
          src={images[index].file_url || "/placeholder.svg"}
          alt={images[index].file_name}
          className="max-w-full max-h-[90vh] object-contain rounded-lg"
        />
        <p className="text-white text-center mt-4">
          {index + 1} / {images.length}
        </p>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 text-white hover:bg-white/10"
        onClick={(e) => {
          e.stopPropagation()
          goToNext()
        }}
      >
        <ChevronRight className="w-8 h-8" />
      </Button>
    </div>
  )
}
