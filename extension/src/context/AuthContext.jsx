import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken]   = useState(null)
  const [user,  setUser]    = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    chrome.storage.local.get(['token', 'user'], (result) => {
      if (result.token) setToken(result.token)
      if (result.user)  setUser(result.user)
      setLoading(false)
    })
  }, [])

  const login = async (email, password) => {
    const res = await fetch('http://localhost:4000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || 'Login failed')
    }
    const data = await res.json()
    await chrome.storage.local.set({ token: data.token, user: data.user })
    setToken(data.token)
    setUser(data.user)
  }

  const register = async (email, password) => {
    const res = await fetch('http://localhost:4000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || 'Registration failed')
    }
    const data = await res.json()
    await chrome.storage.local.set({ token: data.token, user: data.user })
    setToken(data.token)
    setUser(data.user)
  }

  const logout = async () => {
    await chrome.storage.local.remove(['token', 'user'])
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ token, user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)