import React from 'react'

interface PageHeaderProps {
  title: string
  subtitle?: string
  icon?: React.ReactNode
  actions?: React.ReactNode
}

export default function PageHeader({ title, subtitle, icon, actions }: PageHeaderProps) {
  return (
    <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-6)' }}>
      <div className="flex items-center gap-3">
        {icon && (
          <div style={{
            color: '#4F8EF7',
            fontSize: '24px',
            opacity: 0.8
          }}>
            {icon}
          </div>
        )}
        <div>
          <h1 className="page-title" style={{ margin: 0 }}>{title}</h1>
          {subtitle && <p className="muted-text" style={{ margin: '0.25rem 0 0 0' }}>{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  )
}
