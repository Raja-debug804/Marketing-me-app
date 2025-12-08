import React from 'react'

interface PrimaryButtonProps {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  loading?: boolean
  type?: 'button' | 'submit' | 'reset'
  className?: string
}

export default function PrimaryButton({
  children,
  onClick,
  disabled = false,
  loading = false,
  type = 'button',
  className = ''
}: PrimaryButtonProps) {
  const baseClasses = 'btn-primary'
  const combinedClasses = className ? `${baseClasses} ${className}` : baseClasses
  const finalDisabled = disabled || loading

  return (
    <button
      type={type}
      className={combinedClasses}
      onClick={onClick}
      disabled={finalDisabled}
    >
      {loading && <div className="loading-spinner" />}
      {children}
    </button>
  )
}
