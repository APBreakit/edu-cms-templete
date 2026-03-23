import { redirect } from "next/navigation"
import { getGroupBySlug } from "@/lib/db/helpers"
import GroupForm from "@/components/admin/group-form"

export default async function EditGroupPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const group = await getGroupBySlug(slug)

  if (!group) {
    redirect("/admin/groups")
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Edytuj {group.name}</h1>
        <p className="text-gray-600 mt-1">Zaktualizuj informacje o grupie</p>
      </div>

      <GroupForm group={group} />
    </div>
  )
}
