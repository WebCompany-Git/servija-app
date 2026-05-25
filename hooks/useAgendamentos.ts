'use client'
import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

export interface Agendamento {
  id: string
  numero_agendamento: string
  data_agendada: string
  status: 'pendente' | 'confirmado' | 'em_andamento' | 'concluido' | 'cancelado'
  endereco_completo: string
  observacoes: string | null
  valor_orcado: number | null
  valor_final: number | null
  criado_em: string
  servico_id: string | null
  cliente_id: string
  tecnico_id: string
  tecnico?: { nome_completo: string; foto_url: string | null; bairro: string | null }
  cliente?: { nome_completo: string; foto_url: string | null }
  servico?: { nome: string; preco: number | null }
}

export function useAgendamentos() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  const carregar = useCallback(async () => {
    setLoading(true)
    setErro(null)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: perfil } = await supabase
        .from('perfis')
        .select('id, tipo')
        .eq('user_id', user.id)
        .single()

      if (!perfil) return

      let query = supabase
        .from('agendamentos')
        .select(`
          *,
          servico:servicos(nome, preco),
          tecnico:tecnicos(
            perfil:perfis(nome_completo, foto_url),
            bairro
          ),
          clientePerfil:perfis!agendamentos_cliente_id_fkey(nome_completo, foto_url)
        `)
        .order('data_agendada', { ascending: false })

      if (perfil.tipo === 'cliente') {
        query = query.eq('cliente_id', perfil.id)
      } else if (perfil.tipo === 'tecnico') {
        const { data: tecnico } = await supabase
          .from('tecnicos')
          .select('id')
          .eq('perfil_id', perfil.id)
          .single()
        if (tecnico) query = query.eq('tecnico_id', tecnico.id)
      }

      const { data, error } = await query
      if (error) { setErro('Erro ao carregar agendamentos.'); return }
      setAgendamentos(data || [])
    } catch {
      setErro('Erro de ligação.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { carregar() }, [carregar])

  async function criarAgendamento(dados: {
    tecnico_id: string
    servico_id?: string
    data_agendada: string
    endereco_completo: string
    observacoes?: string
  }) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { erro: 'Não autenticado' }

    const { data: perfil } = await supabase
      .from('perfis')
      .select('id')
      .eq('user_id', user.id)
      .single()
    if (!perfil) return { erro: 'Perfil não encontrado' }

    const { data, error } = await supabase
      .from('agendamentos')
      .insert({
        cliente_id: perfil.id,
        tecnico_id: dados.tecnico_id,
        servico_id: dados.servico_id || null,
        data_agendada: dados.data_agendada,
        endereco_completo: dados.endereco_completo,
        observacoes: dados.observacoes || null,
        status: 'pendente',
      })
      .select()
      .single()

    if (error) return { erro: error.message }
    await carregar()
    return { data }
  }

  async function actualizarStatus(id: string, status: Agendamento['status']) {
    const supabase = createClient()
    const { error } = await supabase
      .from('agendamentos')
      .update({ status })
      .eq('id', id)
    if (error) return { erro: error.message }
    await carregar()
    return { sucesso: true }
  }

  return { agendamentos, loading, erro, carregar, criarAgendamento, actualizarStatus }
}
