import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import { TodoProvider } from './context/TodoContext.jsx'
import AuthScreen from './components/AuthScreen.jsx'
import PopupShell from './components/PopupShell.jsx'

function Inner() {
  const { token, loading } = useAuth()

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-gray-950">
      <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return token
    ? <TodoProvider><PopupShell /></TodoProvider>
    : <AuthScreen />
}

export default function App() {
  return (
    <AuthProvider>
      <Inner />
    </AuthProvider>
  )
}