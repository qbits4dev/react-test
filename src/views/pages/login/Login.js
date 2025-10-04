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
      grant_type: 'password', // fixed, per spec
      username: username,
      password: password,
      scope: '',
      client_id: '',
      client_secret: '',
    }

    try {
      const formBody = new URLSearchParams();
      formBody.append('grant_type', 'password');
      formBody.append('username', payload.username);  
      formBody.append('password', payload.password);  
      formBody.append('scope', payload.scope || ''); 
      formBody.append('client_id', payload.client_id || '');
      formBody.append('client_secret', payload.client_secret || '');
    
      const response = await fetch('https://api.qbits4dev.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formBody.toString(),
      });
    
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        setErrors({});
        navigate('/dashboard'); // redirect to protected page
      } else {
        setErrors({ form: data.message || 'Invalid credentials' });
      }
    } catch (error) {
      setErrors({ form: error.message || 'Request failed' });
    }
    
  }
  //   if (username === 'testuser' && password === 'testpass') {
  //     // Simulate a successful login response
  //     localStorage.setItem('access_token', 'dummy_access_token');
  //     localStorage.setItem('refresh_token', 'dummy_refresh_token');
  //     setErrors({});
  //     navigate('/dashboard'); // redirect to protected page
  //     return;
  //   } else {
  //     // Simulate an error
  //     setErrors({ form: 'Invalid credentials (dummy data)' });
  //     return;
  //   }
  // }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol xs={12} sm={10} md={8} lg={7}>
            {/* Stack on mobile, side-by-side on desktop */}
            <div className="d-flex flex-column flex-md-row">
              {/* Login Card */}
              <CCard className="p-4 flex-fill">
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
                    {errors.username && (
                      <CFormText className="text-danger">{errors.username}</CFormText>
                    )}

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
                    {errors.password && (
                      <CFormText className="text-danger">{errors.password}</CFormText>
                    )}

                    <CButton type="submit" color="primary" className="w-100">
                      Login
                    </CButton>
                  </CForm>
                </CCardBody>
              </CCard>

              {/* Register Card */}
              <CCard className="text-white bg-primary py-5 flex-fill mt-3 mt-md-0 md-3">
                <CCardBody className="text-center d-flex flex-column justify-content-center">
                  <div>
                    <h2 className="mb-4">Sign up</h2>
                    <p>If you don't have an account, you can register here.</p>
                    <Link to="/ARegister">
                      <CButton color="info" className="mt-3 w-100">
                        Register
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </div>
          </CCol>
        </CRow>
      </CContainer>
    </div>

  )
}

export default Login
