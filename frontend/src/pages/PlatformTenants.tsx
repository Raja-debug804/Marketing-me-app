import { FormEvent, useEffect, useMemo, useState } from 'react'
import { api, Tenant } from '../api/client'
import { useTenant } from '../context/TenantContext'

export default function PlatformTenants() {
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: '', slug: '', status: 'active' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)
  const { reload } = useTenant()

  const refresh = async () => {
    setLoading(true)
    try {
      const response = await api.get<Tenant[]>('/api/v1/platform/tenants')
      setTenants(response.data)
    } catch (err) {
      console.error(err)
      setError('Failed to load tenants')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(undefined)
    try {
      await api.post('/api/v1/platform/tenants', form)
      setForm({ name: '', slug: '', status: 'active' })
      await refresh()
      await reload()
    } catch (err) {
      setError('Could not create tenant')
    } finally {
      setSaving(false)
    }
  }

  const badgeClass = (status: string) => `badge ${status === 'active' ? 'badge-success' : 'badge-muted'}`
  const tenantRows = useMemo(
    () =>
      tenants.map((tenant) => (
        <tr key={tenant.id}>
          <td>{tenant.name}</td>
          <td>{tenant.slug}</td>
          <td>
            <span className={badgeClass(tenant.status)}>{tenant.status}</span>
          </td>
        </tr>
      )),
    [tenants]
  )

  return (
    <div className="page">
      <div className="card">
        <div className="card-header">
          <div>
            <p className="eyebrow">Platform</p>
            <h2>Tenants</h2>
            <p className="muted">Manage client tenants and onboarding.</p>
          </div>
        </div>
        {error && <div className="error">{error}</div>}
        {loading ? (
          <p>Loading tenants...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Slug</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>{tenantRows}</tbody>
          </table>
        )}
      </div>

      <div className="card">
        <div className="card-header space-between">
          <div>
            <p className="eyebrow">Add tenant</p>
            <h3>Create new tenant</h3>
          </div>
        </div>
        <form className="stack" onSubmit={onSubmit}>
          <label>
            Name
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Sapphire Retail"
              required
            />
          </label>
          <label>
            Slug
            <input
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              placeholder="sapphire"
              required
            />
          </label>
          <label>
            Status
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </label>
          <button type="submit" disabled={saving}>
            {saving ? 'Creating...' : 'Add tenant'}
          </button>
        </form>
      </div>
    </div>
  )
}
