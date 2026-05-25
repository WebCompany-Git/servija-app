import React from 'react'

interface SeloBadgeProps {
  selo: string
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

const seloConfig: Record<string, { emoji: string; label: string; classe: string }> = {
  top_servija:           { emoji: '🏆', label: 'Top ServiJá',        classe: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  experiente_verificado: { emoji: '⭐', label: 'Exp. + Verificado',  classe: 'bg-servi-100 text-servi-700 border-servi-200' },
  verificado:            { emoji: '✅', label: 'Verificado',          classe: 'bg-green-100 text-green-700 border-green-200' },
  experiente:            { emoji: '👍', label: 'Experiente',          classe: 'bg-blue-100 text-blue-700 border-blue-200' },
  novo:                  { emoji: '🆕', label: 'Novo',                classe: 'bg-gray-100 text-gray-600 border-gray-200' },
}

const sizeClasses = {
  sm: 'text-xs px-1.5 py-0.5',
  md: 'text-sm px-2 py-1',
  lg: 'text-base px-3 py-1.5',
}

export default function SeloBadge({ selo, size = 'md', showLabel = true }: SeloBadgeProps) {
  const config = seloConfig[selo] || seloConfig.novo
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border font-semibold ${config.classe} ${sizeClasses[size]}`}>
      <span>{config.emoji}</span>
      {showLabel && <span>{config.label}</span>}
    </span>
  )
}
