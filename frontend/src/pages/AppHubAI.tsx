import ChatPanel from '../shared/ChatPanel'

export default function AppHubAI() {
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">AI Copilot</p>
          <h2>Platform AI Assistant</h2>
          <p className="muted">Ask questions across all tenants using live data.</p>
        </div>
      </div>
      <div className="two-column">
        <div className="column">
          <ChatPanel scope="platform" />
        </div>
        <div className="column placeholder">
          <div className="card">
            <h4>Insights panel</h4>
            <p className="muted">AI will show summary/insights here in a future iteration.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
