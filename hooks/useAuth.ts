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
        // Erro específico de email não confirmado
        if (error.message.includes('Email not confirmed')) {
          setErro('Confirma o teu email antes de entrar. Verifica a caixa de entrada.')
          return false
        }
        setErro('Email ou password incorrectos.')
        return false
      }

      // Buscar tipo e status do utilizador
      const { data: perfil } = await supabase
        .from('perfis')
        .select('tipo, status')
        .eq('user_id', data.user.id)
        .single()

      if (!perfil) {
        setErro('Perfil não encontrado. Contacta o suporte.')
        await supabase.auth.signOut()
        return false
      }

      if (perfil.status === 'bloqueado') {
        setErro('A tua conta foi suspensa. Contacta o suporte via WhatsApp.')
        await supabase.auth.signOut()
        return false
      }

      // Redirecionar conforme o tipo
      if (perfil.tipo === 'admin') router.push('/admin')
      else if (perfil.tipo === 'tecnico') router.push('/tecnico/dashboard')
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
      // Criar conta passando dados como metadata
      // O trigger cria o perfil automaticamente após confirmação do email
      const { data, error } = await supabase.auth.signUp({
        email: dados.email,
        password: dados.password,
        options: {
          data: {
            nome_completo: dados.nome,
            tipo: dados.tipo,
            telefone: dados.telefone,
          }
        }
      })

      if (error) {
        if (error.message.includes('already registered')) {
          setErro('Este email já está registado. Faz login ou recupera a password.')
          return false
        }
        setErro('Erro ao criar conta. Verifica o email.')
        return false
      }

      if (!data.user) return false

      // Redirecionar conforme o tipo
      if (dados.tipo === 'tecnico') {
        // Abrir WhatsApp para enviar documentos
        window.open(
          `https://wa.me/244938080177?text=Olá,%20registei-me%20no%20ServiJá%20como%20técnico.%20O%20meu%20nome%20é%20${encodeURIComponent(dados.nome)}.%20Quero%20enviar%20os%20meus%20documentos%20para%20verificação.`,
          '_blank'
        )
        router.push('/tecnico/verificacao')
      } else {
        router.push('/sign-up-success')
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