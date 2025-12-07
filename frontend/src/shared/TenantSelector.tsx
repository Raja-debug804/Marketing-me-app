import { useMemo } from 'react'
import { useTenant } from '../context/TenantContext'

export default function TenantSelector() {
  const { tenants, selectedTenant, setSelectedTenant } = useTenant()
  const options = useMemo(() => tenants.map((t) => ({ label: t.name, value: t.slug })), [tenants])

  return (
    <div className="tenant-selector">
      <label htmlFor="tenant-select">Tenant</label>
      <select
        id="tenant-select"
        value={selectedTenant?.slug || ''}
        onChange={(e) => {
          const tenant = tenants.find((t) => t.slug === e.target.value)
          setSelectedTenant(tenant)
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
