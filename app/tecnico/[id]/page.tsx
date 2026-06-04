<<<<<<< HEAD
import PerfilPublicoTecnicoClient from './PerfilPublicoTecnicoClient'
=======
export const dynamic = "force-dynamic";

'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import SeloBadge from '@/components/selos/SeloBadge'
import Avatar from '@/components/ui/Avatar'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
>>>>>>> c6580802b2687abcbbdc6d1078b6e979e1041bb2

export const dynamic = 'force-dynamic'

export default function PerfilPublicoTecnico({ params }: { params: { id: string } }) {
  const { id } = params

  // Renderiza componente cliente que faz carregamento no cliente
  return <PerfilPublicoTecnicoClient id={id} />
}
