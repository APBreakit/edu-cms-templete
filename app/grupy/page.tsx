import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Palette, Calendar, Users, Clock } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getGroupsPublic } from "@/app/actions/public-actions"

export const dynamic = "force-dynamic"

export default async function GrupyPage() {
  const groups = await getGroupsPublic()
  return (
    <main className="min-h-screen relative overflow-hidden bg-[#fcfaf8] text-[#443b32]">
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full gradient-3 blur-3xl animate-gradient" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full gradient-1 blur-3xl animate-gradient animation-delay-400" />
      </div>

      <Navigation />

      <div className="container mx-auto px-6 py-12 relative">
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-16 opacity-0 animate-fade-in-up">
          <h1 className="font-serif text-5xl text-[#443b32] leading-tight lg:text-5xl">Nasze Grupy</h1>
          <p className="text-[#443b32]/70 text-lg leading-relaxed">
            Osiem grup przedszkolnych, w których każde dziecko znajduje swoje miejsce. Kliknij w grupę, aby zobaczyć
            szczegółowe informacje dla rodziców.
          </p>
        </div>

        {/* Groups Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {groups.map((group: any, index: number) => (
            <Link
              key={group.slug}
              href={`/grupy/${group.slug}`}
              className={`bg-white rounded-3xl p-6 space-y-4 transition-all hover:shadow-xl hover:scale-[1.02] cursor-pointer border-2 opacity-0 animate-fade-in-up block border-[#e5dfd8]`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div
                className={`w-16 h-16 rounded-2xl ${String(group.color || '').includes('from-') ? `bg-gradient-to-br ${group.color}` : ''} flex items-center justify-center`}
                style={String(group.color || '').includes('from-') ? undefined : { background: group.color || '#3b82f6' }}
              >
                <Palette className="w-8 h-8 text-white" />
              </div>
              <div className="space-y-2">
                <h3 className="font-serif text-2xl text-[#443b32]">{group.name}</h3>
                <div className="space-y-1 text-sm text-[#443b32]/70">
                  <p className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    {group.teacher_name || ''}
                  </p>
                  <p className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Wiek: {group.age_group || ''}
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {group.hours || ''}
                  </p>
                </div>
                <p className="text-[#443b32]/70 text-sm leading-relaxed">{group.description || ''}</p>
              </div>
              <Button
                variant="outline"
                className="w-full border-[#443b32] text-[#443b32] hover:bg-[#443b32] hover:text-white"
              >
                Zobacz szczegóły
              </Button>
            </Link>
          ))}
        </div>

        {/* Additional Resources for Parents */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 space-y-8 opacity-0 animate-fade-in-up animation-delay-400">
          <h2 className="font-serif text-2xl sm:text-3xl text-[#443b32] text-center">Informacje dla Rodziców</h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-4 py-0 text-center">
              <div className="w-12 h-12 rounded-xl gradient-1 flex items-center justify-center text-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-xl text-[#443b32] text-center">Kalendarz</h3>
              <p className="text-[#443b32]/70 text-sm leading-relaxed">
                Ważne daty, wydarzenia przedszkolne i dni wolne od zajęć
              </p>
              <Button variant="outline" className="w-full bg-transparent">
                Zobacz kalendarz
              </Button>
            </div>

            <div className="space-y-4 text-center">
              <div className="w-12 h-12 rounded-xl gradient-2 flex items-center justify-center">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-xl text-[#443b32]">Dokumenty</h3>
              <p className="text-[#443b32]/70 text-sm leading-relaxed">
                Wszystkie niezbędne formularze, zgody i dokumenty dostępne do pobrania
              </p>
              <Button variant="outline" className="w-full bg-transparent">
                Zobacz dokumenty
              </Button>
            </div>

            <div className="space-y-4 text-center">
              <div className="w-12 h-12 rounded-xl gradient-3 flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-xl text-[#443b32]">Jadłospis</h3>
              <p className="text-[#443b32]/70 text-sm leading-relaxed">
                Tygodniowe menu z uwzględnieniem diet i alergi pokarmowych
              </p>
              <Button variant="outline" className="w-full bg-transparent">
                Zobacz jadłospis
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
