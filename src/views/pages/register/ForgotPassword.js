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

  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error while typing
    setErrors((prev) => ({ ...prev, [name]: '' }))
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

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validate()) return

    // TODO: API call for forgot password
    console.log('Submitted:', formData)

    // redirect to verification page
    navigate('/verification')
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
              <CForm onSubmit={handleSubmit}>
                <CFormInput
                  type="text"
                  name="uid"
                  label="UID"
                  placeholder="Enter your 8-character UID"
                  value={formData.uid}
                  onChange={handleChange}
                  invalid={!!errors.uid}
                  className="mb-3"
                  required
                />
                {errors.uid && <CFormFeedback invalid>{errors.uid}</CFormFeedback>}

                <CFormInput
                  type="password"
                  name="new_password"
                  label="New Password"
                  placeholder="Enter new password (8-32 characters)"
                  value={formData.new_password}
                  onChange={handleChange}
                  invalid={!!errors.new_password}
                  className="mb-4"
                  required
                />
                {errors.new_password && (
                  <CFormFeedback invalid>{errors.new_password}</CFormFeedback>
                )}

                <div className="d-grid">
                  <CButton type="submit" color="primary" size="lg">
                    Submit
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
