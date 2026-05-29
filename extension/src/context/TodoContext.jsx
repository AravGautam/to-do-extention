import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from './AuthContext.jsx'

const TodoContext = createContext(null)

const API = 'http://localhost:4000/api'

export function TodoProvider({ children }) {
  const { token } = useAuth()
  const [todos,   setTodos]   = useState([])
  const [loading, setLoading] = useState(false)

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }

  const fetchTodos = useCallback(async () => {
    if (!token) return
    setLoading(true)
    try {
      const res  = await fetch(`${API}/todos`, { headers })
      const data = await res.json()
      setTodos(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => { fetchTodos() }, [fetchTodos])

  const addTodo = async (text, url, pageTitle) => {
    const res  = await fetch(`${API}/todos`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ text, url, pageTitle })
    })
    const data = await res.json()
    setTodos(prev => [data, ...prev])
  }

  const toggleTodo = async (id) => {
    const todo = todos.find(t => t._id === id)
    const res  = await fetch(`${API}/todos/${id}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ completed: !todo.completed })
    })
    const data = await res.json()
    setTodos(prev => prev.map(t => t._id === id ? data : t))
  }

  const deleteTodo = async (id) => {
    await fetch(`${API}/todos/${id}`, { method: 'DELETE', headers })
    setTodos(prev => prev.filter(t => t._id !== id))
  }

  return (
    <TodoContext.Provider value={{ todos, loading, addTodo, toggleTodo, deleteTodo, fetchTodos }}>
      {children}
    </TodoContext.Provider>
  )
}

export const useTodo = () => useContext(TodoContext)