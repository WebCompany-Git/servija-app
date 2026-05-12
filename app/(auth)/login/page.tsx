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
    <div className="min-h-screen bg-gradient-to-br from-servi-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-servi-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">SJ</span>
            </div>
            <span className="font-bold text-2xl">
              <span className="text-servi-500">Servi</span>
              <span className="text-ja-500">Já</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-4">Bem-vindo de volta</h1>
          <p className="text-gray-500 mt-1">Entra na tua conta</p>
        </div>

        {/* Formulário */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

          {/* Erro */}
          {erro && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
              {erro}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="o-teu@email.com"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-servi-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Link href="/forgot-password" className="text-xs text-servi-600 hover:text-servi-700">
                  Esqueceste?
                </Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-servi-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Botão */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-servi-600 text-white py-3 rounded-xl font-semibold hover:bg-servi-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? 'A entrar...' : 'Entrar'}
            </button>
          </form>

          {/* Registo */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Não tens conta?{' '}
            <Link href="/sign-up" className="text-servi-600 font-medium hover:text-servi-700">
              Regista-te grátis
            </Link>
          </p>
        </div>

        {/* Suporte */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Precisas de ajuda?{' '}
          <a href="https://wa.me/244938080177" target="_blank" rel="noopener noreferrer"
            className="text-servi-600 hover:text-servi-700">
            Fala connosco no WhatsApp
          </a>
        </p>
      </div>
    </div>
  )
}
