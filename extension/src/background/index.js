const API_BASE = 'http://localhost:4000/api'

async function getToken() {
  return new Promise((resolve) => {
    chrome.storage.local.get('token', ({ token }) => {
      resolve(token || null)
    })
  })
}

async function apiFetch(path, options = {}) {

  const token = await getToken()

  if (!token) {
    throw new Error('No auth token found')
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,

    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers || {})
    }
  })

  if (!response.ok) {

    if (response.status === 401) {
      await chrome.storage.local.remove('token')
      throw new Error('Session expired')
    }

    throw new Error(`API Error ${response.status}`)
  }

  return response.json()
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {

  ; (async () => {

    try {

      switch (msg.type) {

        case 'FETCH_USER_DATA': {

          const data = await apiFetch('/auth/me')

          sendResponse({
            success: true,
            data
          })

          break
        }

        case 'SAVE_PAGE': {

          const data = await apiFetch('/pages', {
            method: 'POST',
            body: JSON.stringify(msg.payload)
          })

          sendResponse({
            success: true,
            data
          })

          break
        }

        default:

          sendResponse({
            success: false,
            error: 'Unknown message type'
          })
      }

    } catch (err) {

      sendResponse({
        success: false,
        error: err.message
      })
    }

  })()

  return true
})