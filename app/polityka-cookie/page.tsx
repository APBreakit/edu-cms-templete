"use client"

import Navigation from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Shield, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function PolitykaCookiePage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-[#fcfaf8]">
      <Navigation />
      <main className="container mx-auto px-4 py-24 max-w-4xl">
        <Link href="/" className="inline-flex items-center gap-2 text-[#2f67ab] hover:text-[#6fc0e8] transition-colors mb-8 group">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold">Powrót do strony głównej</span>
        </Link>
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full gradient-4">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#443b32]">Polityka Cookie</h1>
          <p className="text-[#443b32]/70">Informacje o plikach cookie używanych na stronie</p>
        </div>
        <div className="space-y-6 bg-white/60 rounded-3xl p-6 sm:p-8">
          <p className="text-[#443b32]/80">Dokument w przygotowaniu. Pliki cookie służą poprawie działania serwisu i analityce ruchu.</p>
        </div>
      </main>
      <Footer />
    </div>
  )
}

