import React, { useEffect, useState } from 'react'
import { FileText, Plus, MessageSquare, Edit2, Trash2 } from 'lucide-react'
import Card from '../components/Card'
import FormField from '../components/FormField'
import PrimaryButton from '../components/PrimaryButton'
import PageHeader from '../components/PageHeader'
import ChatPanel from '../shared/ChatPanel'
import { listTemplates, createTemplate, updateTemplate, deleteTemplate, NotificationTemplate } from '../api/client'

export default function Templates() {
  const [templates, setTemplates] = useState<NotificationTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<NotificationTemplate | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    channel: 'whatsapp',
    body_template: '',
    is_default: false
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadTemplates()
  }, [])

  const loadTemplates = async () => {
    try {
      const data = await listTemplates()
      setTemplates(data)
    } catch (error) {
      console.error('Failed to load templates', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTemplate = async () => {
    setSubmitting(true)
    try {
      await createTemplate(formData)
      await loadTemplates()
      setFormData({ name: '', channel: 'whatsapp', body_template: '', is_default: false })
      setShowModal(false)
    } catch (error) {
      console.error('Failed to create template', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditTemplate = (template: NotificationTemplate) => {
    setEditingTemplate(template)
    setFormData({
      name: template.name,
      channel: template.channel || 'whatsapp',
      body_template: template.body_template,
      is_default: template.is_default ?? false
    })
    setShowModal(true)
  }

  const handleUpdateTemplate = async () => {
    if (!editingTemplate) return
    setSubmitting(true)
    try {
      await updateTemplate(editingTemplate.id, formData)
      await loadTemplates()
      setFormData({ name: '', channel: 'whatsapp', body_template: '', is_default: false })
      setShowModal(false)
      setEditingTemplate(null)
    } catch (error) {
      console.error('Failed to update template', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteTemplate = async (id: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return
    try {
      await deleteTemplate(id)
      await loadTemplates()
    } catch (error) {
      console.error('Failed to delete template', error)
    }
  }

  const handleSubmit = () => {
    if (editingTemplate) {
      handleUpdateTemplate()
    } else {
      handleCreateTemplate()
    }
  }

  if (loading) {
    return <div>Loading templates...</div>
  }

  return (
    <div>
      <PageHeader
        title="Notification Templates"
        subtitle="Manage reusable message templates for your notifications"
        icon={<FileText />}
        actions={
          <PrimaryButton onClick={() => setShowModal(true)}>
            <Plus size={16} />
            New Template
          </PrimaryButton>
        }
      />

      {templates.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <MessageSquare size={48} className="mx-auto text-muted" />
            <h3 className="card-title mt-4">No templates yet</h3>
            <p className="muted-text">Create your first notification template to get started.</p>
            <PrimaryButton className="mt-4" onClick={() => setShowModal(true)}>
              <Plus size={16} />
              Create Template
            </PrimaryButton>
          </div>
        </Card>
      ) : (
        <div className="card-grid">
          {templates.map((template) => (
            <Card key={template.id}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div style={{
                    color: '#4F8EF7',
                    fontSize: '20px',
                    marginTop: '2px'
                  }}>
                    <MessageSquare />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="card-title">{template.name}</h3>
                      {template.is_default && (
                        <span className="status-chip status-active">Default</span>
                      )}
                    </div>
                    <p className="muted-text" style={{
                      marginTop: 'var(--space-2)',
                      lineHeight: '1.4',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {template.body_template}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <button
                    onClick={() => handleEditTemplate(template)}
                    className="btn-secondary p-2"
                    title="Edit template"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteTemplate(template.id)}
                    className="btn-secondary p-2 text-red-600"
                    title="Delete template"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <div style={{ marginTop: 'var(--space-8)' }}>
        <ChatPanel mode="tenant" section="templates" />
      </div>

      {/* Create Template Modal */}
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
                <h3 className="card-title">{editingTemplate ? 'Edit Template' : 'Create New Template'}</h3>
                <p className="muted-text">{editingTemplate ? 'Update the notification template' : 'Add a new notification template for your messages'}</p>
              </div>

              <div className="form-group">
                <FormField
                  label="Template Name"
                  required
                >
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g., Order Confirmation"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </FormField>

                <FormField
                  label="Message Body"
                  helper="Use {{variable}} syntax for dynamic content"
                  required
                >
                  <textarea
                    className="form-textarea"
                    placeholder="Hi {{customer_name}}, your order #{{order_number}} has been confirmed!"
                    rows={4}
                    value={formData.body_template}
                    onChange={(e) => setFormData({...formData, body_template: e.target.value})}
                  />
                </FormField>

                <FormField label="">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.is_default}
                      onChange={(e) => setFormData({...formData, is_default: e.target.checked})}
                    />
                    <span className="body-text">Set as default template</span>
                  </label>
                </FormField>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  className="btn-secondary"
                  onClick={() => {
                    setShowModal(false)
                    setEditingTemplate(null)
                    setFormData({ name: '', channel: 'whatsapp', body_template: '', is_default: false })
                  }}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <PrimaryButton
                  onClick={handleSubmit}
                  loading={submitting}
                  disabled={!formData.name || !formData.body_template}
                >
                  {editingTemplate ? 'Update Template' : 'Create Template'}
                </PrimaryButton>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
