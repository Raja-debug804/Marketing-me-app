import { FormEvent, useEffect, useState } from 'react'
import { api, TenantUser } from '../api/client'
import { useTenant } from '../context/TenantContext'

export default function Users() {
  const { selectedTenant } = useTenant()
  const [users, setUsers] = useState<TenantUser[]>([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ email: '', full_name: '', role: 'TENANT_ADMIN', password: '' })
  const [error, setError] = useState<string | undefined>(undefined)
  const [success, setSuccess] = useState<string | undefined>(undefined)

  const fetchUsers = async () => {
    if (!selectedTenant) return
    setLoading(true)
    setError(undefined)
    try {
      const response = await api.get<TenantUser[]>(`/api/v1/tenants/${selectedTenant.id}/users`)
      setUsers(response.data)
    } catch (err) {
      console.error(err)
      setError('Unable to load users for this tenant')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [selectedTenant?.id])

  const invite = async (e: FormEvent) => {
    e.preventDefault()
    if (!selectedTenant) return
    setError(undefined)
    setSuccess(undefined)
    try {
      const response = await api.post(`/api/v1/tenants/${selectedTenant.id}/users`, form)
      setUsers((prev) => [response.data, ...prev])
      setForm({ email: '', full_name: '', role: 'TENANT_ADMIN', password: '' })
      setSuccess('User invited')
    } catch (err) {
      console.error(err)
      setError('Could not invite user')
    }
  }

  return (
    <div className="page">
      <div className="card">
        <div className="card-header">
          <div>
            <p className="eyebrow">Tenant users</p>
            <h2>Team members</h2>
            <p className="muted">Invite collaborators to manage NotifyInsights.</p>
          </div>
        </div>
        {loading ? (
          <p>Loading users...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Email</th>
                <th>Full name</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.email}</td>
                  <td>{user.full_name}</td>
                  <td>
                    <span className={`badge ${user.role === 'TENANT_ADMIN' ? 'badge-success' : 'badge-info'}`}>
                      {user.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="card">
        <div className="card-header space-between">
          <div>
            <p className="eyebrow">Invite</p>
            <h3>Add user</h3>
          </div>
        </div>
        <form className="stack" onSubmit={invite}>
          <label>
            Email
            <input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              placeholder="user@tenant.com"
            />
          </label>
          <label>
            Full name
            <input
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              placeholder="Alex Doe"
            />
          </label>
          <label>
            Role
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="TENANT_ADMIN">Tenant Admin</option>
              <option value="ANALYST">Analyst</option>
            </select>
          </label>
          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="********"
              required
            />
          </label>
          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}
          <button type="submit" disabled={!selectedTenant}>
            Invite user
          </button>
        </form>
      </div>
    </div>
  )
}
