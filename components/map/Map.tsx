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

        if (!mapRef.current || mapInstanceRef.current) return

        const map = L.map(mapRef.current).setView([lat, lng], 13)

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap',
          maxZoom: 19,
        }).addTo(map)

        // Marcador do cliente (moderno)
        const iconeCliente = L.divIcon({
          html: `<div style="width:16px;height:16px;background:#7c3aed;border:3px solid white;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.3)"></div>`,
          className: '',
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        })

        L.marker([lat, lng], { icon: iconeCliente })
          .addTo(map)
          .bindPopup('<b>A sua localização</b>')

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
  }, [lat, lng])

  // Actualizar marcadores quando técnicos mudam
  useEffect(() => {
    if (!mapInstanceRef.current) return

    const updateMarkers = async () => {
      try {
        const L = await import('leaflet')
        
        marcadoresRef.current.forEach((m) => m.remove())
        marcadoresRef.current = []

        tecnicos.forEach((t) => {
          if (!t.distancia_km) return

          const selecionado = tecnicoSeleccionado === t.id
          
          // Cor da borda do marcador baseada no selo
          const corBorda = {
            top_servija: '#f59e0b',
            experiente_verificado: '#8b5cf6',
            verificado: '#16a34a',
            experiente: '#2563eb',
            novo: '#6b7280',
          }[t.selo] || '#6b7280'

          // HTML do marcador com FOTO
          const fotoUrl = t.foto_url || ''
          const temFoto = fotoUrl && fotoUrl !== ''
          
          const iconeHtml = `
            <div style="
              position: relative;
              width: 48px;
              height: 48px;
              background: white;
              border-radius: 50%;
              border: 3px solid ${corBorda};
              box-shadow: 0 2px 8px rgba(0,0,0,0.25);
              overflow: hidden;
              cursor: pointer;
              transition: transform 0.2s;
            ">
              ${temFoto ? `
                <img 
                  src="${fotoUrl}" 
                  alt="${t.nome_completo}" 
                  style="width: 100%; height: 100%; object-fit: cover;"
                  onerror="this.style.display='none'; this.parentElement.innerHTML='<div style=\"display:flex;align-items:center;justify-content:center;width:100%;height:100%;background:#8b5cf6;color:white;font-weight:bold;font-size:18px\">${t.nome_completo.charAt(0)}</div>'"
                />
              ` : `
                <div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;background:#8b5cf6;color:white;font-weight:bold;font-size:18px">
                  ${t.nome_completo.charAt(0)}
                </div>
              `}
              <div style="
                position: absolute;
                bottom: -4px;
                right: -4px;
                background: ${corBorda};
                color: white;
                font-size: 10px;
                font-weight: bold;
                border-radius: 10px;
                padding: 2px 6px;
                white-space: nowrap;
              ">
                ⭐ ${t.avaliacao_media > 0 ? t.avaliacao_media.toFixed(1) : 'Novo'}
              </div>
            </div>
          `

          const icone = L.divIcon({
            html: iconeHtml,
            className: '',
            iconSize: [48, 48],
            iconAnchor: [24, 48],
            popupAnchor: [0, -48],
          })

          // Coordenadas ao redor do cliente
          const latT = lat + (Math.random() - 0.5) * 0.03
          const lngT = lng + (Math.random() - 0.5) * 0.03

          const marcador = L.marker([latT, lngT], { icon: icone })
            .addTo(mapInstanceRef.current)
            .bindPopup(`
              <div style="min-width:180px; text-align:center;">
                <div style="font-weight:bold; margin-bottom:5px;">${t.nome_completo}</div>
                <div style="color:#6b7280; font-size:12px; margin-bottom:5px;">${t.categoria}</div>
                <div style="color:#f59e0b; font-size:12px; margin-bottom:5px;">⭐ ${t.avaliacao_media > 0 ? t.avaliacao_media.toFixed(1) : 'Sem avaliações'}</div>
                <div style="color:#7c3aed; font-size:12px; margin-bottom:10px;">${t.distancia_km} km de distância</div>
                <button onclick="window.location.href='/tecnico/${t.id}'" style="background:#8b5cf6; color:white; border:none; padding:6px 12px; border-radius:12px; cursor:pointer; font-size:12px; font-weight:bold;">
                  Ver perfil →
                </button>
              </div>
            `)
            .on('click', () => {
              // Redirecionar diretamente para o perfil
              window.location.href = `/tecnico/${t.id}`
            })

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
