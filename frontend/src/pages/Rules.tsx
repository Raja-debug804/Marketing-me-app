import React from 'react'
import { Settings, Plus, Clock, Hash, Globe, Target, ToggleLeft } from 'lucide-react'
import Card from '../components/Card'
import FormField from '../components/FormField'
import PrimaryButton from '../components/PrimaryButton'
import PageHeader from '../components/PageHeader'

interface Rule {
  id: string
  trigger: 'BACK_IN_STOCK' | 'LOW_STOCK' | 'PRICE_DROP'
  templateId: string
  utmSource: string
  utmMedium: string
  utmCampaign: string
  sendWindowStart: string
  sendWindowEnd: string
  isActive: boolean
}

const mockRules: Rule[] = [
  {
    id: '1',
    trigger: 'BACK_IN_STOCK',
    templateId: 'template_001',
    utmSource: 'notifyinsights',
    utmMedium: 'whatsapp',
    utmCampaign: 'back_in_stock',
    sendWindowStart: '09:00',
    sendWindowEnd: '18:00',
    isActive: true
  },
  {
    id: '2',
    trigger: 'LOW_STOCK',
    templateId: 'template_002',
    utmSource: 'notifyinsights',
    utmMedium: 'whatsapp',
    utmCampaign: 'low_stock_alert',
    sendWindowStart: '10:00',
    sendWindowEnd: '16:00',
    isActive: false
  }
]

export default function Rules() {
  const getTriggerIcon = (trigger: string) => {
    switch (trigger) {
      case 'BACK_IN_STOCK': return <Target size={20} />
      case 'LOW_STOCK': return <Hash size={20} />
      case 'PRICE_DROP': return <Globe size={20} />
      default: return <Settings size={20} />
    }
  }

  const getTriggerColor = (trigger: string) => {
    switch (trigger) {
      case 'BACK_IN_STOCK': return '#16a34a'
      case 'LOW_STOCK': return '#f59e0b'
      case 'PRICE_DROP': return '#8b5cf6'
      default: return '#6b7280'
    }
  }

  const getTriggerLabel = (trigger: string) => {
    switch (trigger) {
      case 'BACK_IN_STOCK': return 'Back in Stock'
      case 'LOW_STOCK': return 'Low Stock Alert'
      case 'PRICE_DROP': return 'Price Drop'
      default: return trigger
    }
  }

  return (
    <div>
      <PageHeader
        title="Notification Rules"
        subtitle="Configure automated notification triggers and UTM parameters"
        icon={<Settings />}
        actions={
          <PrimaryButton>
            <Plus size={16} />
            Add Rule
          </PrimaryButton>
        }
      />

      <div className="space-y-4">
        {mockRules.map((rule) => (
          <Card key={rule.id}>
            <div className="space-y-4">
              {/* Rule Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div style={{
                    color: getTriggerColor(rule.trigger),
                    fontSize: '20px'
                  }}>
                    {getTriggerIcon(rule.trigger)}
                  </div>
                  <div>
                    <h3 className="card-title">{getTriggerLabel(rule.trigger)}</h3>
                    <p className="muted-text">Template: {rule.templateId}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`status-chip ${rule.isActive ? 'status-active' : 'status-inactive'}`}>
                    {rule.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <ToggleLeft size={20} style={{ color: rule.isActive ? '#16a34a' : '#6b7280' }} />
                </div>
              </div>

              {/* UTM Parameters */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Globe size={16} style={{ color: '#6b7280' }} />
                  <span className="body-text" style={{ fontWeight: '500' }}>UTM Parameters:</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="flex items-center gap-2">
                    <span className="muted-text">Source:</span>
                    <span className="body-text">{rule.utmSource}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="muted-text">Medium:</span>
                    <span className="body-text">{rule.utmMedium}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="muted-text">Campaign:</span>
                    <span className="body-text">{rule.utmCampaign}</span>
                  </div>
                </div>
              </div>

              {/* Send Window */}
              <div className="flex items-center gap-2">
                <Clock size={16} style={{ color: '#6b7280' }} />
                <span className="muted-text">Send Window:</span>
                <span className="body-text">
                  {rule.sendWindowStart} - {rule.sendWindowEnd}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
