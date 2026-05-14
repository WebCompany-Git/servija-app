// Cria o cliente Supabase para uso no browser (componentes cliente)
// Usado em páginas com 'use client' — login, formulários, chat, etc.
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  )
}

