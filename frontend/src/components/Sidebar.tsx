import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  BarChart3,
  Bell,
  FileText,
  Settings,
  Users,
  Building,
  Code,
  Home,
  MessageSquare,
  ArrowLeft
} from 'lucide-react'
import { useTenant } from '../context/TenantContext'

interface SidebarProps {
  children?: React.ReactNode
}

// 👇 yahan hum apna local type define kar rahe hain
type TenantWithSlug = {
  slug: string
  name?: string
}

const platformNavigation = [
  { name: 'Platform Tenants', href: '/platform/tenants', icon: Building },
  { name: 'Embed Snippet', href: '/public/snippet', icon: Code },
]

export default function Sidebar({ children }: SidebarProps) {
  const location = useLocation()

  // 👇 yahan pe hum type ko narrow kar rahe hain
  const { currentTenant } = useTenant() as {
    currentTenant: TenantWithSlug | null
  }

  // Determine if we're in tenant workspace or platform mode
  const isTenantWorkspace = location.pathname.startsWith('/tenant/')

  const tenantNavigation = currentTenant
    ? [
        {
          name: 'Overview',
          href: `/tenant/${currentTenant.slug}/app/overview`,
          icon: Home,
        },
        {
          name: 'Subscriptions',
          href: `/tenant/${currentTenant.slug}/app/subscriptions`,
          icon: Bell,
        },
        {
          name: 'Templates',
          href: `/tenant/${currentTenant.slug}/app/templates`,
          icon: FileText,
        },
        {
          name: 'Rules',
          href: `/tenant/${currentTenant.slug}/app/rules`,
          icon: Settings,
        },
        {
          name: 'Insights',
          href: `/tenant/${currentTenant.slug}/app/insights`,
          icon: BarChart3,
        },
        {
          name: 'Shopify',
          href: `/tenant/${currentTenant.slug}/app/shopify`,
          icon: Building,
        },
        {
          name: 'GA4',
          href: `/tenant/${currentTenant.slug}/app/ga4`,
          icon: BarChart3,
        },
        {
          name: 'Users',
          href: `/tenant/${currentTenant.slug}/app/users`,
          icon: Users,
        },
        {
          name: 'AI Copilot',
          href: `/tenant/${currentTenant.slug}/app/ai`,
          icon: MessageSquare,
        },
        {
          name: 'Embed Snippet',
          href: `/tenant/${currentTenant.slug}/app/embed-snippet`,
          icon: Code,
        },
      ]
    : []

  const currentNavigation = isTenantWorkspace ? tenantNavigation : platformNavigation

  return (
    <div className="sidebar">
      <div className="logo">
        <BarChart3 size={24} />
        NotifyInsights
      </div>

      {isTenantWorkspace && (
        <div style={{ padding: '0 var(--space-4) var(--space-4)' }}>
          <Link
            to="/platform/tenants"
            className="sidebar-link"
            style={{ color: 'var(--text-muted)', fontSize: '13px' }}
          >
            <ArrowLeft size={16} />
            Back to Platform
          </Link>
          {currentTenant && (
            <div
              style={{
                padding: 'var(--space-2) var(--space-4)',
                fontSize: '12px',
                color: 'var(--text-muted)',
                fontWeight: '500',
              }}
            >
              {currentTenant.name ?? ''}
            </div>
          )}
        </div>
      )}

      <nav className="sidebar-nav">
        {currentNavigation.map((item) => {
          const isActive = location.pathname === item.href
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`sidebar-link ${isActive ? 'active' : ''}`}
            >
              <item.icon size={18} />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {children}
    </div>
  )
}
