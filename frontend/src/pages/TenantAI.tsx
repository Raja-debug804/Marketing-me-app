import { useTenant } from '../context/TenantContext'
import Card from '../components/Card'
import PageHeader from '../components/PageHeader'
import ChatPanel from '../shared/ChatPanel'

export default function TenantAI() {
  const { currentTenant } = useTenant()
  return (
    <div>
      <PageHeader
        title="AI Copilot"
        subtitle="Your intelligent assistant for tenant-specific insights and automation"
      />

      <div className="space-y-6">
        {/* AI Copilot Chat Interface */}
        <div className="ai-copilot-container">
          <Card className="ai-copilot-card">
            <div className="ai-copilot-header">
              <div>
                <h3 className="card-title">AI Copilot</h3>
                <p className="muted-text">
                  Your intelligent assistant for tenant-specific insights and automation
                </p>
                {currentTenant && (
                  <div className="text-sm">
                    <span className="font-medium">Active tenant:</span> {currentTenant.name}
                  </div>
                )}
              </div>
            </div>
            <div className="ai-copilot-chat">
              <ChatPanel scope="tenant" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
