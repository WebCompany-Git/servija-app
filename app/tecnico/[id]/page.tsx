'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import SeloBadge from '@/components/selos/SeloBadge'
import Avatar from '@/components/ui/Avatar'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

interface Tecnico {
  id: string
  bairro: string | null
  avaliacao_media: number
  total_avaliacoes: number
  total_servicos: number
  preco_base: number | null
  preco_hora: number | null
  anos_experiencia: number
  selo: string
  disponivel: boolean
  perfil: { nome_completo: string; foto_url: string | null; bio: string | null }
  categoria: { nome: string }
  servicos: { id: string; nome: string; preco: number | null; preco_tipo: string; descricao: string | null }[]
  avaliacoes: { id: string; rating: number; comentario: string | null; criado_em: string; cliente: { nome_completo: string; foto_url: string | null } }[]
}

export default function PerfilPublicoTecnico() {
  const params = useParams()
  const id = params?.id as string
  const router = useRouter()
  const [tecnico, setTecnico] = useState<Tecnico | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function carregar() {
      const supabase = createClient()
      const { data } = await supabase
        .from('tecnicos')
        .select(`
          id, bairro, avaliacao_media, total_avaliacoes, total_servicos,
          preco_base, preco_hora, anos_experiencia, selo, disponivel,
          perfil:perfis(nome_completo, foto_url, bio),
          categoria:categorias_servico(nome),
          servicos(id, nome, preco, preco_tipo, descricao),
          avaliacoes(
            id, rating, comentario, criado_em,
            cliente:perfis!avaliacoes_cliente_id_fkey(nome_completo, foto_url)
          )
        `)
        .eq('id', id)
        .eq('status_verificacao', 'aprovado')
        .single()
      setTecnico(data as any)
      setLoading(false)
    }
    if (id) carregar()
  }, [id])

  if (loading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>

  if (!tecnico) return (
    <div className="min-h-screen flex items-center justify-center text-center px-4">
      <div>
        <span className="text-5xl mb-4 block">😕</span>
        <h1 className="font-bold text-gray-900 text-xl mb-2">Técnico não encontrado</h1>
        <button onClick={() => router.back()} className="text-servi-600 text-sm">← Voltar</button>
      </div>
    </div>
  )

  const estrelas = (rating: number) => '★'.repeat(rating) + '☆'.repeat(5 - rating)

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => router.back()} className="text-gray-500 text-xl">←</button>
        <span className="font-bold text-gray-900">Perfil do técnico</span>
      </div>

      <div className="bg-white px-4 py-6">
        <div className="flex items-start gap-4">
          <Avatar src={tecnico.perfil?.foto_url} nome={tecnico.perfil?.nome_completo} size="xl" />
          <div className="flex-1">
            <h1 className="font-bold text-gray-900 text-xl leading-tight">{tecnico.perfil?.nome_completo}</h1>
            <p className="text-gray-500 text-sm mb-2">{tecnico.categoria?.nome}</p>
            <SeloBadge selo={tecnico.selo} size="md" />
            <div className="flex items-center gap-3 mt-3">
              <div className="text-center">
                <p className="font-bold text-gray-900">{tecnico.total_servicos}</p>
                <p className="text-xs text-gray-500">Serviços</p>
              </div>
              <div className="w-px h-8 bg-gray-200"></div>
              <div className="text-center">
                <p className="font-bold text-gray-900">{tecnico.avaliacao_media > 0 ? tecnico.avaliacao_media.toFixed(1) : '—'}</p>
                <p className="text-xs text-gray-500">Avaliação</p>
              </div>
              <div className="w-px h-8 bg-gray-200"></div>
              <div className="text-center">
                <p className="font-bold text-gray-900">{tecnico.anos_experiencia}</p>
                <p className="text-xs text-gray-500">Anos exp.</p>
              </div>
            </div>
          </div>
        </div>

        {tecnico.perfil?.bio && (
          <p className="text-gray-600 text-sm mt-4 leading-relaxed">{tecnico.perfil.bio}</p>
        )}

        <div className="flex gap-3 mt-3 text-sm text-gray-500">
          {tecnico.bairro && <span>📍 {tecnico.bairro}</span>}
          {tecnico.preco_base && <span>💰 {tecnico.preco_base.toLocaleString()} Kz</span>}
        </div>

        <div className={`mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${tecnico.disponivel ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${tecnico.disponivel ? 'bg-green-500' : 'bg-gray-400'}`}></span>
          {tecnico.disponivel ? 'Disponível agora' : 'Indisponível'}
        </div>
      </div>

      {tecnico.servicos?.length > 0 && (
        <div className="mt-2 bg-white px-4 py-4">
          <h2 className="font-bold text-gray-900 mb-3">Serviços oferecidos</h2>
          <div className="flex flex-col gap-3">
            {tecnico.servicos.map((s) => (
              <div key={s.id} className="border border-gray-100 rounded-xl p-3">
                <div className="flex justify-between items-start">
                  <p className="font-semibold text-gray-900 text-sm">{s.nome}</p>
                  {s.preco && (
                    <span className="text-servi-600 font-bold text-sm">
                      {s.preco.toLocaleString()} Kz
                      {s.preco_tipo === 'hora' && '/h'}
                    </span>
                  )}
                </div>
                {s.descricao && <p className="text-gray-500 text-xs mt-1">{s.descricao}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {tecnico.avaliacoes?.length > 0 && (
        <div className="mt-2 bg-white px-4 py-4">
          <h2 className="font-bold text-gray-900 mb-3">Avaliações ({tecnico.total_avaliacoes})</h2>
          <div className="flex flex-col gap-4">
            {tecnico.avaliacoes.slice(0, 5).map((av) => (
              <div key={av.id}>
                <div className="flex items-center gap-2 mb-1">
                  <Avatar src={av.cliente?.foto_url} nome={av.cliente?.nome_completo} size="sm" />
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{av.cliente?.nome_completo}</p>
                    <p className="text-yellow-500 text-xs">{estrelas(av.rating)}</p>
                  </div>
                </div>
                {av.comentario && <p className="text-gray-600 text-sm ml-10">{av.comentario}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4">
        <button
          onClick={() => router.push(`/cliente/agendamentos/novo?tecnico=${tecnico.id}`)}
          className="w-full bg-servi-600 text-white py-3.5 rounded-xl font-bold text-lg hover:bg-servi-700 transition-colors"
        >
          Agendar serviço
        </button>
      </div>
    </div>
  )
}
