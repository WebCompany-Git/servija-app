'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import SeloBadge from '@/components/selos/SeloBadge'
import Avatar from '@/components/ui/Avatar'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

export default function TecnicoDashboard() {
  const [dados, setDados] = useState<any>(null)
  const [agendamentos, setAgendamentos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function carregar() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: perfil } = await supabase
        .from('perfis')
        .select('id, nome_completo, foto_url')
        .eq('user_id', user.id)
        .single()
      if (!perfil) return

      const { data: tecnico } = await supabase
        .from('tecnicos')
        .select('id, selo, avaliacao_media, total_servicos, disponivel, status_verificacao')
        .eq('perfil_id', perfil.id)
        .single()

      setDados({ ...perfil, ...tecnico })

      if (tecnico) {
        const { data: ags } = await supabase
          .from('agendamentos')
          .select(`
            id, numero_agendamento, status, data_agendada, endereco_completo,
            cliente:perfis!agendamentos_cliente_id_fkey(nome_completo, foto_url)
          `)
          .eq('tecnico_id', tecnico.id)
          .in('status', ['pendente', 'confirmado'])
          .order('data_agendada', { ascending: true })
          .limit(5)
        setAgendamentos(ags || [])
      }
      setLoading(false)
    }
    carregar()
  }, [])

  if (loading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>

  if (dados?.status_verificacao !== 'aprovado') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <span className="text-5xl mb-4 block">⏳</span>
          <h1 className="font-bold text-gray-900 text-xl mb-2">Conta em verificação</h1>
          <p className="text-gray-500 text-sm mb-6">A tua conta está a ser verificada. Processo até 24h.</p>
          <a href="https://wa.me/244938080177" target="_blank" rel="noopener noreferrer"
            className="bg-green-500 text-white px-6 py-3 rounded-xl font-semibold text-sm block text-center">
            💬 Enviar documentos via WhatsApp
          </a>
        </div>
      </div>
    )
  }

  const statusConfig: Record<string, { cor: string; label: string }> = {
    pendente:    { cor: 'bg-yellow-100 text-yellow-700', label: 'Pendente' },
    confirmado:  { cor: 'bg-blue-100 text-blue-700',    label: 'Confirmado' },
    concluido:   { cor: 'bg-green-100 text-green-700',  label: 'Concluído' },
    cancelado:   { cor: 'bg-red-100 text-red-700',      label: 'Cancelado' },
    em_andamento:{ cor: 'bg-purple-100 text-purple-700',label: 'Em andamento' },
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">

      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar src={dados?.foto_url} nome={dados?.nome_completo} size="md" />
            <div>
              <p className="text-xs text-gray-500">Olá 👋</p>
              <h1 className="font-bold text-gray-900">{dados?.nome_completo}</h1>
            </div>
          </div>
          <span className="font-bold text-xl">
            <span className="text-servi-500">Servi</span>
            <span className="text-ja-500">Já</span>
          </span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">

        {/* Selo e stats */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <SeloBadge selo={dados?.selo || 'novo'} size="md" />
            <Link href="/tecnico/selos" className="text-xs text-servi-600">Ver progressão →</Link>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center bg-servi-50 rounded-xl p-3">
              <p className="font-bold text-servi-700 text-xl">{dados?.total_servicos || 0}</p>
              <p className="text-xs text-gray-500">Serviços</p>
            </div>
            <div className="text-center bg-yellow-50 rounded-xl p-3">
              <p className="font-bold text-yellow-700 text-xl">
                {dados?.avaliacao_media > 0 ? dados.avaliacao_media.toFixed(1) : '—'}
              </p>
              <p className="text-xs text-gray-500">Avaliação</p>
            </div>
            <div className="text-center bg-green-50 rounded-xl p-3">
              <p className="font-bold text-green-700 text-xl">
                {dados?.disponivel ? 'Sim' : 'Não'}
              </p>
              <p className="text-xs text-gray-500">Disponível</p>
            </div>
          </div>
        </div>

        {/* Agendamentos pendentes */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-900">Pedidos pendentes</h2>
            <Link href="/tecnico/agenda" className="text-sm text-servi-600">Ver todos</Link>
          </div>
          {agendamentos.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center">
              <span className="text-3xl mb-2 block">📋</span>
              <p className="text-gray-500 text-sm">Sem agendamentos pendentes</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {agendamentos.map((ag) => (
                <div key={ag.id} className="bg-white rounded-xl border border-gray-100 p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar src={ag.cliente?.foto_url} nome={ag.cliente?.nome_completo} size="sm" />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm">{ag.cliente?.nome_completo}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(ag.data_agendada).toLocaleDateString('pt-PT')}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusConfig[ag.status]?.cor}`}>
                      {statusConfig[ag.status]?.label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">📍 {ag.endereco_completo}</p>
                  {ag.status === 'pendente' && (
                    <div className="flex gap-2">
                      <Link href={`/tecnico/agenda`}
                        className="flex-1 text-center bg-servi-600 text-white py-2 rounded-lg text-xs font-semibold">
                        Ver detalhes
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Links rápidos */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { href: '/tecnico/agenda', icone: '📅', label: 'Agenda', desc: 'Ver compromissos' },
            { href: '/tecnico/servicos', icone: '🔧', label: 'Serviços', desc: 'Gerir serviços' },
            { href: '/tecnico/estatisticas', icone: '📊', label: 'Estatísticas', desc: 'Ver métricas' },
            { href: '/tecnico/perfil', icone: '👤', label: 'Perfil', desc: 'Editar dados' },
          ].map((item) => (
            <Link key={item.href} href={item.href}
              className="bg-white border border-gray-100 rounded-xl p-4 flex flex-col gap-1 hover:border-servi-200 transition-colors">
              <span className="text-2xl">{item.icone}</span>
              <span className="font-semibold text-gray-900 text-sm">{item.label}</span>
              <span className="text-xs text-gray-500">{item.desc}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 flex justify-around">
        <Link href="/tecnico/dashboard" className="flex flex-col items-center gap-1">
          <span className="text-xl">🏠</span>
          <span className="text-xs text-servi-600 font-medium">Início</span>
        </Link>
        <Link href="/tecnico/agenda" className="flex flex-col items-center gap-1">
          <span className="text-xl">📅</span>
          <span className="text-xs text-gray-400">Agenda</span>
        </Link>
        <Link href="/tecnico/servicos" className="flex flex-col items-center gap-1">
          <span className="text-xl">🔧</span>
          <span className="text-xs text-gray-400">Serviços</span>
        </Link>
        <Link href="/tecnico/perfil" className="flex flex-col items-center gap-1">
          <span className="text-xl">👤</span>
          <span className="text-xs text-gray-400">Perfil</span>
        </Link>
      </div>
    </div>
  )
}
