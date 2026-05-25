'use client'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function useAuth() {
  const supabase = createClient()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  async function login(email: string, password: string) {
    setLoading(true)
    setErro(null)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email, password,
      })
      if (error) {
        if (error.message.includes('Email not confirmed')) {
          setErro('Confirma o teu email antes de entrar.')
          return false
        }
        setErro('Email ou password incorrectos.')
        return false
      }
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
        setErro('A tua conta foi suspensa. Contacta o suporte.')
        await supabase.auth.signOut()
        return false
      }
      router.refresh()
      setTimeout(() => {
        if (perfil.tipo === 'admin') router.push('/admin')
        else if (perfil.tipo === 'tecnico') router.push('/tecnico/dashboard')
        else router.push('/cliente/dashboard')
        setLoading(false)
      }, 300)
      return true
    } catch {
      setErro('Erro ao entrar. Tenta novamente.')
      setLoading(false)
      return false
    }
  }

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
        if (error.message.includes('already registered') || error.message.includes('User already registered')) {
          setErro('Este email já está registado.')
        } else if (error.message.includes('password')) {
          setErro('Password inválida. Usa no mínimo 6 caracteres.')
        } else if (error.message.includes('email')) {
          setErro('Email inválido.')
        } else {
          setErro(`Erro: ${error.message}`)
        }
        setLoading(false)
        return false
      }

      if (!data.user) {
        setErro('Erro ao criar utilizador. Tenta novamente.')
        setLoading(false)
        return false
      }

      setLoading(false)

      if (dados.tipo === 'tecnico') {
        window.open(
          `https://wa.me/244938080177?text=Olá,%20registei-me%20no%20ServiJá%20como%20técnico.%20Nome:%20${encodeURIComponent(dados.nome)}`,
          '_blank'
        )
        router.push('/tecnico/verificacao')
      } else {
        router.push('/cliente/dashboard')
      }
      return true

    } catch {
      setErro('Erro inesperado. Verifica a tua ligação à internet.')
      setLoading(false)
      return false
    }
  }

  async function logout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  return { login, registar, logout, loading, erro }
}
