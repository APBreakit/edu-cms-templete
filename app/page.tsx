import type { Metadata } from "next"
import ClientPage from "./client-page"

export const metadata: Metadata = {
  title: "Strona Główna - Placówka Edukacyjna Mieściea Nazaret",
  description:
    "Przedszkole parafialne w Mieście z 34-letnim doświadczeniem. Wykwalifikowana kadra pedagogiczna, rodzinna atmosfera, edukacja katolicka. Zapisz dziecko już dziś!",
  alternates: {
    canonical: "https://educms-szablon.pl",
  },
  openGraph: {
    title: "EduCMS - Placówka Edukacyjna",
    description: "34 lata doświadczenia w wychowaniu dzieci w duchu wartości chrześcijańskich",
    url: "https://educms-szablon.pl",
    type: "website",
  },
}

export default function Page() {
  return <ClientPage />
}
