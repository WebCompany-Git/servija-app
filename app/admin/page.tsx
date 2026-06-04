'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function carregar() {
      const supabase = createClient()

      // Apenas contar pendentes (que já funciona)
      const { data: pendentes } = await supabase
        .from('tecnicos')
        .select('id')
        .eq('status_verificacao', 'aguardando')
      
      const { data: selos } = await supabase
        .from('pedidos_selo')
        .select('id')
        .eq('status', 'pendente')
      
      const { data: denuncias } = await supabase
        .from('denuncias')
        .select('id')
        .eq('status', 'pendente')

      setStats({
        pendentes: pendentes?.length || 0,
        selos: selos?.length || 0,
        denuncias: denuncias?.length || 0,
      })
      setLoading(false)
    }
    carregar()
  }, [])

  if (loading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>

  const alertas = (stats?.pendentes || 0) + (stats?.selos || 0) + (stats?.denuncias || 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-servi-600 px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <p className="text-servi-200 text-sm">Painel do administrador</p>
          <h1 className="font-bold text-white text-2xl">
            <span className="text-white">Servi</span>
            <span className="text-ja-300">Já</span>
          </h1>
          {alertas > 0 && (
            <div className="mt-2 bg-white/20 rounded-lg px-3 py-2 text-white text-sm">
              ⚠️ {alertas} {alertas === 1 ? 'item requer' : 'itens requerem'} atenção
            </div>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">

        {/* Ações urgentes */}
        <h2 className="font-bold text-gray-900 mb-3">✅ Ações urgentes</h2>
        <div className="flex flex-col gap-3 mb-6">
          <Link href="/admin/tecnicos" className="bg-white rounded-xl border border-gray-100 p-4 flex items-center justify-between hover:border-servi-200 transition-colors">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔧</span>
              <span className="font-medium text-gray-900">Aprovar técnicos</span>
            </div>
            {stats?.pendentes > 0 && (
              <span className="bg-ja-100 text-ja-700 px-2 py-1 rounded-full text-xs font-bold">{stats.pendentes}</span>
            )}
          </Link>

          <Link href="/admin/selos" className="bg-white rounded-xl border border-gray-100 p-4 flex items-center justify-between hover:border-servi-200 transition-colors">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🏆</span>
              <span className="font-medium text-gray-900">Pedidos de selo</span>
            </div>
            {stats?.selos > 0 && (
              <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-bold">{stats.selos}</span>
            )}
          </Link>

          <Link href="/admin/denuncias" className="bg-white rounded-xl border border-gray-100 p-4 flex items-center justify-between hover:border-servi-200 transition-colors">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🚨</span>
              <span className="font-medium text-gray-900">Denúncias pendentes</span>
            </div>
            {stats?.denuncias > 0 && (
              <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-bold">{stats.denuncias}</span>
            )}
          </Link>
        </div>

        <h2 className="font-bold text-gray-900 mb-3">📋 Gestão</h2>
        <div className="grid grid-cols-2 gap-3">
          <Link href="/admin/tecnicos" className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-3 hover:border-servi-200 transition-colors">
            <span className="text-2xl">🔧</span>
            <span className="font-medium text-gray-900 text-sm">Técnicos</span>
          </Link>
          <Link href="/admin/clientes" className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-3 hover:border-servi-200 transition-colors">
            <span className="text-2xl">👤</span>
            <span className="font-medium text-gray-900 text-sm">Clientes</span>
          </Link>
          <Link href="/admin/agendamentos" className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-3 hover:border-servi-200 transition-colors">
            <span className="text-2xl">📋</span>
            <span className="font-medium text-gray-900 text-sm">Agendamentos</span>
          </Link>
          <Link href="/admin/bloqueados" className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-3 hover:border-servi-200 transition-colors">
            <span className="text-2xl">🔒</span>
            <span className="font-medium text-gray-900 text-sm">Bloqueados</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
