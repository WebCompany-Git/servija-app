'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

export default function LoginPage() {
  const { login, loading, erro } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await login(email, password)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-servi-50 to-white flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">

        {/* Logo - EXATAMENTE igual ao sign-up */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 justify-center">
            <div className="w-10 h-10 bg-servi-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">SJ</span>
            </div>
            <span className="font-bold text-2xl">
              <span className="text-servi-500">Servi</span>
              <span className="text-ja-500">Já</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-4">
            Entrar na conta
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            O teu problema tem solução já
          </p>
        </div>

        {/* Card - EXATAMENTE igual ao sign-up */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

          {erro && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-4">
              {erro}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="o-teu@email.com"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-servi-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-servi-500 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-servi-600 text-white py-3 rounded-xl font-semibold hover:bg-servi-700 transition-colors disabled:opacity-50 mt-1"
            >
              {loading ? 'A entrar...' : 'Entrar'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Não tens conta?{' '}
            <Link href="/sign-up" className="text-servi-600 font-medium hover:text-servi-700">
              Criar conta gratuita
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Ajuda?{' '}
          <a href="https://wa.me/244938080177" target="_blank" rel="noopener noreferrer"
            className="text-servi-600 hover:text-servi-700">
            WhatsApp 938 080 177
          </a>
        </p>
      </div>
    </div>
  )
}