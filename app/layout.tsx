//This is a layout page
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ServiJá — O teu problema tem solução já',
  description: 'Encontra técnicos de confiança perto de ti em Angola.',
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