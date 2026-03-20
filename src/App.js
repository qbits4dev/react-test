import React, { Suspense, useEffect } from 'react'
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom'

import { CSpinner, useColorModes } from '@coreui/react'
import './scss/style.scss'
import './scss/examples.scss'

// shared protected route component
import ProtectedRoute from './components/ProtectedRoute'
import ErrorBoundary from './components/ErrorBoundary'

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))
const Verification = React.lazy(() => import('./views/pages/verification'))
globalThis.apiBaseUrl = import.meta.env.VITE_API_BASE_URL
// console.log('API Base URL:', globalThis.apiBaseUrl);

const AgentRegistration = React.lazy(() =>
  import('./views/pages/register/register_agent')
)
const ClientRegister = React.lazy(() =>
  import('./views/pages/register/cilent_register')
)

const App = () => {
  const { setColorMode } = useColorModes(
    'coreui-free-react-admin-template-theme'
  )

  useEffect(() => {
    setColorMode('light')

    const globalError = (event) => {
      console.error('Global error:', event.error || event.message || event)
      // Prevent default to avoid browser console duplication in production.
      if (event.preventDefault) {
        event.preventDefault()
      }
    }

    const globalRejection = (event) => {
      console.error('Unhandled promise rejection:', event.reason)
      // Standard handle for event.
      if (event.preventDefault) {
        event.preventDefault()
      }
    }

    window.addEventListener('error', globalError)
    window.addEventListener('unhandledrejection', globalRejection)

    return () => {
      window.removeEventListener('error', globalError)
      window.removeEventListener('unhandledrejection', globalRejection)
    }
  }, [setColorMode])

  return (
    <HashRouter>
      <ErrorBoundary>
        <Suspense
          fallback={
            <div className="pt-3 text-center">
              <CSpinner color="primary" variant="grow" />
            </div>
          }
        >
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Navigate to="login" replace />} />
          <Route exact path="/login" name="Login Page" element={<Login />} />
          <Route exact path="/register" name="Register Page" element={<Register />} />
          <Route exact path="/404" name="Page 404" element={<Page404 />} />
          <Route exact path="/500" name="Page 500" element={<Page500 />} />
          <Route exact path="/verification" name="Verification" element={<Verification />} />
          {/* Protected routes */}
          <Route
            path="/*"
            name="Home"
            element={
              <ProtectedRoute>
                <DefaultLayout />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  </HashRouter>
  )
}

export default App