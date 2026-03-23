"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Accessibility, Type, Contrast, Eye, LinkIcon, Palette } from 'lucide-react'

export default function AccessibilityWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [fontSize, setFontSize] = useState(100)
  const [highContrast, setHighContrast] = useState(false)
  const [highlightLinks, setHighlightLinks] = useState(false)
  const [readableFont, setReadableFont] = useState(false)
  const [grayscale, setGrayscale] = useState(false)

  // Load saved preferences from localStorage
  useEffect(() => {
    const savedFontSize = localStorage.getItem("a11y-font-size")
    const savedHighContrast = localStorage.getItem("a11y-high-contrast")
    const savedHighlightLinks = localStorage.getItem("a11y-highlight-links")
    const savedReadableFont = localStorage.getItem("a11y-readable-font")
    const savedGrayscale = localStorage.getItem("a11y-grayscale")

    if (savedFontSize) setFontSize(Number.parseInt(savedFontSize))
    if (savedHighContrast) setHighContrast(savedHighContrast === "true")
    if (savedHighlightLinks) setHighlightLinks(savedHighlightLinks === "true")
    if (savedReadableFont) setReadableFont(savedReadableFont === "true")
    if (savedGrayscale) setGrayscale(savedGrayscale === "true")
  }, [])

  // Apply font size
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}%`
    localStorage.setItem("a11y-font-size", fontSize.toString())
  }, [fontSize])

  // Apply high contrast
  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add("high-contrast")
    } else {
      document.documentElement.classList.remove("high-contrast")
    }
    localStorage.setItem("a11y-high-contrast", highContrast.toString())
  }, [highContrast])

  // Apply link highlighting
  useEffect(() => {
    if (highlightLinks) {
      document.documentElement.classList.add("highlight-links")
    } else {
      document.documentElement.classList.remove("highlight-links")
    }
    localStorage.setItem("a11y-highlight-links", highlightLinks.toString())
  }, [highlightLinks])

  // Apply readable font
  useEffect(() => {
    if (readableFont) {
      document.documentElement.classList.add("readable-font")
    } else {
      document.documentElement.classList.remove("readable-font")
    }
    localStorage.setItem("a11y-readable-font", readableFont.toString())
  }, [readableFont])

  // Apply grayscale
  useEffect(() => {
    if (grayscale) {
      document.documentElement.classList.add("grayscale-mode")
    } else {
      document.documentElement.classList.remove("grayscale-mode")
    }
    localStorage.setItem("a11y-grayscale", grayscale.toString())
  }, [grayscale])

  const resetSettings = () => {
    setFontSize(100)
    setHighContrast(false)
    setHighlightLinks(false)
    setReadableFont(false)
    setGrayscale(false)
    localStorage.removeItem("a11y-font-size")
    localStorage.removeItem("a11y-high-contrast")
    localStorage.removeItem("a11y-highlight-links")
    localStorage.removeItem("a11y-readable-font")
    localStorage.removeItem("a11y-grayscale")
  }

  return (
    <>
      {/* Floating accessibility button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="lg"
        className="fixed bottom-24 left-6 z-50 h-14 w-14 rounded-full bg-background border-2 border-primary text-primary shadow-lg hover:bg-primary hover:text-primary-foreground hover:scale-110 transition-all duration-300"
        aria-label="Otwórz ustawienia dostępności"
      >
        <Accessibility className="h-6 w-6" />
      </Button>

      {/* Accessibility panel */}
      {isOpen && (
        <Card className="fixed bottom-42 left-6 z-50 w-[90vw] max-w-md shadow-2xl animate-scale-in border-2">
          <CardHeader className="relative pb-4 bg-muted/50">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="absolute right-2 top-2"
              aria-label="Zamknij"
            >
              <X className="h-4 w-4" />
            </Button>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Accessibility className="h-5 w-5" />
              Dostępność
            </CardTitle>
            <CardDescription>Dostosuj stronę do swoich potrzeb</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Font size adjustment */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="font-size" className="flex items-center gap-2 text-sm font-medium">
                  <Type className="h-4 w-4" />
                  Rozmiar tekstu
                </label>
                <span className="text-sm text-muted-foreground">{fontSize}%</span>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFontSize(Math.max(80, fontSize - 10))}
                  disabled={fontSize <= 80}
                  aria-label="Zmniejsz rozmiar tekstu"
                >
                  A-
                </Button>
                <input
                  id="font-size"
                  type="range"
                  min="80"
                  max="150"
                  step="10"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number.parseInt(e.target.value))}
                  className="flex-1"
                  aria-label="Suwak rozmiaru tekstu"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFontSize(Math.min(150, fontSize + 10))}
                  disabled={fontSize >= 150}
                  aria-label="Zwiększ rozmiar tekstu"
                >
                  A+
                </Button>
              </div>
            </div>

            {/* High contrast toggle */}
            <div className="flex items-center justify-between">
              <label htmlFor="high-contrast" className="flex items-center gap-2 text-sm font-medium">
                <Contrast className="h-4 w-4" />
                Wysoki kontrast
              </label>
              <Button
                id="high-contrast"
                variant={highContrast ? "default" : "outline"}
                size="sm"
                onClick={() => setHighContrast(!highContrast)}
                aria-pressed={highContrast}
              >
                {highContrast ? "Włączone" : "Wyłączone"}
              </Button>
            </div>

            {/* Highlight links toggle */}
            <div className="flex items-center justify-between">
              <label htmlFor="highlight-links" className="flex items-center gap-2 text-sm font-medium">
                <LinkIcon className="h-4 w-4" />
                Podświetl linki
              </label>
              <Button
                id="highlight-links"
                variant={highlightLinks ? "default" : "outline"}
                size="sm"
                onClick={() => setHighlightLinks(!highlightLinks)}
                aria-pressed={highlightLinks}
              >
                {highlightLinks ? "Włączone" : "Wyłączone"}
              </Button>
            </div>

            {/* Readable font toggle */}
            <div className="flex items-center justify-between">
              <label htmlFor="readable-font" className="flex items-center gap-2 text-sm font-medium">
                <Eye className="h-4 w-4" />
                Czytelna czcionka
              </label>
              <Button
                id="readable-font"
                variant={readableFont ? "default" : "outline"}
                size="sm"
                onClick={() => setReadableFont(!readableFont)}
                aria-pressed={readableFont}
              >
                {readableFont ? "Włączone" : "Wyłączone"}
              </Button>
            </div>

            {/* Grayscale toggle */}
            <div className="flex items-center justify-between">
              <label htmlFor="grayscale" className="flex items-center gap-2 text-sm font-medium">
                <Palette className="h-4 w-4" />
                Odcienie szarości
              </label>
              <Button
                id="grayscale"
                variant={grayscale ? "default" : "outline"}
                size="sm"
                onClick={() => setGrayscale(!grayscale)}
                aria-pressed={grayscale}
              >
                {grayscale ? "Włączone" : "Wyłączone"}
              </Button>
            </div>

            {/* Reset button */}
            <Button variant="secondary" className="w-full" onClick={resetSettings}>
              Przywróć domyślne
            </Button>
          </CardContent>
        </Card>
      )}
    </>
  )
}
