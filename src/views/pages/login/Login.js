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
  CSpinner,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'

import { AppFooter } from '../../../components'
import Logo from '../../../assets/images/siradithya.jpg'

const Login = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    localStorage.clear()
  }, [])


  const validateForm = () => {
    const newErrors = {}
    if (!username.trim()) newErrors.username = 'Username is required.'
    if (!password.trim()) newErrors.password = 'Password is required.'
    return newErrors
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)
    setErrors({})

    const payload = {
      grant_type: 'password',
      username,
      password,
      scope: '',
      client_id: '',
      client_secret: '',
    }

    try {
      const apiUrl = globalThis.apiBaseUrl
      const formBody = new URLSearchParams(payload).toString()

      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formBody,
      })

      const data = await response.json()

      if (response.ok && data?.access_token) {
        localStorage.setItem('access_token', data.access_token)
        localStorage.setItem('refresh_token', data.refresh_token || '')
        localStorage.setItem('user', JSON.stringify(data)); // Store the whole user object
        console.log('LocalStorage values:', JSON.stringify(localStorage));

        // Role-based navigation
        switch (data.role) {
          case 'admin':
            navigate('/Admindashboard')
            break
          case 'agent':
            navigate('/Agentdashboard')
            break
          case 'customer':
            navigate('/Clientdashboard')
            break
          default:
            navigate('/dashboard')
        }
      } else {
        setErrors({ form: data.message || 'Invalid username or password.' })
      }
    } catch (error) {
      console.error('Login error:', error)
      setErrors({ form: 'Unable to connect to the server. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const [showPassword, setShowPassword] = useState(false)


  return (
    <div className="wrapper d-flex flex-column min-vh-100">
      <div className="body flex-grow-1">
        <div
          className="min-vh-100 d-flex align-items-center justify-content-center"
          style={{ background: 'linear-gradient(to right, #667eea, #764ba2)' }}
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
                        src={Logo}
                        alt='../../../assets/images/siradithya.jpg'
                        style={{
                          maxWidth: '100px',
                          width: '30%',
                          height: 'auto',
                          borderRadius: '50%',
                          boxShadow: '0px 4px 10px rgba(0,0,0,0.2)',
                        }}
                      />
                    </div>

                    <h2
                      className="text-center text-dark mb-2"
                      style={{ fontWeight: '600' }}
                    >
                      Welcome
                    </h2>
                    <p
                      className="text-center text-dark mb-4"
                      style={{ fontSize: '0.9rem' }}
                    >
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
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Password"
                          autoComplete="current-password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          invalid={!!errors.password}
                          required
                          style={{ fontSize: '0.95rem' }}
                        />

                        {/* Toggle Button */}
                        <CInputGroupText
                          onClick={() => setShowPassword(!showPassword)}
                          style={{ cursor: 'pointer', backgroundColor: '#f0f0f0' }}
                        >
                          {showPassword ? 'Hide' : 'Show'}
                        </CInputGroupText>
                      </CInputGroup>

                      {errors.password && (
                        <CFormText className="text-danger mb-3">{errors.password}</CFormText>
                      )}


                      <CButton
                        type="submit"
                        color="primary"
                        className="w-100 d-flex justify-content-center align-items-center"
                        style={{
                          fontSize: '1rem',
                          padding: '0.5rem 0',
                          borderRadius: '0.5rem',
                          fontWeight: '500',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        }}
                        disabled={loading}
                      >
                        {loading ? <CSpinner size="sm" color="light" /> : 'Login'}
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
