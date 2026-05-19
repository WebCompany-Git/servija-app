import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type')

  if (code || token_hash) {
    const supabase = await createClient()

    let error = null

    if (code) {
      const result = await supabase.auth.exchangeCodeForSession(code)
      error = result.error
    } else if (token_hash && type) {
      const result = await supabase.auth.verifyOtp({ token_hash, type: type as any })
      error = result.error
    }

    if (!error) {
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        // Aguardar o trigger criar o perfil
        await new Promise(resolve => setTimeout(resolve, 1000))

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
          // Cliente ou perfil ainda não criado — vai para dashboard
          return NextResponse.redirect(`${origin}/cliente/dashboard`)
        }
      }
    }
  }

  return NextResponse.redirect(`${origin}/error`)
}
