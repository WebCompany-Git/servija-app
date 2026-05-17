'use client'

import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
}

export default function Card({ children, className = '', onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-2xl border border-gray-100 shadow-sm
        hover:shadow-md transition-all duration-200
        ${className}
      `}
    >
      {children}
    </div>
  )
}
