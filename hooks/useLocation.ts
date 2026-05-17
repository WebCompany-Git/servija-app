'use client'
import { useState, useEffect, useCallback } from 'react'

interface Localizacao {
  lat: number
  lng: number
}

// Zonas de Luanda e Icolo e Bengo
export const zonasDisponiveis = [
  { nome: '📍 Luanda Centro', lat: -8.8383, lng: 13.2344 },
  { nome: '🏘️ Icolo e Bengo (Zango)', lat: -8.9833, lng: 13.3167 },
  { nome: '🏙️ Talatona', lat: -8.8933, lng: 13.1875 },
  { nome: '🏠 Kilamba', lat: -8.9833, lng: 13.2167 },
  { nome: '🌊 Belas', lat: -8.9833, lng: 13.1833 },
  { nome: '🏪 Viana', lat: -8.9033, lng: 13.3667 },
]

export function useLocation() {
  const [localizacao, setLocalizacao] = useState<Localizacao | null>(null)
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  const obterLocalizacao = useCallback(() => {
    setLoading(true)
    setErro(null)

    const luanda: Localizacao = { lat: -8.8383, lng: 13.2344 }

    if (!navigator.geolocation) {
      setErro('❌ O teu navegador não suporta localização. Usa uma zona manual.')
      setLocalizacao(luanda)
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        console.log('📍 Localização obtida:', pos.coords.latitude, pos.coords.longitude)
        setLocalizacao({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        })
        setErro(null)
        setLoading(false)
      },
      (err) => {
        console.log('❌ Erro GPS:', err.message)
        
        if (err.code === 1) {
          setErro('⚠️ Permissão negada. Clica em "📍 Usar minha localização" e permite o acesso ao GPS.')
        } else if (err.code === 2) {
          setErro('📡 Não foi possível obter localização. Verifica se o GPS está ligado.\n\n💡 Dica: Ativa o GPS nas definições do telemóvel e clica no botão "📍 Usar minha localização" novamente.')
        } else if (err.code === 3) {
          setErro('⏰ Tempo esgotado. O GPS demorou muito.\n\n💡 Dica: Clica no botão "📍 Usar minha localização" novamente para tentar outra vez.')
        } else {
          setErro('📍 Não foi possível obter localização. Usa os botões de zona manual acima ou clica em "📍 Usar minha localização" para tentar novamente.')
        }
        
        setLocalizacao(luanda)
        setLoading(false)
      },
      { timeout: 10000, enableHighAccuracy: true }
    )
  }, [])

  const setZonaManual = useCallback((zona: typeof zonasDisponiveis[0]) => {
    setLocalizacao({ lat: zona.lat, lng: zona.lng })
    setErro(null)
    setLoading(false)
  }, [])

  useEffect(() => {
    obterLocalizacao()
  }, [obterLocalizacao])

  return { localizacao, loading, erro, obterLocalizacao, setZonaManual, zonasDisponiveis }
}
