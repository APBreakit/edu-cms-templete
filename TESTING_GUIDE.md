# Przewodnik Testowania - Przedszkole Nazaret

## Status Migracji
✅ Supabase → Neon Database (PostgreSQL)
✅ Autentykacja: Custom JWT z NEXTAUTH_SECRET
✅ Storage: Vercel Blob
✅ Wszystkie funkcje admin przeniesione na server actions

---

## 1. AUTENTYKACJA

### Test logowania:
1. Przejdź do `/admin/login`
2. Wprowadź dane logowania z tabeli `users` w Neon
3. Sprawdź czy po zalogowaniu przekierowuje do `/admin`
4. Middleware powinien chronić wszystkie trasy `/admin/*`

**Gdzie sprawdzić użytkowników:**
- Tabela: `users` w Neon Database
- Hasła są hashowane bcrypt
- Email i hasło muszą być poprawne

**Funkcje auth:**
- `lib/auth.ts` - getSession(), createSession(), deleteSession()
- `app/api/auth/login/route.ts` - endpoint logowania
- `app/api/auth/logout/route.ts` - endpoint wylogowania
- `middleware.ts` - ochrona tras admin

---

## 2. POSTY (Posts)

### Server Actions:
- `getPosts(type?)` - lista postów (aktualności/ogłoszenia/konkursy)
- `getPost(id)` - pojedynczy post
- `createPost(data)` - nowy post
- `updatePost(id, data)` - edycja posta
- `deletePost(id)` - usunięcie posta

### Test tworzenia posta:
1. Przejdź do `/admin/posts/new`
2. Wypełnij formularz:
   - Tytuł
   - Treść (markdown wspierany)
   - Typ (aktualność/ogłoszenie/konkurs)
   - Zdjęcie (opcjonalne - upload przez Vercel Blob)
   - Grupa (opcjonalne)
3. Kliknij "Opublikuj"
4. Sprawdź czy post pojawia się na `/admin/posts`
5. Sprawdź czy widoczny na stronie głównej `/aktualnosci`

### Test edycji posta:
1. Przejdź do `/admin/posts`
2. Kliknij "Edytuj" przy wybranym poście
3. Zmień dane
4. Zapisz
5. Sprawdź czy zmiany są widoczne

### Test usuwania:
1. Lista postów → Kliknij "Usuń"
2. Potwierdź
3. Sprawdź czy post zniknął

**Tabela w bazie:** `posts`
**Komponenty:**
- `app/admin/posts/page.tsx` - lista
- `app/admin/posts/new/page.tsx` - nowy post
- `app/admin/posts/[id]/edit/page.tsx` - edycja
- `components/admin/post-form.tsx` - formularz

---

## 3. GALERIE (Galleries)

### Server Actions:
- `getGalleries()` - lista galerii
- `getGallery(id)` - pojedyncza galeria
- `createGallery(data, images)` - nowa galeria
- `updateGallery(id, data)` - edycja galerii
- `addGalleryImage()` - dodaj zdjęcie do galerii
- `deleteGalleryImage()` - usuń zdjęcie
- `moveGalleryImage()` - zmień kolejność
- `deleteGallery(id)` - usuń galerię

### Test tworzenia galerii:
1. Przejdź do `/admin/galleries/new`
2. Wypełnij:
   - Nazwa galerii
   - Opis
   - Kategoria (przedszkole/wydarzenia/wycieczki)
   - Zdjęcie okładki
   - Galeria zdjęć (wiele plików)
3. Zapisz
4. Sprawdź na `/admin/galleries`

### Test zarządzania zdjęciami:
1. Otwórz galerię do edycji
2. Dodaj nowe zdjęcia
3. Zmień kolejność (drag & drop)
4. Usuń zdjęcie
5. Zapisz zmiany

**Tabele:** `galleries`, `gallery_images`
**Upload:** Przez Vercel Blob z optymalizacją

---

## 4. GRUPY (Groups)

### Server Actions:
- `getGroups()` - lista grup
- `getGroup(slug)` - pojedyncza grupa
- `updateGroup(slug, data)` - edycja grupy

### Test edycji grupy:
1. Przejdź do `/admin/groups`
2. Wybierz grupę (np. "motylki")
3. Edytuj:
   - Nazwę
   - Opis
   - Wiek dzieci
   - Opiekunów
4. Zapisz
5. Sprawdź na stronie publicznej `/grupa/motylki`

**Tabela:** `groups`
**Uwaga:** Grupy są predefiniowane, tylko edycja (nie dodawanie/usuwanie)

---

## 5. MEDIA

### Server Actions:
- `getMediaFiles()` - lista plików
- `createMediaFile(data)` - dodaj plik
- `deleteMedia(id)` - usuń plik

### Test uploadu:
1. Przejdź do `/admin/media`
2. Kliknij "Dodaj media"
3. Wybierz pliki (jpg, png, pdf, doc, docx)
4. Wprowadź tytuł i kategorię
5. Upload
6. Sprawdź czy widoczne na liście

### Test usuwania:
1. Lista mediów → Kliknij "Usuń"
2. Potwierdź
3. Plik usunięty z listy i Vercel Blob

**Tabela:** `media`
**Storage:** Vercel Blob (BLOB_READ_WRITE_TOKEN)
**API:** `/api/upload` - endpoint do uploadu plików

---

## 6. KALENDARZ

