'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

export interface Mensagem {
  id: string
  agendamento_id: string
  remetente_id: string
  destinatario_id: string
  conteudo: string
  lida: boolean
  criado_em: string
  remetente?: { nome_completo: string; foto_url: string | null }
}

export function useChat(agendamentoId: string | null) {
  const [mensagens, setMensagens] = useState<Mensagem[]>([])
  const [loading, setLoading] = useState(true)
  const [meuPerfilId, setMeuPerfilId] = useState<string | null>(null)
  const supabase = createClient()
  const canalRef = useRef<any>(null)

  const carregar = useCallback(async () => {
    if (!agendamentoId) return
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: perfil } = await supabase
        .from('perfis').select('id').eq('user_id', user.id).single()
      if (perfil) setMeuPerfilId(perfil.id)

      const { data } = await supabase
        .from('mensagens')
        .select('*, remetente:perfis!mensagens_remetente_id_fkey(nome_completo, foto_url)')
        .eq('agendamento_id', agendamentoId)
        .order('criado_em', { ascending: true })
      setMensagens(data || [])
    } finally {
      setLoading(false)
    }
  }, [agendamentoId])

  useEffect(() => {
    carregar()
    if (!agendamentoId) return

    canalRef.current = supabase
      .channel(`chat-${agendamentoId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'mensagens',
        filter: `agendamento_id=eq.${agendamentoId}`,
      }, (payload) => {
        setMensagens(prev => [...prev, payload.new as Mensagem])
      })
      .subscribe()

    return () => {
      if (canalRef.current) supabase.removeChannel(canalRef.current)
    }
  }, [agendamentoId, carregar])

  async function enviarMensagem(conteudo: string, destinatarioId: string) {
    if (!agendamentoId || !meuPerfilId || !conteudo.trim()) return
    await supabase.from('mensagens').insert({
      agendamento_id: agendamentoId,
      remetente_id: meuPerfilId,
      destinatario_id: destinatarioId,
      conteudo: conteudo.trim(),
    })
  }

  return { mensagens, loading, meuPerfilId, enviarMensagem }
}
