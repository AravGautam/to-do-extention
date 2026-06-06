import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)
const API = 'https://to-do-extention.onrender.com/api'

export function AuthProvider({ children }) {
  const [token,   setToken]   = useState(null)
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    chrome.storage.local.get(['token', 'user'], (result) => {
      if (result.token) setToken(result.token)
      if (result.user)  setUser(result.user)
      setLoading(false)
    })
  }, [])

  const login = async (email, password) => {
    const res = await fetch(`${API}/auth/login`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ email, password })
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || 'Login failed')
    }
    const data = await res.json()
    await saveSession(data.token, data.user)
  }

  const register = async (email, password) => {
    const res = await fetch(`${API}/auth/register`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ email, password })
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || 'Registration failed')
    }
    const data = await res.json()
    await saveSession(data.token, data.user)
  }

  const loginWithGoogle = async () => {
    // Step 1 — clear stale cached token
    const stale = await new Promise((resolve) => {
      chrome.identity.getAuthToken({ interactive: false }, (t) => resolve(t || null))
    })
    if (stale) {
      await new Promise((resolve) => {
        chrome.identity.removeCachedAuthToken({ token: stale }, resolve)
      })
    }

    // Step 2 — get fresh token (reads client_id from manifest.json oauth2 block)
    const googleToken = await new Promise((resolve, reject) => {
      chrome.identity.getAuthToken({ interactive: true }, (t) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message))
        } else if (!t) {
          reject(new Error('No token — check extension ID in Google Cloud Console'))
        } else {
          resolve(t)
        }
      })
    })

    // Step 3 — exchange with your backend for a JWT
    const res = await fetch(`${API}/auth/google`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ googleToken })
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || 'Google login failed')
    }
    const data = await res.json()
    await saveSession(data.token, data.user)
  }

  const logout = async () => {
    await chrome.storage.local.clear()
    setToken(null)
    setUser(null)
  }

  const saveSession = async (token, user) => {
    await chrome.storage.local.set({ token, user })
    setToken(token)
    setUser(user)
  }

  return (
    <AuthContext.Provider value={{
      token, user, loading,
      login, register, loginWithGoogle, logout
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)