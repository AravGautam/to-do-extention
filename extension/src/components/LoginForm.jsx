import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'

export default function LoginForm() {
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      setError('')

      await login(email, password)

    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-[380px] h-[600px] bg-[#050816] text-white overflow-hidden relative">

      {/* Glow */}
      <div className="absolute top-[-100px] left-[-100px] w-[250px] h-[250px] bg-cyan-500/20 blur-3xl rounded-full"></div>
      <div className="absolute bottom-[-120px] right-[-120px] w-[300px] h-[300px] bg-purple-500/20 blur-3xl rounded-full"></div>

      <div className="relative z-10 flex items-center justify-center h-full p-6">

        <form
          onSubmit={handleSubmit}
          className="w-full backdrop-blur-2xl bg-white/5 border border-white/10 rounded-3xl p-6 shadow-2xl"
        >

          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome back
            </h1>

            <p className="text-white/50 text-sm mt-2">
              Login to continue
            </p>
          </div>

          <div className="space-y-4">

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-cyan-400 transition"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-cyan-400 transition"
            />

          </div>

          {error && (
            <p className="text-red-400 text-sm mt-4">
              {error}
            </p>
          )}

          <button
            disabled={loading}
            className="w-full mt-6 bg-white text-black font-medium rounded-xl py-3 hover:scale-[1.02] active:scale-[0.98] transition"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

        </form>

      </div>

    </div>
  )
}