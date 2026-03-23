export const siteConfig = {
  name: "EduCMS Szablon",
  shortName: "EduCMS",
  description: "Uniwersalny system CMS dla placówek edukacyjnych (przedszkola, szkoły).",
  url: "https://educms-szablon.pl",
  ogImage: "/images/og-image.jpg",
  contact: {
    phone: "123 456 789",
    email: "kontakt@educms-szablon.pl",
    directorEmail: "dyrektor@educms-szablon.pl",
    accountingEmail: "ksiegowosc@educms-szablon.pl",
    address: "ul. Edukacyjna 1, 00-000 Miasto",
    mapUrl: "https://maps.app.goo.gl/",
  },
  social: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
  },
  seo: {
    keywords: [
      "przedszkole",
      "szkoła",
      "edukacja",
      "cms edukacyjny",
      "szablon placówki oświatowej"
    ],
  }
}

export type SiteConfig = typeof siteConfig
