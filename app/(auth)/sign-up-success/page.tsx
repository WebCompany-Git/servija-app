import Link from 'next/link'

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-servi-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">

        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">✉️</span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Confirma o teu email
        </h1>
        <p className="text-gray-500 mb-6 leading-relaxed text-sm">
          Enviámos um email de confirmação para o teu endereço.
          Clica no link para activar a tua conta.
        </p>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 text-left">
          <p className="text-sm font-semibold text-gray-700 mb-3">O que fazer a seguir:</p>
          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 bg-servi-100 text-servi-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
              <p className="text-sm text-gray-600">Abre o teu email e procura a mensagem do ServiJá</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 bg-servi-100 text-servi-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
              <p className="text-sm text-gray-600">Clica em <strong>"Confirmar email"</strong></p>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 bg-servi-100 text-servi-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
              <p className="text-sm text-gray-600">Entra na tua conta e começa a usar o <span className="text-servi-500 font-semibold">Servi</span><span className="text-ja-500 font-semibold">Já</span></p>
            </div>
          </div>
        </div>

        <Link
          href="/login"
          className="w-full bg-servi-600 text-white py-3 rounded-xl font-semibold hover:bg-servi-700 transition-colors block text-center"
        >
          Ir para o login
        </Link>

        <p className="text-xs text-gray-400 mt-4">
          Não recebeste o email?{' '}
          <a
            href="https://wa.me/244938080177"
            target="_blank"
            rel="noopener noreferrer"
            className="text-servi-600 hover:text-servi-700"
          >
            Contacta o suporte
          </a>
        </p>
      </div>
    </div>
  )
}