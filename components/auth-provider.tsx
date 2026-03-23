"use client"

import type React from "react"

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
