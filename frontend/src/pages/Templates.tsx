import { FormEvent, useEffect, useState } from 'react'
import { api, NotificationTemplate } from '../api/client'
import { useTenant } from '../context/TenantContext'

export default function Templates() {
  const { selectedTenant } = useTenant()
  const [templates, setTemplates] = useState<NotificationTemplate[]>([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', body: '', is_default: false })
  const [message, setMessage] = useState<string | undefined>(undefined)
  const [error, setError] = useState<string | undefined>(undefined)

  const fetchTemplates = async () => {
    if (!selectedTenant) return
    setLoading(true)
    setMessage(undefined)
    try {
      const response = await api.get<NotificationTemplate[]>(`/api/v1/tenants/${selectedTenant.id}/templates`)
      setTemplates(response.data)
    } catch (err) {
      console.error(err)
      setError('Unable to load templates')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTemplates()
  }, [selectedTenant?.id])

  const saveTemplate = async (e: FormEvent) => {
    e.preventDefault()
    if (!selectedTenant) return
    setError(undefined)
    setMessage(undefined)
    try {
      const response = await api.post(`/api/v1/tenants/${selectedTenant.id}/templates`, form)
      setTemplates((prev) => [response.data, ...prev])
      setForm({ name: '', body: '', is_default: false })
      setMessage('Template saved')
    } catch (err) {
      console.error(err)
      setError('Could not save template')
    }
  }

  const setDefault = async (templateId: string) => {
    if (!selectedTenant) return
    await api.post(`/api/v1/tenants/${selectedTenant.id}/templates/${templateId}/default`)
    fetchTemplates()
  }

  return (
    <div className="page">
      <div className="card">
        <div className="card-header space-between">
          <div>
            <p className="eyebrow">Templates</p>
            <h2>Notification templates</h2>
            <p className="muted">Create reusable WhatsApp notification templates for this tenant.</p>
          </div>
        </div>
        <form className="stack" onSubmit={saveTemplate}>
          <label>
            Template name
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Back in stock default"
              required
            />
          </label>
          <label>
            Body
            <textarea
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              placeholder="Hi {{customer_name}}, {{product_name}} is back in stock."
              rows={4}
              required
            />
          </label>
          <label className="checkbox">
            <input
              type="checkbox"
              checked={form.is_default}
              onChange={(e) => setForm({ ...form, is_default: e.target.checked })}
            />
            Set as default
          </label>
          {error && <div className="error">{error}</div>}
          {message && <div className="success">{message}</div>}
          <button type="submit" disabled={!selectedTenant}>
            Save template
          </button>
        </form>
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <p className="eyebrow">Library</p>
            <h3>Existing templates</h3>
          </div>
        </div>
        {loading ? (
          <p>Loading templates...</p>
        ) : templates.length === 0 ? (
          <p className="muted">No templates yet. Create your first template above.</p>
        ) : (
          <div className="template-grid">
            {templates.map((template) => (
              <div className="template-card" key={template.id}>
                <div className="template-card-header">
                  <h4>{template.name}</h4>
                  {template.is_default && <span className="badge badge-success">Default</span>}
                </div>
                <p className="muted">{template.body.slice(0, 120)}...</p>
                <div className="template-actions">
                  <button type="button" className="ghost" onClick={() => setDefault(template.id)}>
                    Set as default
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
