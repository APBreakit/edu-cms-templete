import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/", "/grupy/"],
    },
    sitemap: "https://educms-szablon.pl/sitemap.xml",
  }
}
