import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  CContainer, CRow, CCol, CButton, CCard, CCardBody, CForm, CInputGroup, CFormInput, CSpinner, CAlert
} from '@coreui/react'

const Verification = () => {
  const { state } = useLocation()
  const navigate = useNavigate()
  const { uid, new_password, mobile } = state || {}

  const [otp, setOtp] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [alert, setAlert] = useState({ visible: false, message: '', color: 'success' })

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setAlert({ visible: true, message: 'Please enter a valid 6-digit OTP.', color: 'danger' })
      return
    }

    setIsSubmitting(true)
    setAlert({ visible: false, message: '', color: 'success' })

    try {
      const requestBody = { identifier: mobile, otp: otp };
      // console.log('Sending to API:', JSON.stringify(requestBody, null, 2));
      // Step 1: Verify OTP
      const verifyResp = await fetch(`${globalThis.apiBaseUrl}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      })
      const verifyData = await verifyResp.json()
      // console.log('Response from server:', verifyData)
      // if (!verifyResp.ok || verifyData.message !== 'OTP verified successfully') throw new Error('OTP verification failed.')

      // Step 2: Call forgot-password API
      const params = new URLSearchParams()
      params.append('uid', uid)
      params.append('new_password', new_password)
      
      if(verifyData.message == 'OTP verified successfully'){
        const passwordResp = await fetch(`${globalThis.apiBaseUrl}/register/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        body: params.toString(),
      })
      // console.log('Response from server:', passwordResp)
      const passwordResult = await passwordResp.json()
      if (!passwordResp.ok) throw new Error(passwordResult.message || 'Password update failed.')
      
      setAlert({ visible: true, message: 'Password updated successfully! Redirecting to login...', color: 'success' })
      setTimeout(() => navigate('/login'), 3000)
    } 
    else {
      throw new Error('OTP verification failed.')
    }
    } catch (error) {
      console.error('Error:', error)
      setAlert({ visible: true, message: error.message, color: 'danger' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-light min-vh-100 d-flex justify-content-center align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={6} lg={5}>
            <CCard className="shadow-lg border-0">
              <CCardBody className="p-4">
                <h2 className="text-center mb-3 text-primary fw-bold">Account Verification</h2>
                <p className="text-center text-muted mb-4">
                  Enter the 6-digit OTP sent to your mobile number.
                </p>
                {alert.visible && (
                  <CAlert color={alert.color} dismissible onClose={() => setAlert({ ...alert, visible: false })}>
                    {alert.message}
                  </CAlert>
                )}
                <CForm>
                  <CInputGroup className="mb-4">
                    <CFormInput
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter OTP"
                      maxLength={6}
                      autoComplete="off"
                      required
                    />
                  </CInputGroup>

                  <div className="d-grid">
                    <CButton color="primary" disabled={isSubmitting} onClick={handleVerifyOtp}>
                      {isSubmitting ? <CSpinner size="sm" className="me-2" /> : 'Verify Now'}
                    </CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Verification
