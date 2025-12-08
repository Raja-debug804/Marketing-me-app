import { useTenant } from '../context/TenantContext'
import Card from '../components/Card'
import PageHeader from '../components/PageHeader'

export default function TenantAI() {
  const { currentTenant } = useTenant()
  return (
    <div>
      <PageHeader
        title="AI Copilot"
        subtitle="Your intelligent assistant for tenant-specific insights and automation"
      />

      <div className="space-y-6">
        <Card>
          <div className="space-y-4">
            <h3 className="card-title">AI Copilot</h3>
            <p className="muted-text">
              Your intelligent assistant for tenant-specific insights and automation. Use the floating chat widget in the bottom-right corner.
            </p>
            {currentTenant && (
              <div className="text-sm">
                <span className="font-medium">Active tenant:</span> {currentTenant.name}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
