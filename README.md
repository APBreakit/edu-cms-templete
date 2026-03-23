# EduCMS - Uniwersalny Szablon CMS dla Placówek Edukacyjnych

Kompletny system CMS wyodrębniony i zanonimizowany w celu stworzenia uniwersalnego szablonu dla przedszkoli, szkół podstawowych i średnich. Szablon zawiera w pełni funkcjonalny panel administracyjny i stronę główną.

## Funkcjonalności

- **Strona Główna (Landing Page):** Nowoczesna, responsywna strona główna z komponentami demonstracyjnymi (kalendarz wydarzeń, aktualności, galeria zdjęć, formularze kontaktowe).
- **Panel Administracyjny:** Pełne zarządzanie treścią (CRUD) z obsługą ról (użytkownicy i administratorzy).
- **Moduły:**
  - Kalendarz wydarzeń z dodawaniem, edycją i usuwaniem wydarzeń.
  - System postów/aktualności i ogłoszeń.
  - Moduł galerii zdjęć (z przesyłaniem plików).
  - Formularze kontaktowe i zgłoszeniowe.
  - System powiadomień.
- **Konfiguracja:** Łatwe dostosowanie kolorystyki, logo, treści i struktury poprzez plik `site.json` bez ingerencji w kod źródłowy.
- **Zgodność i Dostępność:** Wbudowane wtyczki i zanonimizowane podstrony RODO oraz Dostępności.

## Konfiguracja bez ingerencji w kod (`site.json`)

Cała podstawowa konfiguracja strony znajduje się w pliku `site.json` w głównym katalogu projektu.
Możesz tam zmienić:
- `siteName` i `shortName` (Nazwę placówki)
- `contact` (Telefon, email, adres, mapę)
- `theme.colors` (Kolorystykę szablonu, np. główny, akcentujący)
- `logos` (Ścieżki do logo)

Zmiany w pliku `site.json` automatycznie zaktualizują wygląd i metadane aplikacji.

## Uruchomienie projektu

### Wymagania

- Node.js (wersja 18+)
- Baza danych PostgreSQL (np. Neon)
- Konto Vercel Blob (do przechowywania zdjęć i załączników)

### Instalacja i Konfiguracja

1. Sklonuj repozytorium i zainstaluj zależności:
   ```bash
   npm install
   # lub
   pnpm install
   ```

2. Skopiuj plik `.env.example` do `.env.local` i uzupełnij zmienne środowiskowe:
   ```bash
   cp .env.example .env.local
   ```
   Wymagane zmienne to m.in.: `DATABASE_URL`, `JWT_SECRET`, `BLOB_READ_WRITE_TOKEN`.

3. Zainicjalizuj bazę danych (struktura tabel):
   ```bash
   node scripts/migrate_to_neon.mjs
   ```

4. Wygeneruj początkowe dane i domyślnego administratora:
   ```bash
   node scripts/seed_data.js
   ```
   *Domyślne konto:* `admin@educms-szablon.pl`
   *Hasło:* (wygenerowane z Twojego pliku env lub `admin123`)

### Uruchomienie deweloperskie

```bash
npm run dev
```
Aplikacja będzie dostępna pod adresem `http://localhost:3000`. Panel administracyjny znajdziesz pod adresem `http://localhost:3000/admin`.
