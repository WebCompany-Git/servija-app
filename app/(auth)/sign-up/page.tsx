'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

export default function SignUpPage() {
  const { registar, loading, erro } = useAuth()
  const [tipo, setTipo] = useState<'cliente' | 'tecnico'>('cliente')
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [erroLocal, setErroLocal] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErroLocal(null)

    if (password !== confirmar) {
      setErroLocal('As passwords não coincidem.')
      return
    }
    if (password.length < 6) {
      setErroLocal('A password deve ter pelo menos 6 caracteres.')
      return
    }

    await registar({ email, password, nome, telefone, tipo })
  }

  const erroFinal = erroLocal || erro

  return (
    <div className="min-h-screen bg-gradient-to-br from-servi-50 to-white flex items-center justify-center px-4 py-8">
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
          <h1 className="text-2xl font-bold text-gray-900 mt-4">Criar conta</h1>
          <p className="text-gray-500 mt-1">Junta-te ao ServiJá gratuitamente</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

          {/* Escolha de tipo */}
          <div className="flex gap-3 mb-6">
            <button
              type="button"
              onClick={() => setTipo('cliente')}
              className={`flex-1 py-3 rounded-xl text-sm font-semibold border-2 transition-colors ${
                tipo === 'cliente'
                  ? 'border-servi-600 bg-servi-50 text-servi-700'
                  : 'border-gray-200 text-gray-500 hover:border-gray-300'
              }`}
            >
              👤 Sou cliente
            </button>
            <button
              type="button"
              onClick={() => setTipo('tecnico')}
              className={`flex-1 py-3 rounded-xl text-sm font-semibold border-2 transition-colors ${
                tipo === 'tecnico'
                  ? 'border-servi-600 bg-servi-50 text-servi-700'
                  : 'border-gray-200 text-gray-500 hover:border-gray-300'
              }`}
            >
              🔧 Sou técnico
            </button>
          </div>

          {/* Aviso técnico */}
          {tipo === 'tecnico' && (
            <div className="bg-ja-50 border border-ja-200 text-ja-700 px-4 py-3 rounded-lg text-xs mb-4">
              🔍 O teu perfil será verificado pela nossa equipa em até 24h antes de aparecer nas buscas.
            </div>
          )}

          {/* Erro */}
          {erroFinal && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
              {erroFinal}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Nome */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome completo
              </label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="O teu nome completo"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-servi-500 focus:border-transparent text-sm"
              />
            </div>

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

            {/* Telefone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefone
              </label>
              <input
                type="tel"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="9XX XXX XXX"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-servi-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-servi-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Confirmar password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar password
              </label>
              <input
                type="password"
                value={confirmar}
                onChange={(e) => setConfirmar(e.target.value)}
                placeholder="Repete a password"
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
              {loading ? 'A criar conta...' : 'Criar conta'}
            </button>
          </form>

          {/* Login */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Já tens conta?{' '}
            <Link href="/login" className="text-servi-600 font-medium hover:text-servi-700">
              Entra aqui
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