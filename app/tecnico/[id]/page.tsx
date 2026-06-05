import PerfilPublicoTecnicoClient from './PerfilPublicoTecnicoClient'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function PerfilPublicoTecnico({ params }: PageProps) {
  const { id } = await params
  
  // Envia a prop com nome 'id' (consistente com o componente cliente)
  return <PerfilPublicoTecnicoClient id={id} />
}
