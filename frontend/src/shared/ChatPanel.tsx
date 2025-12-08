import { FormEvent, useMemo, useState } from 'react'
import { MessageCircle, X } from 'lucide-react'
import { askPlatformAI, askTenantAI, ChatMessage, ChatResponse } from '../api/client'
import { useTenant } from '../context/TenantContext'

export type ChatScope = 'platform' | 'tenant'

interface ChatPanelProps {
  scope?: ChatScope
}

const bubbleClass = (role: ChatMessage['role']) =>
  role === 'assistant' ? 'chat-bubble assistant' : 'chat-bubble user'

export default function ChatPanel({ scope: propScope }: ChatPanelProps) {
  const { currentTenant } = useTenant()
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const scope = propScope || (currentTenant ? 'tenant' : 'platform')
  const title = useMemo(() => (scope === 'platform' ? 'Platform AI Copilot' : 'Tenant AI Assistant'), [scope])

  const sendMessage = async (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    if (scope === 'tenant' && !currentTenant) return
    const userMessage: ChatMessage = { id: crypto.randomUUID(), role: 'user', content: input.trim(), created_at: new Date().toISOString() }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setError(null)
    setLoading(true)

    try {
      let response: ChatResponse
      if (scope === 'platform') {
        response = await askPlatformAI(userMessage.content)
      } else {
        response = await askTenantAI(userMessage.content, currentTenant!.id)
      }
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: 'assistant', content: response.answer, created_at: new Date().toISOString() }])
    } catch (err: any) {
      const message = 'The AI service is temporarily unavailable. Please try again.'
      setError(message)
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: 'assistant', content: message, created_at: new Date().toISOString() }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="chat-widget">
      {!isOpen ? (
        <button className="chat-toggle" onClick={() => setIsOpen(true)}>
          <MessageCircle size={24} />
          <span>AI Copilot</span>
        </button>
      ) : (
        <div className="chat-card">
          <div className="chat-header">
            <div>
              <p className="eyebrow">AI Copilot</p>
              <h3>{title}</h3>
              {scope === 'tenant' && currentTenant ? (
                <p className="muted">Context: {currentTenant.name}</p>
              ) : (
                <p className="muted">Platform context</p>
              )}
            </div>
            <button className="chat-close" onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>
          <div className="chat-body">
            {messages.length === 0 && <p className="muted">Ask a question to begin.</p>}
            {messages.map((msg) => (
              <div key={msg.id} className={bubbleClass(msg.role)}>
                <p>{msg.content}</p>
              </div>
            ))}
            {loading && <p className="muted">Thinking...</p>}
          </div>
          <form className="chat-input" onSubmit={sendMessage}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  sendMessage(e as any)
                }
              }}
              placeholder="Ask a question about your data..."
              rows={1}
              style={{ resize: 'none' }}
            />
            <button type="submit" disabled={loading || (scope === 'tenant' && !currentTenant)}>
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
