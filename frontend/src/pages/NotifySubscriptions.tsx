const rows = [
  { name: 'Taylor', product: 'Classic Tee', status: 'PENDING' },
  { name: 'Sam', product: 'Cap', status: 'NOTIFIED' }
]

export default function NotifySubscriptions() {
  return (
    <div>
      <h2>Notify subscriptions</h2>
      <table>
        <thead>
          <tr><th>Customer</th><th>Product</th><th>Status</th></tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name+row.product}>
              <td>{row.name}</td>
              <td>{row.product}</td>
              <td>{row.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
