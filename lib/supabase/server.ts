// Cria o cliente Supabase para uso no servidor (Server Components)
// Usado em páginas sem 'use client' — leitura de dados protegidos, SSR, etc.
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  // Lê os cookies do browser para manter a sessão do utilizador
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Devolve todos os cookies actuais
        getAll() {
          return cookieStore.getAll()
        },
        // Guarda cookies novos (sessão, token, etc.)
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Ignorar erros de cookies em Server Components de leitura
          }
        },
      },
    }
  )
}