import type React from "react"
import type { Metadata } from "next"
import { Nunito } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import CookieConsentManager from "@/components/cookie-consent-manager"
import ScrollToTop from "@/components/scroll-to-top"
import AccessibilityWidget from "@/components/accessibility-widget"
import AuthProvider from "@/components/auth-provider"
import siteConfig from "../site.json"

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
  weight: ["300", "400", "600", "700", "800"],
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://educms-szablon.pl"),
  title: {
    default: siteConfig.siteName,
    template: `%s | ${siteConfig.siteName}`,
  },
  description: siteConfig.description,
  authors: [{ name: siteConfig.siteName }],
  creator: siteConfig.siteName,
  publisher: siteConfig.siteName,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: siteConfig.siteName,
    description: siteConfig.description,
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://educms-szablon.pl",
    siteName: siteConfig.shortName,
    locale: "pl_PL",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const customThemeStyles = `
    :root {
      --kg-blue: ${siteConfig.theme.colors.primary};
      --kg-light-blue: ${siteConfig.theme.colors.secondary};
      --kg-yellow: ${siteConfig.theme.colors.accent};
      --kg-brown: ${siteConfig.theme.colors.text};
      --kg-white: ${siteConfig.theme.colors.background};
    }
  `;

  return (
    <html lang="pl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://hebbkx1anhila5yf.public.blob.vercel-storage.com" />
        <link rel="dns-prefetch" href="https://vercel.live" />
        <style dangerouslySetInnerHTML={{ __html: customThemeStyles }} />
      </head>
      <body className={`${nunito.variable} font-sans antialiased`}>
        <AuthProvider>
          <ScrollToTop />
          <Suspense fallback={null}>{children}</Suspense>
          <AccessibilityWidget />
          <Analytics />
          <CookieConsentManager
            brandName={siteConfig.siteName}
            policyLinks={{
              privacy: "/polityka-prywatnosci",
              cookies: "/polityka-cookie",
            }}
            forceLang="pl"
          />
        </AuthProvider>
      </body>
    </html>
  )
}
