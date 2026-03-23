# Konfiguracja Netlify - Krok po kroku

## Błąd: "NEXTAUTH_SECRET is required in production"

Ten błąd występuje, gdy brakuje wymaganej zmiennej środowiskowej w Netlify. Poniżej znajdziesz instrukcję, jak to naprawić.

## Krok 1: Wejdź do panelu Netlify

1. Zaloguj się na https://app.netlify.com
2. Wybierz swoją stronę (kspgdynia)
3. Przejdź do **Site configuration** → **Environment variables**

## Krok 2: Dodaj wymagane zmienne środowiskowe

Kliknij **Add a variable** i dodaj następujące zmienne:

### 1. NEXTAUTH_SECRET (WYMAGANE)
```
Klucz: NEXTAUTH_SECRET
Wartość: <wygeneruj losowy ciąg minimum 32 znaki>
```

**Jak wygenerować bezpieczny sekret:**
- Opcja A - w terminalu:
  ```bash
  openssl rand -base64 32
  ```
- Opcja B - online generator: https://generate-secret.vercel.app/32
- Opcja C - użyj menedżera haseł do wygenerowania losowego ciągu (32+ znaków)

Przykład: `3k9mP2xR5nQ8wL7jT1vY6bN4sG0hD9fC5mK2pW8rE3xZ1`

### 2. DATABASE_URL (WYMAGANE)
```
Klucz: DATABASE_URL
Wartość: postgresql://user:password@host:port/database
```

Jeśli używasz Neon.tech:
1. Zaloguj się na https://neon.tech
2. Wybierz projekt
3. Skopiuj **Connection string** z zakładki Dashboard

### 3. JWT_SECRET (WYMAGANE)
```
Klucz: JWT_SECRET
Wartość: <wygeneruj losowy ciąg>
```

Może być taki sam jak NEXTAUTH_SECRET lub osobny.

### 4. BLOB_READ_WRITE_TOKEN (WYMAGANE)
```
Klucz: BLOB_READ_WRITE_TOKEN
Wartość: <token z Vercel Blob>
```

Aby uzyskać token:
1. Zaloguj się na https://vercel.com
2. Przejdź do Storage → Blob
3. Skopiuj token

### 5. ADMIN_PASSWORD (WYMAGANE)
```
Klucz: ADMIN_PASSWORD
Wartość: <bezpieczne hasło administratora>
```

### 6. NEXT_PUBLIC_SITE_URL (OPCJONALNE)
```
Klucz: NEXT_PUBLIC_SITE_URL
Wartość: https://kspgdynia.pl
```

### 7. NEXT_PUBLIC_SUPABASE_URL i NEXT_PUBLIC_SUPABASE_ANON_KEY (OPCJONALNE)
Jeśli używasz Supabase:
```
Klucz: NEXT_PUBLIC_SUPABASE_URL
Wartość: https://twoj-projekt.supabase.co

Klucz: NEXT_PUBLIC_SUPABASE_ANON_KEY
Wartość: <klucz z Supabase>
```

## Krok 3: Zapisz zmienne

Po dodaniu wszystkich zmiennych, kliknij **Save**.

## Krok 4: Uruchom ponownie deployment

1. Przejdź do zakładki **Deploys**
2. Kliknij **Trigger deploy** → **Deploy site**
3. Poczekaj na zakończenie procesu

## Krok 5: Sprawdź deployment

Po zakończeniu deploymentu:
1. Sprawdź logi w zakładce **Deploy log**
2. Upewnij się, że build zakończył się sukcesem (✓)
3. Otwórz stronę i sprawdź, czy działa poprawnie

## Troubleshooting

### Nadal pojawia się błąd po dodaniu zmiennych?
1. Upewnij się, że `NEXTAUTH_SECRET` ma minimum 32 znaki
2. Sprawdź, czy nie ma literówek w nazwach zmiennych
3. Kliknij **Clear cache and retry deploy**

### Jak sprawdzić, czy zmienne są ustawione?
W zakładce **Environment variables** powinieneś zobaczyć listę wszystkich zmiennych (wartości są ukryte z bezpieczeństwa).

### Database connection error?
1. Sprawdź, czy `DATABASE_URL` jest poprawny
2. Upewnij się, że baza danych akceptuje połączenia z Internetu
3. Sprawdź, czy uruchomiłeś migracje: `node scripts/migrate_to_neon.mjs`

## Dodatkowe wskazówki

- **Nigdy nie commituj prawdziwych sekretów do repozytorium**
- **Używaj silnych, losowych wartości dla sekretów**
- **Regularnie zmieniaj hasła produkcyjne**
- **Zachowaj kopię wszystkich sekretów w bezpiecznym miejscu (menedżer haseł)**

## Potrzebujesz pomocy?

Jeśli nadal masz problemy, skontaktuj się z zespołem wsparcia Netlify lub sprawdź dokumentację:
- https://docs.netlify.com/environment-variables/overview/
