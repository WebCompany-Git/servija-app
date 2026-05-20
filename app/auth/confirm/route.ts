import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type')

  console.log('🔑 Confirmação recebida:', { code: !!code, token_hash: !!token_hash, type })

  const supabase = await createClient()
  let sessionError = null

  // Tenta com code primeiro (formato novo)
  if (code) {
    console.log('📧 A confirmar com code...')
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    sessionError = error
    if (error) console.error('❌ Erro ao confirmar code:', error)
    else console.log('✅ Code confirmado com sucesso')
  } 
  // Tenta com token_hash (formato antigo)
  else if (token_hash && type) {
    console.log('📧 A confirmar com token_hash...')
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as any,
    })
    sessionError = error
    if (error) console.error('❌ Erro ao confirmar token_hash:', error)
    else console.log('✅ Token_hash confirmado com sucesso')
  } 
  // Se não tem nenhum, erro
  else {
    console.error('❌ Nenhum code ou token_hash recebido')
    return NextResponse.redirect(`${origin}/error`)
  }

  if (sessionError) {
    console.error('❌ Erro de sessão:', sessionError)
    return NextResponse.redirect(`${origin}/error`)
  }

  // Aguardar trigger criar perfil (1.5 segundos)
  console.log('⏳ A aguardar trigger criar perfil...')
  await new Promise(resolve => setTimeout(resolve, 1500))

  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    console.error('❌ Erro ao buscar utilizador:', userError)
    return NextResponse.redirect(`${origin}/error`)
  }

  console.log('👤 Utilizador confirmado:', user.email)

  // Buscar perfil
  const { data: perfil, error: perfilError } = await supabase
    .from('perfis')
    .select('tipo, status')
    .eq('user_id', user.id)
    .single()

  if (perfilError) {
    console.error('❌ Erro ao buscar perfil:', perfilError)
    // Se não tem perfil, criar manualmente
    console.log('🔨 A criar perfil manualmente...')
    const { error: insertError } = await supabase
      .from('perfis')
      .insert({
        user_id: user.id,
        nome_completo: user.user_metadata?.nome_completo || 'Utilizador',
        telefone: user.user_metadata?.telefone || '',
        tipo: user.user_metadata?.tipo || 'cliente',
        status: 'ativo',
      })
    
    if (insertError) {
      console.error('❌ Erro ao criar perfil:', insertError)
      return NextResponse.redirect(`${origin}/error`)
    }
    
    console.log('✅ Perfil criado manualmente')
    // Redirecionar conforme tipo
    const tipo = user.user_metadata?.tipo || 'cliente'
    if (tipo === 'tecnico') return NextResponse.redirect(`${origin}/tecnico/verificacao`)
    return NextResponse.redirect(`${origin}/cliente/dashboard`)
  }

  // Verificar se está bloqueado
  if (perfil.status === 'bloqueado') {
    console.log('🚫 Utilizador bloqueado')
    return NextResponse.redirect(`${origin}/error?message=conta-bloqueada`)
  }

  console.log('✅ A redirecionar para dashboard:', perfil.tipo)

  // Redirecionar conforme tipo
  if (perfil.tipo === 'admin') return NextResponse.redirect(`${origin}/admin`)
  if (perfil.tipo === 'tecnico') return NextResponse.redirect(`${origin}/tecnico/verificacao`)
  return NextResponse.redirect(`${origin}/cliente/dashboard`)
}
