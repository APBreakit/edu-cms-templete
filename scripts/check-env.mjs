#!/usr/bin/env node

/**
 * Skrypt sprawdzający czy wszystkie wymagane zmienne środowiskowe są ustawione
 */

import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { existsSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '..')

// Załaduj zmienne z .env jeśli plik istnieje
const envPath = join(rootDir, '.env')
if (existsSync(envPath)) {
  config({ path: envPath })
}

const requiredEnvVars = {
  DATABASE_URL: 'PostgreSQL database connection string',
  JWT_SECRET: 'Secret key for JWT tokens',
  NEXTAUTH_SECRET: 'Secret key for NextAuth (minimum 32 characters)',
  ADMIN_PASSWORD: 'Default admin password',
  BLOB_READ_WRITE_TOKEN: 'Vercel Blob storage token',
}

const optionalEnvVars = {
  NEXT_PUBLIC_SITE_URL: 'Public site URL',
  NEXT_PUBLIC_SUPABASE_URL: 'Supabase project URL',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: 'Supabase anonymous key',
}

console.log('🔍 Sprawdzanie zmiennych środowiskowych...\n')

let hasErrors = false
let hasWarnings = false

// Sprawdź wymagane zmienne
console.log('📋 Wymagane zmienne:')
for (const [key, description] of Object.entries(requiredEnvVars)) {
  const value = process.env[key]
  if (!value) {
    console.log(`  ❌ ${key} - BRAK (${description})`)
    hasErrors = true
  } else if (value.includes('placeholder') || value.includes('your_')) {
    console.log(`  ⚠️  ${key} - używa wartości placeholder (${description})`)
    hasWarnings = true
  } else {
    // Sprawdź długość NEXTAUTH_SECRET
    if (key === 'NEXTAUTH_SECRET' && value.length < 32) {
      console.log(`  ❌ ${key} - za krótki (minimum 32 znaki, obecna: ${value.length})`)
      hasErrors = true
    } else {
      console.log(`  ✅ ${key} - OK`)
    }
  }
}

console.log('\n📋 Opcjonalne zmienne:')
for (const [key, description] of Object.entries(optionalEnvVars)) {
  const value = process.env[key]
  if (!value) {
    console.log(`  ⚠️  ${key} - nie ustawiona (${description})`)
  } else {
    console.log(`  ✅ ${key} - OK`)
  }
}

console.log('\n' + '='.repeat(60))
if (hasErrors) {
  console.log('❌ Wykryto błędy w konfiguracji zmiennych środowiskowych!')
  console.log('\n💡 Rozwiązanie:')
  console.log('1. Skopiuj .env.example do .env.local')
  console.log('2. Uzupełnij wszystkie wymagane zmienne')
  console.log('3. Wygeneruj NEXTAUTH_SECRET: openssl rand -base64 32')
  console.log('\n📖 Więcej informacji: DEPLOYMENT.md')
  process.exit(1)
} else if (hasWarnings) {
  console.log('⚠️  Konfiguracja zawiera wartości placeholder')
  console.log('Upewnij się, że są to prawidłowe wartości przed wdrożeniem!')
} else {
  console.log('✅ Wszystkie wymagane zmienne środowiskowe są poprawnie skonfigurowane!')
}

console.log('='.repeat(60) + '\n')
