import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  style?: React.CSSProperties
}

export default function Card({ children, className = '', onClick, style }: CardProps) {
  const baseClasses = 'card'
  const combinedClasses = className ? `${baseClasses} ${className}` : baseClasses

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      onClick()
    }
  }

  return (
    <div
      className={combinedClasses}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? 'button' : undefined}
      style={style}
    >
      {children}
    </div>
  )
}
