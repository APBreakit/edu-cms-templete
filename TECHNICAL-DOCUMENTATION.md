# Dokument techniczny: Architektura, wdrażanie, utrzymanie

## Architektura aplikacji
### Warstwy i komponenty
- Frontend: Next.js 15 (App Router), React 19, Tailwind CSS, shadcn/ui, framer-motion.
- Backend: Server Actions (`"use server"`) i API Routes (`app/api/*`).
- Baza danych: Neon PostgreSQL (RLS sterowane przez `SET app.user_role`).
- Pliki/obrazy: Vercel Blob (publiczne URL-e z trwałymi odnośnikami).
- Autentykacja: `next-auth` (sesje, cookies), strony admin oznaczone jako dynamiczne.

### Kluczowe moduły
- Publiczne strony: `app/*` (np. `/`, `/aktualnosci`, `/ogloszenia`, `/konkursy`, `/rada-rodzicow`, `/rekrutacja`, `/bip`).
- Dynamiczny widok postu: `app/[category]/[slug]/page` (hero obraz/placeholder, breadcrumb, meta, załączniki, ostatnio dodane).
- Panel admin: `app/admin/*` (Posty, Galerie, Media, Grupy, Jadłospis, Rada Rodziców, Kalendarz).
- Serwerowe akcje: `app/actions/*` (pobieranie publiczne, operacje admin z walidacją i RLS).
- Warstwa DB: `lib/db` (klient SQL, typy, pomocnicze funkcje).

### Schemat połączeń (logiczny)
- Przeglądarka → Next.js (SSR/ISR/dynamic) → Server Actions/API → Neon (SQL, RLS).
- Przeglądarka → Next.js → Vercel Blob (GET/HEAD dla załączników/miniatur).
- Admin UI → Server Actions → `SET app.user_role='admin'` → `INSERT/UPDATE/DELETE`.

## Baza danych i indeksy
### Tabele (wybrane)
- `posts`: treści (typ, status, `slug` unikalny, meta kalendarza/konkursu, obrazy).
- `galleries`, `gallery_images`: galerie i zdjęcia (sortowanie, podpisy, okładki).
- `media`: pliki (obrazy/PDF/DOC/XLS/TXT), kategorie.
- `meal_plans`: jadłospisy (`is_current` oraz URL, daty).
- `rada_rodzicow_documents`: dokumenty RR (tytuł, URL, typ, `display_order`).
- `groups`: grupy (kolor, nauczyciel, wiek, harmonogram, dokumenty).
- `users`, `admin_permissions`: konta admin + sekcje uprawnień.

### Indeksy i spójność
- Unikalne indeksy: `posts.slug`, `galleries.slug` (unikalne adresy SEO).
- RLS: logika uprawnień przez `current_setting('app.user_role')`; przed każdym mutującym SQL wywołanie `SET app.user_role='admin'` w osobnym zapytaniu.

## Routing, SEO i treści
- Jednolity szablon postu: `/${category}/${slug}` dla: Aktualności (`aktualnosci`), Ogłoszenia (`ogloszenia`), Konkursy (`konkursy`), Rada Rodziców (`rada-rodzicow`).
- Metadane: `generateMetadata` tworzy `title`, `description` (z `excerpt` lub skrótu `content`), `canonical`/OG; canonical bazuje na `NEXT_PUBLIC_SITE_URL`.
- Breadcrumb i `rel=prev/next`: w widoku postu nawigacja wewnątrz kategorii.
- Załączniki: automatyczna detekcja linków do Blob w `content` (PDF/obrazy/DOC/XLS/TXT), rozmiar `HEAD`, miniatury obrazów.

## Walidacje i bezpieczeństwo
- Serwerowa walidacja postów: wymagane `title`, `content`; typ należy do `aktualnosci|ogloszenia|konkursy|rada-rodzicow`; gdy `add_to_calendar=true` wymagane `calendar_date`.
- Slug: automatyczne generowanie (mapowanie diakrytyków PL), rozwiązywanie kolizji przy `update`.
- Media upload: weryfikacje rozszerzeń (obrazy/PDF/DOC/XLS/TXT), rozmiaru; nagłówki `content-type` w Blob.
- Uprawnienia admin: sprawdzane przez `getSession()` i tablicę `admin_permissions` dla sekcji.
- RLS: rozdzielenie `SET` i `INSERT/UPDATE/DELETE` (osobne wywołania SQL) ze względu na ograniczenia drivera.

## Wdrażanie (Vercel)
### Wymagane zmienne środowiskowe (Production)
- `NEXT_PUBLIC_SITE_URL`: `https://www.przedszkolenazaret.com`.
- `DATABASE_URL`: DSN do Neon (SSL, użytkownik prod).
- `NEXTAUTH_SECRET`: silny sekret (hex 32 bajty).
- `BLOB_READ_WRITE_TOKEN`: RW token do Vercel Blob (prod).
- Opcjonalnie: `NEXT_TELEMETRY_DISABLED=1` (wyłączenie telemetry Next.js).

