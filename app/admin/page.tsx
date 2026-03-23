import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Calendar, ImageIcon, Users, Newspaper, Megaphone, Trophy } from "lucide-react"
import Link from "next/link"
import { getAdminStats } from "@/app/actions/admin-actions"
import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
export const dynamic = "force-dynamic"

export default async function AdminDashboardPage() {
  const session = await getSession()
  if (!session || !session.user) redirect('/admin/login')
  const { postsCount, aktualnosciCount, ogloszeniaCount, konkursyCount, mediaCount, groupsCount } =
    await getAdminStats()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Panel Administracyjny</h1>
        <p className="text-gray-600 mt-2">Witaj w systemie zarządzania treścią Przedszkola Nazaret</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wszystkie posty</CardTitle>
            <FileText className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{postsCount}</div>
            <p className="text-xs text-gray-600 mt-1">Aktualności, ogłoszenia, konkursy</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktualności</CardTitle>
            <Newspaper className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{aktualnosciCount}</div>
            <p className="text-xs text-gray-600 mt-1">Opublikowane wiadomości</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ogłoszenia</CardTitle>
            <Megaphone className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ogloszeniaCount}</div>
            <p className="text-xs text-gray-600 mt-1">Ważne komunikaty</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Konkursy</CardTitle>
            <Trophy className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{konkursyCount}</div>
            <p className="text-xs text-gray-600 mt-1">Aktywne i zakończone</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pliki mediów</CardTitle>
            <ImageIcon className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mediaCount}</div>
            <p className="text-xs text-gray-600 mt-1">Zdjęcia i dokumenty</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Grupy</CardTitle>
            <Users className="h-4 w-4 text-pink-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{groupsCount}</div>
            <p className="text-xs text-gray-600 mt-1">Grupy przedszkolne</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Szybkie akcje</CardTitle>
          <CardDescription>Najczęściej używane funkcje</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/admin/posts/new"
              className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="font-medium">Nowy post</div>
                <div className="text-sm text-gray-600">Dodaj aktualność lub ogłoszenie</div>
              </div>
            </Link>

            <Link
              href="/admin/media"
              className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-green-500 hover:bg-green-50 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="font-medium">Dodaj media</div>
                <div className="text-sm text-gray-600">Wgraj zdjęcia lub dokumenty</div>
              </div>
            </Link>

            <Link
              href="/admin/calendar"
              className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="font-medium">Kalendarz</div>
                <div className="text-sm text-gray-600">Zarządzaj wydarzeniami</div>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
