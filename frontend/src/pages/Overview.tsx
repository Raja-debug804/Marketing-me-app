import React from 'react'
import { Bell, Settings, FileText, BarChart3, Users, Building } from 'lucide-react'
import Card from '../components/Card'
import PageHeader from '../components/PageHeader'
import { Link } from 'react-router-dom'

export default function Overview() {
  const quickActions = [
    {
      title: 'Notify Subscriptions',
      description: 'Track back-in-stock interest and manage customer notifications.',
      icon: <Bell />,
      link: '/app/notify/subscriptions',
      color: '#4F8EF7'
    },
    {
      title: 'Analytics Dashboard',
      description: 'View GA4 insights, conversion tracking, and performance metrics.',
      icon: <BarChart3 />,
      link: '/app/insights',
      color: '#16a34a'
    },
    {
      title: 'Integration Settings',
      description: 'Configure Shopify and GA4 connections for seamless data flow.',
      icon: <Settings />,
      link: '/app/settings/integrations/shopify',
      color: '#f59e0b'
    },
    {
      title: 'Templates & Rules',
      description: 'Customize WhatsApp outreach with placeholders and UTM defaults.',
      icon: <FileText />,
      link: '/app/notify/templates',
      color: '#8b5cf6'
    },
    {
      title: 'User Management',
      description: 'Manage team members and their access permissions.',
      icon: <Users />,
      link: '/app/settings/users',
      color: '#06b6d4'
    },
    {
      title: 'Platform Overview',
      description: 'Access platform-wide tenant management and analytics.',
      icon: <Building />,
      link: '/platform/tenants',
      color: '#dc2626'
    }
  ]

  return (
    <div>
      <PageHeader
        title="Dashboard Overview"
        subtitle="Welcome to NotifyInsights - your complete e-commerce notification platform"
      />

      <div className="space-y-6">
        {/* Welcome Message */}
        <Card>
          <div className="text-center space-y-3">
            <h3 className="card-title">Getting Started</h3>
            <p className="body-text">
              Connect your Shopify store and GA4 property to start sending intelligent notifications
              and tracking customer engagement across all channels.
            </p>
            <div className="flex justify-center gap-3">
              <Link to="/app/settings/integrations/shopify">
                <button className="btn-primary">Setup Shopify</button>
              </Link>
              <Link to="/app/settings/integrations/ga4">
                <button className="btn-secondary">Setup GA4</button>
              </Link>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div>
          <h3 className="section-title">Quick Actions</h3>
          <div className="card-grid">
            {quickActions.map((action, index) => (
              <Link key={index} to={action.link} style={{ textDecoration: 'none' }}>
                <Card className="cursor-pointer hover:scale-105 transition-transform">
                  <div className="flex items-start gap-3">
                    <div style={{
                      color: action.color,
                      fontSize: '24px',
                      marginTop: '2px'
                    }}>
                      {action.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="card-title" style={{ marginBottom: 'var(--space-2)' }}>
                        {action.title}
                      </h4>
                      <p className="muted-text" style={{ fontSize: '14px', lineHeight: '1.4' }}>
                        {action.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
