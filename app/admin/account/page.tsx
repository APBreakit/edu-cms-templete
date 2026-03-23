import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { updateOwnPassword } from "@/app/actions/admin-actions"

export const dynamic = "force-dynamic"

export default async function AccountPage({ searchParams }: { searchParams?: { success?: string; error?: string } }) {
  const session = await getSession()
  if (!session || !['admin','superadmin'].includes(session.user.role)) redirect('/admin/login')

  async function changeMyPassword(formData: FormData) {
    "use server"
    const current = String(formData.get('current') || '')
    const next = String(formData.get('next') || '')
    const confirm = String(formData.get('confirm') || '')
    if (!current || !next || !confirm) redirect('/admin/account?error=Brak danych')
    if (next !== confirm) redirect('/admin/account?error=Hasła się różnią')
    const res = await updateOwnPassword(current, next)
    if (res.success) redirect('/admin/account?success=1')
    redirect(`/admin/account?error=${encodeURIComponent(res.error || 'Błąd')}`)
  }

  return (
    <div className="max-w-md mx-auto bg-white border rounded p-6 space-y-4">
      <h1 className="text-xl font-bold">Konto administratora</h1>
      {searchParams?.success && (
        <div className="text-sm text-green-600">Hasło zostało zmienione.</div>
      )}
      {searchParams?.error && (
        <div className="text-sm text-red-600">{searchParams.error}</div>
      )}
      <form action={changeMyPassword} className="grid gap-3">
        <label className="grid gap-1">
          <span className="text-sm">Obecne hasło</span>
          <input name="current" type="password" className="border rounded px-3 py-2" />
        </label>
        <label className="grid gap-1">
          <span className="text-sm">Nowe hasło</span>
          <input name="next" type="password" className="border rounded px-3 py-2" />
        </label>
        <label className="grid gap-1">
          <span className="text-sm">Powtórz nowe hasło</span>
          <input name="confirm" type="password" className="border rounded px-3 py-2" />
        </label>
        <button className="px-3 py-2 bg-primary text-white rounded">Zmień hasło</button>
      </form>
    </div>
  )
}

