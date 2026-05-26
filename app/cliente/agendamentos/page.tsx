'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAgendamentos } from '@/hooks/useAgendamentos'
import Avatar from '@/components/ui/Avatar'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

const statusConfig: Record<string, { cor: string; label: string; ordem: number }> = {
  pendente:      { cor: 'bg-yellow-100 text-yellow-700', label: 'Pendente', ordem: 1 },
  confirmado:    { cor: 'bg-blue-100 text-blue-700',    label: 'Confirmado', ordem: 2 },
  em_andamento:  { cor: 'bg-purple-100 text-purple-700',label: 'Em andamento', ordem: 3 },
  concluido:     { cor: 'bg-green-100 text-green-700',  label: 'Concluído', ordem: 4 },
  cancelado:     { cor: 'bg-red-100 text-red-700',      label: 'Cancelado', ordem: 5 },
}

export default function ClienteAgendamentosPage() {
  const router = useRouter()
  const { agendamentos, loading, erro, carregar } = useAgendamentos()
  const [filtro, setFiltro] = useState<string>('todos')

  useEffect(() => {
    carregar()
  }, [])

  const agendamentosFiltrados = agendamentos.filter(ag => {
    if (filtro === 'todos') return true
    return ag.status === filtro
  })

  const agendamentosOrdenados = [...agendamentosFiltrados].sort((a, b) => {
    if (a.status === 'pendente' && b.status !== 'pendente') return -1
    if (a.status !== 'pendente' && b.status === 'pendente') return 1
    return new Date(b.data_agendada).getTime() - new Date(a.data_agendada).getTime()
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">

      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => router.back()} className="text-gray-500 text-xl">←</button>
        <h1 className="font-bold text-gray-900 text-lg flex-1">Meus agendamentos</h1>
        <span className="font-bold text-sm">
          <span className="text-servi-500">Servi</span>
          <span className="text-ja-500">Já</span>
        </span>
      </div>

      {/* Filtros */}
      <div className="bg-white border-b border-gray-100 px-4 py-2 overflow-x-auto">
        <div className="flex gap-2">
          {['todos', 'pendente', 'confirmado', 'em_andamento', 'concluido', 'cancelado'].map((f) => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                filtro === f
                  ? 'bg-servi-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f === 'todos' ? 'Todos' : statusConfig[f]?.label || f}
            </button>
          ))}
        </div>
      </div>

      {/* Lista */}
      <div className="px-4 py-4">
        {erro && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-4">
            {erro}
          </div>
        )}

        {agendamentosOrdenados.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
            <span className="text-5xl mb-3 block">📋</span>
            <p className="font-semibold text-gray-900 mb-1">Sem agendamentos</p>
            <p className="text-sm text-gray-500 mb-4">Ainda não tens agendamentos</p>
            <Link
              href="/cliente/buscar"
              className="bg-servi-600 text-white px-4 py-2 rounded-xl text-sm font-semibold inline-block"
            >
              Encontrar técnico
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {agendamentosOrdenados.map((ag) => {
              const tecnico = ag.tecnico as any
              const nomeTecnico = tecnico?.perfil?.nome_completo || 'Técnico'
              const fotoTecnico = tecnico?.perfil?.foto_url
              const data = new Date(ag.data_agendada)
              const dataFormatada = data.toLocaleDateString('pt-PT', {
                day: '2-digit', month: '2-digit', year: 'numeric'
              })
              const horaFormatada = data.toLocaleTimeString('pt-PT', {
                hour: '2-digit', minute: '2-digit'
              })

              return (
                <Link
                  key={ag.id}
                  href={`/cliente/agendamentos/${ag.id}`}
                  className="bg-white rounded-xl border border-gray-100 p-4 hover:border-servi-200 transition-all block"
                >
                  <div className="flex items-center gap-3">
                    <Avatar src={fotoTecnico} nome={nomeTecnico} size="md" />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{nomeTecnico}</p>
                          <p className="text-xs text-gray-500">{tecnico?.bairro || 'Localidade'}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusConfig[ag.status]?.cor}`}>
                          {statusConfig[ag.status]?.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                        <span>📅 {dataFormatada}</span>
                        <span>🕐 {horaFormatada}</span>
                      </div>
                      {ag.endereco_completo && (
                        <p className="text-xs text-gray-400 mt-1 truncate">📍 {ag.endereco_completo}</p>
                      )}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 flex justify-around">
        <Link href="/cliente/dashboard" className="flex flex-col items-center gap-1">
          <span className="text-xl">🏠</span>
          <span className="text-xs text-gray-400">Início</span>
        </Link>
        <Link href="/cliente/buscar" className="flex flex-col items-center gap-1">
          <span className="text-xl">🗺️</span>
          <span className="text-xs text-gray-400">Buscar</span>
        </Link>
        <Link href="/cliente/agendamentos" className="flex flex-col items-center gap-1">
          <span className="text-xl">📋</span>
          <span className="text-xs text-servi-600 font-medium">Serviços</span>
        </Link>
        <Link href="/cliente/perfil" className="flex flex-col items-center gap-1">
          <span className="text-xl">👤</span>
          <span className="text-xs text-gray-400">Perfil</span>
        </Link>
      </div>
    </div>
  )
}
