import PerfilPublicoTecnicoClient from './PerfilPublicoTecnicoClient'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function PerfilPublicoTecnico({ params }: PageProps) {
  const { id } = await params
  return <PerfilPublicoTecnicoClient id={id} />
}
