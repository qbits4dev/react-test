import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import 'core-js'

// Strict entry path validation before React mounts
const pathname = window.location.pathname
const hash = window.location.hash

// Only allow root entry
const isRoot = pathname === '/' || pathname === '/index.html'

// Allowed hash routes (HashRouter app behavior)
const allowedHashes = ['', '#/', '#/login']
const isValidHash = allowedHashes.includes(hash)

if (!isRoot || !isValidHash) {
  document.body.innerHTML = `
    <div style="font-family:sans-serif;text-align:center;margin-top:10%">
      <h1>404 - Invalid URL</h1>
      <p>Invalid entry point: ${pathname}${hash}</p>
    </div>
  `
  throw new Error('Blocked invalid URL entry')
}

import App from './App'
import store from './store'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>,
)
