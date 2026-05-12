import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Buscar tipo do utilizador e redirecionar
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        const { data: perfil } = await supabase
          .from('perfis')
          .select('tipo')
          .eq('user_id', user.id)
          .single()

        if (perfil?.tipo === 'admin') {
          return NextResponse.redirect(`${origin}/admin`)
        } else if (perfil?.tipo === 'tecnico') {
          return NextResponse.redirect(`${origin}/tecnico/dashboard`)
        } else {
          return NextResponse.redirect(`${origin}/cliente/dashboard`)
        }
      }
    }
  }

  // Se algo correu mal redireciona para erro
  return NextResponse.redirect(`${origin}/error`)
}