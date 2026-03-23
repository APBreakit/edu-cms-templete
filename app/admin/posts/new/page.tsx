import PostForm from "@/components/admin/post-form"
import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function NewPostPage() {
  const session = await getSession()
  if (!session) {
    redirect("/login")
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Nowy post</h1>
        <p className="text-gray-600 mt-1">Utwórz nową aktualność, ogłoszenie lub konkurs</p>
      </div>

      <PostForm userId={session!.user.id} />
    </div>
  )
}
