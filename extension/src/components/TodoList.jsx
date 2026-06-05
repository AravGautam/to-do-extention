import { useTodo } from '../context/TodoContext.jsx'

export default function TodoList({ filter }) {
  const { todos, loading, toggleTodo, deleteTodo } = useTodo()

  const filtered = todos.filter(t => {
    if (filter === 'active') return !t.completed
    if (filter === 'done')   return  t.completed
    return true
  })

  if (loading) return (
    <div style={{
      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        width: 20, height: 20, borderRadius: '50%',
        border: '2px solid #f43f5e', borderTopColor: 'transparent',
        animation: 'spin 0.8s linear infinite',
      }} />
    </div>
  )

  if (filtered.length === 0) return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 8, padding: 32,
    }}>
      <span style={{ fontSize: 28, opacity: 0.15 }}>✓</span>
      <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', margin: 0, textAlign: 'center' }}>
        {filter === 'done' ? 'Nothing completed yet' : 'No todos — add one above'}
      </p>
    </div>
  )

  return (
    <div style={{
      flex: 1, overflowY: 'auto',
      padding: '10px 14px',
      display: 'flex', flexDirection: 'column', gap: 7,
      scrollbarWidth: 'thin',
      scrollbarColor: 'rgba(244,63,94,0.3) transparent',
    }}>
      {filtered.map((todo, i) => (
        <div key={todo._id}
          className="todo-row"
          style={{
            display: 'flex', alignItems: 'flex-start', gap: 10,
            borderRadius: 14, padding: '10px 12px',
            border: '1px solid rgba(255,255,255,0.06)',
            background: 'rgba(255,255,255,0.03)',
            position: 'relative', overflow: 'hidden',
            animation: `fadeUp 0.25s ease ${i * 0.04}s both`,
          }}>

          {/* Left accent bar */}
          <div style={{
            position: 'absolute', left: 0, top: 0, bottom: 0, width: 3,
            background: todo.completed
              ? 'rgba(255,255,255,0.06)'
              : 'linear-gradient(180deg, #f43f5e, #fb923c)',
            borderRadius: '2px 0 0 2px',
          }} />

          {/* Checkbox */}
          <button onClick={() => toggleTodo(todo._id)} style={{
            width: 18, height: 18, borderRadius: '50%',
            flexShrink: 0, marginTop: 2,
            border: todo.completed ? 'none' : '1.5px solid rgba(255,255,255,0.2)',
            background: todo.completed
              ? 'linear-gradient(135deg, #f43f5e, #fb923c)'
              : 'transparent',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {todo.completed &&
              <span style={{ color: '#fff', fontSize: 10, lineHeight: 1 }}>✓</span>
            }
          </button>

          {/* Text */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{
              fontSize: 12.5, margin: 0, lineHeight: 1.45,
              color: todo.completed ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.85)',
              textDecoration: todo.completed ? 'line-through' : 'none',
              wordBreak: 'break-word',
            }}>
              {todo.text}
            </p>
            {todo.pageTitle && (
              <p style={{
                fontSize: 11, margin: '3px 0 0',
                color: 'rgba(255,255,255,0.18)',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                📄 {todo.pageTitle}
              </p>
            )}
          </div>

          {/* Delete button */}
          <button
            onClick={() => deleteTodo(todo._id)}
            className="del-btn"
            style={{
              fontSize: 18, lineHeight: 1,
              color: 'rgba(255,255,255,0.1)',
              background: 'none', border: 'none',
              cursor: 'pointer', flexShrink: 0, padding: '0 2px',
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#f43f5e'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.1)'}>
            ×
          </button>
        </div>
      ))}
    </div>
  )
}