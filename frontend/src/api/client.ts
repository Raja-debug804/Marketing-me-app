import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
})

export type Tenant = {
  id: string
  name: string
  slug: string
  status: string
}

export type TenantUser = {
  id: string
  email: string
  full_name?: string
  role: string
  created_at: string
}

export type NotificationTemplate = {
  id: string
  name: string
  body: string
  is_default: boolean
  created_at: string
}

export type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
}

export type ChatResponse = {
  answer: string
  sql: string
  rows: Record<string, any>[]
}

export const askPlatformAI = async (question: string): Promise<ChatResponse> => {
  const res = await api.post('/api/v1/ai/platform/query', { question })
  return res.data
}

export const askTenantAI = async (question: string, tenantId: string): Promise<ChatResponse> => {
  const res = await api.post('/api/v1/ai/tenant/query', { question, tenant_id: tenantId })
  return res.data
}
