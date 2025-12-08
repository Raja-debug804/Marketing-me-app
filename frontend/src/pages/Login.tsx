import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { login } from '../api/client'
import Card from '../components/Card'
import FormField from '../components/FormField'
import PrimaryButton from '../components/PrimaryButton'

export default function Login({ platform = false }: { platform?: boolean }) {
  const [email, setEmail] = useState('')
  const [tenantSlug, setTenantSlug] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  // Extract tenant slug from URL if present
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const slug = params.get('tenant')
    if (slug) {
      setTenantSlug(slug)
    }
  }, [location.search])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await login(email, password, platform ? undefined : tenantSlug)

      // Check if there's a redirect URL in localStorage or query params
      const redirectTo = localStorage.getItem('redirectAfterLogin') ||
                        (tenantSlug ? `/tenant/${tenantSlug}/app/templates` : '/platform/tenants')

      // Clear the redirect
      localStorage.removeItem('redirectAfterLogin')

      navigate(redirectTo)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--subtle-gradient)',
      padding: 'var(--space-6)'
    }}>
      <Card style={{ width: '100%', maxWidth: '400px' }}>
        <div className="space-y-6">
          <div style={{ textAlign: 'center' }}>
            <h1 className="card-title" style={{
              fontSize: '24px',
              fontWeight: '600',
              marginBottom: 'var(--space-2)'
            }}>
              {platform ? 'Platform Admin Login' : 'Tenant Login'}
            </h1>
            <p className="muted-text">
              {platform
                ? 'Sign in to access the NotifyInsights platform'
                : 'Sign in to your tenant workspace'
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="form-group">
            {!platform && (
              <FormField
                label="Tenant Slug"
                required
              >
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., sapphire"
                  value={tenantSlug}
                  onChange={(e) => setTenantSlug(e.target.value)}
                />
              </FormField>
            )}

            <FormField
              label="Email Address"
              required
            >
              <input
                type="email"
                className="form-input"
                placeholder={platform ? "admin@platform.com" : "user@tenant.com"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormField>

            <FormField
              label="Password"
              required
            >
              <input
                type="password"
                className="form-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormField>

            {error && (
              <div style={{
                padding: 'var(--space-3) var(--space-4)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                color: '#dc2626',
                border: '1px solid #dc2626',
                fontSize: '14px'
              }}>
                {error}
              </div>
            )}

            <PrimaryButton
              type="submit"
              loading={loading}
              disabled={!email || !password || (!platform && !tenantSlug)}
              style={{ width: '100%' }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </PrimaryButton>
          </form>

          {!platform && (
            <div style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)' }}>
              <p>Demo credentials:</p>
              <p>sapphire tenant: admin@sapphire.com / password123</p>
              <p>emerald tenant: admin@emerald.com / password123</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
