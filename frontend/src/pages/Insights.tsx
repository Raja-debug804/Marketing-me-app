import { useState } from 'react'

const data = [
  { date: '2024-01-01', sessions: 120 },
  { date: '2024-01-02', sessions: 180 },
  { date: '2024-01-03', sessions: 150 }
]

export default function Insights() {
  const [channel, setChannel] = useState('whatsapp')
  const [range, setRange] = useState('last7')

  return (
    <div>
      <h2>GA4 Insights</h2>
      <form>
        <select value={range} onChange={(e) => setRange(e.target.value)}>
          <option value="last7">Last 7 days</option>
          <option value="last30">Last 30 days</option>
        </select>
        <select value={channel} onChange={(e) => setChannel(e.target.value)}>
          <option value="whatsapp">WhatsApp</option>
          <option value="organic">Organic</option>
          <option value="direct">Direct</option>
        </select>
      </form>
      <div className="card-grid">
        <div className="card"><h3>Sessions</h3><p>450</p></div>
        <div className="card"><h3>Conversions</h3><p>32</p></div>
        <div className="card"><h3>Revenue</h3><p>$1,568</p></div>
      </div>
      <svg width="100%" height="120" viewBox="0 0 300 120">
        <polyline
          fill="none"
          stroke="#2563eb"
          strokeWidth="3"
          points={data
            .map((point, index) => `${index * 100},${120 - point.sessions / 2}`)
            .join(' ')}
        />
      </svg>
      <div className="card">
        <h3>Top Notify Products</h3>
        <table>
          <thead>
            <tr><th>Product</th><th>Sessions</th><th>Channel</th></tr>
          </thead>
          <tbody>
            <tr><td>Starter Tee</td><td>140</td><td>{channel}</td></tr>
            <tr><td>Premium Hoodie</td><td>98</td><td>{channel}</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
