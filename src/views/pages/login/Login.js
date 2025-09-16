import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormText,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'

// Helper function to decode JWT payload (used in API mode)
const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch (e) {
    return null
  }
}

const Login = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    if (!username) newErrors.username = 'Username is required.'
    if (!password) newErrors.password = 'Password is required.'
    return newErrors
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    // --- CONTROL FLAG ---
    // Set to 'true' to use the real API login.
    // Set to 'false' to use the hardcoded dummy login.
    const useApiLogin = false

    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    if (useApiLogin) {
      // --- CASE 1: API-BASED LOGIN ---
      try {
        const formBody = new URLSearchParams()
        formBody.append('grant_type', 'password')
        formBody.append('username', username)
        formBody.append('password', password)
        formBody.append('scope', '')
        formBody.append('client_id', '')
        formBody.append('client_secret', '')

        const response = await fetch('https://api.qbits4dev.com/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formBody.toString(),
        })

        const data = await response.json()

        if (response.ok) {
          localStorage.setItem('access_token', data.access_token)
          localStorage.setItem('refresh_token', data.refresh_token)

          const decodedToken = parseJwt(data.access_token)
          const userRole = decodedToken ? decodedToken.role : null

          setErrors({})

          switch (userRole) {
            case 'admin':
              navigate('/Admindashboard')
              break
            case 'agent':
              navigate('/Agentdashboard')
              break
            case 'client':
              navigate('/Clientdashboard')
              break
            default:
              navigate('/dashboard')
              break
          }
        } else {
          setErrors({ form: data.detail || 'Invalid credentials' })
        }
      } catch (error) {
        console.error('Login request failed:', error)
        setErrors({ form: 'Request failed. Please try again.' })
      }
    } else {
      // --- CASE 2: HARDCODED DUMMY LOGIN (WITH PASSWORD CHECK) ---
      const dummyUsers = {
        admin: 'admin', // user: 'admin', pass: 'admin'
        agent: 'agent', // user: 'agent', pass: 'agent'
        client: 'client', // user: 'client', pass: 'client'
      }

      const user = username.toLowerCase()
      const expectedPassword = dummyUsers[user]

      if (expectedPassword && password === expectedPassword) {
        const role = user
        localStorage.setItem('access_token', `dummy_token_for_${role}`)
        localStorage.setItem('refresh_token', `dummy_refresh_token_for_${role}`)
        setErrors({})

        switch (role) {
          case 'admin':
            navigate('/Admindashboard')
            break
          case 'agent':
            navigate('/Agentdashboard')
            break
          case 'client':
            navigate('/Clientdashboard')
            break
          default:
            navigate('/dashboard')
            break
        }
      } else {
        setErrors({ form: 'Invalid username or password for dummy login.' })
      }
    }
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleLogin} noValidate>
                    <h1>Login</h1>
                    <p className="text-body-secondary">Sign In to your account</p>
                    {errors.form && <p className="text-danger">{errors.form}</p>}

                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        name="username"
                        placeholder="Username"
                        autoComplete="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        invalid={!!errors.username}
                        required
                      />
                    </CInputGroup>
                    {errors.username && <CFormText className="text-danger">{errors.username}</CFormText>}

                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        name="password"
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        invalid={!!errors.password}
                        required
                      />
                    </CInputGroup>
                    {errors.password && <CFormText className="text-danger">{errors.password}</CFormText>}

                    <CButton type="submit" color="primary" className="px-4">
                      Login
                    </CButton>
                  </CForm>
                </CCardBody>
              </CCard>

              <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2 className="mb-5">Sign up</h2>
                    <p>If you don't have an account, you can register here.</p>
                    <Link to="/register_agent">
                      <CButton color="info" className="mt-3 ms-2" active tabIndex={-1}>
                        Agent Register
                      </CButton>
                    </Link>
                    <Link to="/cilent_register">
                      <CButton color="danger" className="mt-3 ms-2" active tabIndex={-1}>
                        Client Register
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
