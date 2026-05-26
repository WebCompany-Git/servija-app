export const dynamic = 'force-dynamic';
'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import ChatWindow from '@/components/chat/ChatWindow'
import Avatar from '@/components/ui/Avatar'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

export default function ChatTecnico() {
  const { id } = useParams()
  const router = useRouter()
  const [info, setInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function carregar() {
      const supabase = createClient()
      const { data } = await supabase
        .from('agendamentos')
        .select(`
          id, status,
          cliente:perfis!agendamentos_cliente_id_fkey(id, nome_completo, foto_url)
        `)
        .eq('id', id)
        .single()
      setInfo(data)
      setLoading(false)
    }
    if (id) carregar()
  }, [id])

  if (loading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>

  const cliente = info?.cliente

  return (
    <div className="h-screen flex flex-col">
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <button onClick={() => router.back()} className="text-gray-500 text-xl">←</button>
        <Avatar src={cliente?.foto_url} nome={cliente?.nome_completo} size="sm" />
        <div>
          <p className="font-semibold text-gray-900 text-sm">{cliente?.nome_completo}</p>
          <p className="text-xs text-gray-500">Cliente</p>
        </div>
      </div>
      {info && cliente?.id && (
        <ChatWindow
          agendamentoId={id as string}
          destinatarioId={cliente.id}
          destinatarioNome={cliente.nome_completo}
        />
      )}
    </div>
  )
}
