'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

interface Estatisticas {
  totalClientes: number
  totalTecnicos: number
  totalTecnicosPendentes: number
  totalAgendamentos: number
  totalAgendamentosPendentes: number
  totalDenuncias: number
  totalPedidosSelo: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Estatisticas | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function carregar() {
      const supabase = createClient()

      // Total clientes
      const { count: clientes } = await supabase
        .from('perfis')
        .select('*', { count: 'exact', head: true })
        .eq('tipo', 'cliente')

      // Total técnicos
      const { count: tecnicos } = await supabase
        .from('tecnicos')
        .select('*', { count: 'exact', head: true })

      // Técnicos pendentes
      const { count: pendentes } = await supabase
        .from('tecnicos')
        .select('*', { count: 'exact', head: true })
        .eq('status_verificacao', 'aguardando')

      // Total agendamentos
      const { count: agendamentos } = await supabase
        .from('agendamentos')
        .select('*', { count: 'exact', head: true })

      // Agendamentos pendentes
      const { count: agPendentes } = await supabase
        .from('agendamentos')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pendente')

      // Total denúncias
      const { count: denuncias } = await supabase
        .from('denuncias')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pendente')

      // Total pedidos selo pendentes
      const { count: pedidosSelo } = await supabase
        .from('pedidos_selo')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pendente')

      setStats({
        totalClientes: clientes || 0,
        totalTecnicos: tecnicos || 0,
        totalTecnicosPendentes: pendentes || 0,
        totalAgendamentos: agendamentos || 0,
        totalAgendamentosPendentes: agPendentes || 0,
        totalDenuncias: denuncias || 0,
        totalPedidosSelo: pedidosSelo || 0,
      })
      setLoading(false)
    }
    carregar()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  const cards = [
    { titulo: 'Clientes', valor: stats?.totalClientes || 0, icone: '👥', cor: 'bg-blue-50 text-blue-700', href: '/admin/clientes' },
    { titulo: 'Técnicos', valor: stats?.totalTecnicos || 0, icone: '🔧', cor: 'bg-green-50 text-green-700', href: '/admin/tecnicos' },
    { titulo: 'Pendentes', valor: stats?.totalTecnicosPendentes || 0, icone: '⏳', cor: 'bg-yellow-50 text-yellow-700', href: '/admin/tecnicos?status=pendente' },
    { titulo: 'Agendamentos', valor: stats?.totalAgendamentos || 0, icone: '📅', cor: 'bg-purple-50 text-purple-700', href: '/admin/agendamentos' },
    { titulo: 'Denúncias', valor: stats?.totalDenuncias || 0, icone: '⚠️', cor: 'bg-red-50 text-red-700', href: '/admin/denuncias' },
    { titulo: 'Pedidos selo', valor: stats?.totalPedidosSelo || 0, icone: '🏆', cor: 'bg-servi-50 text-servi-700', href: '/admin/selos' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Header */}
      <div className="bg-servi-600 text-white px-4 py-5">
        <h1 className="text-xl font-bold">Painel Admin</h1>
        <p className="text-servi-200 text-sm mt-1">Bem-vindo, Elias</p>
      </div>

      <div className="px-4 py-5">
        {/* Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {cards.map((card) => (
            <Link
              key={card.titulo}
              href={card.href}
              className={`${card.cor} rounded-2xl p-4 transition-transform hover:scale-[1.02]`}
            >
              <span className="text-2xl">{card.icone}</span>
              <p className="font-bold text-2xl mt-2">{card.valor}</p>
              <p className="text-xs font-medium">{card.titulo}</p>
            </Link>
          ))}
        </div>

        {/* Ações rápidas */}
        <h2 className="font-bold text-gray-900 mb-3">Ações rápidas</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { href: '/admin/tecnicos', icone: '✅', label: 'Aprovar técnicos', desc: 'Ver pendentes' },
            { href: '/admin/selos', icone: '🏆', label: 'Conceder selos', desc: 'Analisar pedidos' },
            { href: '/admin/denuncias', icone: '⚠️', label: 'Denúncias', desc: 'Resolver' },
            { href: '/admin/bloqueados', icone: '🔒', label: 'Utilizadores', desc: 'Bloqueados' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="bg-white rounded-xl border border-gray-100 p-4 hover:border-servi-200 transition-colors"
            >
              <span className="text-2xl">{item.icone}</span>
              <p className="font-semibold text-gray-900 text-sm mt-1">{item.label}</p>
              <p className="text-xs text-gray-400">{item.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
