"use client"

import type React from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { MapPin, Phone, Mail, Clock, Send, Shield, Copy, Check } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect } from "react"

export default function KontaktPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    honeypot: "", // Hidden field for bots
    captcha: "",
  })
  const [formLoadTime, setFormLoadTime] = useState<number>(0)
  const [captchaQuestion, setCaptchaQuestion] = useState({ num1: 0, num2: 0, answer: 0 })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")
  const [copiedField, setCopiedField] = useState<string>("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitMessage("")

    if (formData.honeypot) {
      return
    }

    const timeTaken = Date.now() - formLoadTime
    if (timeTaken < 3000) {
      setSubmitMessage("Proszę poświęcić chwilę na wypełnienie formularza.")
      return
    }

    if (Number.parseInt(formData.captcha) !== captchaQuestion.answer) {
      setSubmitMessage("Nieprawidłowa odpowiedź na pytanie weryfikacyjne.")
      return
    }

    if (!formData.name || !formData.email || !formData.message) {
      setSubmitMessage("Proszę wypełnić wszystkie wymagane pola.")
      return
    }

    setIsSubmitting(true)

    setTimeout(() => {
      setSubmitMessage("Dziękujemy za wiadomość! Skontaktujemy się wkrótce.")
      setFormData({ name: "", email: "", phone: "", message: "", honeypot: "", captcha: "" })
      setIsSubmitting(false)

      const num1 = Math.floor(Math.random() * 10) + 1
      const num2 = Math.floor(Math.random() * 10) + 1
      setCaptchaQuestion({ num1, num2, answer: num1 + num2 })
    }, 1000)
  }

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(""), 2000)
  }

  useEffect(() => {
    setFormLoadTime(Date.now())
    const num1 = Math.floor(Math.random() * 10) + 1
    const num2 = Math.floor(Math.random() * 10) + 1
    setCaptchaQuestion({ num1, num2, answer: num1 + num2 })
  }, [])

  return (
    <main className="min-h-screen relative overflow-hidden bg-[#fcfaf8] text-[#443b32]">
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full gradient-3 blur-3xl animate-gradient" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full gradient-1 blur-3xl animate-gradient animation-delay-400" />
      </div>

      <Navigation />

      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 relative mb-16 sm:mb-24">
        <div className="gradient-1 rounded-3xl sm:rounded-[4rem] p-6 sm:p-12 lg:p-16">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="text-white space-y-2.5">
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl leading-tight">Skontaktuj się z nami</h1>
              <p className="text-white/90 text-lg leading-relaxed">
                Masz pytania? Chcesz zapisać dziecko? Zapraszamy do kontaktu!
              </p>

              <div className="space-y-4 pt-4">
                {/* Phone moved to first position */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-medium">Telefon</div>
                    <div className="text-white/80">123 456 789</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-medium">Email</div>
                    <div className="mt-1 space-y-1">
                      <a href="mailto:dyrektor@educms-szablon.pl" className="text-white/80 text-sm hover:underline">dyrektor@educms-szablon.pl</a>
                      <a href="mailto:ksiegowosc@educms-szablon.pl" className="text-white/80 text-sm hover:underline">ksiegowosc@educms-szablon.pl</a>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-medium">Godziny otwarcia</div>
                    <div className="text-white/80">Pon-Pt: 6:30 - 16:30</div>
                    <div className="text-white/60 text-sm">Przyjmowanie dzieci od 6:30</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">Adres</div>
                    <div className="text-white/80">ul. Edukacyjna 1, 00-000 Miasto</div>
                    <div className="text-white/80">00-000 Miasto</div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard("ul. Edukacyjna 1, 00-000 Miasto, 00-000 Miasto", "address")}
                    className="text-white hover:bg-white/20 flex-shrink-0"
                  >
                    {copiedField === "address" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>

                <div className="pt-4 border-t border-white/20">
                  <div className="font-medium mb-3">Numery kont bankowych</div>
                  <div className="space-y-3">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                      <div className="text-white/90 font-medium mb-2">Opłaty za przedszkole (pobyt + wyżywienie):</div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="font-bold text-white font-mono text-xs sm:text-sm break-all sm:break-normal">33 1020 4900 0000 8802 3237 6554</div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard("33102049000000880232376554", "account1")}
                          className="text-white hover:bg-white/20 flex-shrink-0 self-start sm:self-auto"
                        >
                          {copiedField === "account1" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                      <div className="text-white/90 font-medium mb-2">Wpłaty na Radę Rodziców:</div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="font-bold text-white font-mono text-xs sm:text-sm break-all sm:break-normal">73 1020 4900 0000 8102 3237 6565</div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard("73102049000000810232376565", "account2")}
                          className="text-white hover:bg-white/20 flex-shrink-0 self-start sm:self-auto"
                        >
                          {copiedField === "account2" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Form */}
            <div className="bg-white rounded-3xl p-5 sm:p-8 space-y-6">
              <h3 className="font-serif text-xl sm:text-2xl text-[#443b32]">Wyślij wiadomość</h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input
                    placeholder="Imię i nazwisko *"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="h-12 rounded-xl border-[#443b32]/20"
                    required
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder="Email *"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="h-12 rounded-xl border-[#443b32]/20"
                    required
                  />
                </div>
                <div>
                  <Input
                    type="tel"
                    placeholder="Telefon"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="h-12 rounded-xl border-[#443b32]/20"
                  />
                </div>
                <div>
                  <Textarea
                    placeholder="Wiadomość *"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="min-h-[120px] rounded-xl border-[#443b32]/20 resize-none"
                    required
                  />
                </div>

                <div style={{ position: "absolute", left: "-9999px" }} aria-hidden="true">
                  <Input
                    type="text"
                    name="website"
                    placeholder="Leave this field empty"
                    value={formData.honeypot}
                    onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                <div className="bg-[#fcfaf8] rounded-xl p-4 border border-[#443b32]/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-[#2f67ab]" />
                    <label className="text-sm font-medium text-[#443b32]">
                      Weryfikacja: Ile to {captchaQuestion.num1} + {captchaQuestion.num2}? *
                    </label>
                  </div>
                  <Input
                    type="number"
                    placeholder="Twoja odpowiedź"
                    value={formData.captcha}
                    onChange={(e) => setFormData({ ...formData, captcha: e.target.value })}
                    className="h-10 rounded-lg border-[#443b32]/20"
                    required
                  />
                </div>

                {submitMessage && (
                  <div
                    className={`text-sm p-3 rounded-lg ${
                      submitMessage.includes("Dziękujemy")
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    {submitMessage}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full gradient-2 text-white rounded-xl h-12 text-base font-medium transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5 mr-2" />
                  {isSubmitting ? "Wysyłanie..." : "Wyślij wiadomość"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
