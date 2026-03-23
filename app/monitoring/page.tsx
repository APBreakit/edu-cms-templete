"use client"

import Navigation from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Shield, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function MonitoringPage() {
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
          <h1 className="text-3xl sm:text-4xl font-bold text-[#443b32]">Klauzula informacyjna – monitoring</h1>
          <p className="text-[#443b32]/70">Informacje o przetwarzaniu danych w związku ze stosowaniem monitoringu wizyjnego</p>
        </div>

        <div className="space-y-6 bg-white/70 rounded-3xl p-6 sm:p-8 text-[#443b32]">
          <p>
            Zgodnie z art. 13 ust. 1 i 2 Rozporządzenia Parlamentu Europejskiego i Rady (UE) 2016/679 z dnia 27 kwietnia 2016 r. w sprawie ochrony osób fizycznych w związku z przetwarzaniem danych osobowych i w sprawie swobodnego przepływu takich danych oraz uchylenia dyrektywy 95/46/WE (ogólne rozporządzenia o ochronie danych) (Dz.Urz.EU.L Nr 119, str.1), (RODO) Administrator Danych przekazuje następującą informację:
          </p>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Administrator danych</h2>
            <p>
              Administratorem przetwarzanych danych osobowych jest Placówka Edukacyjna przy Parafii NMP w Mieście z siedzibą: ul. Edukacyjna 1, 00-000 Miasto, 00-000 Miasto, tel. 690-471-187, reprezentowanym przez Dyrektora placówki s. Beatrycze Żmuda.
            </p>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Inspektor Ochrony Danych</h2>
            <p>Funkcję Inspektora Ochrony Danych pełni s. Monika Knaak, kontakt: rodo.csfn@gmail.com.</p>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Cel przetwarzania</h2>
            <p>Wizerunek przetwarzany jest w związku ze stosowaniem monitoringu wizyjnego na terenie placówki w celu zapewnienia bezpieczeństwa na terenie i wokół placówki.</p>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Podstawa prawna</h2>
            <p>Dane osobowe będą przetwarzane na podstawie prawnie uzasadnionego interesu Administratora, art. 108a ustawy Prawo oświatowe (Dz.U.2018.0.996 t.j. – Ustawa z dnia 14 grudnia 2016 r. – Prawo oświatowe).</p>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Odbiorcy danych</h2>
            <p>Odbiorcą danych osobowych mogą być podmioty dostarczające i utrzymujące infrastrukturę IT Administratora, a także świadczące usługi ochroniarskie.</p>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Okres przechowywania</h2>
            <p>Dane osobowe będą przechowywane przez okres 24 dni.</p>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Prawa osób, których dane dotyczą</h2>
            <p>Każdy ma prawo dostępu do swoich danych osobowych oraz możliwość ich sprostowania, usunięcia lub ograniczenia przetwarzania oraz prawo wniesienia sprzeciwu wobec przetwarzania.</p>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Skarga do organu nadzorczego</h2>
            <p>Każdy ma prawo do wniesienia skargi do organu nadzorczego: Biuro Prezesa Urzędu Ochrony Danych Osobowych, ul. Stawki 2, 00-193 Warszawa.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

