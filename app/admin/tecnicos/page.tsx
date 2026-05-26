'use client'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Avatar from '@/components/ui/Avatar'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

interface TecnicoCompleto {
  id: string
  perfil_id: string
  bairro: string | null
  selo: string
  status_verificacao: string
  documento_identidade: string | null
  anos_experiencia: number
  criado_em: string
  perfil: {
    nome_completo: string
    email: string
    telefone: string
    foto_url: string | null
  }
  categoria: {
    nome: string
  }
}

export default function AdminTecnicosPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [tecnicos, setTecnicos] = useState<TecnicoCompleto[]>([])
  const [loading, setLoading] = useState(true)
  const [processando, setProcessando] = useState<string | null>(null)

  const statusFiltro = searchParams.get('status') || 'todos'

  useEffect(() => {
    carregar()
  }, [statusFiltro])

  async function carregar() {
    setLoading(true)
    const supabase = createClient()

    let query = supabase
      .from('tecnicos')
      .select(`
        id, perfil_id, bairro, selo, status_verificacao,
        documento_identidade, anos_experiencia, criado_em,
        perfil:perfis(nome_completo, email, telefone, foto_url),
        categoria:categorias_servico(nome)
      `)
      .order('criado_em', { ascending: false })

    if (statusFiltro === 'pendente') {
      query = query.eq('status_verificacao', 'aguardando')
    }

    const { data, error } = await query
    if (!error && data) {
      setTecnicos(data as any)
    }
    setLoading(false)
  }

  async function aprovar(id: string) {
    setProcessando(id)
    const supabase = createClient()
    const { error } = await supabase
      .from('tecnicos')
      .update({ status_verificacao: 'aprovado' })
      .eq('id', id)
    if (!error) {
      await carregar()
    }
    setProcessando(null)
  }

  async function recusar(id: string) {
    const motivo = prompt('Motivo da recusa:')
    if (!motivo) return
    setProcessando(id)
    const supabase = createClient()
    const { error } = await supabase
      .from('tecnicos')
      .update({ status_verificacao: 'recusado', motivo_recusa: motivo })
      .eq('id', id)
    if (!error) {
      await carregar()
    }
    setProcessando(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => router.back()} className="text-gray-500 text-xl">←</button>
        <h1 className="font-bold text-gray-900 text-lg flex-1">Gestão de Técnicos</h1>
        <span className="font-bold text-sm">
          <span className="text-servi-500">Servi</span>
          <span className="text-ja-500">Já</span>
        </span>
      </div>

      {/* Filtros */}
      <div className="bg-white border-b border-gray-100 px-4 py-2">
        <div className="flex gap-2">
          <button
            onClick={() => router.push('/admin/tecnicos')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium ${
              statusFiltro === 'todos'
                ? 'bg-servi-600 text-white'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => router.push('/admin/tecnicos?status=pendente')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium ${
              statusFiltro === 'pendente'
                ? 'bg-servi-600 text-white'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            Pendentes
          </button>
        </div>
      </div>

      {/* Lista */}
      <div className="px-4 py-4">
        {tecnicos.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
            <span className="text-5xl mb-3 block">👥</span>
            <p className="font-semibold text-gray-900">Nenhum técnico encontrado</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {tecnicos.map((t) => (
              <div key={t.id} className="bg-white rounded-xl border border-gray-100 p-4">
                <div className="flex items-start gap-3">
                  <Avatar src={t.perfil?.foto_url} nome={t.perfil?.nome_completo} size="lg" />
                  <div className="flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-gray-900">{t.perfil?.nome_completo}</p>
                        <p className="text-xs text-gray-500">{t.categoria?.nome}</p>
                        <p className="text-xs text-gray-400 mt-1">{t.bairro}</p>
                        {t.documento_identidade && (
                          <p className="text-xs text-gray-400 mt-1">
                            📄 BI: {t.documento_identidade}
                          </p>
                        )}
                        <p className="text-xs text-gray-400">📞 {t.perfil?.telefone}</p>
                        <p className="text-xs text-gray-400">✉️ {t.perfil?.email}</p>
                      </div>
                      <div className="flex flex-col items-end">
                        {t.status_verificacao === 'aguardando' && (
                          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full mb-2">
                            ⏳ Pendente
                          </span>
                        )}
                        {t.status_verificacao === 'aprovado' && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full mb-2">
                            ✅ Aprovado
                          </span>
                        )}
                        {t.status_verificacao === 'recusado' && (
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full mb-2">
                            ❌ Recusado
                          </span>
                        )}
                      </div>
                    </div>

                    {t.status_verificacao === 'aguardando' && (
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => aprovar(t.id)}
                          disabled={processando === t.id}
                          className="flex-1 bg-green-500 text-white py-2 rounded-lg text-sm font-semibold hover:bg-green-600 disabled:opacity-50"
                        >
                          {processando === t.id ? 'A processar...' : '✅ Aprovar'}
                        </button>
                        <button
                          onClick={() => recusar(t.id)}
                          disabled={processando === t.id}
                          className="flex-1 bg-red-500 text-white py-2 rounded-lg text-sm font-semibold hover:bg-red-600 disabled:opacity-50"
                        >
                          ❌ Recusar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
