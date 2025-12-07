import { useTenant } from '../context/TenantContext'
import ChatPanel from '../shared/ChatPanel'

export default function TenantAI() {
  const { selectedTenant } = useTenant()
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">AI Copilot</p>
          <h2>Tenant AI Assistant</h2>
          <p className="muted">Ask focused questions for the currently selected tenant.</p>
        </div>
      </div>
      <div className="two-column">
        <div className="column">
          <ChatPanel scope="tenant" />
        </div>
        <div className="column placeholder">
          <div className="card">
            <h4>Insights panel</h4>
            <p className="muted">AI will show summary/insights here in a future iteration.</p>
            {selectedTenant && <p className="muted">Active tenant: {selectedTenant.name}</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
