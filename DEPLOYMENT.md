# Instrukcja wdrożenia na Netlify

## Wymagane zmienne środowiskowe

Aby aplikacja działała poprawnie w produkcji, musisz skonfigurować następujące zmienne środowiskowe w panelu Netlify:

### 1. Baza danych
```
DATABASE_URL=postgresql://user:password@host:port/database
```
Połączenie z bazą danych PostgreSQL (np. Neon, Supabase)

### 2. Uwierzytelnianie
```
NEXTAUTH_SECRET=<wygeneruj_bezpieczny_losowy_ciąg_znaków_minimum_32_znaki>
JWT_SECRET=<wygeneruj_bezpieczny_losowy_ciąg_znaków>
```
Sekrety do szyfrowania sesji i tokenów JWT.

**Jak wygenerować bezpieczny sekret:**
```bash
openssl rand -base64 32
```

### 3. Hasło administratora
```
ADMIN_PASSWORD=<twoje_bezpieczne_hasło>
```
Domyślne hasło dla konta administratora.

### 4. Storage (Vercel Blob)
```
BLOB_READ_WRITE_TOKEN=<token_z_vercel_blob>
```
Token dostępu do Vercel Blob Storage dla przechowywania plików.

### 5. Adres strony
```
NEXT_PUBLIC_SITE_URL=https://kspgdynia.pl
```
Pełny URL twojej strony (używany do generowania linków).

### 6. Supabase (opcjonalne, jeśli używasz)
```
NEXT_PUBLIC_SUPABASE_URL=<twój_supabase_url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<twój_supabase_anon_key>
```

## Konfiguracja w Netlify

1. Przejdź do panelu Netlify
2. Wybierz swoją stronę
3. Przejdź do **Site configuration** → **Environment variables**
4. Dodaj wszystkie wymagane zmienne środowiskowe
5. Kliknij **Save**
6. Uruchom ponownie deployment

## Kolejność wdrożenia

1. Skonfiguruj bazę danych PostgreSQL (Neon/Supabase)
2. Uruchom migracje bazy danych
3. Skonfiguruj Vercel Blob Storage
4. Ustaw zmienne środowiskowe w Netlify
5. Uruchom deployment

## Troubleshooting

### Błąd: "NEXTAUTH_SECRET is required in production"
- Upewnij się, że zmienna `NEXTAUTH_SECRET` jest ustawiona w Netlify
- Wartość musi mieć minimum 32 znaki
- Po dodaniu zmiennej uruchom ponownie deployment

### Błąd: "DATABASE_URL is not defined"
- Sprawdź, czy `DATABASE_URL` jest poprawnie skonfigurowany
- Upewnij się, że baza danych jest dostępna z Internetu
- Sprawdź format connection string

## Bezpieczeństwo

⚠️ **WAŻNE:**
- Nigdy nie commituj prawdziwych sekretów do repozytorium
- Używaj silnych, losowych sekretów
- Regularnie rotuj sekrety produkcyjne
- Ograniczaj dostęp do panelu Netlify
