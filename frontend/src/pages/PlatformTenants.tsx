import React from 'react'
import { Building2, Globe, Users } from 'lucide-react'
import Card from '../components/Card'
import PageHeader from '../components/PageHeader'
import { useNavigate } from 'react-router-dom'
import { useTenant } from '../context/TenantContext'

interface Tenant {
  id: string
  name: string
  slug: string
  domain: string
  status: 'active' | 'suspended' | 'pending'
  userCount: number
}

const mockTenants: Tenant[] = [
  {
    id: '1',
    name: 'Sapphire Retail',
    slug: 'sapphire',
    domain: 'sapphire-retail.com',
    status: 'active',
    userCount: 12
  },
  {
    id: '2',
    name: 'Emerald Shops',
    slug: 'emerald',
    domain: 'emerald-shops.com',
    status: 'suspended',
    userCount: 5
  },
  {
    id: '3',
    name: 'Ruby Commerce',
    slug: 'ruby',
    domain: 'ruby-commerce.net',
    status: 'pending',
    userCount: 0
  }
]

export default function PlatformTenants() {
  const navigate = useNavigate()
  const { setCurrentTenant } = useTenant()

  const handleTenantClick = (tenant: Tenant) => {
    setCurrentTenant(tenant)
    navigate(`/tenant/${tenant.slug}/app/overview`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'status-active'
      case 'suspended': return 'status-inactive'
      case 'pending': return 'status-pending'
      default: return 'status-pending'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Active'
      case 'suspended': return 'Suspended'
      case 'pending': return 'Pending'
      default: return status
    }
  }

  return (
    <div>
      <PageHeader
        title="Platform Tenants"
        subtitle="Manage all tenants across the NotifyInsights platform"
        icon={<Building2 />}
      />

      <div className="card-grid">
        {mockTenants.map((tenant) => (
          <Card key={tenant.id} onClick={() => handleTenantClick(tenant)}>
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div style={{
                    color: '#4F8EF7',
                    fontSize: '24px',
                    marginTop: '2px'
                  }}>
                    <Building2 />
                  </div>
                  <div className="flex-1">
                    <h3 className="card-title">{tenant.name}</h3>
                    <div className="flex items-center gap-2 muted-text" style={{ fontSize: '13px' }}>
                      <Globe size={14} />
                      {tenant.domain}
                    </div>
                  </div>
                </div>
                <span className={`status-chip ${getStatusColor(tenant.status)}`}>
                  {getStatusText(tenant.status)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users size={16} style={{ color: '#6B7280' }} />
                  <span className="body-text" style={{ fontSize: '14px' }}>
                    {tenant.userCount} {tenant.userCount === 1 ? 'user' : 'users'}
                  </span>
                </div>
                <div className="muted-text" style={{ fontSize: '12px' }}>
                  /{tenant.slug}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
