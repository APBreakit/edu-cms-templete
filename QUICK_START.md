# Szybki Start - KSP Nazaret

## ✅ Projekt gotowy do wdrożenia!

Aplikacja została pomyślnie zbudowana i jest gotowa do uruchomienia na Netlify.

## Co już działa:

- ✅ Build przechodzi bez błędów
- ✅ Middleware poprawnie skonfigurowany
- ✅ Wszystkie strony zbudowane (24 tras)
- ✅ Panel administracyjny gotowy
- ✅ System CMS w pełni funkcjonalny

## Następne kroki (5 minut):

### 1. Skonfiguruj zmienne środowiskowe w Netlify

Przejdź do: **Site configuration** → **Environment variables**

**Wymagane zmienne:**

```bash
# Wygeneruj bezpieczny sekret (min. 32 znaki)
NEXTAUTH_SECRET=<wygeneruj: openssl rand -base64 32>

# Connection string do bazy PostgreSQL
DATABASE_URL=postgresql://user:password@host:port/database

# Klucz JWT (może być taki sam jak NEXTAUTH_SECRET)
JWT_SECRET=<wygeneruj: openssl rand -base64 32>

# Token Vercel Blob Storage
BLOB_READ_WRITE_TOKEN=<token z vercel.com/storage>

# Hasło domyślnego konta admin
ADMIN_PASSWORD=<twoje_bezpieczne_hasło>

# URL twojej strony
NEXT_PUBLIC_SITE_URL=https://kspgdynia.pl
```

**Opcjonalne (jeśli używasz Supabase):**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://twoj-projekt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<klucz z Supabase>
```

### 2. Uruchom migracje bazy danych

Jeśli jeszcze nie utworzyłeś tabel w bazie:

```bash
node scripts/migrate_to_neon.mjs
```

### 3. Trigger deploy na Netlify

Po dodaniu zmiennych:
1. Przejdź do **Deploys**
2. Kliknij **Trigger deploy** → **Deploy site**
3. Poczekaj na zakończenie (ok. 2-3 minuty)

### 4. Zaloguj się do panelu admina

Po pomyślnym deployment:
1. Przejdź na: `https://twoja-domena.netlify.app/admin`
2. Zaloguj się używając:
   - Email: admin z bazy danych
   - Hasło: wartość z `ADMIN_PASSWORD`

## Dodatkowe zasoby:

- **NETLIFY_SETUP.md** - szczegółowa instrukcja konfiguracji Netlify
- **DEPLOYMENT.md** - ogólne informacje o deploymencie
- **README.md** - pełna dokumentacja projektu

## Potrzebujesz pomocy?

### Gdzie uzyskać wymagane zasoby:

**Baza danych (DATABASE_URL):**
- Zalecane: [Neon.tech](https://neon.tech) (darmowy plan, bez karty)
- Alternatywa: [Supabase](https://supabase.com)

**Storage (BLOB_READ_WRITE_TOKEN):**
- [Vercel Blob Storage](https://vercel.com/storage)
- Darmowy plan: 500MB

### Jak wygenerować bezpieczne sekrety:

**W terminalu (Mac/Linux):**
```bash
openssl rand -base64 32
```

**Online generator:**
- https://generate-secret.vercel.app/32

**Menedżer haseł:**
- Wygeneruj losowy ciąg 32+ znaków

## Troubleshooting:

**Build nadal się nie udaje?**
- Sprawdź, czy wszystkie zmienne są dodane w Netlify
- Upewnij się, że `NEXTAUTH_SECRET` ma minimum 32 znaki
- Kliknij **Clear cache and retry deploy**

**Strona nie działa po deploymencie?**
- Sprawdź logi w Netlify: **Deploys** → **Deploy log**
- Upewnij się, że baza danych jest dostępna z Internetu
- Sprawdź, czy uruchomiłeś migracje

**Nie możesz się zalogować do admina?**
- Sprawdź, czy użytkownik admin istnieje w bazie
- Użyj skryptu: `node scripts/add_admin_user.mjs`
- Sprawdź hasło w zmiennej `ADMIN_PASSWORD`

---

**Powodzenia!** 🚀

Jeśli wszystko pójdzie dobrze, za 10 minut będziesz mieć działającą stronę szkoły!
