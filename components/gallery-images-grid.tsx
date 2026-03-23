"use client"

import { useState } from "react"
import Image from "next/image"
import { GalleryLightbox } from "@/components/gallery-lightbox"

export default function GalleryImagesGrid({ images }: { images: Array<{ id: string; image_url: string; title?: string }> }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const mapped = images.map((img) => ({ id: img.id, file_url: img.image_url, file_name: img.title || "" }))

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((img, i) => (
          <button key={img.id} className="relative w-full aspect-square overflow-hidden rounded-xl border" onClick={() => setLightboxIndex(i)}>
            <Image src={img.image_url} alt={img.title || ""} fill className="object-cover" />
          </button>
        ))}
      </div>
      {lightboxIndex !== null && (
        <GalleryLightbox images={mapped} currentIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} />
      )}
    </>
  )
}

