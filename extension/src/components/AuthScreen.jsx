import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'

export default function AuthScreen() {
  const { login, register } = useAuth()
  const [mode,     setMode]     = useState('login')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  const submit = async () => {
    setError('')
    setLoading(true)
    try {
      mode === 'login'
        ? await login(email, password)
        : await register(email, password)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const onKey = (e) => { if (e.key === 'Enter') submit() }

  return (
    <div className="w-full h-screen bg-gray-950 flex flex-col items-center justify-center px-6"
         style={{ background: 'radial-gradient(ellipse at top, #1e1b4b 0%, #0a0a0f 60%)' }}>

      {/* Logo */}
      <div className="mb-8 flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-xl font-bold"
             style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>✓</div>
        <h1 className="text-white text-lg font-semibold tracking-tight">TodoExt</h1>
        <p className="text-gray-500 text-xs">
          {mode === 'login' ? 'Sign in to your account' : 'Create a new account'}
        </p>
      </div>

      {/* Card */}
      <div className="w-full rounded-2xl p-5 space-y-3"
           style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={onKey}
          className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:ring-1 focus:ring-indigo-500"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={onKey}
          className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:ring-1 focus:ring-indigo-500"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
        />

        {error && (
          <p className="text-red-400 text-xs px-1">{error}</p>
        )}

        <button
          onClick={submit}
          disabled={loading}
          className="w-full py-3 rounded-xl text-sm font-medium text-white disabled:opacity-50 transition-opacity hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
          {loading ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}
        </button>
      </div>

      {/* Toggle */}
      <p className="mt-4 text-xs text-gray-600">
        {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
        <button
          onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}
          className="text-indigo-400 hover:text-indigo-300 transition-colors">
          {mode === 'login' ? 'Sign up' : 'Sign in'}
        </button>
      </p>
    </div>
  )
}