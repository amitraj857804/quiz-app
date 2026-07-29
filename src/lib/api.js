const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://98.88.26.239:8080/api'

function getToken() {
  return localStorage.getItem('token')
}

async function request(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (auth) {
    const token = getToken()
    if (token) headers.Authorization = `Bearer ${token}`
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) {
    let message = res.statusText
    try {
      const text = await res.text()
      const parsed = JSON.parse(text)
      // Spring's error body is typically { error: "..." } or a field-errors map
      message = parsed.error || parsed.message || Object.values(parsed)[0] || message
    } catch {
      // response wasn't JSON — fall back to statusText above
    }
    throw new Error(message || `Request failed: ${res.status}`)
  }

  const contentType = res.headers.get('content-type') || ''
  return contentType.includes('application/json') ? res.json() : null
}

export const api = {
  get: (path, opts) => request(path, { ...opts, method: 'GET' }),
  post: (path, body, opts) => request(path, { ...opts, method: 'POST', body }),
  put: (path, body, opts) => request(path, { ...opts, method: 'PUT', body }),
  del: (path, opts) => request(path, { ...opts, method: 'DELETE' }),
}
