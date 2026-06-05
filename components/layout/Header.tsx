'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  const [menuAberto, setMenuAberto] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo ServiJá com imagem */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 relative">
            <Image
              src="/logo.png"
              alt="ServiJá"
              width={32}
              height={32}
              className="object-contain"
            />
          </div>
          <span className="font-bold text-xl">
            <span className="text-servi-500">Servi</span>
            <span className="text-ja-500">Já</span>
          </span>
        </Link>

        {/* Menu Desktop */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="#como-funciona" className="text-gray-600 hover:text-servi-600 transition-colors text-sm font-medium">
            Como funciona
          </Link>
          <Link href="#categorias" className="text-gray-600 hover:text-servi-600 transition-colors text-sm font-medium">
            Categorias
          </Link>
          <Link href="#selos" className="text-gray-600 hover:text-servi-600 transition-colors text-sm font-medium">
            Confiança
          </Link>
        </nav>

        {/* Botões Desktop */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login" className="text-servi-600 font-medium text-sm hover:text-servi-700 transition-colors">
            Entrar
          </Link>
          <Link href="/sign-up" className="bg-servi-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-servi-700 transition-colors">
            Registar
          </Link>
        </div>

        {/* Botão Menu Mobile */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          onClick={() => setMenuAberto(!menuAberto)}
        >
          <div className="w-5 h-0.5 bg-gray-600 mb-1"></div>
          <div className="w-5 h-0.5 bg-gray-600 mb-1"></div>
          <div className="w-5 h-0.5 bg-gray-600"></div>
        </button>
      </div>

      {/* Menu Mobile Aberto */}
      {menuAberto && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-4">
          <Link href="#como-funciona" className="text-gray-600 text-sm font-medium py-2">Como funciona</Link>
          <Link href="#categorias" className="text-gray-600 text-sm font-medium py-2">Categorias</Link>
          <Link href="#selos" className="text-gray-600 text-sm font-medium py-2">Confiança</Link>
          <div className="flex gap-3 pt-2 border-t border-gray-100">
            <Link href="/login" className="flex-1 text-center border border-servi-600 text-servi-600 py-2.5 rounded-lg text-sm font-medium">
              Entrar
            </Link>
            <Link href="/sign-up" className="flex-1 text-center bg-servi-600 text-white py-2.5 rounded-lg text-sm font-medium">
              Registar
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
