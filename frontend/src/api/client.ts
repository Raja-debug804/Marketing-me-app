/// <reference types="vite/client" />

import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
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
  tenant_id: string
  name: string
  channel: string | null
  body_template: string
  is_default: boolean | null
  created_at: string
  updated_at: string
}

export type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
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

export const listTemplates = async (): Promise<NotificationTemplate[]> => {
  const res = await api.get('/api/v1/notify/templates')
  return res.data
}

export const createTemplate = async (template: { name: string; channel: string; body_template: string; is_default: boolean }): Promise<NotificationTemplate> => {
  const res = await api.post('/api/v1/notify/templates', template)
  return res.data
}

export const updateTemplate = async (id: string, template: { name: string; channel: string; body_template: string; is_default: boolean }): Promise<NotificationTemplate> => {
  const res = await api.put(`/api/v1/notify/templates/${id}`, template)
  return res.data
}

export const deleteTemplate = async (id: string): Promise<void> => {
  await api.delete(`/api/v1/notify/templates/${id}`)
}
