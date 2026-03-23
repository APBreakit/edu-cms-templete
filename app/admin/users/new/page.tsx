import { getSession } from "@/lib/auth"
import AdminUserForm from "@/components/admin/admin-user-form"
import { redirect } from "next/navigation"
export const dynamic = "force-dynamic"

export default async function NewAdminUserPage() {
  const session = await getSession()
  if (!session || session.user.role !== 'superadmin') {
    redirect('/admin/login')
  }
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Nowy administrator</h1>
      <AdminUserForm />
    </div>
  )
}
