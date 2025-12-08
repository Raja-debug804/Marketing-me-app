import React, { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import Card from '../components/Card'
import PageHeader from '../components/PageHeader'
import PrimaryButton from '../components/PrimaryButton'
import { useTenant } from '../context/TenantContext'

// Local type so TS knows currentTenant has slug & id
type TenantWithSlug = {
  id?: string
  slug?: string
}

export default function PublicSnippet() {
  const { currentTenant } = useTenant() as { currentTenant: TenantWithSlug | null }
  const [copied, setCopied] = useState(false)

  const tenantPublicKey = currentTenant?.id ?? 'TENANT_PUBLIC_KEY'
  const tenantSlug = currentTenant?.slug ?? 'your-tenant-slug'

  // Generate the snippet content dynamically
  const snippetContent = `<script src="https://cdn.notifyinsights.com/widget.js"
  data-tenant-key="${tenantPublicKey}">
</script>
<button id="notify-me-btn">Notify me on WhatsApp</button>
<script>
  const btn = document.querySelector('#notify-me-btn');
  btn.addEventListener('click', async () => {
    const payload = {
      tenant_slug: "${tenantSlug}",
      product_id: 'sku-123',
      variant_id: 'variant-1',
      product_name: 'Product name',
      customer_name: 'Visitor',
      whatsapp_number: '+155555555'
    };
    await fetch('/api/v1/public/notify/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  });
</script>`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippetContent)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <div>
      <PageHeader
        title="Embed Snippet"
        subtitle="Copy this code snippet to embed the Notify Me widget on your website"
      />

      <div className="space-y-6">
        <Card>
          <div className="space-y-4">
            <div>
              <h3 className="card-title">WhatsApp Notify Me Widget</h3>
              <p className="muted-text">
                Embed this widget on your product pages to collect WhatsApp notify-me requests
                from customers when items are out of stock.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-700">Integration Code</h4>
                <PrimaryButton
                  onClick={handleCopy}
                  className="text-sm px-3 py-1"
                >
                  {copied ? (
                    <>
                      <Check size={14} />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      Copy Code
                    </>
                  )}
                </PrimaryButton>
              </div>

              <div className="relative">
                <pre className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm font-mono text-gray-800 overflow-x-auto">
                  <code>{snippetContent}</code>
                </pre>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Implementation Notes</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Replace the placeholder values (sku-123, variant-1, etc.) with your actual product data</li>
                <li>• The widget will automatically handle WhatsApp number collection and notifications</li>
                <li>• Ensure the script is loaded before any button interactions</li>
                <li>• Test the integration on a development environment first</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
