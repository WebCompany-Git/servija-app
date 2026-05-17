export default function ErrorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-servi-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">⚠️</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Algo correu mal
        </h1>
        <p className="text-gray-500 mb-6 text-sm">
          Ocorreu um erro. Tenta novamente ou contacta o suporte.
        </p>
        <a
          href="/login"
          className="w-full bg-servi-600 text-white py-3 rounded-xl font-semibold hover:bg-servi-700 transition-colors block text-center mb-3"
        >
          Voltar ao login
        </a>
        <a
          href="https://wa.me/244938080177"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-servi-600 hover:text-servi-700"
        >
          💬 Contactar suporte
        </a>
      </div>
    </div>
  )
}