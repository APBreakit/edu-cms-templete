"use client"

import { ArrowLeft, Shield, FileText, Users, Lock, Eye, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import Navigation from "@/components/navigation"
import { Footer } from "@/components/footer"

export default function RodoClausesPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <Navigation />

      <main className="container mx-auto px-4 py-24 max-w-4xl">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[#2f67ab] hover:text-[#6fc0e8] transition-colors mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold">Powrót do strony głównej</span>
        </Link>

        {/* Header */}
        <div className="text-center mb-16 space-y-4 opacity-0 animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full gradient-1 mb-4">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-[#443b32]">Klauzury Informacyjne RODO</h1>
          <p className="text-lg text-[#443b32]/70">
            Informacje o przetwarzaniu danych osobowych w Placówce Edukacyjnej EduCMS
          </p>
        </div>

        {/* Content */}
        <div className="space-y-12 opacity-0 animate-fade-in-up animation-delay-200">
          {/* Clause 1 - For Parents/Guardians */}
          <section className="bg-white/50 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl gradient-1 flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-[#443b32] mb-4">
                  Klauzula informacyjna dla rodziców/opiekunów prawnych
                </h2>

                <div className="space-y-4 text-[#443b32]/80">
                  <div>
                    <h3 className="font-bold text-[#443b32] mb-2">Administrator danych osobowych:</h3>
                    <p className="leading-relaxed">
                      Placówka Edukacyjna przy Parafii NMP w Mieście
                      <br />
                      ul. Edukacyjna 1, 00-000 Miasto, 00-000 Miasto
                      <br />
                      tel. (58) 661 94 47, fax. (58) 661 94 46
                      <br />
                      e-mail: kontakt@educms-szablon.pl
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-[#443b32] mb-2">Cel przetwarzania danych:</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-[#2f67ab] mt-0.5 flex-shrink-0" />
                        <span>Realizacja procesu rekrutacji do przedszkola</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-[#2f67ab] mt-0.5 flex-shrink-0" />
                        <span>Prowadzenie dokumentacji związanej z pobytem dziecka w przedszkolu</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-[#2f67ab] mt-0.5 flex-shrink-0" />
                        <span>Kontakt z rodzicami/opiekunami prawnymi</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-[#2f67ab] mt-0.5 flex-shrink-0" />
                        <span>Realizacja obowiązków wynikających z przepisów prawa</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-bold text-[#443b32] mb-2">Podstawa prawna:</h3>
                    <p className="leading-relaxed">
                      Art. 6 ust. 1 lit. c RODO - przetwarzanie jest niezbędne do wypełnienia obowiązku prawnego
                      ciążącego na administratorze (Ustawa o systemie oświaty, przepisy o dokumentacji przebiegu
                      nauczania)
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-[#443b32] mb-2">Odbiorcy danych:</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#2f67ab] mt-2 flex-shrink-0"></span>
                        <span>Organy prowadzące i nadzorujące przedszkole</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#2f67ab] mt-2 flex-shrink-0"></span>
                        <span>Podmioty świadczące usługi na rzecz przedszkola (np. catering, ubezpieczenia)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#2f67ab] mt-2 flex-shrink-0"></span>
                        <span>Organy uprawnione na podstawie przepisów prawa</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-bold text-[#443b32] mb-2">Okres przechowywania danych:</h3>
                    <p className="leading-relaxed">
                      Dane będą przechowywane przez okres wymagany przepisami prawa, zgodnie z instrukcją kancelaryjną
                      (zazwyczaj 5 lat po zakończeniu nauki w przedszkolu).
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-[#443b32] mb-2">Prawa osób, których dane dotyczą:</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <Eye className="w-5 h-5 text-[#6fc0e8] mt-0.5 flex-shrink-0" />
                        <span>Prawo dostępu do swoich danych osobowych</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Eye className="w-5 h-5 text-[#6fc0e8] mt-0.5 flex-shrink-0" />
                        <span>Prawo do sprostowania danych</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Eye className="w-5 h-5 text-[#6fc0e8] mt-0.5 flex-shrink-0" />
                        <span>Prawo do ograniczenia przetwarzania</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Eye className="w-5 h-5 text-[#6fc0e8] mt-0.5 flex-shrink-0" />
                        <span>Prawo do wniesienia skargi do Prezesa UODO</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-[#f2c91f]/10 rounded-2xl p-4 border-l-4 border-[#f2c91f]">
                    <p className="text-sm leading-relaxed">
                      <strong>Informacja:</strong> Podanie danych osobowych jest wymogiem ustawowym. Konsekwencją
                      niepodania danych będzie brak możliwości przyjęcia dziecka do przedszkola.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Clause 2 - For Image Publication */}
          <section className="bg-white/50 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl gradient-2 flex items-center justify-center flex-shrink-0">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-[#443b32] mb-4">
                  Klauzula informacyjna dotycząca przetwarzania wizerunku
                </h2>

                <div className="space-y-4 text-[#443b32]/80">
                  <div>
                    <h3 className="font-bold text-[#443b32] mb-2">Cel przetwarzania:</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-[#2f67ab] mt-0.5 flex-shrink-0" />
                        <span>Dokumentowanie działalności przedszkola</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-[#2f67ab] mt-0.5 flex-shrink-0" />
                        <span>
                          Promocja przedszkola (strona internetowa, media społecznościowe, materiały promocyjne)
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-[#2f67ab] mt-0.5 flex-shrink-0" />
                        <span>Prezentacja osiągnięć dzieci i wydarzeń przedszkolnych</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-bold text-[#443b32] mb-2">Podstawa prawna:</h3>
                    <p className="leading-relaxed">
                      Art. 6 ust. 1 lit. a RODO - zgoda osoby, której dane dotyczą (rodzica/opiekuna prawnego dziecka)
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-[#443b32] mb-2">Okres przechowywania:</h3>
                    <p className="leading-relaxed">
                      Wizerunek będzie przetwarzany do momentu cofnięcia zgody lub przez okres niezbędny do realizacji
                      celów, dla których został zebrany.
                    </p>
                  </div>

                  <div className="bg-[#6fc0e8]/10 rounded-2xl p-4 border-l-4 border-[#6fc0e8]">
                    <p className="text-sm leading-relaxed">
                      <strong>Ważne:</strong> Zgoda na przetwarzanie wizerunku jest dobrowolna i może zostać cofnięta w
                      każdym czasie. Cofnięcie zgody nie wpływa na zgodność z prawem przetwarzania, którego dokonano
                      przed jej cofnięciem.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Clause 3 - For Employees */}
          <section className="bg-white/50 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl gradient-3 flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-[#2f67ab]" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-[#443b32] mb-4">Klauzula informacyjna dla pracowników</h2>

                <div className="space-y-4 text-[#443b32]/80">
                  <div>
                    <h3 className="font-bold text-[#443b32] mb-2">Cel przetwarzania danych:</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-[#2f67ab] mt-0.5 flex-shrink-0" />
                        <span>Realizacja procesu rekrutacji</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-[#2f67ab] mt-0.5 flex-shrink-0" />
                        <span>Nawiązanie i realizacja stosunku pracy</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-[#2f67ab] mt-0.5 flex-shrink-0" />
                        <span>Wypełnienie obowiązków wynikających z przepisów prawa pracy</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-[#2f67ab] mt-0.5 flex-shrink-0" />
                        <span>Realizacja uprawnień pracowniczych</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-bold text-[#443b32] mb-2">Podstawa prawna:</h3>
                    <p className="leading-relaxed">
                      Art. 6 ust. 1 lit. c RODO w zw. z Kodeksem pracy oraz innymi przepisami prawa pracy
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-[#443b32] mb-2">Okres przechowywania:</h3>
                    <p className="leading-relaxed">
                      Dane będą przechowywane przez okres zatrudnienia oraz przez okres wymagany przepisami prawa po
                      zakończeniu zatrudnienia (zazwyczaj 10 lat dla akt osobowych, 50 lat dla dokumentacji
                      emerytalnej).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Clause 4 - For Website Visitors */}
          <section className="bg-white/50 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl gradient-4 flex items-center justify-center flex-shrink-0">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-[#443b32] mb-4">
                  Klauzula informacyjna dla użytkowników strony internetowej
                </h2>

                <div className="space-y-4 text-[#443b32]/80">
                  <div>
                    <h3 className="font-bold text-[#443b32] mb-2">Cel przetwarzania danych:</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-[#2f67ab] mt-0.5 flex-shrink-0" />
                        <span>Obsługa formularza kontaktowego</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-[#2f67ab] mt-0.5 flex-shrink-0" />
                        <span>Odpowiedź na zapytania przesłane przez formularz</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-[#2f67ab] mt-0.5 flex-shrink-0" />
                        <span>Analiza ruchu na stronie (pliki cookie)</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-bold text-[#443b32] mb-2">Podstawa prawna:</h3>
                    <p className="leading-relaxed">
                      Art. 6 ust. 1 lit. f RODO - prawnie uzasadniony interes administratora (kontakt z osobami
                      zainteresowanymi ofertą przedszkola)
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-[#443b32] mb-2">Okres przechowywania:</h3>
                    <p className="leading-relaxed">
                      Dane będą przechowywane przez okres niezbędny do realizacji celu, dla którego zostały zebrane, nie
                      dłużej niż przez 12 miesięcy od ostatniego kontaktu.
                    </p>
                  </div>

                  <div className="bg-[#2f67ab]/10 rounded-2xl p-4 border-l-4 border-[#2f67ab]">
                    <p className="text-sm leading-relaxed">
                      <strong>Informacja:</strong> Podanie danych w formularzu kontaktowym jest dobrowolne, ale
                      niezbędne do udzielenia odpowiedzi na zapytanie.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Box */}
          <div className="bg-gradient-to-br from-[#2f67ab] to-[#6fc0e8] rounded-3xl p-6 sm:p-8 text-white">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-8 h-8 flex-shrink-0" />
              <div>
                <h3 className="text-2xl font-bold mb-4">Pytania dotyczące przetwarzania danych osobowych?</h3>
                <p className="mb-6 opacity-90 leading-relaxed">
                  W sprawach związanych z ochroną danych osobowych prosimy o kontakt z sekretariatem przedszkola.
                </p>
                <div className="space-y-2 opacity-90">
                  <p>
                    <strong>Adres:</strong> ul. Edukacyjna 1, 00-000 Miasto, 00-000 Miasto
                  </p>
                  <p>
                    <strong>Telefon:</strong> (58) 661 94 47
                  </p>
                  <p>
                    <strong>Email:</strong> kontakt@educms-szablon.pl
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
