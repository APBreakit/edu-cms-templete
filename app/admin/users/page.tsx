 

import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getAdminUsers, deleteAdminUser, getAdminPermissions, createAdminUser, setAdminPermissions } from "@/app/actions/admin-actions"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export const dynamic = "force-dynamic"

export default async function AdminUsersPage() {
  const session = await getSession()
  if (!session || session.user.role !== 'superadmin') redirect('/admin/login')
  const users = await getAdminUsers()
  const permsMap: Record<string, string[]> = {}
  for (const u of users as any[]) {
    permsMap[u.id] = await getAdminPermissions(u.id)
  }

  async function remove(formData: FormData) {
    "use server"
    const id = String(formData.get('id') || '')
    if (!id) return
    await deleteAdminUser(id)
  }

  async function changePassword(formData: FormData) {
    "use server"
    const id = String(formData.get('id') || '')
    const pw = String(formData.get('password') || '')
    if (!id || !pw) return
    const { updateAdminPassword } = await import('@/app/actions/admin-actions')
    await updateAdminPassword(id, pw)
  }

  async function changeRole(formData: FormData) {
    "use server"
    const id = String(formData.get('id') || '')
    const role = String(formData.get('role') || '') as 'admin' | 'superadmin'
    if (!id || !role) return
    const { updateAdminRole } = await import('@/app/actions/admin-actions')
    await updateAdminRole(id, role)
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navigation />
      <div className="container mx-auto px-6 py-12 max-w-4xl space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Administratorzy</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="border rounded p-4">
            <h3 className="text-lg font-semibold mb-3">Dodaj nowego administratora</h3>
            <form action={async (formData: FormData) => {
              "use server"
              const email = String(formData.get('email')||'')
              const name = String(formData.get('name')||'')
              const password = String(formData.get('password')||'')
              const sections = (formData.getAll('perm')||[]).map(String)
              if (!email || !password) return
              await createAdminUser({ email, password, name: name||null, permissions: sections })
            }} className="grid gap-2">
              <input name="email" placeholder="Email" className="border rounded px-3 py-2" />
              <input name="name" placeholder="Imię i nazwisko (opcjonalnie)" className="border rounded px-3 py-2" />
              <input name="password" placeholder="Hasło" className="border rounded px-3 py-2" />
              <div className="grid grid-cols-2 gap-2">
                {['posts','galleries','groups','calendar','media','rada_rodzicow'].map(s => (
                  <label key={s} className="flex items-center gap-2 text-sm"><input type="checkbox" name="perm" value={s} /> {s}</label>
                ))}
              </div>
              <button className="px-3 py-2 bg-primary text-white rounded">Dodaj</button>
            </form>
          </div>
        </div>

        <div className="space-y-2">
          {users?.map((u: any) => (
            <div key={u.id} className="flex items-center justify-between border rounded px-3 py-2">
              <div>
                <div className="font-medium">{u.email}{u.name ? ` — ${u.name}` : ''}</div>
                <div className="text-sm text-muted-foreground">Rola: {u.role} • Utworzony: {new Date(u.created_at).toLocaleDateString('pl-PL')}</div>
              </div>
              <div className="flex items-center gap-2">
                {session.user.role === 'superadmin' && (
                  <>
                    <form action={changeRole} className="flex items-center gap-2">
                      <input type="hidden" name="id" value={u.id} />
                      <select name="role" defaultValue={u.role} className="border rounded px-2 py-1 text-sm">
                        <option value="admin">admin</option>
                        <option value="superadmin">superadmin</option>
                      </select>
                      <button className="px-3 py-1 bg-primary text-white rounded">Zmień rolę</button>
                    </form>
                    <form action={changePassword} className="flex items-center gap-2">
                      <input type="hidden" name="id" value={u.id} />
                      <input name="password" placeholder="Nowe hasło" className="border rounded px-2 py-1 text-sm" />
                      <button className="px-3 py-1 bg-secondary text-white rounded">Zmień hasło</button>
                    </form>
                    <form action={async (formData: FormData) => {
                      "use server"
                      const id = String(formData.get('id')||'')
                      const sections = (formData.getAll('perm')||[]).map(String)
                      if (!id) return
                      await setAdminPermissions(id, sections)
                    }} className="flex items-center gap-2">
                      <input type="hidden" name="id" value={u.id} />
                      <div className="flex flex-wrap gap-2">
                        {['posts','galleries','groups','calendar','media','rada_rodzicow'].map(s => (
                          <label key={`${u.id}-${s}`} className="flex items-center gap-1 text-xs border rounded px-2 py-1">
                            <input type="checkbox" name="perm" value={s} defaultChecked={(permsMap[u.id]||[]).includes(s)} /> {s}
                          </label>
                        ))}
                      </div>
                      <button className="px-3 py-1 bg-blue-600 text-white rounded">Zapisz uprawnienia</button>
                    </form>
                    <form action={remove}>
                      <input type="hidden" name="id" value={u.id} />
                      <button className="px-3 py-1 bg-destructive text-white rounded">Usuń</button>
                    </form>
                  </>
                )}
              </div>
              <div className="text-xs text-muted-foreground">Uprawnienia: {(permsMap[u.id]||[]).join(', ') || 'brak'}</div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  )
}
