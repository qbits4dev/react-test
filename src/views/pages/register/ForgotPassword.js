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
  CRow,
  CFormFeedback,
  CAlert,
  CSpinner,
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'

export default function ForgotPassword() {
  const [formData, setFormData] = useState({
    uid: '',
    new_password: '',
  })

  const [errors, setErrors] = useState({
    uid: '',
    new_password: '',
  })

  const [alert, setAlert] = useState({ visible: false, message: '', color: 'success' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error while typing
    setErrors((prev) => ({ ...prev, [name]: '' }))
    // Clear alert when user starts typing
    setAlert({ visible: false, message: '', color: 'success' })
  }

  const validate = () => {
    let valid = true
    const newErrors = { uid: '', new_password: '' }

    // UID validation: 8 characters alphanumeric
    const uidRegex = /^[a-zA-Z0-9]{8}$/
    if (!uidRegex.test(formData.uid)) {
      newErrors.uid = 'UID must be exactly 8 alphanumeric characters.'
      valid = false
    }

    // Password validation: 8–32 characters
    if (formData.new_password.length < 8 || formData.new_password.length > 32) {
      newErrors.new_password = 'Password must be 8–32 characters long.'
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
      // Create URLSearchParams for application/x-www-form-urlencoded
      const params = new URLSearchParams()
      params.append('uid', formData.uid)
      params.append('new_password', formData.new_password)

      console.log('Submitting forgot password request for UID:', formData.uid)

      // Make API call
      const response = await fetch(`${globalThis.apiBaseUrl}/register/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        body: params.toString(),
      })

      const result = await response.json()
      console.log('API Response:', result)

      if (response.ok) {
        // Success
        setAlert({
          visible: true,
          message: 'Password reset successful! Redirecting to login...',
          color: 'success',
        })

        // Clear form
        setFormData({ uid: '', new_password: '' })

        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login')
        }, 3000)
      } else {
        // Error from server
        setAlert({
          visible: true,
          message: result.message || result.detail || 'Password reset failed. Please check your UID and try again.',
          color: 'danger',
        })
      }
    } catch (error) {
      console.error('Network error:', error)
      setAlert({
        visible: true,
        message: 'Network error. Please check your connection and try again.',
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
              {/* Alert Message */}
              {alert.visible && (
                <CAlert
                  color={alert.color}
                  dismissible
                  onClose={() => setAlert({ ...alert, visible: false })}
                  className="mb-3"
                >
                  {alert.message}
                </CAlert>
              )}

              <CForm onSubmit={handleSubmit}>
                <div className="mb-3">
                  <CFormInput
                    type="text"
                    name="uid"
                    label="UID"
                    placeholder="Enter your 8-character UID"
                    value={formData.uid}
                    onChange={handleChange}
                    invalid={!!errors.uid}
                    required
                    disabled={isSubmitting}
                    maxLength={8}
                  />
                  {errors.uid && <CFormFeedback className="d-block">{errors.uid}</CFormFeedback>}
                </div>

                <div className="mb-4">
                  <CFormInput
                    type="password"
                    name="new_password"
                    label="New Password"
                    placeholder="Enter new password (8-32 characters)"
                    value={formData.new_password}
                    onChange={handleChange}
                    invalid={!!errors.new_password}
                    required
                    disabled={isSubmitting}
                    minLength={8}
                    maxLength={32}
                  />
                  {errors.new_password && (
                    <CFormFeedback className="d-block">{errors.new_password}</CFormFeedback>
                  )}
                </div>

                <div className="d-grid gap-2">
                  <CButton 
                    type="submit" 
                    color="primary" 
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <CSpinner size="sm" className="me-2" />
                        Submitting...
                      </>
                    ) : (
                      'Reset Password'
                    )}
                  </CButton>

                  <CButton
                    type="button"
                    color="secondary"
                    variant="outline"
                    onClick={() => navigate('/login')}
                    disabled={isSubmitting}
                  >
                    Back to Login
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
