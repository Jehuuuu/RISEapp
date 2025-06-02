import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
  elevation?: 1 | 2 | 3 | 4
  hover?: boolean
  onClick?: () => void
  glass?: boolean
}

export default function Card({
  children,
  className = '',
  padding = 'md',
  elevation = 1,
  hover = false,
  onClick,
  glass = false
}: CardProps) {
  const baseClasses = 'rounded-xl bg-white transition-all duration-300 ease-out'
  
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  }
  
  const elevationClasses = {
    1: 'elevation-1',
    2: 'elevation-2', 
    3: 'elevation-3',
    4: 'elevation-4'
  }
  
  const hoverClass = hover ? 'card-hover cursor-pointer' : ''
  const glassClass = glass ? 'glass' : ''
  const clickableClass = onClick ? 'cursor-pointer touch-feedback' : ''
  
  return (
    <div
      className={`
        ${baseClasses}
        ${paddingClasses[padding]}
        ${elevationClasses[elevation]}
        ${hoverClass}
        ${glassClass}
        ${clickableClass}
        ${className}
      `}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      } : undefined}
    >
      {children}
    </div>
  )
}

// Legacy component for compatibility
interface CardContentProps {
  children: ReactNode
  className?: string
}

export function CardContent({ children, className = '' }: CardContentProps) {
  return (
    <div className={className}>
      {children}
    </div>
  )
} 