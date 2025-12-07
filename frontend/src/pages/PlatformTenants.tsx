const tenants = [
  { name: 'Sapphire Retail', slug: 'sapphire', status: 'active' },
  { name: 'Emerald Shops', slug: 'emerald', status: 'suspended' }
]

export default function PlatformTenants() {
  return (
    <div>
      <h2>Platform Tenants</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Slug</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {tenants.map((tenant) => (
            <tr key={tenant.slug}>
              <td>{tenant.name}</td>
              <td>{tenant.slug}</td>
              <td>{tenant.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
