import { useState } from 'react'
import { useTodo } from '../context/TodoContext.jsx'

export default function AddTodo() {
  const { addTodo } = useTodo()
  const [text,    setText]    = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    if (!text.trim()) return
    setLoading(true)
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
      await addTodo(text.trim(), tab?.url || '', tab?.title || '')
      setText('')
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      display: 'flex', gap: 8,
      padding: '10px 14px', flexShrink: 0,
      borderBottom: '1px solid rgba(255,255,255,0.06)',
    }}>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && submit()}
        placeholder="Add a todo for this page…"
        style={{
          flex: 1, borderRadius: 12, padding: '9px 13px',
          border: '1px solid rgba(255,255,255,0.07)',
          background: 'rgba(255,255,255,0.04)',
          color: 'rgba(255,255,255,0.85)', fontSize: 13,
          outline: 'none', fontFamily: 'inherit',
        }}
      />
      <button
        onClick={submit}
        disabled={loading || !text.trim()}
        style={{
          width: 36, height: 36, borderRadius: 10, border: 'none',
          background: 'linear-gradient(135deg, #f43f5e, #fb923c)',
          color: '#fff', fontSize: 22, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: (loading || !text.trim()) ? 0.45 : 1,
          flexShrink: 0, lineHeight: 1, fontFamily: 'inherit',
        }}>
        +
      </button>
    </div>
  )
}