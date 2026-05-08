// Ficheiro auxiliar do middleware — lógica de autenticação Supabase
// Importado pelo middleware.ts da raiz
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  // Cria cliente Supabase com acesso aos cookies da sessão
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

  // Verifica se o utilizador está autenticado
  const { data: { user } } = await supabase.auth.getUser()

  // Define rotas protegidas
  const isCliente = request.nextUrl.pathname.startsWith('/cliente')
  const isTecnico = request.nextUrl.pathname.startsWith('/tecnico') &&
                    !request.nextUrl.pathname.startsWith('/tecnico/')
  const isAdmin   = request.nextUrl.pathname.startsWith('/admin')

  // Redireciona para login se não autenticado
  if ((isCliente || isTecnico || isAdmin) && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Apenas admins acedem ao painel admin
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
  matcher: ['/cliente/:path*', '/tecnico/:path*', '/admin/:path*'],
}