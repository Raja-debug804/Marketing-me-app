import { useState } from 'react'

export default function Login({ platform = false }: { platform?: boolean }) {
  const [email, setEmail] = useState('')
  const [tenantSlug, setTenantSlug] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div className="content">
      <h2>{platform ? 'Platform' : 'Tenant'} Login</h2>
      <form>
        {!platform && (
          <input placeholder="Tenant slug" value={tenantSlug} onChange={(e) => setTenantSlug(e.target.value)} />
        )}
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="button">Sign in</button>
      </form>
    </div>
  )
}
