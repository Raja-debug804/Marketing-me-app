export default function Overview() {
  return (
    <div>
      <h2>Tenant Overview</h2>
      <div className="card-grid">
        <div className="card">
          <h3>Notify signups</h3>
          <p>Track back-in-stock interest per tenant.</p>
        </div>
        <div className="card">
          <h3>Integrations</h3>
          <p>Shopify & GA4 settings managed here.</p>
        </div>
        <div className="card">
          <h3>Templates & Rules</h3>
          <p>Customize WhatsApp outreach with placeholders and UTM defaults.</p>
        </div>
      </div>
    </div>
  )
}
