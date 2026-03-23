# Raport postępu prac

## 1. Paginacja i wyszukiwanie w panelu „Posty”
- Dodano obsługę `LIMIT/OFFSET` z parametrem `page` oraz formularz GET dla pole „Szukaj postów”.
- Zmiany: `app/admin/posts/page.tsx` — typowanie `searchParams`, wyliczanie `limit`/`page`, `OFFSET`, formularz GET.
- Status: Zakończone, przetestowane — lista działa stabilnie.

## 2. Indeksy SQL dla kluczowych pól
- Dodano indeksy: `posts(type)`, `posts(status)`, `posts(calendar_date)`, `galleries(slug)`, `meal_plans(is_current)`.
- Zmiany: `scripts/migrate_to_neon.mjs` — blok `DO $$` wewnątrz `migrationSql`.
- Migracja uruchomiona: sukces (`Tables created successfully.`).

## 3. Ujednolicenie PostForm (+ typ „rada-rodzicow”)
- Dodano opcję typu `rada-rodzicow` w selektorze.
- Formularz zgodny z modelem: `title/content/excerpt/type/status/image_url/add_to_calendar/calendar_*` itd.
- Zmiany: `components/admin/post-form.tsx`.
- Status: Zakończone.

## Dodatkowe wykonane wcześniej
- Stabilizacja hydracji (baner cookies): `components/cookie-consent-manager.tsx`.
- Kompatybilne wywołania SQL (`sql.query`/tagowany `sql`): galerie, media, API postów.
- RLS dla Neon + ustawianie roli admin w server actions.
- Centralny jadłospis z `is_current` i lista w panelu; link na stronie głównej i w grupach.
- Animacje przejść i pasek postępu w panelu admin oraz skeletony w Posty/Galerie.
- Link adresu w stopce do Google Maps.

## Następne kroki (propozycje)
- Dodać paginację w innych listach (Galerie/Media) i filtry statusu.
- Włączyć walidację TS/ESLint na CI (bez ignorowania błędów).
- Dodać indeksy dla dodatkowych pól wg potrzeb (np. `posts(slug)`).
## 4. Paginacja i wyszukiwanie w „Galerie” i „Media”
- Galerie: limit/offset, formularz GET z polem „Szukaj galerii”.
- Media: limit/offset, filtr `type/category` + pole „Szukaj plików”.
- Zmiany: `app/admin/galleries/page.tsx`, `app/admin/media/page.tsx`.

## 5. Walidacja TS/ESLint na build
- Wyłączono ignorowanie błędów w `next.config.mjs` (`ignoreDuringBuilds=false`, `ignoreBuildErrors=false`).
- Proponowane: dodać workflow CI (GitHub Actions) z `tsc --noEmit` i `eslint`.
## 6. Paginacja UI w tabelach admin
- Dodano przyciski „Poprzednia/Następna” budujące URL z parametrami.
- Zmiany: `app/admin/posts/page.tsx`, `app/admin/galleries/page.tsx`, `app/admin/media/page.tsx`.
- Status: Zakończone.
- Hardening backend akcji admin:
  - Slugify PL i unikalność slugów (posty/galerie), normalizacja dat.
  - Walidacje wejścia (wymagalne tytuły, pliki w jadłospisie).
  - Korekty uprawnień (deleteGallery → galleries, RR docs → rada_rodzicow).
## 7. Unikalne indeksy po `slug`
- Dodano warunkowo unikalne indeksy: `idx_posts_slug`, `idx_galleries_slug_unique` (jeśli nie istnieją).
- Zmiany: `scripts/migrate_to_neon.mjs`.

## 8. Testy CRUD modułów admin (z Neon)
- Posty: create/update/delete — działa.
- Galerie: create/add image/update/delete — działa.
- Media: create/delete — działa.
- Grupy: update i revert na „czerwona” — działa.
- Jadłospis: create/set current/delete — działa.
- Rada Rodziców: document create/delete, post create/delete — działa.
- Zrealizowano skrypt: `scripts/admin_crud_tests.mjs` — loguje wyniki.
- Komenda npm: `npm run test:admin-crud` (wymaga ustawionego `DATABASE_URL`).
- Zalecenie: uruchamiać przed releasem i po większych zmianach backendu.

## 9. Co jeszcze zostało do zrobienia
- Walidacje formularzy (Posty/Galerie/Media/Grupy): wymagane pola, typy plików, limity rozmiaru — wdrożone.
- Ujednolicić mapowania `type/status` w całym UI (w tym „Rada Rodziców”).
- Ujednolicenie typów: Posty/Filtry/Detale używają `aktualnosci/ogloszenia/konkursy/rada-rodzicow` — wdrożone.
- Ujednolicić mapowania `type/status` w całym UI (w tym „Rada Rodziców”).
- Dodać paginację/search w „Rada Rodziców” (dokumenty i posty) oraz w „Grupy” (lista).
- Opcjonalnie dodać workflow CI (GitHub Actions) z `tsc --noEmit`, `eslint`, `next build`.
- Rozszerzyć panel zarządzania administratorami (lista użytkowników, edycja uprawnień sekcji).
- Rozważyć ograniczenie widoku szkiców do adminów (RLS + filtrowanie po `status='published'` w publicznych zapytaniach).
- Usprawnienia wydajności: dodatkowe indeksy (np. `posts(slug)`), caching dla `getCalendarEvents`/statystyk.
- Upload: automatyczna kompresja i obsługa błędów/timeoutów, lepsze komunikaty 503 lokalnie.
- Testy: cykliczne uruchamianie `npm run test:admin-crud` przed releasem; później rozważyć testy jednostkowe/integrowane.
### Walidacje — szczegóły
- Media: typy plików i limit rozmiaru po stronie UI i serwera.
- Rada Rodziców: limit rozmiaru i typy plików dla dokumentów; limit 5MB dla obrazów.
- Grupy: typy dokumentów i limit rozmiaru.
- Posty: limit rozmiaru obrazów (wcześniej dodane), wymagane tytuły.
