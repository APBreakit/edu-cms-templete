import Link from "next/link"
import { MapPin, Phone, Mail, Facebook, Info, Users, ImageIcon, FileText, Newspaper, Shield, Cookie, Lock, GraduationCap } from 'lucide-react'
import Image from "next/image"
import siteConfig from "../site.json"

export function Footer() {
  return (
    <footer className="border-t border-border pt-16 pb-8 space-y-12 opacity-0 animate-fade-in animation-delay-200">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 py-2.5">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center overflow-hidden">
                <Image src={siteConfig.logos.footer} alt={`${siteConfig.siteName} Logo`} width={48} height={48} className="object-contain" />
              </div>
              <div>
                <div className="font-serif text-xl text-foreground font-bold">{siteConfig.siteName}</div>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {siteConfig.description}
            </p>
            <div className="flex gap-3">
              <a
                href={siteConfig.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full gradient-1 flex items-center justify-center transition-all hover:scale-110"
              >
                <Facebook className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>

          {/* Menu */}
          <div className="space-y-6">
            <h4 className="font-semibold text-foreground text-lg">Menu</h4>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/o-nas"
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                >
                  <Info className="w-4 h-4" />O nas
                </Link>
              </li>
              <li>
                <Link
                  href="/aktualnosci"
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                >
                  <Newspaper className="w-4 h-4" />
                  Aktualności
                </Link>
              </li>
              <li>
                <Link
                  href="/grupy"
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                >
                  <Users className="w-4 h-4" />
                  Grupy
                </Link>
              </li>
              <li>
                <Link
                  href="/galeria"
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                >
                  <ImageIcon className="w-4 h-4" />
                  Galeria
                </Link>
              </li>
            </ul>
          </div>

          {/* Documents */}
          <div className="space-y-6">
            <h4 className="font-semibold text-foreground text-lg">Ważne</h4>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/rekrutacja"
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 font-medium"
                >
                  <GraduationCap className="w-4 h-4" />
                  Rekrutacja
                </Link>
              </li>
              <li></li>
              <li>
                <Link
                  href="/rada-rodzicow"
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 font-medium"
                >
                  <Users className="w-4 h-4" />
                  Rada Rodziców
                </Link>
              </li>
              <li className="space-y-2">
                <Link
                  href="/bip"
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 font-medium"
                >
                  <FileText className="w-4 h-4" />
                  BIP
                </Link>
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

        {/* Bottom Bar */}
        <div className="border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 pt-2.5">
          <p className="text-muted-foreground text-sm">
            © 2026 Placówka Edukacyjna. Wszelkie prawa zastrzeżone.
          </p>
          <div className="flex gap-6 text-sm">
            <Link
              href="/polityka-prywatnosci"
              className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5" />
              Polityka Prywatności
            </Link>
            <Link
              href="/polityka-cookie"
              className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
            >
              <Cookie className="w-3.5 h-3.5" />
              Polityka Cookie
            </Link>
            <Link
              href="/klauzury-rodo"
              className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              Klauzury RODO
            </Link>
          </div>
        </div>

        <div className="pt-6 flex justify-center">
          <a
            href="https://educms-szablon.pl/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm group"
          >
            <span>Love design?</span>
            <Image
              src="/logo.jpg"
              alt="EduCMS Logo"
              width={20}
              height={20}
              className="transition-transform group-hover:scale-110"
            />
            <span className="font-medium">Be EduCMS</span>
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
