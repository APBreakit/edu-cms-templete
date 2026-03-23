"use client"

import { Chrome as Home, Newspaper, Users, Camera, Mail, ChevronDown, GraduationCap, BookOpen, FileText, Calendar, Globe } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import siteConfig from "../site.json"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

const menuStructure = {
  school: [
    { name: "Dyrektor", slug: "/o-nas#dyrektor" },
    { name: "Historia Szkoły", slug: "/o-nas#historia" },
    { name: "Patron", slug: "/o-nas#patron" },
    { name: "Nauczyciele", slug: "/o-nas#nauczyciele" },
    { name: "Rada Rodziców", slug: "/rada-rodzicow" },
    { name: "Rekrutacja", slug: "/rekrutacja" },
    { name: "Samorząd uczniowski", slug: "/o-nas#samorzad" },
    { name: "Siostry Nazaretanki", slug: "/o-nas#siostry" },
  ],
  student: [
    { name: "Biblioteka", slug: "/o-nas#biblioteka" },
    { name: "Dokumenty szkolne", slug: "/bip" },
    { name: "Konkursy szkolne", slug: "/aktualnosci" },
    { name: "Świetlica", slug: "/o-nas#swietlica" },
    { name: "Pedagog i psycholog", slug: "/o-nas#pedagog" },
    { name: "Wolontariat", slug: "/o-nas#wolontariat" },
    { name: "Zajęcia pozalekcyjne", slug: "/o-nas#zajecia" },
  ],
  calendar: [
    { name: "Kalendarium", slug: "/o-nas#kalendarz" },
    { name: "Msze Święte", slug: "/o-nas#msze" },
    { name: "Zebrania i konsultacje", slug: "/o-nas#zebrania" },
  ],
}

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [schoolMenuOpen, setSchoolMenuOpen] = useState(false)
  const [studentMenuOpen, setStudentMenuOpen] = useState(false)
  const [yearMenuOpen, setYearMenuOpen] = useState(false)
  const [language, setLanguage] = useState<"pl" | "en">("pl")

  return (
    <nav className="sticky top-0 z-50 glass-strong shadow-lg angular-rounded-lg m-2">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-14 h-14 flex items-center justify-center overflow-hidden">
              <Image
                src={siteConfig.logos.main}
                alt={`${siteConfig.siteName} Logo`}
                width={56}
                height={56}
                className="object-contain"
              />
            </div>
            <div className="hidden md:block">
              <div className="font-bold text-lg text-foreground leading-tight max-w-sm">
                {siteConfig.shortName}
              </div>
              <div className="text-xs text-primary font-semibold">Gdynia</div>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            <Link href="/" className="px-4 py-2 text-foreground hover:text-primary transition-colors font-semibold">
              Start
            </Link>

            <NavigationMenu viewport={false}>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="px-4 py-2 text-foreground hover:text-primary transition-colors font-semibold bg-transparent">
                    Szkoła
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[280px] p-3 glass-strong angular-rounded">
                      {menuStructure.school.map((item) => (
                        <Link
                          key={item.slug}
                          href={item.slug}
                          className="block px-4 py-2.5 text-sm hover:bg-primary/10 angular-rounded transition-colors"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <NavigationMenu viewport={false}>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="px-4 py-2 text-foreground hover:text-primary transition-colors font-semibold bg-transparent">
                    Dla ucznia
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[280px] p-3 glass-strong angular-rounded">
                      {menuStructure.student.map((item) => (
                        <Link
                          key={item.slug}
                          href={item.slug}
                          className="block px-4 py-2.5 text-sm hover:bg-primary/10 angular-rounded transition-colors"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <Link
              href="/aktualnosci"
              className="px-4 py-2 text-foreground hover:text-primary transition-colors font-semibold"
            >
              Aktualności
            </Link>

            <Link href="/galeria" className="px-4 py-2 text-foreground hover:text-primary transition-colors font-semibold">
              Galeria
            </Link>

            <NavigationMenu viewport={false}>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="px-4 py-2 text-foreground hover:text-primary transition-colors font-semibold bg-transparent">
                    Rok szkolny
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[280px] p-3 glass-strong angular-rounded">
                      {menuStructure.calendar.map((item) => (
                        <Link
                          key={item.slug}
                          href={item.slug}
                          className="block px-4 py-2.5 text-sm hover:bg-primary/10 angular-rounded transition-colors"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <Link
              href="/kontakt"
              className="px-4 py-2 text-foreground hover:text-primary transition-colors font-semibold"
            >
              Kontakt
            </Link>

            <button
              onClick={() => setLanguage(language === "pl" ? "en" : "pl")}
              className="ml-2 px-3 py-2 text-sm font-semibold text-foreground hover:text-primary transition-colors flex items-center gap-1.5"
              aria-label="Zmień język"
            >
              <Globe className="w-4 h-4" />
              {language.toUpperCase()}
            </button>
          </div>

          <button
            className="lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
          >
            <span
              className={`w-6 h-0.5 bg-primary rounded-full transition-all ${
                mobileMenuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span className={`w-6 h-0.5 bg-primary rounded-full transition-all ${mobileMenuOpen ? "opacity-0" : ""}`} />
            <span
              className={`w-6 h-0.5 bg-primary rounded-full transition-all ${
                mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 glass-strong angular-rounded p-4 space-y-2">
            <Link href="/" className="block py-2 font-semibold" onClick={() => setMobileMenuOpen(false)}>
              Start
            </Link>

            <div>
              <button
                onClick={() => setSchoolMenuOpen(!schoolMenuOpen)}
                className="flex items-center justify-between w-full py-2 font-semibold"
              >
                Szkoła
                <ChevronDown className={`w-4 h-4 transition-transform ${schoolMenuOpen ? "rotate-180" : ""}`} />
              </button>
              {schoolMenuOpen && (
                <div className="ml-4 mt-2 space-y-1">
                  {menuStructure.school.map((item) => (
                    <Link
                      key={item.slug}
                      href={item.slug}
                      className="block py-2 text-sm"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div>
              <button
                onClick={() => setStudentMenuOpen(!studentMenuOpen)}
                className="flex items-center justify-between w-full py-2 font-semibold"
              >
                Dla ucznia
                <ChevronDown className={`w-4 h-4 transition-transform ${studentMenuOpen ? "rotate-180" : ""}`} />
              </button>
              {studentMenuOpen && (
                <div className="ml-4 mt-2 space-y-1">
                  {menuStructure.student.map((item) => (
                    <Link
                      key={item.slug}
                      href={item.slug}
                      className="block py-2 text-sm"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/aktualnosci" className="block py-2 font-semibold" onClick={() => setMobileMenuOpen(false)}>
              Aktualności
            </Link>
            <Link href="/galeria" className="block py-2 font-semibold" onClick={() => setMobileMenuOpen(false)}>
              Galeria
            </Link>

            <div>
              <button
                onClick={() => setYearMenuOpen(!yearMenuOpen)}
                className="flex items-center justify-between w-full py-2 font-semibold"
              >
                Rok szkolny
                <ChevronDown className={`w-4 h-4 transition-transform ${yearMenuOpen ? "rotate-180" : ""}`} />
              </button>
              {yearMenuOpen && (
                <div className="ml-4 mt-2 space-y-1">
                  {menuStructure.calendar.map((item) => (
                    <Link
                      key={item.slug}
                      href={item.slug}
                      className="block py-2 text-sm"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/kontakt" className="block py-2 font-semibold" onClick={() => setMobileMenuOpen(false)}>
              Kontakt
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navigation
