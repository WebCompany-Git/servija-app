'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function ClienteDashboard() {
  const [nome, setNome] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function carregarPerfil() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: perfil } = await supabase
          .from('perfis')
          .select('nome_completo')
          .eq('user_id', user.id)
          .single()
        if (perfil) setNome(perfil.nome_completo)
      }
      setLoading(false)
    }
    carregarPerfil()
  }, [])

  const categorias = [
    { nome: 'Frio', icone: '❄️', slug: 'tecnico-de-frio' },
    { nome: 'Eletricista', icone: '⚡', slug: 'eletricista' },
    { nome: 'Canalizador', icone: '🔧', slug: 'canalizador' },
    { nome: 'Mecânico', icone: '🚗', slug: 'mecanico-auto' },
    { nome: 'Informático', icone: '💻', slug: 'informatico' },
    { nome: 'Pedreiro', icone: '🏗️', slug: 'pedreiro' },
    { nome: 'Pintor', icone: '🎨', slug: 'pintor' },
    { nome: 'Eletrónica', icone: '🎮', slug: 'tecnico-eletronica' },
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-servi-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Olá 👋</p>
            <h1 className="font-bold text-gray-900 text-lg">{nome || 'Cliente'}</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-xl">
              <span className="text-servi-500">Servi</span>
              <span className="text-ja-500">Já</span>
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">

        {/* Botão principal */}
        <Link
          href="/cliente/buscar"
          className="w-full bg-servi-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-servi-700 transition-colors flex items-center justify-center gap-3 mb-6 shadow-lg shadow-servi-200"
        >
          <span>🗺️</span>
          <span>Encontrar técnico agora</span>
        </Link>

        {/* Categorias rápidas */}
        <div className="mb-6">
          <h2 className="font-bold text-gray-900 mb-3">O que precisas?</h2>
          <div className="grid grid-cols-4 gap-3">
            {categorias.map((cat) => (
              <Link
                key={cat.slug}
                href={`/cliente/buscar?categoria=${cat.slug}`}
                className="flex flex-col items-center gap-1.5 p-3 bg-white rounded-xl border border-gray-100 hover:border-servi-200 hover:bg-servi-50 transition-all"
              >
                <span className="text-2xl">{cat.icone}</span>
                <span className="text-xs text-gray-600 text-center leading-tight font-medium">{cat.nome}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Agendamentos recentes */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-900">Agendamentos</h2>
            <Link href="/cliente/agendamentos" className="text-sm text-servi-600">Ver todos</Link>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center">
            <span className="text-4xl mb-3 block">📋</span>
            <p className="font-semibold text-gray-900 text-sm mb-1">Ainda sem agendamentos</p>
            <p className="text-xs text-gray-500">Quando agendares um serviço aparece aqui</p>
          </div>
        </div>

        {/* Links rápidos */}
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/cliente/agendamentos"
            className="bg-white border border-gray-100 rounded-xl p-4 flex flex-col gap-2 hover:border-servi-200 transition-colors"
          >
            <span className="text-2xl">📋</span>
            <span className="font-semibold text-gray-900 text-sm">Agendamentos</span>
            <span className="text-xs text-gray-500">Ver histórico</span>
          </Link>
          <Link
            href="/cliente/perfil"
            className="bg-white border border-gray-100 rounded-xl p-4 flex flex-col gap-2 hover:border-servi-200 transition-colors"
          >
            <span className="text-2xl">👤</span>
            <span className="font-semibold text-gray-900 text-sm">O meu perfil</span>
            <span className="text-xs text-gray-500">Editar dados</span>
          </Link>
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 flex justify-around">
        <Link href="/cliente/dashboard" className="flex flex-col items-center gap-1">
          <span className="text-xl">🏠</span>
          <span className="text-xs text-servi-600 font-medium">Início</span>
        </Link>
        <Link href="/cliente/buscar" className="flex flex-col items-center gap-1">
          <span className="text-xl">🗺️</span>
          <span className="text-xs text-gray-400">Buscar</span>
        </Link>
        <Link href="/cliente/agendamentos" className="flex flex-col items-center gap-1">
          <span className="text-xl">📋</span>
          <span className="text-xs text-gray-400">Serviços</span>
        </Link>
        <Link href="/cliente/perfil" className="flex flex-col items-center gap-1">
          <span className="text-xl">👤</span>
          <span className="text-xs text-gray-400">Perfil</span>
        </Link>
      </div>
    </div>
  )
}