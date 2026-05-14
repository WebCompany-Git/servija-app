import Link from 'next/link'

export default function VerificacaoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-servi-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">

        <div className="w-20 h-20 bg-ja-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">⏳</span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Conta em verificação
        </h1>
        <p className="text-gray-500 mb-6 leading-relaxed text-sm">
          A tua conta está a ser verificada pela nossa equipa.
          Este processo demora até <strong>24 horas</strong>.
        </p>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 text-left">
          <p className="text-sm font-semibold text-gray-700 mb-3">
            📎 Para seres aprovado mais rápido envia pelo WhatsApp:
          </p>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-ja-500">📷</span>
              <p className="text-sm text-gray-600">Foto ou PDF do BI</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-ja-500">📜</span>
              <p className="text-sm text-gray-600">Certificado de qualificações</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-ja-500">🖼️</span>
              <p className="text-sm text-gray-600">Fotos de trabalhos anteriores</p>
            </div>
          </div>
        </div>

        <a
          href="https://wa.me/244938080177?text=Olá,%20sou%20técnico%20no%20ServiJá%20e%20quero%20enviar%20os%20meus%20documentos%20para%20verificação."
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors block text-center mb-3"
        >
          💬 Enviar documentos via WhatsApp
        </a>

        <Link
          href="/login"
          className="w-full border-2 border-gray-200 text-gray-600 py-3 rounded-xl font-semibold hover:border-gray-300 transition-colors block text-center"
        >
          Voltar ao login
        </Link>

        <p className="text-xs text-gray-400 mt-4">
          Receberás uma notificação quando a tua conta for aprovada.
        </p>
      </div>
    </div>
  )
}