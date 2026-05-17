'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

export interface Tecnico {
  id: string
  nome_completo: string
  categoria: string
  foto_url: string | null
  avaliacao_media: number
  total_avaliacoes: number
  distancia_km: number
  raio_encontrado: number
  preco_hora: number | null
  preco_base: number | null
  disponivel: boolean
  verificado: boolean
  bairro: string | null
  provincia: string | null
  selo: string
}

export function useTecnicos(
  lat: number | null,
  lng: number | null,
  categoriaSlug?: string | null
) {
  const [tecnicos, setTecnicos] = useState<Tecnico[]>([])
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const ultimaBuscaRef = useRef<string>('')

  const buscar = useCallback(async () => {
    if (!lat || !lng) return
    
    const chaveBusca = `${lat}-${lng}-${categoriaSlug || 'todos'}`
    if (ultimaBuscaRef.current === chaveBusca) return
    ultimaBuscaRef.current = chaveBusca
    
    setLoading(true)
    setErro(null)
    try {
      const supabase = createClient()
      const { data, error } = await supabase.rpc(
        'buscar_tecnicos_progressivo',
        {
          p_lat: lat,
          p_long: lng,
          p_categoria_slug: categoriaSlug || null,
          p_limite: 20,
        }
      )
      if (error) {
        setErro('Erro ao buscar técnicos.')
        return
      }
      setTecnicos(data || [])
    } catch {
      setErro('Erro de ligação. Tenta novamente.')
    } finally {
      setLoading(false)
    }
  }, [lat, lng, categoriaSlug])

  useEffect(() => {
    if (lat && lng) {
      buscar()
    }
  }, [lat, lng, categoriaSlug, buscar])

  return { tecnicos, loading, erro, buscar }
}
