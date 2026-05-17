'use client'
import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { useLocation, zonasDisponiveis } from '@/hooks/useLocation'
import { useTecnicos } from '@/hooks/useTecnicos'
import TecnicoMarker from '@/components/map/TecnicoMarker'
import Link from 'next/link'

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

const raios = [
  { km: 5, label: '5 km' },
  { km: 10, label: '10 km' },
  { km: 20, label: '20 km' },
  { km: 30, label: '30 km' },
]

export default function BuscarPage() {
  const { localizacao, loading: loadingLoc, erro, obterLocalizacao, setZonaManual } = useLocation()
  const [categoriaSlug, setCategoriaSlug] = useState<string | null>(null)
  const [tecnicoSeleccionado, setTecnicoSeleccionado] = useState<string | null>(null)
  const [vistaLista, setVistaLista] = useState(false)
  const [raioKm, setRaioKm] = useState(10)
  
  const primeiraVez = useRef(true)

  const { tecnicos, loading: loadingTec, buscar } = useTecnicos(
    localizacao?.lat ?? null,
    localizacao?.lng ?? null,
    categoriaSlug
  )

  const loading = loadingLoc || loadingTec

  // Só busca quando localização muda (sem loop)
  useEffect(() => {
    if (localizacao) {
      buscar()
    }
  }, [localizacao, buscar])

  const handleMudarLocalizacao = (zona: typeof zonasDisponiveis[0]) => {
    setZonaManual(zona)
  }

  const handleUsarLocalizacao = () => {
    obterLocalizacao()
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">

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
        <button
          onClick={() => setVistaLista(!vistaLista)}
          className="ml-auto text-xs bg-servi-50 text-servi-600 px-3 py-1.5 rounded-lg font-medium"
        >
          {vistaLista ? '🗺️ Mapa' : '📋 Lista'}
        </button>
      </div>

      <div className="bg-white border-b border-gray-100 px-4 py-2">
        <button
          onClick={handleUsarLocalizacao}
          className="w-full bg-servi-600 text-white px-3 py-2 rounded-xl text-sm font-medium hover:bg-servi-700 transition-colors mb-2"
        >
          📍 Usar minha localização
        </button>

        <div className="mb-2">
          <p className="text-xs text-gray-500 mb-1">📍 Raio: {raioKm} km</p>
          <div className="flex gap-2">
            {raios.map((r) => (
              <button
                key={r.km}
                onClick={() => setRaioKm(r.km)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-medium ${
                  raioKm === r.km
                    ? 'bg-servi-600 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {zonasDisponiveis.map((zona) => (
            <button
              key={zona.nome}
              onClick={() => handleMudarLocalizacao(zona)}
              className="px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 whitespace-nowrap"
            >
              {zona.nome}
            </button>
          ))}
        </div>

        {erro && (
          <div className="mt-2 p-2 bg-ja-50 rounded-lg">
            <p className="text-ja-700 text-xs">{erro}</p>
          </div>
        )}

        {localizacao && (
          <div className="mt-2 p-2 bg-servi-50 rounded-lg">
            <p className="text-servi-700 text-xs">
              📍 {localizacao.lat.toFixed(4)}, {localizacao.lng.toFixed(4)}
            </p>
          </div>
        )}
      </div>

      <div className="bg-white border-b border-gray-100 px-4 py-2">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categorias.map((cat) => (
            <button
              key={cat.nome}
              onClick={() => setCategoriaSlug(cat.slug)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
                categoriaSlug === cat.slug
                  ? 'bg-servi-600 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              <span>{cat.icone}</span>
              <span>{cat.nome}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {vistaLista ? (
          <div className="h-full overflow-y-auto px-4 py-3">
            {loading ? (
              <div className="flex flex-col gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white rounded-xl p-3 flex gap-3 animate-pulse">
                    <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                    <div className="flex-1">
                      <div className="h-3 bg-gray-200 rounded w-32 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-24 mb-2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : tecnicos.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <span className="text-5xl mb-4">🔍</span>
                <p className="font-semibold text-gray-900 mb-1">Nenhum técnico encontrado</p>
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
          <div className="h-full">
            {localizacao ? (
              <Map
                lat={localizacao.lat}
                lng={localizacao.lng}
                tecnicos={tecnicos}
                tecnicoSeleccionado={tecnicoSeleccionado}
                onTecnicoClick={setTecnicoSeleccionado}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <div className="text-center">
                  <div className="w-8 h-8 border-4 border-servi-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-sm text-gray-500">A obter localização...</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
