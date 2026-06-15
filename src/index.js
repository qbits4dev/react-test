import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import 'core-js'

// Strict entry path validation before React mounts
const pathname = window.location.pathname
const hash = window.location.hash

// Only allow root entry; /d is considered invalid and must redirect via 404
const isRoot = pathname === '/' || pathname === '/index.html'

// Allowed hash routes (HashRouter app behavior)
const allowedHashes = ['', '#/', '#/login', '#/404']
const isValidHash = allowedHashes.includes(hash)

if (!isRoot) {
  document.body.innerHTML = `
    <div style="font-family:sans-serif;text-align:center;margin-top:10%">
      <h1>404 - Invalid URL</h1>
      <p>Invalid entry point: ${pathname}${hash}</p>
      <p>Redirecting to login...</p>
    </div>
  `
  setTimeout(() => {
    window.location.href = '/#/login'
  }, 2000)
  // Don't mount React; invalid entry has been handled
  throw new Error('Blocked invalid URL entry')
}

if (!isValidHash) {
  // Clean up unrecognized hash by sending user to the app 404 route.
  window.location.hash = '#/404'
}

import App from './App'
import store from './store'
import { setupAuthFetch } from './utils/authFetch'

globalThis.apiBaseUrl = globalThis.apiBaseUrl || import.meta.env.VITE_API_BASE_URL
setupAuthFetch()

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>,
)
