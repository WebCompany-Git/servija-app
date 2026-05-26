'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import ChatWindow from '@/components/chat/ChatWindow'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

interface AgendamentoInfo {
  id: string
  tecnico_id: string
  tecnico: {
    perfil: {
      nome_completo: string
      foto_url: string | null
    }
  }
}

export default function ClienteChatPage() {
  const { id } = useParams()
  const router = useRouter()
  const [agendamento, setAgendamento] = useState<AgendamentoInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function carregar() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: perfil } = await supabase
        .from('perfis')
        .select('id')
        .eq('user_id', user.id)
        .single()
      if (!perfil) return

      const { data, error } = await supabase
        .from('agendamentos')
        .select(`
          id, tecnico_id,
          tecnico:tecnicos(
            perfil:perfis(nome_completo, foto_url)
          )
        `)
        .eq('id', id)
        .eq('cliente_id', perfil.id)
        .single()

      if (!error && data) {
        setAgendamento(data as any)
      }
      setLoading(false)
    }
    if (id) carregar()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!agendamento) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <span className="text-5xl mb-4 block">😕</span>
        <h1 className="font-bold text-gray-900 text-xl mb-2">Chat não encontrado</h1>
        <p className="text-gray-500 text-sm mb-4">Agendamento não existe ou não tens permissão.</p>
        <button onClick={() => router.back()} className="text-servi-600 text-sm">← Voltar</button>
      </div>
    )
  }

  const nomeTecnico = (agendamento.tecnico as any)?.perfil?.nome_completo || 'Técnico'
  const fotoTecnico = (agendamento.tecnico as any)?.perfil?.foto_url

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 flex-shrink-0">
        <button onClick={() => router.back()} className="text-gray-500 text-xl">←</button>
        <div className="flex items-center gap-2 flex-1">
          <img
            src={fotoTecnico || '/default-avatar.png'}
            alt={nomeTecnico}
            className="w-8 h-8 rounded-full object-cover bg-servi-100"
            onError={(e) => { (e.target as HTMLImageElement).src = '' }}
          />
          <div>
            <p className="font-semibold text-gray-900 text-sm">{nomeTecnico}</p>
            <p className="text-xs text-gray-400">Técnico</p>
          </div>
        </div>
        <span className="font-bold text-sm">
          <span className="text-servi-500">Servi</span>
          <span className="text-ja-500">Já</span>
        </span>
      </div>

      {/* Chat Window */}
      <div className="flex-1 overflow-hidden">
        <ChatWindow
          agendamentoId={agendamento.id}
          destinatarioId={(agendamento.tecnico as any).perfil?.id}
          destinatarioNome={nomeTecnico}
        />
      </div>
    </div>
  )
}
