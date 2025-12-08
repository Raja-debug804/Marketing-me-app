import React, { useState } from 'react'
import { BarChart3, CheckCircle, XCircle } from 'lucide-react'
import Card from '../components/Card'
import FormField from '../components/FormField'
import PrimaryButton from '../components/PrimaryButton'
import PageHeader from '../components/PageHeader'
import ChatPanel from '../shared/ChatPanel'

export default function GA4Settings() {
  const [measurementId, setMeasurementId] = useState('')
  const [apiSecret, setApiSecret] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null)
  const [isConnected, setIsConnected] = useState(false) // TODO: Get from backend

  const handleSave = async () => {
    setLoading(true)
    setMessage(null)

    try {
      // TODO: Call backend API
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      setIsConnected(true)
      setMessage({ type: 'success', text: 'GA4 settings saved and connection established!' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save GA4 settings. Please check your credentials.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="GA4 Settings"
        subtitle="Connect Google Analytics 4 to track user behavior and conversion events"
        icon={<BarChart3 />}
      />

      <Card>
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="card-title">Analytics Configuration</h3>
              <p className="muted-text">
                Configure your GA4 property to enable advanced analytics and insights.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {isConnected ? (
                <>
                  <CheckCircle size={18} color="#16a34a" />
                  <span className="status-chip status-active">Connected</span>
                </>
              ) : (
                <>
                  <XCircle size={18} color="#dc2626" />
                  <span className="status-chip status-inactive">Not Connected</span>
                </>
              )}
            </div>
          </div>

          <div className="form-group">
            <FormField
              label="Measurement ID"
              helper="Your GA4 measurement ID (e.g., G-XXXXXXXXXX)"
              required
            >
              <input
                type="text"
                className="form-input"
                placeholder="G-XXXXXXXXXX"
                value={measurementId}
                onChange={(e) => setMeasurementId(e.target.value)}
              />
            </FormField>

            <FormField
              label="API Secret"
              helper="Measurement Protocol API secret for server-side tracking"
              required
            >
              <input
                type="password"
                className="form-input"
                placeholder="Your API secret"
                value={apiSecret}
                onChange={(e) => setApiSecret(e.target.value)}
              />
            </FormField>
          </div>

          {message && (
            <div style={{
              padding: 'var(--space-3) var(--space-4)',
              borderRadius: 'var(--radius-md)',
              backgroundColor: message.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              color: message.type === 'success' ? '#16a34a' : '#dc2626',
              border: `1px solid ${message.type === 'success' ? '#16a34a' : '#dc2626'}`,
              fontSize: '14px'
            }}>
              {message.text}
            </div>
          )}

          <div className="flex justify-between items-center">
            <div className="muted-text">
              Don't have your API secret? Find it in GA4 Admin → Data Streams → Measurement Protocol API secrets.
            </div>
            <PrimaryButton
              onClick={handleSave}
              loading={loading}
              disabled={!measurementId || !apiSecret}
            >
              {isConnected ? 'Update Settings' : 'Connect GA4'}
            </PrimaryButton>
          </div>
        </div>
      </Card>

      <div style={{ marginTop: 'var(--space-8)' }}>
        <ChatPanel mode="tenant" section="ga4" />
      </div>
    </div>
  )
}
