import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
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
import { AppFooter } from '../../../components'
import { LoginHeader } from '../../../components/LoginHeader'

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
    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    const payload = {
      grant_type: 'password',
      username,
      password,
      scope: '',
      client_id: '',
      client_secret: '',
    }

    try {
      const formBody = new URLSearchParams()
      formBody.append('grant_type', 'password')
      formBody.append('username', payload.username)
      formBody.append('password', payload.password)
      formBody.append('scope', payload.scope || '')
      formBody.append('client_id', payload.client_id || '')
      formBody.append('client_secret', payload.client_secret || '')
      console.log(`${globalThis.apiBaseUrl}/auth/login`)

      const response = await fetch(`${globalThis.apiBaseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formBody.toString(),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('access_token', data.access_token)
        localStorage.setItem('refresh_token', data.refresh_token)
        localStorage.setItem('user_role', data.role)
        localStorage.setItem('user_id', data.u_id)
        setErrors({})
        console.log(data.role)
        // Role-based navigation
        if (data.role === 'admin') {
          navigate('/AdminDashboard')
        } else if (data.role === 'agent') {
          navigate('/AgentDashboard')
        } else if (data.role === 'customer') {
          navigate('/ClientDashboard')
        } else {
          navigate('/dashboard') // fallback default
        }
      } else {
        setErrors({ form: data.message || 'Invalid credentials' })
      }
    } catch (error) {
      setErrors({ form: error.message || 'Request failed' })
    }
  }

  return (
    <div className="wrapper d-flex flex-column min-vh-100">
      <LoginHeader />
      <div className="body flex-grow-1">
        <div
          className="min-vh-100 d-flex align-items-center justify-content-center"
          style={{
            background: 'linear-gradient(to right, #667eea, #764ba2)',
          }}
        >
          <CContainer>
            <CRow className="justify-content-center">
              <CCol xs={12} sm={10} md={6} lg={5}>
                <CCard
                  className="p-4 shadow-lg"
                  style={{
                    borderRadius: '1rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  }}
                >
                  <CCardBody>
                    <div className="text-center mb-4">
                      <img
                        src="src/assets/images/siradithya.jpg"
                        alt="Logo"
                        style={{
                          maxWidth: '100px',
                          width: '30%',
                          height: 'auto',
                          borderRadius: '50%',
                          boxShadow: '0px 4px 10px rgba(0,0,0,0.2)',
                        }}
                      />
                    </div>

                    <h2 className="text-center mb-2" style={{ fontWeight: '600' }}>
                      Welcome
                    </h2>
                    <p className="text-center mb-4 text-muted" style={{ fontSize: '0.9rem' }}>
                      Sign in to your account
                    </p>

                    {errors.form && (
                      <p className="text-danger text-center mb-3">{errors.form}</p>
                    )}

                    <CForm onSubmit={handleLogin} noValidate>
                      <CInputGroup className="mb-3">
                        <CInputGroupText style={{ backgroundColor: '#f0f0f0' }}>
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
                          style={{ fontSize: '0.95rem' }}
                        />
                      </CInputGroup>
                      {errors.username && (
                        <CFormText className="text-danger mb-2">{errors.username}</CFormText>
                      )}

                      <CInputGroup className="mb-4">
                        <CInputGroupText style={{ backgroundColor: '#f0f0f0' }}>
                          <CIcon icon={cilLockLocked} />
                        </CInputGroupText>
                        <CFormInput
                          type="password"
                          placeholder="Password"
                          autoComplete="current-password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          invalid={!!errors.password}
                          required
                          style={{ fontSize: '0.95rem' }}
                        />
                      </CInputGroup>
                      {errors.password && (
                        <CFormText className="text-danger mb-3">{errors.password}</CFormText>
                      )}

                      <CButton
                        type="submit"
                        color="primary"
                        className="w-100"
                        style={{
                          fontSize: '1rem',
                          padding: '0.5rem 0',
                          borderRadius: '0.5rem',
                          fontWeight: '500',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        }}
                      >
                        Login
                      </CButton>
                    </CForm>

                    <div className="text-center mt-3">
                      <p className="mb-0" style={{ fontSize: '0.85rem', color: '#6c757d' }}>
                        Don't have an account?{' '}
                        <span style={{ color: '#667eea', cursor: 'pointer' }}>Sign Up</span>
                      </p>
                    </div>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
          </CContainer>
        </div>
      </div>
      <AppFooter />
    </div>
  )
}

export default Login
