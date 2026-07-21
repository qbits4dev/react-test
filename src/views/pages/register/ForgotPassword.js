import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormLabel,
  CInputGroup,
  CInputGroupText,
  CProgress,
  CRow,
  CFormFeedback,
  CAlert,
  CSpinner,
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import { getPasswordStrength, sanitizeUsername, validateStrongPassword } from '../../../utils/validation'

export default function ForgotPassword() {
  const [formData, setFormData] = useState({ uid: '', new_password: '' })
  const [errors, setErrors] = useState({ uid: '', new_password: '' })
  const [alert, setAlert] = useState({ visible: false, message: '', color: 'success' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    const nextValue = name === 'uid'
      ? sanitizeUsername(value.toUpperCase(), 8)
      : value.replace(/\s/g, '').slice(0, 32)
    setFormData((prev) => ({ ...prev, [name]: nextValue }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
    setAlert({ visible: false, message: '', color: 'success' })

    if (name === 'uid' && nextValue && !/^[A-Za-z0-9]{8}$/.test(nextValue)) {
      setErrors((prev) => ({ ...prev, uid: 'UID must be exactly 8 alphanumeric characters.' }))
    }
    if (name === 'new_password' && nextValue) {
      const pwdError = validateStrongPassword(nextValue)
      setErrors((prev) => ({ ...prev, new_password: pwdError }))
    }
  }

  const validate = () => {
    let valid = true
    const newErrors = { uid: '', new_password: '' }

    const uidRegex = /^[a-zA-Z0-9]{8}$/
    if (!uidRegex.test(formData.uid)) {
      newErrors.uid = 'UID must be exactly 8 alphanumeric characters.'
      valid = false
    }
    const pwdError = validateStrongPassword(formData.new_password)
    if (pwdError) {
      newErrors.new_password = pwdError
      valid = false
    }
    setErrors(newErrors)
    return valid
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    setAlert({ visible: false, message: '', color: 'success' })

    try {
      console.log('Fetching user details for UID:', formData.uid)

      // Step 1: Fetch user details
      const userResponse = await fetch(`${globalThis.apiBaseUrl}/users/${formData.uid}`)
      const userData = await userResponse.json()
      if (!userResponse.ok) throw new Error(userData.detail || 'Failed to fetch user details.')
      const mobile = userData.mobile || userData.phone || userData.contact_number
      if (!mobile) throw new Error('User mobile number not found.')

      console.log('Mobile number found:', mobile)

      // Step 2: Send OTP to user
      const otpResponse = await fetch(`${globalThis.apiBaseUrl}/send-otp/login/${mobile}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      })
      console.log(`${globalThis.apiBaseUrl}/send-otp/login/${mobile}`)
      const otpResult = await otpResponse.json()
      console.log(otpResult)

      if (!otpResponse.ok) throw new Error(otpResult.detail || 'Failed to send OTP.')

      console.log('OTP sent successfully:', otpResult)

      // Step 3: Navigate to verification page
      navigate('/verification', {
        state: {
          uid: formData.uid,
          new_password: formData.new_password,
          mobile: mobile,
        },
      })
    } catch (error) {
      console.error('Error:', error)
      setAlert({
        visible: true,
        message: error.message || 'Something went wrong. Please try again.',
        color: 'danger',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <CContainer className="d-flex align-items-center justify-content-center min-vh-100 py-4">
      <CRow className="justify-content-center w-100">
        <CCol xs={12} sm={10} md={8} lg={6} xl={5}>
          <CCard className="shadow-sm border-0">
            <CCardHeader className="bg-primary text-white text-center">
              <h4 className="mb-0">Forgot Password</h4>
            </CCardHeader>
            <CCardBody>
              {alert.visible && (
                <CAlert color={alert.color} dismissible onClose={() => setAlert({ ...alert, visible: false })}>
                  {alert.message}
                </CAlert>
              )}
              <CForm onSubmit={handleSubmit}>
                <div className="mb-3">
                  <CFormLabel htmlFor="uid">UID</CFormLabel>
                  <CFormInput
                    id="uid"
                    type="text"
                    name="uid"
                    placeholder="Enter your 8-character UID"
                    value={formData.uid}
                    onChange={handleChange}
                    invalid={!!errors.uid}
                    disabled={isSubmitting}
                    maxLength={8}
                    required
                  />
                  {errors.uid && <CFormFeedback className="d-block">{errors.uid}</CFormFeedback>}
                </div>

                <div className="mb-3">
                  <CFormLabel htmlFor="new_password">New Password</CFormLabel>
                  <CInputGroup>
                    <CFormInput
                      id="new_password"
                      type={showPassword ? 'text' : 'password'}
                      name="new_password"
                      placeholder="Enter new password (8-32 characters)"
                      value={formData.new_password}
                      onChange={handleChange}
                      invalid={!!errors.new_password}
                      disabled={isSubmitting}
                      required
                      minLength={8}
                      maxLength={32}
                    />
                    <CInputGroupText onClick={() => setShowPassword((s) => !s)} style={{ cursor: 'pointer', userSelect: 'none' }}>
                      {showPassword ? 'Hide' : 'Show'}
                    </CInputGroupText>
                  </CInputGroup>
                  {formData.new_password && !errors.new_password && (
                    <div className="mt-2">
                      <small className="text-body-secondary">Password strength: {getPasswordStrength(formData.new_password).label}</small>
                      <CProgress thin color={getPasswordStrength(formData.new_password).color} value={getPasswordStrength(getPasswordStrength(formData.new_password).label === 'Strong' ? 100 : getPasswordStrength(formData.new_password).label === 'Medium' ? 60 : 30)} />
                    </div>
                  )}
                  {errors.new_password && <CFormFeedback className="d-block">{errors.new_password}</CFormFeedback>}
                </div>

                <div className="d-grid gap-2 mt-4">
                  <CButton type="submit" color="primary" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <CSpinner size="sm" className="me-2" />
                        Processing...
                      </>
                    ) : (
                      'Reset Password'
                    )}
                  </CButton>
                </div>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}
