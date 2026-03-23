"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, FileText, Calendar, ImageIcon, Users, LogOut, UsersRound, Images, Utensils } from "lucide-react"
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useState, useEffect } from "react"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: Home },
  { name: "Posty", href: "/admin/posts", icon: FileText },
  { name: "Kalendarz", href: "/admin/calendar", icon: Calendar },
  { name: "Galerie", href: "/admin/galleries", icon: Images },
  { name: "Media", href: "/admin/media", icon: ImageIcon },
  { name: "Jadłospis", href: "/admin/meal-plan", icon: Utensils },
  { name: "Grupy", href: "/admin/groups", icon: Users },
  { name: "Rada Rodziców", href: "/admin/rada-rodzicow", icon: UsersRound },
  { name: "Użytkownicy", href: "/admin/users/new", icon: Users },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [role, setRole] = useState<string | null>(null)
  useEffect(() => {
    const onToggle = () => setOpen((v) => !v)
    const onClose = () => setOpen(false)
    window.addEventListener('toggle-admin-sidebar', onToggle as any)
    window.addEventListener('close-admin-sidebar', onClose as any)
    fetch('/api/auth/session').then(r=>r.json()).then((d)=>setRole(d.user?.role || null)).catch(()=>{})
    return () => {
      window.removeEventListener('toggle-admin-sidebar', onToggle as any)
      window.removeEventListener('close-admin-sidebar', onClose as any)
    }
  }, [])

  if (!pathname.startsWith('/admin')) return null

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch {}
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <>
      <div className="hidden lg:block fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-200">
            <Image
              src="/logo.jpg"
              alt="Logo EduCMS"
              width={48}
              height={48}
              className="rounded-lg"
            />
            <div>
              <div className="font-bold text-gray-900">EduCMS</div>
              <div className="text-xs text-gray-600">Panel CMS</div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
              if (item.name === 'Użytkownicy' && role !== 'superadmin') return null
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  prefetch
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Logout button */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-700 hover:bg-red-50 w-full transition-all duration-150 hover:scale-105"
            >
              <LogOut className="w-5 h-5" />
              Wyloguj się
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-64 bg-white border-r border-gray-200 shadow-xl animate-slide-in-right">
            <div className="flex flex-col h-full">
              <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-200">
                <Image src="/logo.jpg" alt="Logo EduCMS" width={40} height={40} className="rounded-lg" />
                <div>
                  <div className="font-semibold text-gray-900 text-sm">Panel CMS</div>
                </div>
              </div>
              <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                {navigation.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      prefetch
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                        isActive ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                      onClick={() => setOpen(false)}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.name}
                    </Link>
                  )
                })}
              </nav>
              <div className="p-4 border-t border-gray-200">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-700 hover:bg-red-50 w-full"
                >
                  <LogOut className="w-5 h-5" />
                  Wyloguj się
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
