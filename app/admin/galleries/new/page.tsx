import { Card } from "@/components/ui/card"
import GalleryForm from "@/components/admin/gallery-form"
import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function NewGalleryPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Nowa galeria</h1>
        <p className="text-gray-600 mt-1">Utwórz nową galerię zdjęć</p>
      </div>

      <Card className="p-6">
        <GalleryForm userId={session!.user.id} />
      </Card>
    </div>
  )
}
