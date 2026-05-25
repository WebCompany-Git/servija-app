'use client'
import { useState } from 'react'

interface Props {
  onEnviar: (texto: string) => void
  disabled?: boolean
}

export default function MessageInput({ onEnviar, disabled }: Props) {
  const [texto, setTexto] = useState('')

  function handleEnviar() {
    if (!texto.trim() || disabled) return
    onEnviar(texto)
    setTexto('')
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleEnviar()
    }
  }

  return (
    <div className="bg-white border-t border-gray-100 px-4 py-3 flex items-end gap-3">
      <textarea
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Escreve uma mensagem..."
        rows={1}
        disabled={disabled}
        className="flex-1 resize-none rounded-2xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-servi-500 max-h-32 disabled:opacity-50"
      />
      <button
        onClick={handleEnviar}
        disabled={!texto.trim() || disabled}
        className="w-10 h-10 bg-servi-600 text-white rounded-full flex items-center justify-center hover:bg-servi-700 transition-colors disabled:opacity-40 flex-shrink-0"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="22" y1="2" x2="11" y2="13"/>
          <polygon points="22 2 15 22 11 13 2 9 22 2"/>
        </svg>
      </button>
    </div>
  )
}
