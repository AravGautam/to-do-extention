import { useState } from 'react'
import { useTodo } from '../context/TodoContext.jsx'

export default function AddTodo() {
  const { addTodo } = useTodo()
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    if (!text.trim()) return
    setLoading(true)
    try {
      // Grab the current tab's URL and title
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
    <div className="px-4 py-3 flex-shrink-0"
         style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="flex gap-2">
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && submit()}
          placeholder="Add a todo for this page..."
          className="flex-1 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-700 outline-none focus:ring-1 focus:ring-indigo-500"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
        />
        <button
          onClick={submit}
          disabled={loading || !text.trim()}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-lg disabled:opacity-40 transition-opacity hover:opacity-80 flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
          +
        </button>
      </div>
    </div>
  )
}