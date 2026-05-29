import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext.jsx'

export default function Popup() {
  const { logout } = useAuth()
  const [data, setData] = useState(null)

  useEffect(() => {

    chrome.runtime.sendMessage(
      { type: 'FETCH_USER_DATA' },

      (res) => {

        if (res?.success) {
          setData(res.data)
        } else {
          console.error(res?.error)
        }
      }
    )

  }, [])

  return (
    <div className="w-[400px] h-[600px] flex flex-col bg-[#050816] text-white overflow-hidden">

      <header className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <span className="text-sm font-medium tracking-tight">My Extension</span>
        <button
          onClick={logout}
          className="text-xs text-white/40 hover:text-white/70 transition-colors"
        >Sign out</button>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-3 animate-fade-up">
        {data ? (
          <DataCard data={data} />
        ) : (
          <Skeleton />
        )}
      </main>

    </div>
  )
}

function DataCard({ data }) {
  return (
    <div className="rounded-xl bg-white/5 border border-white/10 p-4">
      <p className="text-xs text-white/50 mb-1">Current page</p>
      <p className="text-sm font-medium truncate">{data.title}</p>
    </div>
  )
}

function Skeleton() {
  return (
    <div className="rounded-xl bg-white/5 border border-white/10 p-4 animate-shimmer">
      <div className="h-3 w-24 bg-white/10 rounded mb-2"></div>
      <div className="h-4 w-48 bg-white/10 rounded"></div>
    </div>
  )
}