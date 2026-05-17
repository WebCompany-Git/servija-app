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
        if (error.message.includes('already registered')) {
          setErro('Este email já está registado.')
          return false
        }
        setErro('Erro ao criar conta.')
        return false
      }
      if (!data.user) return false
      setLoading(false)
      return true
    } catch {
      setErro('Erro inesperado.')
      return false
    }
  }

  async function logout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  return { login, registar, logout, loading, erro }
}