import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { useTodo } from '../context/TodoContext.jsx'
import TodoList from './TodoList.jsx'
import AddTodo  from './AddTodo.jsx'

export default function PopupShell() {
  const { user, logout } = useAuth()
  const { todos }        = useTodo()
  const [filter, setFilter] = useState('all')

  const total  = todos.length
  const done   = todos.filter(t => t.completed).length
  const active = total - done

  const getInitial = () => {
    if (user?.name)  return user.name[0].toUpperCase()
    if (user?.email) return user.email[0].toUpperCase()
    return '?'
  }

  return (
    <div style={{
      width: '100%', height: '600px',
      display: 'flex', flexDirection: 'column',
      background: 'radial-gradient(ellipse at top left, #1c0808 0%, #0c0906 70%)',
      fontFamily: "'Inter', system-ui, sans-serif",
      overflow: 'hidden',
    }}>

      {/* Top accent line */}
      <div style={{
        height: 1, flexShrink: 0,
        background: 'linear-gradient(90deg, transparent, #f43f5e, #fb923c, transparent)',
      }} />

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 16px', flexShrink: 0,
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 9, flexShrink: 0,
            background: 'linear-gradient(135deg, #f43f5e, #fb923c)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, color: '#fff', fontWeight: 600,
          }}>✓</div>
          <span style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.9)' }}>
            TodoExt
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {user?.avatar
            ? <img src={user.avatar} alt=""
                style={{ width: 26, height: 26, borderRadius: '50%', objectFit: 'cover',
                         border: '1px solid rgba(244,63,94,0.3)' }} />
            : <div style={{
                width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                background: 'rgba(244,63,94,0.2)', border: '1px solid rgba(244,63,94,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 500, color: '#fb923c',
              }}>{getInitial()}</div>
          }
          <span style={{
            fontSize: 11, color: 'rgba(255,255,255,0.3)',
            maxWidth: 110, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {user?.name || user?.email}
          </span>
          <button onClick={logout} style={{
            fontSize: 11, color: 'rgba(255,255,255,0.3)',
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 7, padding: '3px 8px', cursor: 'pointer', fontFamily: 'inherit',
          }}>
            Sign out
          </button>
        </div>
      </div>

      {/* Add todo input */}
      <AddTodo />

      {/* Filter tabs */}
      <div style={{
        display: 'flex', padding: '0 16px', flexShrink: 0,
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        {['all', 'active', 'done'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            fontSize: 12, fontWeight: 500,
            padding: '8px 12px',
            background: 'none', border: 'none',
            borderBottom: filter === f ? '2px solid #f43f5e' : '2px solid transparent',
            color: filter === f ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.28)',
            cursor: 'pointer', fontFamily: 'inherit',
            textTransform: 'capitalize', marginBottom: -1,
          }}>
            {f}
          </button>
        ))}
      </div>

      {/* Scrollable todo list */}
      <TodoList filter={filter} />

      {/* Stats bar */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
        flexShrink: 0, borderTop: '1px solid rgba(255,255,255,0.06)',
      }}>
        {[
          { label: 'TOTAL',  value: total,  color: '#f87171' },
          { label: 'ACTIVE', value: active, color: '#fb923c' },
          { label: 'DONE',   value: done,   color: '#4ade80' },
        ].map((st, i) => (
          <div key={st.label} style={{
            padding: '9px 0', display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: 2,
            borderRight: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none',
          }}>
            <span style={{ fontSize: 16, fontWeight: 600, color: st.color }}>
              {st.value}
            </span>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.05em' }}>
              {st.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}