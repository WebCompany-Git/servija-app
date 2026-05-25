'use client'
import { useChat } from '@/hooks/useChat'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

interface Props {
  agendamentoId: string
  destinatarioId: string
  destinatarioNome: string
}

export default function ChatWindow({ agendamentoId, destinatarioId, destinatarioNome }: Props) {
  const { mensagens, loading, meuPerfilId, enviarMensagem } = useChat(agendamentoId)

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <MessageList mensagens={mensagens} meuPerfilId={meuPerfilId} />
      <MessageInput
        onEnviar={(texto) => enviarMensagem(texto, destinatarioId)}
      />
    </div>
  )
}
