import type React from "react"
import AdminSidebar from "@/components/admin/admin-sidebar"
import AdminHeader from "@/components/admin/admin-header"
import { getSession } from "@/lib/auth"
import RouteTransition from "@/components/admin/route-transition"
import TopProgress from "@/components/admin/top-progress"
import { Toaster } from "@/components/ui/sonner"
// import { redirect } from "next/navigation"
export const dynamic = "force-dynamic"

export const metadata = {
  robots: { index: false, follow: false },
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()

  

  const isAuthed = !!session?.user

  return (
    <div className="min-h-screen bg-gray-50">
      {isAuthed ? (
        <>
          <TopProgress />
          <Toaster richColors closeButton position="top-right" />
          <AdminSidebar />
          <div className="lg:pl-64">
            <AdminHeader user={session!.user} />
            <main className="p-6 lg:p-8"><RouteTransition>{children}</RouteTransition></main>
          </div>
        </>
      ) : (
        <main className="p-6 lg:p-8">
          <Toaster richColors closeButton position="top-right" />
          <RouteTransition>{children}</RouteTransition>
        </main>
      )}
    </div>
  )
}
