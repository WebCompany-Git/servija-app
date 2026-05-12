'use client'
import { useState, useEffect } from 'react'

interface Localizacao {
  lat: number
  lng: number
}

export function useLocation() {
  const [localizacao, setLocalizacao] = useState<Localizacao | null>(null)
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    // Localização padrão — centro de Luanda
    const luanda: Localizacao = { lat: -8.8383, lng: 13.2344 }

    if (!navigator.geolocation) {
      setErro('O teu browser não suporta geolocalização.')
      setLocalizacao(luanda)
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocalizacao({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        })
        setLoading(false)
      },
      () => {
        // Se recusar a localização usa Luanda como padrão
        setLocalizacao(luanda)
        setLoading(false)
      },
      { timeout: 10000, enableHighAccuracy: true }
    )
  }, [])

  return { localizacao, loading, erro }
}