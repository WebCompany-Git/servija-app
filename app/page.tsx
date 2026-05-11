import Link from 'next/link'
import Header from '@/components/layout/Header'

const categorias = [
  { nome: 'Técnico de Frio', icone: '❄️', slug: 'tecnico-de-frio' },
  { nome: 'Eletricista', icone: '⚡', slug: 'eletricista' },
  { nome: 'Canalizador', icone: '🔧', slug: 'canalizador' },
  { nome: 'Mecânico Auto', icone: '🚗', slug: 'mecanico-auto' },
  { nome: 'Informático', icone: '💻', slug: 'informatico' },
  { nome: 'Pedreiro', icone: '🏗️', slug: 'pedreiro' },
  { nome: 'Pintor', icone: '🎨', slug: 'pintor' },
  { nome: 'Soldador', icone: '🔩', slug: 'soldador' },
  { nome: 'Ladrilheiro', icone: '🪟', slug: 'ladrilheiro' },
  { nome: 'Eletrodomésticos', icone: '🏠', slug: 'tecnico-eletrodomesticos' },
  { nome: 'Eletrónica', icone: '🎮', slug: 'tecnico-eletronica' },
  { nome: 'Geradores', icone: '⚙️', slug: 'mecanico-geradores' },
]

const passos = [
  {
    numero: '01',
    titulo: 'Encontra um técnico',
    descricao: 'Abre o mapa, activa a tua localização e vê os técnicos disponíveis perto de ti com avaliações reais.',
  },
  {
    numero: '02',
    titulo: 'Agenda o serviço',
    descricao: 'Escolhe a data, a hora e descreve o problema. O técnico confirma em minutos.',
  },
  {
    numero: '03',
    titulo: 'Avalia e confia',
    descricao: 'Após o serviço avalia o técnico. As tuas avaliações ajudam toda a comunidade.',
  },
]

const selos = [
  { emoji: '🆕', nome: 'Novo', cor: 'bg-gray-100 text-gray-700', descricao: 'Identidade verificada' },
  { emoji: '👍', nome: 'Experiente', cor: 'bg-blue-100 text-blue-700', descricao: '10+ serviços com média 4★' },
  { emoji: '✅', nome: 'Verificado', cor: 'bg-green-100 text-green-700', descricao: 'Certificado de qualificações' },
  { emoji: '⭐', nome: 'Exp. + Verificado', cor: 'bg-servi-100 text-servi-700', descricao: 'Experiente e certificado' },
  { emoji: '🏆', nome: 'Top ServiJá', cor: 'bg-yellow-100 text-yellow-700', descricao: '50+ serviços — grau máximo' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* HERO */}
      <section className="pt-24 pb-16 px-4 bg-gradient-to-br from-servi-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-servi-100 text-servi-700 px-3 py-1 rounded-full text-sm font-medium mb-6">
            <span>🇦🇴</span>
            <span>A primeira plataforma de serviços de Angola</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            O teu problema tem{' '}
            <span className="text-servi-500">solução</span>{' '}
            <span className="text-ja-500">já.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Encontra técnicos de confiança perto de ti em segundos.
            Verificados e avaliados pela comunidade angolana.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sign-up"
              className="bg-servi-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-servi-700 transition-colors shadow-lg shadow-servi-200">
              Encontrar técnico agora
            </Link>
            <Link
              href="/sign-up"
              className="border-2 border-servi-600 text-servi-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-servi-50 transition-colors">
              Sou técnico — registar
            </Link>
          </div>
          <p className="text-gray-400 text-sm mt-4">
            Gratuito para clientes · Luanda e Icolo e Bengo
          </p>
        </div>
      </section>

      {/* CATEGORIAS */}
      <section id="categorias" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">O que precisas?</h2>
            <p className="text-gray-500">12 categorias de serviços disponíveis</p>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {categorias.map((cat) => (
              <Link
                key={cat.slug}
                href="/sign-up"
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-100 hover:border-servi-200 hover:bg-servi-50 transition-all group">
                <span className="text-3xl">{cat.icone}</span>
                <span className="text-xs font-medium text-gray-600 group-hover:text-servi-600 text-center leading-tight">
                  {cat.nome}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como-funciona" className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Como funciona</h2>
            <p className="text-gray-500">Em 3 passos simples</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {passos.map((passo) => (
              <div key={passo.numero} className="text-center">
                <div className="w-16 h-16 bg-servi-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">{passo.numero}</span>
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{passo.titulo}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{passo.descricao}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SELOS */}
      <section id="selos" className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Técnicos verificados e avaliados
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              O nosso sistema de selos garante que só contratas profissionais
              de confiança, verificados pela nossa equipa.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {selos.map((selo) => (
              <div key={selo.nome}
                className="flex flex-col items-center gap-2 p-5 rounded-xl border border-gray-100 w-36 text-center shadow-sm">
                <span className="text-3xl">{selo.emoji}</span>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${selo.cor}`}>
                  {selo.nome}
                </span>
                <span className="text-xs text-gray-400 leading-tight">{selo.descricao}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-16 px-4 bg-servi-600">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Pronto para resolver o teu problema?
          </h2>
          <p className="text-servi-200 mb-8">
            Junta-te a milhares de angolanos que já confiam no ServiJá.
          </p>
          <Link
            href="/sign-up"
            className="bg-white text-servi-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-servi-50 transition-colors inline-block">
            Começar agora — é gratuito
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 py-10 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-servi-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">SJ</span>
            </div>
            <span className="font-bold">
              <span className="text-servi-400">Servi</span>
              <span className="text-ja-400">Já</span>
            </span>
          </div>
          <p className="text-sm text-center">
            © 2026 ServiJá · Luanda, Angola · O teu problema tem solução já.
          </p>
          <a
            href="https://wa.me/244938080177"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm hover:text-white transition-colors">
            💬 Suporte WhatsApp
          </a>
        </div>
      </footer>
    </div>
  )
}
