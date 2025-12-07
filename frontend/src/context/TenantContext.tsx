import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { api, Tenant } from '../api/client'

type TenantContextState = {
  tenants: Tenant[]
  selectedTenant?: Tenant
  setSelectedTenant: (tenant?: Tenant) => void
  loading: boolean
  error?: string
  reload: () => Promise<void>
}

const TenantContext = createContext<TenantContextState | undefined>(undefined)

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [selectedTenant, setSelectedTenant] = useState<Tenant | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | undefined>(undefined)

  const reload = async () => {
    setLoading(true)
    try {
      const response = await api.get<Tenant[]>('/api/v1/platform/tenants')
      setTenants(response.data)
      setSelectedTenant((prev) => prev ?? response.data[0])
    } catch (err) {
      console.error(err)
      setError('Unable to load tenants')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    reload()
  }, [])

  const value = useMemo(
    () => ({ tenants, selectedTenant, setSelectedTenant, loading, error, reload }),
    [tenants, selectedTenant, loading, error]
  )

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>
}

export function useTenant() {
  const ctx = useContext(TenantContext)
  if (!ctx) {
    throw new Error('useTenant must be used within a TenantProvider')
  }
  return ctx
}
