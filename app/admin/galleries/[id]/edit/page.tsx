import { notFound, redirect } from "next/navigation"
import { getGalleryById, getGalleryImages } from "@/lib/db/helpers"
export const dynamic = "force-dynamic"
import { Card } from "@/components/ui/card"
import GalleryForm from "@/components/admin/gallery-form"
import GalleryImagesManager from "@/components/admin/gallery-images-manager"
import { getSession } from "@/lib/auth"

export default async function EditGalleryPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getSession()
  if (!session) {
    redirect("/login")
  }
  const { id } = await params

  const gallery = await getGalleryById(id)

  if (!gallery) {
    notFound()
  }

  const images = await getGalleryImages(id)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Edytuj galerię</h1>
        <p className="text-gray-600 mt-1">{gallery.title}</p>
      </div>

      <Card className="p-6">
        <GalleryForm gallery={gallery} userId={session!.user.id} />
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Zdjęcia w galerii</h2>
        <GalleryImagesManager galleryId={id} images={images || []} />
      </Card>
    </div>
  )
}
