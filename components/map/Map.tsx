'use client'

import { useEffect, useRef } from 'react'
import type { Tecnico } from '@/hooks/useTecnicos'
import 'leaflet/dist/leaflet.css'

interface MapProps {
  lat: number
  lng: number
  tecnicos: Tecnico[]
  tecnicoSeleccionado: string | null
  onTecnicoClick: (id: string) => void
}

export default function Map({
  lat,
  lng,
  tecnicos,
  tecnicoSeleccionado,
  onTecnicoClick
}: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const marcadoresRef = useRef<any[]>([])
  const inicializadoRef = useRef(false)

  // Inicializar mapa apenas uma vez
  useEffect(() => {
    // Se já inicializou ou não tem ref, sai
    if (inicializadoRef.current || !mapRef.current) return

    const initMap = async () => {
      try {
        const L = await import('leaflet')

        delete (L.Icon.Default.prototype as any)._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        })

        // Verificar se o container ainda existe e não tem mapa
        if (!mapRef.current || mapInstanceRef.current) return

        const map = L.map(mapRef.current).setView([lat, lng], 13)

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap',
          maxZoom: 19,
        }).addTo(map)

        const iconeCliente = L.divIcon({
          html: `<div style="width:16px;height:16px;background:#7c3aed;border:3px solid white;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.3)"></div>`,
          className: '',
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        })

        L.marker([lat, lng], { icon: iconeCliente })
          .addTo(map)
          .bindPopup('<b>A tua localização</b>')

        mapInstanceRef.current = map
        inicializadoRef.current = true
      } catch (err) {
        console.error('Erro ao inicializar mapa:', err)
      }
    }

    initMap()

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
        inicializadoRef.current = false
      }
    }
  }, [lat, lng])  // Só executa quando lat/lng mudam

  // Actualizar marcadores quando técnicos mudam
  useEffect(() => {
    if (!mapInstanceRef.current) return

    const updateMarkers = async () => {
      try {
        const L = await import('leaflet')
        
        // Remover marcadores antigos
        marcadoresRef.current.forEach((m) => m.remove())
        marcadoresRef.current = []

        // Adicionar novos marcadores
        tecnicos.forEach((t) => {
          if (!t.distancia_km) return

          const selecionado = tecnicoSeleccionado === t.id
          const corSelo = {
            top_servija: '#f59e0b',
            experiente_verificado: '#8b5cf6',
            verificado: '#16a34a',
            experiente: '#2563eb',
            novo: '#6b7280',
          }[t.selo] || '#6b7280'

          const icone = L.divIcon({
            html: `<div style="background:${selecionado ? '#7c3aed' : corSelo};color:white;padding:4px 8px;border-radius:20px;font-size:11px;font-weight:700;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,0.25);border:2px solid ${selecionado ? '#5b21b6' : 'white'};">
              ⭐ ${t.avaliacao_media > 0 ? t.avaliacao_media.toFixed(1) : 'Novo'}
            </div>`,
            className: '',
            iconAnchor: [30, 15],
          })

          // Coordenadas ao redor do cliente
          const latT = lat + (Math.random() - 0.5) * 0.03
          const lngT = lng + (Math.random() - 0.5) * 0.03

          const marcador = L.marker([latT, lngT], { icon: icone })
            .addTo(mapInstanceRef.current)
            .bindPopup(`
              <div style="min-width:150px">
                <b>${t.nome_completo}</b><br/>
                <span style="color:#6b7280;font-size:12px">${t.categoria}</span><br/>
                <span style="color:#f59e0b">★</span>
                <span style="font-size:12px">${t.avaliacao_media > 0 ? t.avaliacao_media.toFixed(1) : 'Sem avaliações'}</span>
                <br/>
                <span style="font-size:12px;color:#7c3aed">${t.distancia_km} km</span>
              </div>
            `)
            .on('click', () => onTecnicoClick(t.id))

          marcadoresRef.current.push(marcador)
        })
      } catch (err) {
        console.error('Erro ao actualizar marcadores:', err)
      }
    }

    updateMarkers()
  }, [tecnicos, tecnicoSeleccionado, lat, lng, onTecnicoClick])

  return (
    <>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      />
      <div ref={mapRef} className="w-full h-full rounded-xl" />
    </>
  )
}
