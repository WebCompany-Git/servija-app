import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ServiJá — O teu problema tem solução já',
  description: 'Encontra técnicos de confiança perto de ti em Angola. Eletricistas, canalizadores, mecânicos e muito mais.',
  keywords: 'técnicos Angola, eletricista Luanda, canalizador Luanda, ServiJá',
  openGraph: {
    title: 'ServiJá — O teu problema tem solução já',
    description: 'A maior plataforma de serviços locais de Angola.',
    type: 'website',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt">
      <body>{children}</body>
    </html>
  )
}