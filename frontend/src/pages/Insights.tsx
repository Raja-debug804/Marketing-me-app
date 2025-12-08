import React, { useState } from 'react'
import { BarChart3, TrendingUp, DollarSign, Users, Target, Calendar } from 'lucide-react'
import Card from '../components/Card'
import MetricTile from '../components/MetricTile'
import PageHeader from '../components/PageHeader'

export default function Insights() {
  const [channel, setChannel] = useState('whatsapp')
  const [range, setRange] = useState('last7')

  // Mock data - in real app this would come from GA4 API
  const metrics = [
    {
      title: 'Total Sessions',
      value: '12,543',
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: <Users />
    },
    {
      title: 'Conversions',
      value: '1,247',
      change: '+8.2%',
      changeType: 'positive' as const,
      icon: <Target />
    },
    {
      title: 'Revenue',
      value: '$45,231',
      change: '+15.3%',
      changeType: 'positive' as const,
      icon: <DollarSign />
    },
    {
      title: 'Avg. Session Duration',
      value: '3m 24s',
      change: '-2.1%',
      changeType: 'negative' as const,
      icon: <TrendingUp />
    }
  ]

  const topProducts = [
    { name: 'Premium Hoodie', sessions: 1247, channel: 'WhatsApp' },
    { name: 'Starter Tee', sessions: 892, channel: 'Organic' },
    { name: 'Vintage Cap', sessions: 654, channel: 'Direct' },
    { name: 'Denim Jacket', sessions: 432, channel: 'WhatsApp' }
  ]

  return (
    <div>
      <PageHeader
        title="Analytics Dashboard"
        subtitle="Track your e-commerce performance and customer behavior insights"
        icon={<BarChart3 />}
        actions={
          <div className="flex items-center gap-3">
            <select
              className="form-select"
              value={range}
              onChange={(e) => setRange(e.target.value)}
              style={{ width: 'auto' }}
            >
              <option value="last7">Last 7 days</option>
              <option value="last30">Last 30 days</option>
              <option value="last90">Last 90 days</option>
            </select>
            <select
              className="form-select"
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
              style={{ width: 'auto' }}
            >
              <option value="whatsapp">WhatsApp</option>
              <option value="organic">Organic</option>
              <option value="direct">Direct</option>
              <option value="all">All Channels</option>
            </select>
          </div>
        }
      />

      {/* Metric Tiles */}
      <div className="card-grid">
        {metrics.map((metric, index) => (
          <MetricTile
            key={index}
            title={metric.title}
            value={metric.value}
            change={metric.change}
            changeType={metric.changeType}
            icon={metric.icon}
          />
        ))}
      </div>

      {/* Charts Section - Placeholder for future implementation */}
      <div className="card-grid">
        <Card style={{ gridColumn: '1 / -1' }}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="card-title">Traffic Trends</h3>
              <p className="muted-text">Session volume over the selected time period</p>
            </div>
            <div style={{
              width: '60px',
              height: '40px',
              background: 'var(--soft-blue-bg)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <BarChart3 size={20} style={{ color: '#4F8EF7' }} />
            </div>
          </div>
          <div style={{
            height: '200px',
            background: 'var(--soft-blue-bg-2)',
            borderRadius: 'var(--radius-md)',
            marginTop: 'var(--space-4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px dashed var(--light-border)'
          }}>
            <div className="text-center">
              <BarChart3 size={32} style={{ color: '#6B7280', marginBottom: 'var(--space-2)' }} />
              <div className="muted-text">Interactive chart coming soon</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Top Products Table */}
      <Card>
        <div className="flex items-center gap-3" style={{ marginBottom: 'var(--space-4)' }}>
          <div style={{ color: '#4F8EF7', fontSize: '20px' }}>
            <Target />
          </div>
          <div>
            <h3 className="card-title">Top Performing Products</h3>
            <p className="muted-text">Products driving the most engagement and conversions</p>
          </div>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Sessions</th>
              <th>Channel</th>
              <th>Trend</th>
            </tr>
          </thead>
          <tbody>
            {topProducts.map((product, index) => (
              <tr key={index}>
                <td style={{ fontWeight: '500' }}>{product.name}</td>
                <td>{product.sessions.toLocaleString()}</td>
                <td>
                  <span className="status-chip status-active">
                    {product.channel}
                  </span>
                </td>
                <td>
                  <div className="flex items-center gap-1">
                    <TrendingUp size={14} style={{ color: '#16a34a' }} />
                    <span style={{ color: '#16a34a', fontSize: '13px', fontWeight: '500' }}>
                      +{Math.floor(Math.random() * 20 + 5)}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}
