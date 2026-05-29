import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import TodoList from './TodoList.jsx'
import AddTodo from './AddTodo.jsx'

export default function PopupShell() {
  const { user, logout } = useAuth()
  const [filter, setFilter] = useState('all') // all | active | done

  return (
    <div className="w-full flex flex-col bg-gray-950"
         style={{ height: '600px', background: 'radial-gradient(ellipse at top left, #1e1b4b 0%, #0a0a0f 70%)' }}>

      {/* Top rainbow line */}
      <div className="h-px w-full flex-shrink-0"
           style={{ background: 'linear-gradient(90deg, transparent, #6366f1, #a855f7, transparent)' }} />

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 flex-shrink-0"
           style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-sm font-bold"
               style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>✓</div>
          <span className="text-white text-sm font-medium tracking-tight">TodoExt</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-600 text-xs truncate max-w-28">{user?.email}</span>
          <button
            onClick={logout}
            className="text-xs text-gray-600 hover:text-gray-400 transition-colors px-2 py-1 rounded-lg"
            style={{ background: 'rgba(255,255,255,0.04)' }}>
            Sign out
          </button>
        </div>
      </div>

      {/* Add todo input */}
      <AddTodo />

      {/* Filter tabs */}
      <div className="flex gap-0 px-4 flex-shrink-0"
           style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        {['all', 'active', 'done'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-3 py-2 text-xs font-medium capitalize transition-colors"
            style={{
              color: filter === f ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.3)',
              borderBottom: filter === f ? '2px solid #6366f1' : '2px solid transparent',
              marginBottom: '-1px'
            }}>
            {f}
          </button>
        ))}
      </div>

      {/* Todo list — scrollable */}
      <TodoList filter={filter} />
    </div>
  )
}