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
      const [clientes, tecnicos, agendamentos, pendentes, selos, denuncias] = await Promise.all([
        supabase.from('perfis').select('id', { count: 'exact' }).eq('tipo', 'cliente'),
        supabase.from('perfis').select('id', { count: 'exact' }).eq('tipo', 'tecnico'),
        supabase.from('agendamentos').select('id', { count: 'exact' }),
        supabase.from('tecnicos').select('id', { count: 'exact' }).eq('status_verificacao', 'aguardando'),
        supabase.from('pedidos_selo').select('id', { count: 'exact' }).eq('status', 'pendente'),
        supabase.from('denuncias').select('id', { count: 'exact' }).eq('status', 'pendente'),
      ])
      setStats({
        clientes: clientes.count || 0,
        tecnicos: tecnicos.count || 0,
        agendamentos: agendamentos.count || 0,
        pendentes: pendentes.count || 0,
        selos: selos.count || 0,
        denuncias: denuncias.count || 0,
      })
      setLoading(false)
    }
    carregar()
  }, [])

  if (loading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>

  const alertas = (stats?.pendentes || 0) + (stats?.selos || 0) + (stats?.denuncias || 0)

  return (
    <div className="min-h-screen bg-gray-50">
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

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Clientes', valor: stats?.clientes, cor: 'text-servi-600' },
            { label: 'Técnicos', valor: stats?.tecnicos, cor: 'text-ja-500' },
            { label: 'Serviços', valor: stats?.agendamentos, cor: 'text-green-600' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-3 text-center">
              <p className={`font-bold text-2xl ${s.cor}`}>{s.valor}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Acções urgentes */}
        <h2 className="font-bold text-gray-900 mb-3">Acções urgentes</h2>
        <div className="flex flex-col gap-3 mb-6">
          {[
            { href: '/admin/tecnicos', icone: '🔧', label: 'Aprovar técnicos', count: stats?.pendentes, cor: 'text-ja-500' },
            { href: '/admin/selos', icone: '🏆', label: 'Pedidos de selo', count: stats?.selos, cor: 'text-yellow-600' },
            { href: '/admin/denuncias', icone: '🚨', label: 'Denúncias pendentes', count: stats?.denuncias, cor: 'text-red-600' },
          ].map(item => (
            <Link key={item.href} href={item.href}
              className="bg-white rounded-xl border border-gray-100 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{item.icone}</span>
                <span className="font-medium text-gray-900 text-sm">{item.label}</span>
              </div>
              {item.count > 0 && (
                <span className={`font-bold text-lg ${item.cor}`}>{item.count}</span>
              )}
            </Link>
          ))}
        </div>

        {/* Gestão */}
        <h2 className="font-bold text-gray-900 mb-3">Gestão</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { href: '/admin/clientes', icone: '👤', label: 'Clientes' },
            { href: '/admin/tecnicos', icone: '🔧', label: 'Técnicos' },
            { href: '/admin/agendamentos', icone: '📋', label: 'Agendamentos' },
            { href: '/admin/avaliacoes', icone: '⭐', label: 'Avaliações' },
            { href: '/admin/bloqueados', icone: '🔒', label: 'Bloqueados' },
            { href: '/admin/estatisticas', icone: '📊', label: 'Estatísticas' },
          ].map(item => (
            <Link key={item.href} href={item.href}
              className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-3 hover:border-servi-200 transition-colors">
              <span className="text-2xl">{item.icone}</span>
              <span className="font-medium text-gray-900 text-sm">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
