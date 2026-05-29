import { useTodo } from '../context/TodoContext.jsx'

export default function TodoList({ filter }) {
  const { todos, loading, toggleTodo, deleteTodo } = useTodo()

  const filtered = todos.filter(t => {
    if (filter === 'active') return !t.completed
    if (filter === 'done')   return  t.completed
    return true
  })

  if (loading) return (
    <div className="flex-1 flex items-center justify-center">
      <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (filtered.length === 0) return (
    <div className="flex-1 flex flex-col items-center justify-center gap-2">
      <span className="text-3xl">✓</span>
      <p className="text-gray-700 text-xs">
        {filter === 'done' ? 'Nothing completed yet' : 'No todos yet — add one above'}
      </p>
    </div>
  )

  return (
    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2"
         style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}>
      {filtered.map(todo => (
        <div key={todo._id}
             className="flex items-start gap-3 rounded-xl p-3 group transition-all"
             style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>

          {/* Checkbox */}
          <button
            onClick={() => toggleTodo(todo._id)}
            className="w-5 h-5 rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center transition-all"
            style={{
              background: todo.completed ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'transparent',
              border: todo.completed ? 'none' : '1.5px solid rgba(255,255,255,0.2)'
            }}>
            {todo.completed && <span className="text-white text-xs">✓</span>}
          </button>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <p className="text-sm leading-snug"
               style={{
                 color: todo.completed ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.85)',
                 textDecoration: todo.completed ? 'line-through' : 'none'
               }}>
              {todo.text}
            </p>
            {todo.pageTitle && (
              <p className="text-xs mt-0.5 truncate" style={{ color: 'rgba(255,255,255,0.2)' }}>
                📄 {todo.pageTitle}
              </p>
            )}
          </div>

          {/* Delete — shows on hover */}
          <button
            onClick={() => deleteTodo(todo._id)}
            className="text-gray-800 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0 text-lg leading-none">
            ×
          </button>
        </div>
      ))}
    </div>
  )
}