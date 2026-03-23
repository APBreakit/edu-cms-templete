import { redirect } from "next/navigation"
import { getPostById } from "@/lib/db/helpers"
import PostForm from "@/components/admin/post-form"
import { getSession } from "@/lib/auth"
export const dynamic = "force-dynamic"

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) {
    redirect("/login")
  }
  const { id } = await params

  const post = await getPostById(id)

  if (!post) {
    redirect("/admin/posts")
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Edytuj post</h1>
        <p className="text-gray-600 mt-1">Zaktualizuj treść postu</p>
      </div>

      <PostForm userId={session!.user.id} post={post} />
    </div>
  )
}
