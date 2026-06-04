import PerfilPublicoTecnicoClient from './PerfilPublicoTecnicoClient'

export const dynamic = 'force-dynamic'

export default function PerfilPublicoTecnico({ params }: { params: { id: string } }) {
  const { id } = params

  // Renderiza componente cliente que faz carregamento no cliente
  return <PerfilPublicoTecnicoClient id={id} />
}
