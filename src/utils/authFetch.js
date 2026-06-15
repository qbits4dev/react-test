const AUTH_ROUTES = ['/auth/login', '/auth/refresh', '/auth/logout']

const toAbsoluteUrl = (value) => {
  try {
    return new URL(value, window.location.origin)
  } catch {
    return null
  }
}

const getApiBaseUrl = () => {
  const baseUrl = globalThis.apiBaseUrl || import.meta.env.VITE_API_BASE_URL || ''
  const normalized = toAbsoluteUrl(baseUrl)
  return normalized ? normalized.href.replace(/\/$/, '') : ''
}

const isApiRequest = (inputUrl) => {
  const apiBaseUrl = getApiBaseUrl()
  if (!apiBaseUrl) return false
  const requestUrl = toAbsoluteUrl(inputUrl)
  return Boolean(requestUrl && requestUrl.href.startsWith(apiBaseUrl))
}

const getPathname = (inputUrl) => {
  const requestUrl = toAbsoluteUrl(inputUrl)
  return requestUrl ? requestUrl.pathname : ''
}

const isAuthRoute = (inputUrl) => {
  const path = getPathname(inputUrl)
  return AUTH_ROUTES.some((route) => path.endsWith(route))
}

const shouldAttachAccessToken = (inputUrl, headers) => {
  if (!isApiRequest(inputUrl) || isAuthRoute(inputUrl)) return false
  return !headers.has('Authorization')
}

const saveAuthTokens = (payload) => {
  if (payload?.access_token) {
    localStorage.setItem('access_token', payload.access_token)
  }
  if (typeof payload?.refresh_token === 'string') {
    localStorage.setItem('refresh_token', payload.refresh_token)
  }
  if (payload?.role || payload?.u_id) {
    const existingUser = JSON.parse(localStorage.getItem('user') || '{}')
    localStorage.setItem('user', JSON.stringify({ ...existingUser, ...payload }))
  }
}

let refreshPromise = null

const refreshAccessToken = async (baseFetch) => {
  const apiBaseUrl = getApiBaseUrl()
  const refreshToken = localStorage.getItem('refresh_token') || ''
  const currentAccessToken = localStorage.getItem('access_token') || ''

  if (!apiBaseUrl || !refreshToken) return null

  const headers = new Headers({ 'Content-Type': 'application/json' })
  if (currentAccessToken) {
    headers.set('Authorization', `Bearer ${currentAccessToken}`)
  }

  const response = await baseFetch(`${apiBaseUrl}/auth/refresh`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ refresh_token: refreshToken }),
  })

  if (!response.ok) {
    localStorage.removeItem('access_token')
    return null
  }

  const payload = await response.json()
  if (!payload?.access_token) {
    return null
  }

  saveAuthTokens(payload)
  return payload.access_token
}

export const setupAuthFetch = () => {
  if (globalThis.__authFetchSetupDone) return
  globalThis.__authFetchSetupDone = true

  const baseFetch = globalThis.fetch.bind(globalThis)

  globalThis.fetch = async (input, init = {}) => {
    const inputUrl = typeof input === 'string' ? input : input?.url || ''
    const headers = new Headers(init?.headers || (input instanceof Request ? input.headers : undefined))
    const accessToken = localStorage.getItem('access_token') || ''

    if (accessToken && shouldAttachAccessToken(inputUrl, headers)) {
      headers.set('Authorization', `Bearer ${accessToken}`)
    }

    const requestInit = { ...init, headers }
    let response = await baseFetch(input, requestInit)

    const canRetry =
      response.status === 401 &&
      isApiRequest(inputUrl) &&
      !isAuthRoute(inputUrl) &&
      !requestInit.__isRetryRequest

    if (!canRetry) {
      return response
    }

    if (!refreshPromise) {
      refreshPromise = refreshAccessToken(baseFetch).finally(() => {
        refreshPromise = null
      })
    }

    const newAccessToken = await refreshPromise
    if (!newAccessToken) {
      return response
    }

    const retryHeaders = new Headers(requestInit.headers)
    retryHeaders.set('Authorization', `Bearer ${newAccessToken}`)

    response = await baseFetch(input, {
      ...requestInit,
      headers: retryHeaders,
      __isRetryRequest: true,
    })

    return response
  }
}
