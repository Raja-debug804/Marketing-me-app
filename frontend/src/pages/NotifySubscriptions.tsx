import React from 'react'
import { Bell, User, Package, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import Card from '../components/Card'
import PageHeader from '../components/PageHeader'

interface Subscription {
  id: string
  customerName: string
  customerEmail: string
  productName: string
  productVariant: string
  status: 'PENDING' | 'NOTIFIED' | 'FULFILLED' | 'EXPIRED'
  subscribedAt: string
  notifiedAt?: string
}

const mockSubscriptions: Subscription[] = [
  {
    id: '1',
    customerName: 'Taylor Johnson',
    customerEmail: 'taylor@example.com',
    productName: 'Classic Cotton Tee',
    productVariant: 'Medium - Navy Blue',
    status: 'PENDING',
    subscribedAt: '2024-01-15'
  },
  {
    id: '2',
    customerName: 'Sam Rodriguez',
    customerEmail: 'sam@example.com',
    productName: 'Vintage Baseball Cap',
    productVariant: 'One Size - Black',
    status: 'NOTIFIED',
    subscribedAt: '2024-01-10',
    notifiedAt: '2024-01-12'
  },
  {
    id: '3',
    customerName: 'Alex Chen',
    customerEmail: 'alex@example.com',
    productName: 'Premium Hoodie',
    productVariant: 'Large - Gray',
    status: 'FULFILLED',
    subscribedAt: '2024-01-08',
    notifiedAt: '2024-01-09'
  }
]

export default function NotifySubscriptions() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <Clock size={16} />
      case 'NOTIFIED': return <CheckCircle size={16} />
      case 'FULFILLED': return <CheckCircle size={16} />
      case 'EXPIRED': return <AlertCircle size={16} />
      default: return <Clock size={16} />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'status-pending'
      case 'NOTIFIED': return 'status-active'
      case 'FULFILLED': return 'status-active'
      case 'EXPIRED': return 'status-inactive'
      default: return 'status-pending'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Waiting for stock'
      case 'NOTIFIED': return 'Notification sent'
      case 'FULFILLED': return 'Order completed'
      case 'EXPIRED': return 'Subscription expired'
      default: return status
    }
  }

  return (
    <div>
      <PageHeader
        title="Notify Subscriptions"
        subtitle="Manage customer back-in-stock notifications and subscription status"
        icon={<Bell />}
      />

      <div className="space-y-4">
        {mockSubscriptions.map((subscription) => (
          <Card key={subscription.id}>
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-3">
                {/* Customer Info */}
                <div className="flex items-center gap-3">
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'var(--primary-blue)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                  }}>
                    <User size={18} />
                  </div>
                  <div>
                    <div className="body-text" style={{ fontWeight: '600' }}>
                      {subscription.customerName}
                    </div>
                    <div className="muted-text" style={{ fontSize: '13px' }}>
                      {subscription.customerEmail}
                    </div>
                  </div>
                </div>

                {/* Product Info */}
                <div className="flex items-start gap-3">
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--soft-blue-bg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#4F8EF7'
                  }}>
                    <Package size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="body-text" style={{ fontWeight: '500' }}>
                      {subscription.productName}
                    </div>
                    <div className="muted-text" style={{ fontSize: '13px' }}>
                      {subscription.productVariant}
                    </div>
                  </div>
                </div>

                {/* Status and Dates */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(subscription.status)}
                    <span className={`status-chip ${getStatusColor(subscription.status)}`}>
                      {getStatusText(subscription.status)}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="muted-text" style={{ fontSize: '12px' }}>
                      Subscribed: {new Date(subscription.subscribedAt).toLocaleDateString()}
                    </div>
                    {subscription.notifiedAt && (
                      <div className="muted-text" style={{ fontSize: '12px' }}>
                        Notified: {new Date(subscription.notifiedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
