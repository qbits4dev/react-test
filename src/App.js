import React, { Suspense, useEffect } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { CSpinner, useColorModes } from '@coreui/react'
import './scss/style.scss'
import './scss/examples.scss'

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))
const Verification = React.lazy(() => import('./views/pages/verification'))
globalThis.apiBaseUrl = import.meta.env.VITE_API_BASE_URL
console.log('API Base URL:', globalThis.apiBaseUrl);

const AgentRegistration = React.lazy(() =>
  import('./views/pages/register/register_agent')
)
const ClientRegister = React.lazy(() =>
  import('./views/pages/register/cilent_register')
)

import ProtectedRoute from './components/ProtectedRoute'

const App = () => {
  const { setColorMode } = useColorModes(
    'coreui-free-react-admin-template-theme'
  )

  useEffect(() => {
    setColorMode('light')
  }, [])

  return (
    <HashRouter>
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
        <Routes>
          {/* Public routes */}
          <Route exact path="/login" name="Login Page" element={<Login />} />
          <Route exact path="/register" name="Register Page" element={<Register />} />
           {/* <Route
            exact
            path="/agent-register"
            name="Agent Registration Page"
            element={<AgentRegistration />}
          /> */}
          <Route exact path="/404" name="Page 404" element={<Page404 />} />
          <Route exact path="/500" name="Page 500" element={<Page500 />} />
          <Route exact path="/verification" name="Verification" element={<Verification />} />
          {/* <Route
            exact
            path="/register_agent"
            name="Agent Registration"
            element={<AgentRegistration />}
          />
          <Route
            exact
            path="/cilent_register"
            name="Client Registration"
            element={<ClientRegister />}
          /> */}
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
        </Routes>
      </Suspense>
    </HashRouter>
  )
}

export default App
