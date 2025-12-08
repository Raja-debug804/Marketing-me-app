import React from 'react'
import Card from './Card'

interface MetricTileProps {
  title: string
  value: string | number
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  icon?: React.ReactNode
  className?: string
}

export default function MetricTile({
  title,
  value,
  change,
  changeType = 'neutral',
  icon,
  className = ''
}: MetricTileProps) {
  const changeColor = {
    positive: '#16a34a',
    negative: '#dc2626',
    neutral: '#6b7280'
  }

  return (
    <Card className={`metric-tile ${className}`}>
      <div className="flex justify-between items-center">
        <div>
          <div className="muted-text">{title}</div>
          <div className="card-title" style={{ fontSize: '24px', fontWeight: '700', margin: '0.5rem 0' }}>
            {value}
          </div>
          {change && (
            <div
              className="muted-text"
              style={{
                fontSize: '12px',
                color: changeColor[changeType],
                fontWeight: '500'
              }}
            >
              {change}
            </div>
          )}
        </div>
        {icon && (
          <div style={{
            color: '#4F8EF7',
            fontSize: '24px',
            opacity: 0.8
          }}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  )
}
