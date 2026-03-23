"use client"

import { Home, Newspaper, Users, Camera, Mail, ChevronDown, GraduationCap } from "lucide-react"
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

const groups = [
  { name: "Grupa Czerwona", slug: "czerwona", color: "#ef4444" },
  { name: "Grupa Lawendowa", slug: "lawendowa", color: "#a78bfa" },
  { name: "Grupa Niebieska", slug: "niebieska", color: "#3b82f6" },
  { name: "Grupa Pastelowa", slug: "pastelowa", color: "#fbbf24" },
  { name: "Grupa Pomarańczowa", slug: "pomaranczowa", color: "#f97316" },
  { name: "Grupa Turkusowa", slug: "turkusowa", color: "#06b6d4" },
  { name: "Grupa Waniliowa", slug: "waniliowa", color: "#fef3c7" },
  { name: "Grupa Zielona", slug: "zielona", color: "#22c55e" },
]

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [groupsMenuOpen, setGroupsMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-card/90 backdrop-blur-xl border-b border-primary/10 shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center overflow-hidden">
              <Image
                src={siteConfig.logos.main}
                alt={`${siteConfig.siteName} Logo`}
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
            <div>
              <div className="font-serif text-xl text-foreground font-bold">{siteConfig.siteName}</div>
              <div className="text-xs text-primary">{siteConfig.shortName}</div>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-3.5">
            <Link
              href="/o-nas"
              className="flex items-center gap-2 text-foreground hover:text-primary transition-colors font-semibold"
            >
              <Home className="w-4 h-4" />O nas
            </Link>
            <Link
              href="/aktualnosci"
              className="flex items-center gap-2 text-foreground hover:text-primary transition-colors font-semibold"
            >
              <Newspaper className="w-4 h-4" />
              Aktualności
            </Link>

            <NavigationMenu viewport={false}>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="flex items-center gap-2 text-foreground hover:text-primary transition-colors font-semibold bg-transparent">
                    <Users className="w-4 h-4" />
                    Grupy
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[400px] gap-3 p-4">
                      {groups.map((group) => (
                        <Link
                          key={group.slug}
                          href={`/grupy/${group.slug}`}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors group"
                        >
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: group.color }} />
                          <span className="text-foreground group-hover:text-primary font-medium">{group.name}</span>
                        </Link>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <Link
              href="/galeria"
              className="flex items-center gap-2 text-foreground hover:text-primary transition-colors font-semibold"
            >
              <Camera className="w-4 h-4" />
              Galeria
            </Link>
            <Link
              href="/rekrutacja"
              className="flex items-center gap-2 text-foreground hover:text-primary transition-colors font-semibold"
            >
              <GraduationCap className="w-4 h-4" />
              Rekrutacja
            </Link>
            <Link
              href="/kontakt"
              className="flex items-center gap-2 text-foreground hover:text-primary transition-colors font-semibold"
            >
              <Mail className="w-4 h-4" />
              Kontakt
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 hover:opacity-80 transition-opacity"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span
              className={`w-6 h-0.5 bg-primary rounded-full transition-all duration-300 ${
                mobileMenuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`w-6 h-0.5 bg-primary rounded-full transition-all duration-300 ${
                mobileMenuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`w-6 h-0.5 bg-primary rounded-full transition-all duration-300 ${
                mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border shadow-xl animate-slide-in-down">
            <div className="container mx-auto px-4 py-6 space-y-4">
              <Link
                href="/o-nas"
                className="flex items-center gap-3 text-foreground hover:text-primary transition-colors font-semibold py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Home className="w-5 h-5" />O nas
              </Link>
              <Link
                href="/aktualnosci"
                className="flex items-center gap-3 text-foreground hover:text-primary transition-colors font-semibold py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Newspaper className="w-5 h-5" />
                Aktualności
              </Link>

              <div>
                <button
                  onClick={() => setGroupsMenuOpen(!groupsMenuOpen)}
                  className="flex items-center justify-between w-full gap-3 text-foreground hover:text-primary transition-colors font-semibold py-2"
                >
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5" />
                    Grupy
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform ${groupsMenuOpen ? "rotate-180" : ""}`} />
                </button>
                {groupsMenuOpen && (
                  <div className="ml-8 mt-2 space-y-2">
                    {groups.map((group) => (
                      <Link
                        key={group.slug}
                        href={`/grupy/${group.slug}`}
                        className="flex items-center gap-3 py-2 text-foreground hover:text-primary transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: group.color }} />
                        <span className="text-sm">{group.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link
                href="/galeria"
                className="flex items-center gap-3 text-foreground hover:text-primary transition-colors font-semibold py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Camera className="w-5 h-5" />
                Galeria
              </Link>
              <Link
                href="/rekrutacja"
                className="flex items-center gap-3 text-foreground hover:text-primary transition-colors font-semibold py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <GraduationCap className="w-5 h-5" />
                Rekrutacja
              </Link>
              <Link
                href="/kontakt"
                className="flex items-center gap-3 text-foreground hover:text-primary transition-colors font-semibold py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Mail className="w-5 h-5" />
                Kontakt
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navigation
