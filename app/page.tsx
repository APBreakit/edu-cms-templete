import type { Metadata } from "next"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import SchoolHomePage from "./school-home"

export const metadata: Metadata = {
  title: "Katolicka Szkoła Podstawowa im. Świętej Rodziny w Gdyni",
  description:
    "Katolicka Szkoła Podstawowa prowadzona przez Zgromadzenie Sióstr Świętej Rodziny z Nazaretu w Gdyni. Kształcenie w duchu wartości chrześcijańskich.",
  alternates: {
    canonical: "https://kspgdynia.pl",
  },
  openGraph: {
    title: "Katolicka Szkoła Podstawowa im. Świętej Rodziny w Gdyni",
    description: "Kształcenie w duchu wartości chrześcijańskich",
    url: "https://kspgdynia.pl",
    type: "website",
  },
}

export default function Page() {
  return (
    <>
      <Navigation />
      <SchoolHomePage />
      <Footer />
    </>
  )
}
