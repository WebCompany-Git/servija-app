'use client'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function useAuth() {
  const supabase = createClient()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  // LOGIN
  async function login(email: string, password: string) {
    setLoading(true)
    setErro(null)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) {
        setErro('Email ou password incorrectos.')
        return false
      }
      // Buscar tipo do utilizador
      const { data: perfil } = await supabase
        .from('perfis')
        .select('tipo, status')
        .eq('user_id', data.user.id)
        .single()

      if (perfil?.status === 'bloqueado') {
        setErro('A tua conta foi suspensa. Contacta o suporte.')
        await supabase.auth.signOut()
        return false
      }

      // Redirecionar conforme o tipo
      if (perfil?.tipo === 'admin') router.push('/admin')
      else if (perfil?.tipo === 'tecnico') router.push('/tecnico/dashboard')
      else router.push('/cliente/dashboard')

      return true
    } catch {
      setErro('Erro ao entrar. Tenta novamente.')
      return false
    } finally {
      setLoading(false)
    }
  }

  // REGISTO
  async function registar(dados: {
    email: string
    password: string
    nome: string
    telefone: string
    tipo: 'cliente' | 'tecnico'
  }) {
    setLoading(true)
    setErro(null)
    try {
      // Criar conta no Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: dados.email,
        password: dados.password,
      })
      if (error) {
        setErro('Erro ao criar conta. Verifica o email.')
        return false
      }
      if (!data.user) return false

      // Criar perfil na tabela perfis
      const { error: erroP } = await supabase
        .from('perfis')
        .insert({
          user_id: data.user.id,
          tipo: dados.tipo,
          nome_completo: dados.nome,
          email: dados.email,
          telefone: dados.telefone,
          status: 'ativo',
        })

      if (erroP) {
        setErro('Erro ao criar perfil.')
        return false
      }

      // Se for técnico criar entrada na tabela tecnicos
      if (dados.tipo === 'tecnico') {
        const { data: perfil } = await supabase
          .from('perfis')
          .select('id')
          .eq('user_id', data.user.id)
          .single()

        if (perfil) {
          await supabase.from('tecnicos').insert({
            perfil_id: perfil.id,
            selo: 'novo',
            status_verificacao: 'aguardando',
            disponivel: false,
          })
        }
        router.push('/tecnico/verificacao')
      } else {
        router.push('/cliente/dashboard')
      }
      return true
    } catch {
      setErro('Erro inesperado. Tenta novamente.')
      return false
    } finally {
      setLoading(false)
    }
  }

  // LOGOUT
  async function logout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  return { login, registar, logout, loading, erro }
}