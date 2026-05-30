import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

const API = 'http://localhost:4000/api'

export function AuthProvider({ children }) {
  const [token,   setToken]   = useState(null)
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(true)

  // Restore session on popup open
  useEffect(() => {
    chrome.storage.local.get(['token', 'user'], (result) => {
      if (result.token) setToken(result.token)
      if (result.user)  setUser(result.user)
      setLoading(false)
    })
  }, [])

  // ── Email login ──────────────────────────────────────────
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

  // ── Email register ───────────────────────────────────────
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

  // ── Google OAuth ─────────────────────────────────────────
  const loginWithGoogle = async () => {

    // Step 1 — get a Google access token via chrome.identity
    // Because we declared oauth2.client_id in manifest.json,
    // chrome.identity.getAuthToken handles the whole popup flow
    const googleToken = await new Promise((resolve, reject) => {
      chrome.identity.getAuthToken({ interactive: true }, (token) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message))
        } else {
          resolve(token)
        }
      })
    })

    // Step 2 — send the Google token to your backend
    // Your backend verifies it with Google and returns your own JWT
    const res = await fetch(`${API}/auth/google`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ googleToken })
    })

    if (!res.ok) {
      const err = await res.json()
      // If token is stale, remove it and try again
      if (res.status === 401) {
        await revokeGoogleToken(googleToken)
        throw new Error('Google session expired — please try again')
      }
      throw new Error(err.error || 'Google login failed')
    }

    const data = await res.json()
    await saveSession(data.token, data.user)
  }

  // ── Logout ───────────────────────────────────────────────
  const logout = async () => {
    // Also revoke Google token if user signed in with Google
    chrome.storage.local.get('googleToken', async ({ googleToken }) => {
      if (googleToken) await revokeGoogleToken(googleToken)
    })
    await chrome.storage.local.clear()
    setToken(null)
    setUser(null)
  }

  // ── Helpers ──────────────────────────────────────────────
  const saveSession = async (token, user) => {
    await chrome.storage.local.set({ token, user })
    setToken(token)
    setUser(user)
  }

  const revokeGoogleToken = (googleToken) =>
    new Promise((resolve) => {
      chrome.identity.removeCachedAuthToken({ token: googleToken }, resolve)
    })

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