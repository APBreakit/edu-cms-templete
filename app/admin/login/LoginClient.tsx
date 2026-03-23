"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Lock, Mail } from "lucide-react"
import Image from "next/image"

export default function LoginClient() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [honeypot, setHoneypot] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [num1, setNum1] = useState(0)
  const [num2, setNum2] = useState(0)
  const [captcha, setCaptcha] = useState("")
  const [startTime, setStartTime] = useState<number>(0)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (honeypot) {
      return
    }

    setIsLoading(true)
    setError(null)

    const expected = num1 + num2
    if (Number.parseInt(captcha) !== expected) {
      setError("Nieprawidłowa odpowiedź na pytanie weryfikacyjne")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, captcha: Number.parseInt(captcha), num1, num2, form_time: Date.now() - startTime }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Nieprawidłowy email lub hasło")
      } else {
        router.replace("/admin")
        router.refresh()
      }
    } catch (error) {
      setError("Wystąpił błąd podczas logowania")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const a = Math.floor(Math.random() * 9) + 1
    const b = Math.floor(Math.random() * 9) + 1
    setNum1(a)
    setNum2(b)
    setStartTime(Date.now())
  }, [])

  useEffect(() => {
    fetch('/api/auth/session')
      .then((r) => r.json())
      .then((d) => {
        if (d.user) {
          router.replace('/admin')
          router.refresh()
        }
      })
      .catch(() => {})
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 sm:p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Image src="/logo.jpg" alt="Logo EduCMS" width={120} height={120} className="rounded-lg" priority />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel Administracyjny</h1>
          <p className="text-gray-600">EduCMS</p>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">Logowanie</CardTitle>
            <CardDescription>Zaloguj się do panelu administracyjnego</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="flex flex-col gap-6">
                <div className="hidden" aria-hidden="true">
                  <Label htmlFor="website">Website (nie wypełniaj tego pola)</Label>
                  <Input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input id="email" type="email" placeholder="admin@educms-szablon.pl" required value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="password">Hasło</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input id="password" type="password" placeholder="••••••••" required value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10" />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="captcha">Weryfikacja: Ile to {num1} + {num2}?</Label>
                  <Input id="captcha" type="number" required value={captcha} onChange={(e) => setCaptcha(e.target.value)} placeholder="Twoja odpowiedź" />
                </div>
                {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}
                <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? "Logowanie..." : "Zaloguj się"}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

