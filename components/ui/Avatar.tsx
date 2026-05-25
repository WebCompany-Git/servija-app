interface AvatarProps {
  src?: string | null
  nome?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizes = {
  sm:  'w-8 h-8 text-sm',
  md:  'w-12 h-12 text-base',
  lg:  'w-16 h-16 text-xl',
  xl:  'w-24 h-24 text-3xl',
}

export default function Avatar({ src, nome, size = 'md', className = '' }: AvatarProps) {
  const inicial = nome ? nome.charAt(0).toUpperCase() : '?'
  return (
    <div className={`${sizes[size]} rounded-full overflow-hidden bg-servi-100 flex items-center justify-center flex-shrink-0 ${className}`}>
      {src ? (
        <img src={src} alt={nome || 'Avatar'} className="w-full h-full object-cover" />
      ) : (
        <span className="font-bold text-servi-600">{inicial}</span>
      )}
    </div>
  )
}
