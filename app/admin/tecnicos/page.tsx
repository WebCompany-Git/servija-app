'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Avatar from '@/components/ui/Avatar'
import SeloBadge from '@/components/selos/SeloBadge'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import Link from 'next/link'

export default function AdminTecnicos() {
  const [tecnicos, setTecnicos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState('aguardando')

  async function carregar() {
    const supabase = createClient()
    const { data } = await supabase
      .from('tecnicos')
      .select(`
        id, selo, status_verificacao, avaliacao_media, total_servicos,
        bairro, disponivel,
        perfil:perfis!tecnicos_perfil_id_fkey(id, nome_completo, foto_url, email, telefone, status),
        categoria:categorias_servico(nome)
      `)
      .eq('status_verificacao', filtro)
      .order('criado_em', { ascending: false })
    setTecnicos(data || [])
    setLoading(false)
  }

  useEffect(() => { carregar() }, [filtro])

  async function aprovar(tecnicoId: string, perfilId: string) {
    const supabase = createClient()
    await supabase.from('tecnicos').update({
      status_verificacao: 'aprovado',
      verificado: true,
      disponivel: true,
    }).eq('id', tecnicoId)
    await carregar()
  }

  async function recusar(tecnicoId: string) {
    const motivo = prompt('Motivo da recusa:')
    if (!motivo) return
    const supabase = createClient()
    await supabase.from('tecnicos').update({
      status_verificacao: 'recusado',
      motivo_recusa: motivo,
    }).eq('id', tecnicoId)
    await carregar()
  }

  async function bloquear(perfilId: string) {
    const motivo = prompt('Motivo do bloqueio:')
    if (!motivo) return
    const supabase = createClient()
    await supabase.from('perfis').update({
      status: 'bloqueado',
      motivo_bloqueio: motivo,
      bloqueado_em: new Date().toISOString(),
    }).eq('id', perfilId)
    await carregar()
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-4 py-4 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link href="/admin" className="text-gray-500 text-xl">←</Link>
          <h1 className="font-bold text-gray-900">Gestão de técnicos</h1>
        </div>
      </div>

      <div className="bg-white border-b border-gray-100 px-4 py-2">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {['aguardando', 'aprovado', 'recusado'].map(f => (
            <button key={f} onClick={() => setFiltro(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
                filtro === f ? 'bg-servi-600 text-white' : 'bg-gray-100 text-gray-600'
              }`}>
              {f === 'aguardando' ? '⏳ Aguardando' : f === 'aprovado' ? '✅ Aprovados' : '❌ Recusados'}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4">
        {tecnicos.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-5xl mb-4 block">✅</span>
            <p className="font-semibold text-gray-900">Sem técnicos pendentes</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {tecnicos.map((t) => (
              <div key={t.id} className="bg-white rounded-xl border border-gray-100 p-4">
                <div className="flex items-start gap-3 mb-3">
                  <Avatar src={t.perfil?.foto_url} nome={t.perfil?.nome_completo} size="md" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{t.perfil?.nome_completo}</p>
                    <p className="text-xs text-gray-500">{t.perfil?.email}</p>
                    <p className="text-xs text-gray-500">{t.perfil?.telefone}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <SeloBadge selo={t.selo} size="sm" />
                      <span className="text-xs text-gray-500">{t.categoria?.nome}</span>
                    </div>
                    {t.bairro && <p className="text-xs text-gray-500 mt-1">📍 {t.bairro}</p>}
                  </div>
                </div>
                {filtro === 'aguardando' && (
                  <div className="flex gap-2">
                    <button onClick={() => aprovar(t.id, t.perfil?.id)}
                      className="flex-1 bg-green-500 text-white py-2 rounded-lg text-sm font-semibold">
                      ✅ Aprovar
                    </button>
                    <button onClick={() => recusar(t.id)}
                      className="flex-1 bg-red-100 text-red-600 py-2 rounded-lg text-sm font-semibold">
                      ❌ Recusar
                    </button>
                    <button onClick={() => bloquear(t.perfil?.id)}
                      className="bg-gray-100 text-gray-600 px-3 py-2 rounded-lg text-sm font-semibold">
                      🔒
                    </button>
                  </div>
                )}
                {filtro === 'aprovado' && (
                  <div className="flex gap-2">
                    <button onClick={() => bloquear(t.perfil?.id)}
                      className="flex-1 bg-red-100 text-red-600 py-2 rounded-lg text-sm font-semibold">
                      🔒 Bloquear
                    </button>
                    <a href={`https://wa.me/244${t.perfil?.telefone?.replace(/\D/g,'')}`}
                      target="_blank" rel="noopener noreferrer"
                      className="flex-1 text-center bg-green-100 text-green-700 py-2 rounded-lg text-sm font-semibold">
                      💬 WhatsApp
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
