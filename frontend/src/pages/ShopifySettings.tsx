import React, { useState } from 'react'
import { Building } from 'lucide-react'
import Card from '../components/Card'
import FormField from '../components/FormField'
import PrimaryButton from '../components/PrimaryButton'
import PageHeader from '../components/PageHeader'

export default function ShopifySettings() {
  const [shopDomain, setShopDomain] = useState('')
  const [accessToken, setAccessToken] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null)

  const handleSave = async () => {
    setLoading(true)
    setMessage(null)

    try {
      // TODO: Call backend API
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      setMessage({ type: 'success', text: 'Shopify settings saved successfully!' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save Shopify settings. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="Shopify Settings"
        subtitle="Connect your Shopify store to enable order notifications"
        icon={<Building />}
      />

      <Card>
        <div className="space-y-6">
          <div>
            <h3 className="card-title">Store Configuration</h3>
            <p className="muted-text">
              Enter your Shopify store details to connect NotifyInsights with your e-commerce platform.
            </p>
          </div>

          <div className="form-group">
            <FormField
              label="Shop Domain"
              helper="Your Shopify store domain (e.g., mystore.myshopify.com)"
              required
            >
              <input
                type="text"
                className="form-input"
                placeholder="mystore.myshopify.com"
                value={shopDomain}
                onChange={(e) => setShopDomain(e.target.value)}
              />
            </FormField>

            <FormField
              label="Access Token"
              helper="Admin API access token with necessary permissions"
              required
            >
              <input
                type="password"
                className="form-input"
                placeholder="shpat_xxxxxxxxxxxxxxxxxxxxxxxxx"
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
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
              Need help? Check our integration guide for detailed setup instructions.
            </div>
            <PrimaryButton
              onClick={handleSave}
              loading={loading}
              disabled={!shopDomain || !accessToken}
            >
              Save Settings
            </PrimaryButton>
          </div>
        </div>
      </Card>
    </div>
  )
}
