"use client"

import { Menu } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

interface User {
  email: string
}

export default function AdminHeader({ user }: { user: User | undefined }) {
  if (!user) {
    console.error("[v0] AdminHeader rendered without user prop")
    return null
  }

  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4 relative">
        <button className="lg:hidden p-2 rounded-lg hover:bg-gray-100" onClick={() => {
          try { window.dispatchEvent(new Event('toggle-admin-sidebar')) } catch {}
        }}>
          <Menu className="w-6 h-6" />
        </button>

        <div className="flex-1" />

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">{user.email}</div>
              <div className="text-xs text-gray-600">Administrator</div>
            </div>
            <button className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center" onClick={() => setOpen(!open)}>
              <span className="text-white font-medium text-sm">{user.email[0]?.toUpperCase() || "?"}</span>
            </button>
          </div>
          {open && (
            <div className="absolute right-6 top-16 bg-white border rounded shadow-md w-48">
              <Link href="/admin/account" className="block px-3 py-2 hover:bg-gray-50 text-sm">Zmień hasło</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
