'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import Avatar from '@/components/ui/Avatar'

const statusConfig: Record<string, { cor: string; label: string }> = {
  pendente:     { cor: 'bg-yellow-100 text-yellow-700', label: 'Pendente' },
  confirmado:   { cor: 'bg-blue-100 text-blue-700',     label: 'Confirmado' },
  em_andamento: { cor: 'bg-purple-100 text-purple-700', label: 'Em andamento' },
  concluido:    { cor: 'bg-green-100 text-green-700',   label: 'Concluído' },
  cancelado:    { cor: 'bg-red-100 text-red-700',       label: 'Cancelado' },
}

export default function AgendamentosCliente() {
  const [agendamentos, setAgendamentos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState<string>('todos')

  useEffect(() => {
    async function carregar() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: perfil } = await supabase
        .from('perfis').select('id').eq('user_id', user.id).single()
      if (!perfil) return
      const { data } = await supabase
        .from('agendamentos')
        .select(`
          id, numero_agendamento, status, data_agendada, endereco_completo,
          tecnico:tecnicos(
            id,
            perfil:perfis!tecnicos_perfil_id_fkey(nome_completo, foto_url),
            selo
          ),
          servico:servicos(nome)
        `)
        .eq('cliente_id', perfil.id)
        .order('data_agendada', { ascending: false })
      setAgendamentos(data || [])
      setLoading(false)
    }
    carregar()
  }, [])

  const filtrados = filtro === 'todos'
    ? agendamentos
    : agendamentos.filter(a => a.status === filtro)

  if (loading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white border-b border-gray-100 px-4 py-4 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link href="/cliente/dashboard" className="text-gray-500 text-xl">←</Link>
          <h1 className="font-bold text-gray-900">Os meus agendamentos</h1>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white border-b border-gray-100 px-4 py-2">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {['todos', 'pendente', 'confirmado', 'concluido', 'cancelado'].map(f => (
            <button key={f} onClick={() => setFiltro(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                filtro === f ? 'bg-servi-600 text-white' : 'bg-gray-100 text-gray-600'
              }`}>
              {f === 'todos' ? 'Todos' : statusConfig[f]?.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4">
        {filtrados.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-5xl mb-4 block">📋</span>
            <p className="font-semibold text-gray-900 mb-1">Sem agendamentos</p>
            <p className="text-sm text-gray-500 mb-6">Ainda não agendaste nenhum serviço</p>
            <Link href="/cliente/buscar"
              className="bg-servi-600 text-white px-6 py-3 rounded-xl font-semibold text-sm">
              Encontrar técnico
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtrados.map((ag) => (
              <div key={ag.id} className="bg-white rounded-xl border border-gray-100 p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Avatar
                    src={ag.tecnico?.perfil?.foto_url}
                    nome={ag.tecnico?.perfil?.nome_completo}
                    size="md"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm">
                      {ag.tecnico?.perfil?.nome_completo}
                    </p>
                    <p className="text-xs text-gray-500">
                      {ag.servico?.nome || 'Serviço geral'}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusConfig[ag.status]?.cor}`}>
                    {statusConfig[ag.status]?.label}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span>📅 {new Date(ag.data_agendada).toLocaleDateString('pt-PT')}</span>
                  <span>📍 {ag.endereco_completo?.substring(0, 30)}...</span>
                </div>
                <div className="flex gap-2">
                  {ag.status === 'concluido' && (
                    <Link href={`/cliente/avaliar/${ag.id}`}
                      className="flex-1 text-center bg-yellow-500 text-white py-2 rounded-lg text-xs font-semibold">
                      ⭐ Avaliar
                    </Link>
                  )}
                  <Link href={`/cliente/chat/${ag.id}`}
                    className="flex-1 text-center bg-servi-50 text-servi-600 py-2 rounded-lg text-xs font-semibold">
                    💬 Chat
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 flex justify-around">
        <Link href="/cliente/dashboard" className="flex flex-col items-center gap-1">
          <span className="text-xl">🏠</span><span className="text-xs text-gray-400">Início</span>
        </Link>
        <Link href="/cliente/buscar" className="flex flex-col items-center gap-1">
          <span className="text-xl">🗺️</span><span className="text-xs text-gray-400">Buscar</span>
        </Link>
        <Link href="/cliente/agendamentos" className="flex flex-col items-center gap-1">
          <span className="text-xl">📋</span><span className="text-xs text-servi-600 font-medium">Serviços</span>
        </Link>
        <Link href="/cliente/perfil" className="flex flex-col items-center gap-1">
          <span className="text-xl">👤</span><span className="text-xs text-gray-400">Perfil</span>
        </Link>
      </div>
    </div>
  )
}
