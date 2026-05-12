'use client'
import type { Tecnico } from '@/hooks/useTecnicos'

interface Props {
  tecnico: Tecnico
  selecionado: boolean
  onClick: () => void
}

const seloConfig = {
  top_servija:           { emoji: '🏆', cor: 'bg-yellow-100 text-yellow-700' },
  experiente_verificado: { emoji: '⭐', cor: 'bg-servi-100 text-servi-700' },
  verificado:            { emoji: '✅', cor: 'bg-green-100 text-green-700' },
  experiente:            { emoji: '👍', cor: 'bg-blue-100 text-blue-700' },
  novo:                  { emoji: '🆕', cor: 'bg-gray-100 text-gray-600' },
}

export default function TecnicoMarker({ tecnico, selecionado, onClick }: Props) {
  const selo = seloConfig[tecnico.selo as keyof typeof seloConfig] || seloConfig.novo

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
        selecionado
          ? 'border-servi-600 bg-servi-50 shadow-md'
          : 'border-gray-100 bg-white hover:border-servi-200 hover:shadow-sm'
      }`}
    >
      {/* Foto ou avatar */}
      <div className="w-12 h-12 rounded-xl bg-servi-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
        {tecnico.foto_url ? (
          <img src={tecnico.foto_url} alt={tecnico.nome_completo} className="w-full h-full object-cover" />
        ) : (
          <span className="text-servi-600 font-bold text-lg">
            {tecnico.nome_completo.charAt(0)}
          </span>
        )}
      </div>

      {/* Informação */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <p className="font-semibold text-gray-900 text-sm truncate">
            {tecnico.nome_completo}
          </p>
          <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium flex-shrink-0 ${selo.cor}`}>
            {selo.emoji}
          </span>
        </div>
        <p className="text-xs text-gray-500 truncate">{tecnico.categoria}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-yellow-500">★ {tecnico.avaliacao_media > 0 ? tecnico.avaliacao_media.toFixed(1) : 'Novo'}</span>
          <span className="text-xs text-gray-400">·</span>
          <span className="text-xs text-servi-600">{tecnico.distancia_km} km</span>
          {tecnico.preco_base && (
            <>
              <span className="text-xs text-gray-400">·</span>
              <span className="text-xs text-gray-600">
                {tecnico.preco_base.toLocaleString()} Kz
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}