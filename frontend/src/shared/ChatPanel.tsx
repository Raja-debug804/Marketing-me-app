import { FormEvent, useMemo, useState } from 'react'
import { MessageCircle, X } from 'lucide-react'
import { askPlatformAI, askTenantAI, ChatMessage, ChatResponse } from '../api/client'
import { useTenant } from '../context/TenantContext'

export type ChatScope = 'platform' | 'tenant'
export type ChatMode = 'platform' | 'tenant'
export type TenantSection = 'templates' | 'users' | 'shopify' | 'insights' | 'overview' | 'rules' | 'ga4'

interface ChatPanelProps {
  mode?: ChatMode
  section?: TenantSection
}

const bubbleClass = (role: ChatMessage['role']) =>
  role === 'assistant' ? 'chat-bubble assistant' : 'chat-bubble user'

export default function ChatPanel({ mode: propMode, section }: ChatPanelProps) {
  const { currentTenant } = useTenant()
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const mode = propMode || (currentTenant ? 'tenant' : 'platform')
  const title = useMemo(() => (mode === 'platform' ? 'Platform AI Copilot' : 'Tenant AI Assistant'), [mode])

  const sendMessage = async (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    if (mode === 'tenant' && !currentTenant) return
    const userMessage: ChatMessage = { id: crypto.randomUUID(), role: 'user', content: input.trim(), created_at: new Date().toISOString() }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setError(null)
    setLoading(true)

    try {
      let response: ChatResponse
      if (mode === 'platform') {
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
    <div className="card">
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
        <button type="submit" disabled={loading || (mode === 'tenant' && !currentTenant)}>
          Send
        </button>
      </form>
    </div>
  )
}
