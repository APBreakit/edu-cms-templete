import Link from "next/link"
import { MapPin, Phone, Mail, Facebook, Info, Users, Image as ImageIcon, FileText, Newspaper, Shield, Cookie, Lock, GraduationCap } from 'lucide-react'
import Image from "next/image"
import siteConfig from "../site.json"

export function Footer() {
  return (
    <footer className="border-t border-border pt-16 pb-8 space-y-12 bg-muted/20">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 py-2.5">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 flex items-center justify-center overflow-hidden">
                <Image src={siteConfig.logos.footer} alt={`${siteConfig.siteName} Logo`} width={56} height={56} className="object-contain" />
              </div>
              <div>
                <div className="font-bold text-lg text-foreground leading-tight">{siteConfig.shortName}</div>
                <div className="text-xs text-primary font-semibold">Gdynia</div>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed text-sm">
              {siteConfig.description}
            </p>
            <div className="flex gap-3">
              <a
                href={siteConfig.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 angular-rounded gradient-1 flex items-center justify-center transition-all hover:scale-110"
              >
                <Facebook className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="font-semibold text-foreground text-lg">Szkoła</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/o-nas" className="text-muted-foreground hover:text-primary transition-colors">
                  O nas
                </Link>
              </li>
              <li>
                <Link href="/rekrutacja" className="text-muted-foreground hover:text-primary transition-colors">
                  Rekrutacja
                </Link>
              </li>
              <li>
                <Link href="/rada-rodzicow" className="text-muted-foreground hover:text-primary transition-colors">
                  Rada Rodziców
                </Link>
              </li>
              <li>
                <Link href="/o-nas#nauczyciele" className="text-muted-foreground hover:text-primary transition-colors">
                  Nauczyciele
                </Link>
              </li>
              <li>
                <Link href="/bip" className="text-muted-foreground hover:text-primary transition-colors">
                  Dokumenty
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="font-semibold text-foreground text-lg">Dla ucznia</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/aktualnosci" className="text-muted-foreground hover:text-primary transition-colors">
                  Aktualności
                </Link>
              </li>
              <li>
                <Link href="/galeria" className="text-muted-foreground hover:text-primary transition-colors">
                  Galeria
                </Link>
              </li>
              <li>
                <Link href="/o-nas#zajecia" className="text-muted-foreground hover:text-primary transition-colors">
                  Zajęcia pozalekcyjne
                </Link>
              </li>
              <li>
                <a
                  href="https://portal.librus.pl/rodzina"
                  target="_blank"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Dziennik elektroniczny
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h4 className="font-semibold text-foreground text-lg">Kontakt</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="text-muted-foreground text-sm space-y-1">
                  <a href={`tel:${siteConfig.contact.phone.replace(/\s+/g, '')}`} className="block hover:text-primary transition-colors">
                    {siteConfig.contact.phone}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="text-muted-foreground text-sm space-y-1">
                  <a href={`mailto:${siteConfig.contact.email}`} className="block hover:text-primary transition-colors">
                    {siteConfig.contact.email}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <a
                  href={siteConfig.contact.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground text-sm hover:text-primary transition-colors"
                >
                  {siteConfig.contact.address}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 pt-8">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} {siteConfig.shortName}. Wszelkie prawa zastrzeżone.
          </p>
          <div className="flex flex-wrap gap-4 md:gap-6 text-xs md:text-sm justify-center">
            <Link
              href="/polityka-prywatnosci"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Polityka Prywatności
            </Link>
            <Link
              href="/polityka-cookie"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Polityka Cookie
            </Link>
            <Link
              href="/klauzury-rodo"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Klauzury RODO
            </Link>
            <Link
              href="/monitoring"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Monitoring
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
