import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormText, // Use CFormText for helper/error text
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLockLocked, cilUser } from '@coreui/icons';

const Login = () => {
  const navigate = useNavigate();

  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  
  // 1. State for errors is now an object to hold field-specific messages
  const [errors, setErrors] = useState({});

  // 2. A more robust validation function
  const validateForm = () => {
    const newErrors = {};
    if (!userId) {
      newErrors.userId = 'User ID is required.';
    }
    if (!password) {
      newErrors.password = 'Password is required.';
    }
    return newErrors;
  };

  const handleLogin = (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return; // Stop the login process if there are validation errors
    }

    // --- In a REAL application, you would make an API call here ---
    if (userId === 'admin' && password === 'admin') {
      console.log('Login successful');
      setErrors({}); // Clear all errors on success
      navigate('/Dashboard');
    } else {
      // 3. Set a general form error for invalid credentials
      setErrors({ form: 'Invalid User ID or Password.' });
    }
  };

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleLogin} noValidate> {/* noValidate prevents default browser validation */}
                    <h1>Login</h1>
                    <p className="text-body-secondary">Sign In to your account</p>

                    {/* Display general form error (e.g., "Invalid Credentials") */}
                    {errors.form && <p className="text-danger">{errors.form}</p>}

                    {/* === User ID Field === */}
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        name="userId"
                        placeholder="UserId"
                        autoComplete="userId"
                        value={userId}
                        onChange={(e) => {
                          setUserId(e.target.value);
                          // Clear the error for this field when the user starts typing
                          if (errors.userId) setErrors(prev => ({ ...prev, userId: null }));
                          if (errors.form) setErrors(prev => ({...prev, form: null}));
                        }}
                      />
                    </CInputGroup>
                    {/* 4. Display the error for this specific field */}
                    {errors.userId && <CFormText className="text-danger mb-2">{errors.userId}</CFormText>}
                    
                    {/* === Password Field === */}
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
                        onChange={(e) => {
                          setPassword(e.target.value);
                          // Clear the error for this field when the user starts typing
                          if (errors.password) setErrors(prev => ({ ...prev, password: null }));
                          if (errors.form) setErrors(prev => ({...prev, form: null}));
                        }}
                      />
                    </CInputGroup>
                    {/* 4. Display the error for this specific field */}
                    {errors.password && <CFormText className="text-danger mb-2">{errors.password}</CFormText>}

                    <CRow>
                      <CCol xs={6}>
                        <CButton type="submit" color="primary" className="px-4">
                          Login
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              {/* The Sign Up card remains the same */}
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
  );
};

export default Login;