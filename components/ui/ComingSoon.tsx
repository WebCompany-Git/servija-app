import Link from 'next/link';

interface ComingSoonProps {
  pageName: string;
  backLink: string;
}

export default function ComingSoon({ pageName, backLink }: ComingSoonProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-servi-50 to-white flex flex-col items-center justify-center px-4 text-center">
      <div className="w-24 h-24 bg-servi-100 rounded-full flex items-center justify-center mb-6">
        <span className="text-5xl animate-pulse">🚀</span>
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        <span className="text-servi-500">Servi</span>
        <span className="text-ja-500">Já</span>
      </h1>
      <p className="text-xl font-semibold text-gray-800 mb-2">{pageName}</p>
      <p className="text-gray-500 mb-8 max-w-sm">
        Estamos a preparar esta área para lhe dar a melhor experiência. Volte em breve!
      </p>
      <Link 
        href={backLink} 
        className="bg-servi-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-servi-700 transition shadow-lg"
      >
        ← Voltar
      </Link>
    </div>
  );
}
