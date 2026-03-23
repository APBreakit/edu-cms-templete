import LoginClient from "./LoginClient"
import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
export const dynamic = "force-dynamic"

export default async function AdminLoginPage() {
  const session = await getSession()
  if (session?.user) redirect('/admin')
  return <LoginClient />
}
