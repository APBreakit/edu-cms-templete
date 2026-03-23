import { FileText, Shield, Users, BookOpen, ExternalLink, ArrowLeft, Mail } from "lucide-react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export default function BIPPage() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-[#fcfaf8] text-[#443b32]">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#fcfaf8] via-[#fcfaf8] to-[#6fc0e8]/10" />
        <div className="absolute top-20 right-20 w-96 h-96 bg-[#6fc0e8]/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-[#f2c91f]/10 rounded-full blur-3xl animate-float animation-delay-400" />
      </div>

      {/* Navigation Component */}
      <Navigation />

      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Back Button */}
        

        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-16 opacity-0 animate-fade-in-up">
          <h1 className="font-serif text-[#443b32] leading-tight text-3xl sm:text-5xl">
            Biuletyn Informacji Publicznej
          </h1>
          <p className="text-[#443b32]/70 text-lg sm:text-xl leading-relaxed">Oficjalne dokumenty i informacje o przedszkolu</p>
        </div>

        {/* BIP Content */}
        <div className="grid md:grid-cols-2 gap-8 mb-24">
          {/* BIP Category 1 */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 space-y-6 transition-all hover:shadow-xl opacity-0 animate-slide-in-up animation-delay-200">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl gradient-1 flex items-center justify-center">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h2 className="font-serif text-2xl text-[#443b32]">Dokumenty Organizacyjne</h2>
            </div>
            <div className="space-y-3">
              <a
                href="#"
                className="flex items-center justify-between p-4 rounded-xl border border-[#443b32]/10 hover:border-[#2f67ab] hover:bg-[#2f67ab]/5 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-[#2f67ab]" />
                  <span className="text-[#443b32]">Statut Przedszkola</span>
                </div>
                <ExternalLink className="w-5 h-5 text-[#443b32]/40 group-hover:text-[#2f67ab] transition-colors" />
              </a>
              <a
                href="#"
                className="flex items-center justify-between p-4 rounded-xl border border-[#443b32]/10 hover:border-[#2f67ab] hover:bg-[#2f67ab]/5 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-[#2f67ab]" />
                  <span className="text-[#443b32]">Regulamin Przedszkola</span>
                </div>
                <ExternalLink className="w-5 h-5 text-[#443b32]/40 group-hover:text-[#2f67ab] transition-colors" />
              </a>
              <a
                href="#"
                className="flex items-center justify-between p-4 rounded-xl border border-[#443b32]/10 hover:border-[#2f67ab] hover:bg-[#2f67ab]/5 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-[#2f67ab]" />
                  <span className="text-[#443b32]">Standardy Ochrony Małoletnich</span>
                </div>
                <ExternalLink className="w-5 h-5 text-[#443b32]/40 group-hover:text-[#2f67ab] transition-colors" />
              </a>
            </div>
          </div>

          {/* BIP Category 2 */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 space-y-6 transition-all hover:shadow-xl opacity-0 animate-slide-in-up animation-delay-400">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl gradient-4 flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h2 className="font-serif text-2xl text-[#443b32]">Ochrona Danych</h2>
            </div>
            <div className="space-y-3">
              <a
                href="/polityka-prywatnosci"
                className="flex items-center justify-between p-4 rounded-xl border border-[#443b32]/10 hover:border-[#2f67ab] hover:bg-[#2f67ab]/5 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-[#2f67ab]" />
                  <span className="text-[#443b32]">Polityka Prywatności</span>
                </div>
                <ExternalLink className="w-5 h-5 text-[#443b32]/40 group-hover:text-[#2f67ab] transition-colors" />
              </a>
              <a
                href="/klauzury-rodo"
                className="flex items-center justify-between p-4 rounded-xl border border-[#443b32]/10 hover:border-[#2f67ab] hover:bg-[#2f67ab]/5 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-[#2f67ab]" />
                  <span className="text-[#443b32]">Klauzula RODO</span>
                </div>
                <ExternalLink className="w-5 h-5 text-[#443b32]/40 group-hover:text-[#2f67ab] transition-colors" />
              </a>
              <a
                href="/polityka-cookie"
                className="flex items-center justify-between p-4 rounded-xl border border-[#443b32]/10 hover:border-[#2f67ab] hover:bg-[#2f67ab]/5 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-[#2f67ab]" />
                  <span className="text-[#443b32]">Polityka Cookie</span>
                </div>
                <ExternalLink className="w-5 h-5 text-[#443b32]/40 group-hover:text-[#2f67ab] transition-colors" />
              </a>
              
              <a
                href="/monitoring"
                className="flex items-center justify-between p-4 rounded-xl border border-[#443b32]/10 hover:border-[#2f67ab] hover:bg-[#2f67ab]/5 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-[#2f67ab]" />
                  <span className="text-[#443b32]">Monitoring</span>
                </div>
                <ExternalLink className="w-5 h-5 text-[#443b32]/40 group-hover:text-[#2f67ab] transition-colors" />
              </a>
            </div>
          </div>

          {/* BIP Category 3 */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 space-y-6 transition-all hover:shadow-xl opacity-0 animate-slide-in-up animation-delay-600">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl gradient-3 flex items-center justify-center">
                <Users className="w-8 h-8 text-[#2f67ab]" />
              </div>
              <h2 className="font-serif text-2xl text-[#443b32]">Kadra i Struktura</h2>
            </div>
            <div className="space-y-3">
              <a
                href="/o-nas#zespol-wspierajacy"
                className="flex items-center justify-between p-4 rounded-xl border border-[#443b32]/10 hover:border-[#2f67ab] hover:bg-[#2f67ab]/5 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-[#2f67ab]" />
                  <span className="text-[#443b32]">Zespół wspierający</span>
                </div>
                <ExternalLink className="w-5 h-5 text-[#443b32]/40 group-hover:text-[#2f67ab] transition-colors" />
              </a>
              <a
                href="/o-nas#grono-pedagogiczne"
                className="flex items-center justify-between p-4 rounded-xl border border-[#443b32]/10 hover:border-[#2f67ab] hover:bg-[#2f67ab]/5 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-[#2f67ab]" />
                  <span className="text-[#443b32]">Grono pedagogiczne i obsługa</span>
                </div>
                <ExternalLink className="w-5 h-5 text-[#443b32]/40 group-hover:text-[#2f67ab] transition-colors" />
              </a>
              <a
                href="/o-nas#grono-pedagogiczne"
                className="flex items-center justify-between p-4 rounded-xl border border-[#443b32]/10 hover:border-[#2f67ab] hover:bg-[#2f67ab]/5 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-[#2f67ab]" />
                  <span className="text-[#443b32]">Rada Rodziców</span>
                </div>
                <ExternalLink className="w-5 h-5 text-[#443b32]/40 group-hover:text-[#2f67ab] transition-colors" />
              </a>
            </div>
          </div>

          {/* BIP Category 4 */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 space-y-6 transition-all hover:shadow-xl opacity-0 animate-slide-in-up animation-delay-800">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl gradient-2 flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h2 className="font-serif text-2xl text-[#443b32]">Rekrutacja</h2>
            </div>
            <div className="space-y-3">
              <a
                href="/rekrutacja"
                className="flex items-center justify-between p-4 rounded-xl border border-[#443b32]/10 hover:border-[#2f67ab] hover:bg-[#2f67ab]/5 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-[#2f67ab]" />
                  <span className="text-[#443b32]">Zasady Rekrutacji</span>
                </div>
                <ExternalLink className="w-5 h-5 text-[#443b32]/40 group-hover:text-[#2f67ab] transition-colors" />
              </a>
              <a
                href="/rekrutacja#harmonogram"
                className="flex items-center justify-between p-4 rounded-xl border border-[#443b32]/10 hover:border-[#2f67ab] hover:bg-[#2f67ab]/5 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-[#2f67ab]" />
                  <span className="text-[#443b32]">Harmonogram Rekrutacji</span>
                </div>
                <ExternalLink className="w-5 h-5 text-[#443b32]/40 group-hover:text-[#2f67ab] transition-colors" />
              </a>
              <a
                href="#"
                className="flex items-center justify-between p-4 rounded-xl border border-[#443b32]/10 hover:border-[#2f67ab] hover:bg-[#2f67ab]/5 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-[#2f67ab]" />
                  <span className="text-[#443b32]">Oświadczenie o wielodzietności</span>
                </div>
                <ExternalLink className="w-5 h-5 text-[#443b32]/40 group-hover:text-[#2f67ab] transition-colors" />
              </a>
              <a
                href="#"
                className="flex items-center justify-between p-4 rounded-xl border border-[#443b32]/10 hover:border-[#2f67ab] hover:bg-[#2f67ab]/5 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-[#2f67ab]" />
                  <span className="text-[#443b32]">Wniosek o przyjęcie dziecka</span>
                </div>
                <ExternalLink className="w-5 h-5 text-[#443b32]/40 group-hover:text-[#2f67ab] transition-colors" />
              </a>
              <a
                href="#"
                className="flex items-center justify-between p-4 rounded-xl border border-[#443b32]/10 hover:border-[#2f67ab] hover:bg-[#2f67ab]/5 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-[#2f67ab]" />
                  <span className="text-[#443b32]">Oświadczenie o samotnym wychowywaniu</span>
                </div>
                <ExternalLink className="w-5 h-5 text-[#443b32]/40 group-hover:text-[#2f67ab] transition-colors" />
              </a>
              <a
                href="#"
                className="flex items-center justify-between p-4 rounded-xl border border-[#443b32]/10 hover:border-[#2f67ab] hover:bg-[#2f67ab]/5 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-[#2f67ab]" />
                  <span className="text-[#443b32]">Oświadczenie o zatrudnieniu rodziców</span>
                </div>
                <ExternalLink className="w-5 h-5 text-[#443b32]/40 group-hover:text-[#2f67ab] transition-colors" />
              </a>
            </div>
          </div>

          {/* BIP Category 5 */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 space-y-6 transition-all hover:shadow-xl opacity-0 animate-slide-in-up animation-delay-1000">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl gradient-1 flex items-center justify-center">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h2 className="font-serif text-2xl text-[#443b32]">Kontakt</h2>
            </div>
            <div className="space-y-3">
              <a
                href="mailto:kontakt@educms-szablon.pl"
                className="flex items-center justify-between p-4 rounded-xl border border-[#443b32]/10 hover:border-[#2f67ab] hover:bg-[#2f67ab]/5 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#2f67ab]" />
                  <span className="text-[#443b32]">Sekretariat</span>
                </div>
                <ExternalLink className="w-5 h-5 text-[#443b32]/40 group-hover:text-[#2f67ab] transition-colors" />
              </a>
              <a
                href="mailto:dyrektor@educms-szablon.pl"
                className="flex items-center justify-between p-4 rounded-xl border border-[#443b32]/10 hover:border-[#2f67ab] hover:bg-[#2f67ab]/5 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#2f67ab]" />
                  <span className="text-[#443b32]">Dyrektor</span>
                </div>
                <ExternalLink className="w-5 h-5 text-[#443b32]/40 group-hover:text-[#2f67ab] transition-colors" />
              </a>
              <a
                href="mailto:ksiegowosc@educms-szablon.pl"
                className="flex items-center justify-between p-4 rounded-xl border border-[#443b32]/10 hover:border-[#2f67ab] hover:bg-[#2f67ab]/5 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#2f67ab]" />
                  <span className="text-[#443b32]">Księgowość</span>
                </div>
                <ExternalLink className="w-5 h-5 text-[#443b32]/40 group-hover:text-[#2f67ab] transition-colors" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Component */}
      <Footer />
    </main>
  )
}
