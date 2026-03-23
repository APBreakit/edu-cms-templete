import { getGroups } from "@/lib/db/helpers"
import { createGroup, deleteGroup } from "@/app/actions/admin-actions"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pencil, Users } from "lucide-react"
import Link from "next/link"
export const dynamic = "force-dynamic"
import GroupDeleteButton from "@/components/admin/group-delete-button"

export default async function GroupsPage() {
  const groups = await getGroups()
  async function addGroup(formData: FormData) {
    "use server"
    const name = String(formData.get('name') || '')
    const slug = String(formData.get('slug') || '')
    const color = String(formData.get('color') || '')
    const password = String(formData.get('password') || '')
    if (!name) return
    await createGroup({ name, slug, color: color || null as any, password: password || null as any })
  }
  async function removeGroup(slug: string) {
    "use server"
    await deleteGroup(slug)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Grupy przedszkolne</h1>
          <p className="text-gray-600 mt-1">Zarządzaj informacjami o grupach, nauczycielach i hasłach</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Dodaj nową grupę</h3>
            <form action={addGroup} className="grid gap-3">
              <input name="name" placeholder="Nazwa grupy" className="border rounded px-3 py-2" required minLength={2} />
              <input name="slug" placeholder="Slug (opcjonalnie)" className="border rounded px-3 py-2" pattern="^[a-z0-9-]+$" />
              <input name="color" type="color" className="border rounded px-3 py-2 w-24" />
              <input name="password" placeholder="Hasło (opcjonalnie)" className="border rounded px-3 py-2" minLength={4} />
              <Button type="submit">Dodaj</Button>
            </form>
          </div>
        </Card>
        {groups?.map((group) => (
          <Card key={group.id} className="overflow-hidden">
            <div className="h-3" style={{ backgroundColor: group.color || '#E5E7EB' }} />
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{group.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">Hasło: {group.password}</p>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/admin/groups/${group.slug}/edit`}>
                    <Pencil className="w-4 h-4" />
                  </Link>
                </Button>
                <GroupDeleteButton slug={group.slug} />
              </div>

              {group.teacher_name && (
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Users className="w-4 h-4" />
                    <span className="font-medium">{group.teacher_name}</span>
                  </div>
                  {group.email && <p className="text-gray-600 ml-6">{group.email}</p>}
                  {group.phone && <p className="text-gray-600 ml-6">{group.phone}</p>}
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-600">
                Ostatnia aktualizacja: {group.updated_at ? new Date(group.updated_at).toLocaleDateString("pl-PL") : ''}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
