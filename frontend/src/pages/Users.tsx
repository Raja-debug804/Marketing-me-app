import React, { useState, useEffect } from 'react'
import { Users as UsersIcon, Plus, Mail } from 'lucide-react'
import Card from '../components/Card'
import FormField from '../components/FormField'
import PrimaryButton from '../components/PrimaryButton'
import PageHeader from '../components/PageHeader'
import ChatPanel from '../shared/ChatPanel'
import { useTenant } from '../context/TenantContext'
import { api } from '../api/client'

interface User {
  id: string
  email: string
  full_name: string
  role: 'TENANT_ADMIN' | 'MANAGER' | 'ANALYST'
  is_active: boolean
  created_at: string
}

export default function Users() {
  const { currentTenant } = useTenant()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    role: 'ANALYST' as User['role']
  })
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null)

  // Fetch users on mount and when tenant changes
  useEffect(() => {
    if (currentTenant) {
      fetchUsers()
    }
  }, [currentTenant])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await api.get<User[]>('/api/v1/users')
      setUsers(response.data)
    } catch (error) {
      console.error('Failed to fetch users:', error)
      setMessage({ type: 'error', text: 'Failed to load users.' })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUser = async () => {
    if (!currentTenant) return

    setSubmitting(true)
    setMessage(null)

    try {
      const payload = {
        email: formData.email,
        full_name: formData.full_name,
        role: formData.role,
        tenant_id: currentTenant.id
      }

      const response = await api.post<User>('/api/v1/users', payload)
      setUsers([...users, response.data])
      setFormData({ email: '', full_name: '', role: 'ANALYST' })
      setShowModal(false)
      setMessage({ type: 'success', text: 'User created successfully.' })
    } catch (error) {
      console.error('Failed to create user:', error)
      setMessage({ type: 'error', text: 'Failed to create user. Please try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'TENANT_ADMIN': return 'Tenant Admin'
      case 'MANAGER': return 'Manager'
      case 'ANALYST': return 'Analyst'
      default: return role
    }
  }

  return (
    <div>
      <PageHeader
        title="Tenant Users"
        subtitle="Manage users and their access levels for your organization"
        icon={<UsersIcon />}
        actions={
          <PrimaryButton onClick={() => setShowModal(true)}>
            <Plus size={16} />
            Create User
          </PrimaryButton>
        }
      />

      {message && (
        <div style={{
          padding: 'var(--space-3) var(--space-4)',
          borderRadius: 'var(--radius-md)',
          backgroundColor: message.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          color: message.type === 'success' ? '#16a34a' : '#dc2626',
          border: `1px solid ${message.type === 'success' ? '#16a34a' : '#dc2626'}`,
          fontSize: '14px',
          marginBottom: 'var(--space-4)'
        }}>
          {message.text}
        </div>
      )}

      <Card>
        <table className="table">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className="flex items-center gap-3">
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'var(--primary-blue)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    {user.full_name.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                  <div>
                    <div className="body-text" style={{ fontWeight: '500' }}>{user.full_name}</div>
                    <div className="muted-text">{user.email}</div>
                  </div>
                  </div>
                </td>
                <td>
                  <span className="status-chip status-active">
                    {getRoleDisplayName(user.role)}
                  </span>
                </td>
                <td>
                  <span className={`status-chip ${user.is_active ? 'status-active' : 'status-pending'}`}>
                    {user.is_active ? 'Active' : 'Pending'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <div style={{ marginTop: 'var(--space-8)' }}>
        <ChatPanel mode="tenant" section="users" />
      </div>

      {/* Create User Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <Card style={{ width: '500px', maxWidth: '90vw' }}>
            <div className="space-y-6">
              <div>
                <h3 className="card-title">Create New User</h3>
                <p className="muted-text">Add a new user to your organization</p>
              </div>

              <div className="form-group">
                <FormField
                  label="Email Address"
                  helper="User will use this to sign in and receive notifications"
                  required
                >
                  <input
                    type="email"
                    className="form-input"
                    placeholder="user@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </FormField>

                <FormField
                  label="Full Name"
                  required
                >
                  <input
                    type="text"
                    className="form-input"
                    placeholder="John Doe"
                    value={formData.full_name}
                    onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  />
                </FormField>

                <FormField
                  label="Role"
                  helper="Determines the user's access level and permissions"
                >
                  <select
                    className="form-select"
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value as User['role']})}
                  >
                    <option value="ANALYST">Analyst</option>
                    <option value="MANAGER">Manager</option>
                    <option value="TENANT_ADMIN">Tenant Admin</option>
                  </select>
                </FormField>
              </div>

              <div style={{
                padding: 'var(--space-4)',
                background: 'var(--soft-blue-bg-2)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--light-border)'
              }}>
                <div className="flex items-start gap-3">
                  <Mail size={18} style={{ color: '#4F8EF7', marginTop: '2px' }} />
                  <div>
                    <div className="body-text" style={{ fontWeight: '500', marginBottom: 'var(--space-1)' }}>
                      No Email Invitation Sent
                    </div>
                    <div className="muted-text">
                      The user account will be created in the database, but no invitation email will be sent.
                      You'll need to provide login credentials to the user separately.
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  className="btn-secondary"
                  onClick={() => setShowModal(false)}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <PrimaryButton
                  onClick={handleCreateUser}
                  loading={submitting}
                  disabled={!formData.email || !formData.full_name}
                >
                  Create User
                </PrimaryButton>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
