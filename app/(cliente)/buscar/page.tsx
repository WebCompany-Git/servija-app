'use client'
import { useState } from 'react'
import dynamic from 'next/dynamic'
import { useLocation } from '@/hooks/useLocation'
import { useTecnicos } from '@/hooks/useTecnicos'
import TecnicoMarker from '@/components/map/TecnicoMarker'
import Link from 'next/link'

// Mapa carrega só no browser (não no servidor)
const Map = dynamic(() => import('@/components/map/Map'), { ssr: false })

const categorias = [
  { nome: 'Todos', slug: null, icone: '🔍' },
  { nome: 'Frio', slug: 'tecnico-de-frio', icone: '❄️' },
  { nome: 'Eletricista', slug: 'eletricista', icone: '⚡' },
  { nome: 'Canalizador', slug: 'canalizador', icone: '🔧' },
  { nome: 'Mecânico', slug: 'mecanico-auto', icone: '🚗' },
  { nome: 'Informático', slug: 'informatico', icone: '💻' },
  { nome: 'Pedreiro', slug: 'pedreiro', icone: '🏗️' },
  { nome: 'Pintor', slug: 'pintor', icone: '🎨' },
  { nome: 'Eletrónica', slug: 'tecnico-eletronica', icone: '🎮' },
  { nome: 'Geradores', slug: 'mecanico-geradores', icone: '⚙️' },
  { nome: 'Eletrodom.', slug: 'tecnico-eletrodomesticos', icone: '🏠' },
  { nome: 'Soldador', slug: 'soldador', icone: '🔩' },
  { nome: 'Ladrilheiro', slug: 'ladrilheiro', icone: '🪟' },
]

export default function BuscarPage() {
  const { localizacao, loading: loadingLoc } = useLocation()
  const [categoriaSlug, setCategoriaSlug] = useState<string | null>(null)
  const [tecnicoSeleccionado, setTecnicoSeleccionado] = useState<string | null>(null)
  const [vistaLista, setVistaLista] = useState(false)

  const { tecnicos, loading: loadingTec } = useTecnicos(
    localizacao?.lat ?? null,
    localizacao?.lng ?? null,
    categoriaSlug
  )

  const loading = loadingLoc || loadingTec

  return (
    <div className="h-screen flex flex-col bg-gray-50">

      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <Link href="/cliente/dashboard" className="text-gray-500 hover:text-gray-700">
          ←
        </Link>
        <div>
          <h1 className="font-bold text-gray-900 text-sm">
            <span className="text-servi-500">Servi</span>
            <span className="text-ja-500">Já</span>
          </h1>
          <p className="text-xs text-gray-500">
            {loading ? 'A procurar...' : `${tecnicos.length} técnicos encontrados`}
          </p>
        </div>
        {/* Botão lista/mapa */}
        <button
          onClick={() => setVistaLista(!vistaLista)}
          className="ml-auto text-xs bg-servi-50 text-servi-600 px-3 py-1.5 rounded-lg font-medium"
        >
          {vistaLista ? '🗺️ Mapa' : '📋 Lista'}
        </button>
      </div>

      {/* Filtros de categoria */}
      <div className="bg-white border-b border-gray-100 px-4 py-2">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {categorias.map((cat) => (
            <button
              key={cat.nome}
              onClick={() => setCategoriaSlug(cat.slug)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                categoriaSlug === cat.slug
                  ? 'bg-servi-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span>{cat.icone}</span>
              <span>{cat.nome}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Conteúdo — Mapa ou Lista */}
      <div className="flex-1 overflow-hidden">
        {vistaLista ? (
          /* VISTA LISTA */
          <div className="h-full overflow-y-auto px-4 py-3">
            {loading ? (
              /* Loading skeleton */
              <div className="flex flex-col gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white rounded-xl p-3 flex gap-3 animate-pulse">
                    <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                    <div className="flex-1">
                      <div className="h-3 bg-gray-200 rounded w-32 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-24 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-20"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : tecnicos.length === 0 ? (
              /* Estado vazio */
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <span className="text-5xl mb-4">🔍</span>
                <p className="font-semibold text-gray-900 mb-1">Nenhum técnico encontrado</p>
                <p className="text-sm text-gray-500">Tenta outra categoria ou aumenta o raio</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {tecnicos.map((t) => (
                  <Link key={t.id} href={`/tecnico/${t.id}`}>
                    <TecnicoMarker
                      tecnico={t}
                      selecionado={tecnicoSeleccionado === t.id}
                      onClick={() => setTecnicoSeleccionado(t.id)}
                    />
                  </Link>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* VISTA MAPA */
          <div className="h-full flex flex-col md:flex-row">

            {/* Mapa */}
            <div className="flex-1 relative">
              {loadingLoc ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <div className="text-center">
                    <div className="w-8 h-8 border-4 border-servi-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-sm text-gray-500">A obter localização...</p>
                  </div>
                </div>
              ) : localizacao ? (
                <Map
                  lat={localizacao.lat}
                  lng={localizacao.lng}
                  tecnicos={tecnicos}
                  tecnicoSeleccionado={tecnicoSeleccionado}
                  onTecnicoClick={setTecnicoSeleccionado}
                />
              ) : null}
            </div>

            {/* Lista lateral — desktop */}
            <div className="hidden md:flex flex-col w-80 bg-white border-l border-gray-100 overflow-y-auto">
              <div className="p-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-700">
                  {tecnicos.length} técnicos perto de ti
                </p>
              </div>
              {loading ? (
                <div className="p-3 flex flex-col gap-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-3 animate-pulse">
                      <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                      <div className="flex-1">
                        <div className="h-3 bg-gray-200 rounded w-28 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-20"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : tecnicos.length === 0 ? (
                <div className="flex flex-col items-center justify-center flex-1 p-6 text-center">
                  <span className="text-4xl mb-3">🔍</span>
                  <p className="font-semibold text-gray-900 text-sm mb-1">Sem técnicos</p>
                  <p className="text-xs text-gray-500">Tenta outra categoria</p>
                </div>
              ) : (
                <div className="p-3 flex flex-col gap-2">
                  {tecnicos.map((t) => (
                    <Link key={t.id} href={`/tecnico/${t.id}`}>
                      <TecnicoMarker
                        tecnico={t}
                        selecionado={tecnicoSeleccionado === t.id}
                        onClick={() => setTecnicoSeleccionado(t.id)}
                      />
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Painel mobile — técnico seleccionado */}
            {tecnicoSeleccionado && (
              <div className="md:hidden absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
                {tecnicos.filter((t) => t.id === tecnicoSeleccionado).map((t) => (
                  <div key={t.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-servi-100 flex items-center justify-center flex-shrink-0">
                      {t.foto_url ? (
                        <img src={t.foto_url} alt={t.nome_completo} className="w-full h-full object-cover rounded-xl" />
                      ) : (
                        <span className="text-servi-600 font-bold text-lg">{t.nome_completo.charAt(0)}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm">{t.nome_completo}</p>
                      <p className="text-xs text-gray-500">{t.categoria} · {t.distancia_km} km</p>
                    </div>
                    <Link
                      href={`/tecnico/${t.id}`}
                      className="bg-servi-600 text-white px-4 py-2 rounded-xl text-sm font-semibold"
                    >
                      Ver perfil
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}