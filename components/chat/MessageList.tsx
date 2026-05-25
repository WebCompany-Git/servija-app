'use client'
import { useEffect, useRef } from 'react'
import type { Mensagem } from '@/hooks/useChat'
import Avatar from '@/components/ui/Avatar'

interface Props {
  mensagens: Mensagem[]
  meuPerfilId: string | null
}

export default function MessageList({ mensagens, meuPerfilId }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensagens])

  if (mensagens.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-center p-8">
        <div>
          <span className="text-4xl mb-3 block">💬</span>
          <p className="text-gray-500 text-sm">Ainda sem mensagens</p>
          <p className="text-gray-400 text-xs mt-1">Começa a conversa!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3">
      {mensagens.map((msg) => {
        const minha = msg.remetente_id === meuPerfilId
        return (
          <div key={msg.id} className={`flex items-end gap-2 ${minha ? 'flex-row-reverse' : 'flex-row'}`}>
            {!minha && (
              <Avatar
                src={msg.remetente?.foto_url}
                nome={msg.remetente?.nome_completo}
                size="sm"
              />
            )}
            <div className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm ${
              minha
                ? 'bg-servi-600 text-white rounded-br-sm'
                : 'bg-gray-100 text-gray-900 rounded-bl-sm'
            }`}>
              <p className="leading-relaxed">{msg.conteudo}</p>
              <p className={`text-xs mt-1 ${minha ? 'text-servi-200' : 'text-gray-400'}`}>
                {new Date(msg.criado_em).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}
                {minha && <span className="ml-1">{msg.lida ? '✓✓' : '✓'}</span>}
              </p>
            </div>
          </div>
        )
      })}
      <div ref={bottomRef} />
    </div>
  )
}
