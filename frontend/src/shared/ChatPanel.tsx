import { FormEvent, useMemo, useState } from 'react'
import { askPlatformAI, askTenantAI, ChatMessage, ChatResponse } from '../api/client'
import { useTenant } from '../context/TenantContext'

export type ChatScope = 'platform' | 'tenant'

interface ChatPanelProps {
  scope: ChatScope
}

const bubbleClass = (role: ChatMessage['role']) =>
  role === 'assistant' ? 'chat-bubble assistant' : 'chat-bubble user'

export default function ChatPanel({ scope }: ChatPanelProps) {
  const { selectedTenant } = useTenant()
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const title = useMemo(() => (scope === 'platform' ? 'Platform AI Assistant' : 'Tenant AI Assistant'), [scope])

  const sendMessage = async (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    if (scope === 'tenant' && !selectedTenant) return
    const userMessage: ChatMessage = { role: 'user', content: input.trim() }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setError(null)
    setLoading(true)

    try {
      let response: ChatResponse
      if (scope === 'platform') {
        response = await askPlatformAI(userMessage.content)
      } else {
        response = await askTenantAI(userMessage.content, selectedTenant!.id)
      }
      setMessages((prev) => [...prev, { role: 'assistant', content: response.answer }])
    } catch (err: any) {
      const message = err?.response?.data?.detail || 'Failed to get AI response'
      setError(message)
      setMessages((prev) => [...prev, { role: 'assistant', content: message }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="chat-card">
      <div className="chat-header">
        <div>
          <p className="eyebrow">AI Copilot</p>
          <h3>{title}</h3>
          {scope === 'tenant' && selectedTenant ? (
            <p className="muted">Context: {selectedTenant.name}</p>
          ) : (
            <p className="muted">Platform context</p>
          )}
        </div>
      </div>
      <div className="chat-body">
        {messages.length === 0 && <p className="muted">Ask a question to begin.</p>}
        {messages.map((msg, idx) => (
          <div key={idx} className={bubbleClass(msg.role)}>
            <p>{msg.content}</p>
          </div>
        ))}
        {loading && <p className="muted">Thinking...</p>}
      </div>
      {error && <p className="error small">{error}</p>}
      <form className="chat-input" onSubmit={sendMessage}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about your data..."
        />
        <button type="submit" disabled={loading || (scope === 'tenant' && !selectedTenant)}>
          Send
        </button>
      </form>
    </div>
  )
}
