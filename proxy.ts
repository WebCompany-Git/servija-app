import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const pathname = request.nextUrl.pathname

  const isCliente = pathname.startsWith('/cliente')
  const isAdmin = pathname.startsWith('/admin')
  const rotasTecnicoProtegidas = [
    '/tecnico/dashboard', '/tecnico/agenda', '/tecnico/servicos',
    '/tecnico/horarios', '/tecnico/chat', '/tecnico/estatisticas',
    '/tecnico/selos', '/tecnico/verificacao', '/tecnico/denuncias',
    '/tecnico/perfil',
  ]
  const isTecnicoProtegido = rotasTecnicoProtegidas.some(r =>
    pathname.startsWith(r)
  )

  if ((isCliente || isTecnicoProtegido || isAdmin) && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isAdmin && user) {
    const { data: perfil } = await supabase
      .from('perfis')
      .select('tipo')
      .eq('user_id', user.id)
      .single()
    if (perfil?.tipo !== 'admin') {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/cliente/:path*',
    '/tecnico/dashboard/:path*',
    '/tecnico/agenda/:path*',
    '/tecnico/servicos/:path*',
    '/tecnico/horarios/:path*',
    '/tecnico/chat/:path*',
    '/tecnico/estatisticas/:path*',
    '/tecnico/selos/:path*',
    '/tecnico/verificacao/:path*',
    '/tecnico/denuncias/:path*',
    '/tecnico/perfil/:path*',
    '/admin/:path*',
  ],
}
