import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export default function AdaptacjaPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-[#f8f9fa] text-[#443b32]">
      <Navigation />
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold">Poradnik dla rodziców</h1>
            <p className="text-lg text-[#443b32]/70">Adaptacja dziecka w przedszkolu</p>
          </div>

          <div className="max-w-4xl mx-auto mt-10 space-y-10">
            <div className="space-y-4">
              <h2 className="font-serif text-2xl md:text-3xl">Wspierający przewodnik na początek przedszkolnej drogi</h2>
              <p className="leading-relaxed">
                Rozpoczęcie edukacji przedszkolnej to ważny moment w życiu dziecka i całej rodziny. To czas nauki samodzielności, budowania relacji oraz stopniowego odkrywania świata poza domem rodzinnym. Adaptacja to proces, który wymaga cierpliwości, spokoju serca i wzajemnego zaufania. W duchu wychowania chrześcijańskiego chcemy towarzyszyć Państwu i dzieciom w tym etapie, opierając go na miłości, poczuciu bezpieczeństwa i wartościach płynących z wiary katolickiej.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="font-serif text-2xl">Czym jest adaptacja?</h2>
              <p className="leading-relaxed">
                Adaptacja to proces przystosowania dziecka do nowego środowiska – przedszkola, zasad i relacji z innymi dziećmi oraz nauczycielami. Dla wielu dzieci wiąże się to z silnymi emocjami: smutkiem, lękiem, niepewnością. Są to reakcje naturalne, które z czasem ustępują, gdy dziecko czuje się bezpieczne i akceptowane.
              </p>
              <p className="leading-relaxed">Nie mierzymy sukcesu adaptacji ilością dni bez płaczu, lecz budowaniem relacji, wzrostem zaufania i spokojem wewnętrznym dziecka.</p>
            </div>

            <div className="space-y-4">
              <h2 className="font-serif text-2xl">Rola rodziców w procesie adaptacji</h2>
              <p className="leading-relaxed">Najważniejszym zadaniem rodzica jest upewnienie dziecka, że jego uczucia są ważne i że zawsze może liczyć na wsparcie, zrozumienie oraz miłość.</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>okazywać spokój i zaufanie do przedszkola,</li>
                <li>mówić prawdę o rozstaniu i powrocie,</li>
                <li>podkreślać, że przedszkole to miejsce bezpieczne i dobre,</li>
                <li>wspierać dziecko modlitwą i zawierzyć je opiece Pana Boga.</li>
              </ul>
              <p className="leading-relaxed">Warto rozpocząć dzień od znaku krzyża i krótkiej modlitwy, powierzając dziecko Bożej Opatrzności.</p>
            </div>

            <div className="space-y-4">
              <h2 className="font-serif text-2xl">Jak przygotować dziecko do przedszkola?</h2>
              <ul className="list-disc ml-6 space-y-2">
                <li>oswajaj dziecko z miejscem przedszkola poprzez spacery i rozmowy,</li>
                <li>opowiadaj spokojnie, co je czeka,</li>
                <li>pozwól dziecku samodzielnie wybierać niektóre elementy wyprawki,</li>
                <li>ćwicz samodzielność: ubieranie się, jedzenie, korzystanie z toalety,</li>
                <li>buduj w dziecku poczucie, że jest kochane i ważne.</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="font-serif text-2xl">W czasie rozstania</h2>
              <ul className="list-disc ml-6 space-y-2">
                <li>pożegnanie powinno być krótkie, czułe i spokojne,</li>
                <li>nie przedłużaj momentu rozstania,</li>
                <li>nie wychodź bez pożegnania,</li>
                <li>przypomnij dziecku, kiedy wrócisz (np. po obiedzie),</li>
                <li>zapewnij, że Pan Bóg i pani nauczycielka czuwają nad nim.</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="font-serif text-2xl">Możliwe reakcje dziecka</h2>
              <p className="leading-relaxed">W czasie adaptacji mogą pojawić się:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>płacz i zmienność nastroju,</li>
                <li>rozdrażnienie,</li>
                <li>zmęczenie,</li>
                <li>zwiększona potrzeba bliskości,</li>
                <li>cofnięcie do wcześniejszych zachowań.</li>
              </ul>
              <p className="leading-relaxed">Są to naturalne objawy stresu. Potrzeba wówczas cierpliwości, przytulenia i spokojnej obecności.</p>
            </div>

            <div className="space-y-4">
              <h2 className="font-serif text-2xl">Po powrocie do domu</h2>
              <ul className="list-disc ml-6 space-y-2">
                <li>daj dziecku czas na wyciszenie,</li>
                <li>nie zasypuj go wieloma pytaniami,</li>
                <li>okaż zainteresowanie i zrozumienie,</li>
                <li>wprowadź spokojny rytm wieczoru (kolacja, modlitwa, sen),</li>
                <li>stwórz atmosferę ciepła i bezpieczeństwa.</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="font-serif text-2xl">Adaptacja całej rodziny</h2>
              <p className="leading-relaxed">Przedszkole to także zmiana dla rodziców. Mogą pojawić się trudne emocje: tęsknota, niepokój, poczucie utraty. Są one naturalne i warto je przyjąć z akceptacją. To czas, w którym uczymy się nowego etapu rodzicielstwa – pełnego zaufania i powierzania dziecka Bogu.</p>
            </div>

            <div className="space-y-4">
              <h2 className="font-serif text-2xl">Pamiętajmy</h2>
              <ul className="list-disc ml-6 space-y-2">
                <li>każde dziecko przechodzi adaptację w swoim tempie,</li>
                <li>trudności są naturalną częścią rozwoju,</li>
                <li>relacja i miłość są fundamentem,</li>
                <li>modlitwa i postawa zaufania pomagają w chwilach niepokoju.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <blockquote className="italic text-[#2f67ab]">"Pozwólcie dzieciom przychodzić do Mnie i nie przeszkadzajcie im" (Mk 10,14)</blockquote>
              <p className="leading-relaxed">Niech czas adaptacji będzie początkiem pięknej, spokojnej i radosnej drogi wzrastania w miłości, wierze i wzajemnym zaufaniu.</p>
            </div>

            <div className="pt-6">
              <Link href="/">
                <span className="inline-block px-6 py-3 rounded-full bg-[#2f67ab] text-white">Powrót do strony głównej</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}