### Kroki CLI (nowy projekt)
1. `npm i -g vercel` i `vercel login`.
2. `vercel link --project przedszkolenazaret --org <org>` lub interaktywnie `vercel link`.
3. Dodaj env (Production):
   - `printf "https://www.przedszkolenazaret.com" | vercel env add NEXT_PUBLIC_SITE_URL production`
   - `printf "postgresql://<user>:<pass>@<host>/<db>?sslmode=require" | vercel env add DATABASE_URL production`
   - `printf "<HEX32>" | vercel env add NEXTAUTH_SECRET production`
   - `printf "vercel_blob_rw_..." | vercel env add BLOB_READ_WRITE_TOKEN production`
4. Deploy: `vercel --prod`.
5. Domena: przypnij `www.przedszkolenazaret.com` → DNS: `A @ -> 76.76.21.21`, `CNAME www -> cname.vercel-dns.com`; ustaw przekierowanie `www` → `https://www.przedszkolenazaret.com`.

### Uwaga o build
- Next.js automatycznie przełącza trasy używające `cookies()` na dynamiczne (komunikat „Dynamic server usage…”). Strony admin jawnie oznaczone: `export const dynamic = 'force-dynamic'`.
- W razie potrzeby akceptuj build scripts (`@tailwindcss/oxide`, `sharp`, `esbuild`) przez `pnpm approve-builds` lub Settings → Build & Development.
- Corepack/pnpm: można przypiąć wersję przez `ENABLE_EXPERIMENTAL_COREPACK=1` i `packageManager` w `package.json`.

## Sanity check (po deploy)
- Public: `/`, `/aktualnosci`, `/${type}/${slug}`, `/bip`, `/rekrutacja`, `/galeria`, `/rada-rodzicow`.
- Admin: `/admin/login`, `/admin/posts`, `/admin/galleries`, `/admin/media`, `/admin/rada-rodzicow`, `/admin/meal-plan`, `/admin/calendar`, `/admin/groups`.
- Przejdź CRUD: utwórz/edytuj/usuń post (w tym RR), dodaj galerię i obraz, upload plików (PDF/DOC/XLS/obrazy), ustaw jadłospis jako aktualny.
- Sprawdź SEO: canonical na `NEXT_PUBLIC_SITE_URL`; OG obraz/tytuł/opis; breadcrumb i `rel=prev/next`.

## Utrzymanie i testy
- Skrypt CRUD: `scripts/admin_crud_tests.mjs` (sprawdza pełen zestaw CRUD dla modułów)
  - Dodaj komendę w `package.json`: `"test:admin-crud": "node scripts/admin_crud_tests.mjs"`.
- Migracje: `scripts/migrate_to_neon.mjs` (ALTER TABLE, indeksy, kolumny brakujące). Uruchamiaj przy zmianach schematu.
- Monitoring: `vercel inspect <deployment-url> --logs`, `vercel env ls`, `vercel env pull`.

## Rozwiązania i decyzje projektowe
- Jednolity szablon postu (`/${category}/${slug}`) minimalnie różnicuje akcenty kolorystyczne kategorii.
- Publiczne linki po `slug` (spójne SEO), admin nadal po `id`.
- Załączniki/grafiki z Blob ujednolicone w renderowaniu i rozmiarach, miniatury obrazów.
- Globalne hover styli: delikatny błękit (`hover:bg-blue-50`) lub lekkie przyciemnienie (`hover:brightness-95`).
- Footer: adres klikalny do Google Maps; logo Breackly z trwałego URL Blob.

## Rozwiązywanie problemów
- `DynamicServerError` podczas build (cookies/headers): oznacz stronę jako dynamiczną; nie jest to błąd runtime.
- Błędy Neon przy łączeniu instrukcji: zawsze rozdziel `SET app.user_role` i właściwe `INSERT/UPDATE/DELETE` na osobne wywołania.
- Slug pusty przy publikacji szkicu: generuj `slug` z tytułu i sprawdzaj kolizje.
- Braki typów/NULL: formularze i typy TS dostosowane do możliwych `null`/`string|Date` wartości.

## Dalsze kierunki
- CI (GitHub Actions): walidacja `tsc --noEmit`, `eslint`, testy CRUD w pipeline (opcjonalnie).
- Prefetch krytycznych tras publicznych; ewentualna wirtualizacja list w admin przy dużych datasetach.
- Rozszerzenie polityk RODO/cookies na dedykowane podstrony z linkami w BIP i stopce.

