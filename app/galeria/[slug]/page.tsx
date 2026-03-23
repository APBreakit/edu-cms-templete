import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { getPublicGalleryBySlug } from "@/app/actions/public-actions"
import Image from "next/image"
import GalleryImagesGrid from "@/components/gallery-images-grid"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const gallery = await getPublicGalleryBySlug(slug)
  const title = gallery?.title ? `${gallery.title} | EduCMS` : "Galeria | EduCMS"
  const description = gallery?.description || (gallery?.title ? `Galeria: ${gallery.title}` : "Zdjęcia z życia naszego przedszkola")
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://educms-szablon.pl"
  const url = `${base}/galeria/${slug}`
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "article" },
    robots: { index: true, follow: true },
  }
}

export default async function GalleryDetailPage({ params, searchParams }: { params: Promise<{ slug: string }>, searchParams?: Promise<{ page?: string }> }) {
  const { slug } = await params
  const resolvedSearchParams = await searchParams
  const page = Number(resolvedSearchParams?.page || "1") || 1
  const limit = 24
  const start = (page - 1) * limit
  const end = start + limit
  const gallery = await getPublicGalleryBySlug(slug)

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navigation />
      <div className="container mx-auto px-4 sm:px-6 py-12 max-w-6xl space-y-6">
        <h1 className="text-3xl font-bold">{gallery?.title || "Galeria"}</h1>
        <div className="relative w-full h-48 sm:h-64 rounded-2xl overflow-hidden border">
          {gallery?.cover_image_url ? (
            <Image src={gallery.cover_image_url} alt={gallery.title} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">Brak okładki</div>
          )}
        </div>

        <GalleryImagesGrid images={(gallery?.images || []).slice(start, end)} />

        <div className="flex items-center justify-between mt-8">
          <a href={`/galeria/${slug}?page=${Math.max(1, page - 1)}`} className="px-4 py-2 rounded border">Poprzednia</a>
          <a href={`/galeria/${slug}?page=${page + 1}`} className="px-4 py-2 rounded border">Następna</a>
        </div>
      </div>
      <Footer />
    </main>
  )
}
