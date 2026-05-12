'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { createClient } from '@/lib/supabase/client'

const categorias = [
  { id: 1, nome: 'Técnico de Frio', icone: '❄️' },
  { id: 2, nome: 'Eletricista', icone: '⚡' },
  { id: 3, nome: 'Canalizador', icone: '🔧' },
  { id: 4, nome: 'Mecânico Auto', icone: '🚗' },
  { id: 5, nome: 'Informático', icone: '💻' },
  { id: 6, nome: 'Pedreiro', icone: '🏗️' },
  { id: 7, nome: 'Pintor', icone: '🎨' },
  { id: 8, nome: 'Soldador', icone: '🔩' },
  { id: 9, nome: 'Ladrilheiro', icone: '🪟' },
  { id: 10, nome: 'Eletrodomésticos', icone: '🏠' },
  { id: 11, nome: 'Eletrónica', icone: '🎮' },
  { id: 12, nome: 'Geradores', icone: '⚙️' },
]

export default function SignUpPage() {
  const { registar, loading, erro } = useAuth()
  const [tipo, setTipo] = useState<'cliente' | 'tecnico'>('cliente')
  const [passo, setPasso] = useState(1)
  const [erroLocal, setErroLocal] = useState<string | null>(null)

  // Passo 1
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmar, setConfirmar] = useState('')

  // Passo 2
  const [categoria, setCategoria] = useState<number | null>(null)
  const [bairro, setBairro] = useState('')
  const [raio, setRaio] = useState(10)
  const [numeroBi, setNumeroBi] = useState('')

  function avancarPasso1(e: React.FormEvent) {
    e.preventDefault()
    setErroLocal(null)
    if (password !== confirmar) { setErroLocal('As passwords não coincidem.'); return }
    if (password.length < 6) { setErroLocal('Password com mínimo 6 caracteres.'); return }
    if (tipo === 'tecnico') setPasso(2)
    else handleRegistarCliente()
  }

  async function handleRegistarCliente() {
    await registar({ email, password, nome, telefone, tipo })
  }

  async function handleSubmitTecnico(e: React.FormEvent) {
    e.preventDefault()
    setErroLocal(null)
    if (!categoria) { setErroLocal('Escolhe a tua categoria.'); return }
    if (!bairro) { setErroLocal('Indica o teu bairro.'); return }

    const sucesso = await registar({ email, password, nome, telefone, tipo })
    if (sucesso) {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: perfil } = await supabase
          .from('perfis')
          .select('id')
          .eq('user_id', user.id)
          .single()

        if (perfil) {
          await supabase.from('tecnicos').update({
            categoria_principal_id: categoria,
            bairro,
            raio_atendimento_km: raio,
          }).eq('perfil_id', perfil.id)

          if (numeroBi) {
            await supabase.from('perfis')
              .update({ documento_identidade: numeroBi })
              .eq('id', perfil.id)
          }
        }
      }
      // Abrir WhatsApp com mensagem pré-preenchida
      window.open(
        `https://wa.me/244938080177?text=Olá,%20registei-me%20no%20ServiJá%20como%20técnico.%20O%20meu%20nome%20é%20${encodeURIComponent(nome)}.%20Quero%20enviar%20os%20meus%20documentos%20para%20verificação.`,
        '_blank'
      )
    }
  }

  const erroFinal = erroLocal || erro

  return (
    <div className="min-h-screen bg-gradient-to-br from-servi-50 to-white flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">

        {/* Logo */}
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
            {passo === 1 ? 'Criar conta' : 'O teu trabalho'}
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            {passo === 1 ? 'Junta-te ao ServiJá gratuitamente' : 'Só o essencial — editas o resto depois'}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

          {/* Indicador de passos — só técnico */}
          {tipo === 'tecnico' && (
            <div className="flex items-center gap-2 mb-6">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${passo >= 1 ? 'bg-servi-600 text-white' : 'bg-gray-200 text-gray-400'}`}>1</div>
              <div className={`flex-1 h-0.5 rounded transition-colors ${passo >= 2 ? 'bg-servi-600' : 'bg-gray-200'}`}></div>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${passo >= 2 ? 'bg-servi-600 text-white' : 'bg-gray-200 text-gray-400'}`}>2</div>
            </div>
          )}

          {/* PASSO 1 */}
          {passo === 1 && (
            <>
              {/* Tipo */}
              <div className="flex gap-2 mb-5">
                <button type="button" onClick={() => setTipo('cliente')}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-colors ${tipo === 'cliente' ? 'border-servi-600 bg-servi-50 text-servi-700' : 'border-gray-200 text-gray-500'}`}>
                  👤 Cliente
                </button>
                <button type="button" onClick={() => setTipo('tecnico')}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-colors ${tipo === 'tecnico' ? 'border-servi-600 bg-servi-50 text-servi-700' : 'border-gray-200 text-gray-500'}`}>
                  🔧 Técnico
                </button>
              </div>

              {erroFinal && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-4">
                  {erroFinal}
                </div>
              )}

              <form onSubmit={avancarPasso1} className="flex flex-col gap-3">
                {[
                  { label: 'Nome completo', value: nome, set: setNome, type: 'text', placeholder: 'O teu nome' },
                  { label: 'Email', value: email, set: setEmail, type: 'email', placeholder: 'o-teu@email.com' },
                  { label: 'Telefone', value: telefone, set: setTelefone, type: 'tel', placeholder: '9XX XXX XXX' },
                  { label: 'Password', value: password, set: setPassword, type: 'password', placeholder: 'Mínimo 6 caracteres' },
                  { label: 'Confirmar password', value: confirmar, set: setConfirmar, type: 'password', placeholder: 'Repete a password' },
                ].map((field) => (
                  <div key={field.label}>
                    <label className="block text-xs font-medium text-gray-700 mb-1">{field.label}</label>
                    <input
                      type={field.type}
                      value={field.value}
                      onChange={(e) => field.set(e.target.value)}
                      placeholder={field.placeholder}
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-servi-500 text-sm"
                    />
                  </div>
                ))}
                <button type="submit" disabled={loading}
                  className="w-full bg-servi-600 text-white py-3 rounded-xl font-semibold hover:bg-servi-700 transition-colors disabled:opacity-50 mt-1">
                  {tipo === 'tecnico' ? 'Continuar →' : loading ? 'A criar...' : 'Criar conta'}
                </button>
              </form>
            </>
          )}

          {/* PASSO 2 — técnicos */}
          {passo === 2 && (
            <>
              {erroFinal && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-4">
                  {erroFinal}
                </div>
              )}

              <form onSubmit={handleSubmitTecnico} className="flex flex-col gap-5">

                {/* Categoria — cards visuais */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    A tua área <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {categorias.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setCategoria(c.id)}
                        className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border-2 transition-all ${
                          categoria === c.id
                            ? 'border-servi-600 bg-servi-50'
                            : 'border-gray-100 hover:border-gray-200'
                        }`}
                      >
                        <span className="text-xl">{c.icone}</span>
                        <span className={`text-xs font-medium text-center leading-tight ${categoria === c.id ? 'text-servi-700' : 'text-gray-600'}`}>
                          {c.nome}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bairro */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bairro onde trabalhas <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={bairro}
                    onChange={(e) => setBairro(e.target.value)}
                    placeholder="Ex: Zango 3, Talatona, Kilamba..."
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-servi-500 text-sm"
                  />
                </div>

                {/* Raio — botões */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Até onde atendes?
                  </label>
                  <div className="flex gap-2">
                    {[10, 20, 30].map((km) => (
                      <button
                        key={km}
                        type="button"
                        onClick={() => setRaio(km)}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-colors ${
                          raio === km
                            ? 'border-servi-600 bg-servi-50 text-servi-700'
                            : 'border-gray-200 text-gray-500 hover:border-gray-300'
                        }`}
                      >
                        {km} km
                      </button>
                    ))}
                  </div>
                </div>

                {/* BI opcional */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número do BI
                    <span className="text-gray-400 text-xs ml-1">(opcional)</span>
                  </label>
                  <input
                    type="text"
                    value={numeroBi}
                    onChange={(e) => setNumeroBi(e.target.value)}
                    placeholder="005123456LA041"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-servi-500 text-sm"
                  />
                </div>

                {/* Aviso WhatsApp */}
                <div className="bg-ja-50 border border-ja-100 rounded-xl p-4">
                  <p className="font-semibold text-ja-700 text-sm mb-1">
                    📎 Após o registo
                  </p>
                  <p className="text-ja-600 text-xs leading-relaxed">
                    Serás redirecionado para o nosso WhatsApp para enviares os documentos. Quanto mais enviares, mais rápido és aprovado:
                  </p>
                  <div className="flex flex-col gap-0.5 mt-2">
                    <span className="text-ja-600 text-xs">📷 Foto do BI</span>
                    <span className="text-ja-600 text-xs">📜 Certificado (PDF ou foto)</span>
                    <span className="text-ja-600 text-xs">🖼️ Fotos de trabalhos anteriores</span>
                  </div>
                  <p className="text-ja-500 text-xs mt-2 font-medium">⏱️ Verificação em até 24h</p>
                </div>

                <div className="flex gap-2">
                  <button type="button" onClick={() => setPasso(1)}
                    className="flex-1 border-2 border-gray-200 text-gray-600 py-3 rounded-xl font-semibold text-sm hover:border-gray-300 transition-colors">
                    ← Voltar
                  </button>
                  <button type="submit" disabled={loading}
                    className="flex-1 bg-servi-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-servi-700 transition-colors disabled:opacity-50">
                    {loading ? 'A registar...' : 'Concluir ✓'}
                  </button>
                </div>
              </form>
            </>
          )}

          <p className="text-center text-sm text-gray-500 mt-5">
            Já tens conta?{' '}
            <Link href="/login" className="text-servi-600 font-medium hover:text-servi-700">
              Entra aqui
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