### Server Actions:
- `getCalendarEvents()` - lista wydarzeń

### Test:
1. Przejdź do `/admin/calendar`
2. Sprawdź czy wydarzenia z tabeli `posts` są widoczne
3. Wydarzenia to posty typu "aktualność" z datą w treści

**Tabela:** `posts` (filtrowane po typie)
**Komponent:** `components/admin/calendar-view.tsx`

---

## 7. JADŁOSPIS (Meal Plan)

### Server Actions:
- `getMealPlans()` - lista jadłospisów
- `createMealPlan(data)` - nowy jadłospis
- `getLatestMealPlan()` - aktualny jadłospis
- `deleteMealPlan(id)` - usuń jadłospis

### Test:
1. Przejdź do `/admin/meal-plan`
2. Wybierz plik PDF z jadłospisem
3. Upload
4. Sprawdź czy widoczny na `/posilki`
5. Tylko jeden jadłospis może być aktywny (nowy zastępuje stary)

**Tabela:** `meal_plans`
**Format:** PDF
**Storage:** Vercel Blob

---

## 8. RADA RODZICÓW

### Server Actions:
- `getRadaRodzicowData()` - posty i dokumenty
- `createRadaRodzicowDocument(data)` - dodaj dokument
- `deleteRadaRodzicowDocument(id)` - usuń dokument

### Test dokumentów:
1. Przejdź do `/admin/rada-rodzicow`
2. Zakładka "Dokumenty"
3. Dodaj nowy dokument (PDF, DOC, DOCX)
4. Sprawdź na `/rada-rodzicow`

### Test postów:
1. Zakładka "Posty"
2. Utwórz nowy post dla Rady Rodziców
3. Zapisz
4. Sprawdź na stronie publicznej

**Tabele:** `rada_rodzicow_documents`, `posts` (z flagą rada_rodzicow=true)

---

## 9. STATYSTYKI DASHBOARD

Server Action: `getAdminStats()`

### Test:
1. Przejdź do `/admin`
2. Sprawdź czy statystyki są poprawne:
   - Liczba postów
   - Liczba aktualności
   - Liczba ogłoszeń
   - Liczba konkursów
   - Liczba plików media
   - Liczba grup

**Zapytania SQL:** Zliczanie rekordów z różnych tabel

---

## DEBUGOWANIE

### Logi w konsoli:
Wszystkie kluczowe operacje mają logi `console.log("[v0] ...")`:
- Upload plików
- Zapisywanie do bazy
- Błędy
- Operacje CRUD

### Gdzie sprawdzać logi:
- **Przeglądarka:** F12 → Console (client-side)
- **Vercel:** Deployment Logs (server-side)

### Częste problemy:

**1. "Load failed"**
- Sprawdź czy NEXTAUTH_SECRET jest ustawiony
- Sprawdź DATABASE_URL w zmiennych środowiskowych

**2. "Uncached promise"**
- Middleware już obsługuje auth
- Usuń dodatkowe wywołania getSession() w komponentach

**3. Upload nie działa**
- Sprawdź BLOB_READ_WRITE_TOKEN
- Max rozmiar pliku: 10MB
- API: `/api/upload`

**4. Nie można zalogować**
- Sprawdź tabelę `users` w Neon
- Hasło musi być zahashowane bcrypt
- Email musi być poprawny

---

## BAZA DANYCH - NEON

### Tabele główne:
1. `users` - użytkownicy admin
2. `posts` - aktualności, ogłoszenia, konkursy
3. `groups` - grupy przedszkolne
4. `galleries` - galerie zdjęć
5. `gallery_images` - zdjęcia w galeriach
6. `media` - pliki mediów
7. `meal_plans` - jadłospisy
8. `rada_rodzicow_documents` - dokumenty rady rodziców

### Połączenie:
\`\`\`typescript
import { neon } from '@neondatabase/serverless'
const sql = neon(process.env.DATABASE_URL!)
\`\`\`

### Przykład query:
\`\`\`typescript
const posts = await sql`
  SELECT * FROM posts 
  WHERE type = 'aktualnosc' 
  ORDER BY created_at DESC
`
\`\`\`

---

## VERCEL BLOB

### Upload:
\`\`\`typescript
import { put } from '@vercel/blob'

const blob = await put(file.name, file, {
  access: 'public',
  addRandomSuffix: true
})

// blob.url - publiczny URL pliku
\`\`\`

### Maksymalny rozmiar: 10MB
### Formaty: JPG, PNG, PDF, DOC, DOCX

---

## CHECKLIST FINALNY

- [ ] Logowanie działa
- [ ] Tworzenie postów działa
- [ ] Edycja postów działa
- [ ] Usuwanie postów działa
- [ ] Galerie działają
- [ ] Upload zdjęć działa
- [ ] Zarządzanie grupami działa
- [ ] Upload mediów działa
- [ ] Kalendarz wyświetla wydarzenia
- [ ] Jadłospis można uploadować
- [ ] Rada Rodziców - dokumenty i posty działają
- [ ] Statystyki na dashboardzie są poprawne
- [ ] Middleware chroni trasy admin
- [ ] Sesja JWT działa poprawnie

---

## KONTAKT / SUPPORT

W razie problemów:
1. Sprawdź logi w konsoli (F12)
2. Sprawdź deployment logs w Vercel
3. Sprawdź zmienne środowiskowe
4. Sprawdź tabelę users w Neon
