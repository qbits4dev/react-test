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
    CAlert,
    CSpinner,
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'

const ForgotUserId = () => {
    const [mobile, setMobile] = useState('')
    const [error, setError] = useState('')
    const [alert, setAlert] = useState({ visible: false, message: '', color: 'info' })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const navigate = useNavigate()

    const handleChange = (e) => {
        const value = e.target.value
        if (/^\d*$/.test(value)) {
            setMobile(value)
            setError('')
            setAlert({ visible: false, message: '', color: 'info' })
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Validation
        if (!mobile) {
            setError('Please enter your mobile number')
            return
        }

        if (mobile.length !== 10) {
            setError('Mobile number must be exactly 10 digits')
            return
        }

        setError('')
        setIsSubmitting(true)
        setAlert({ visible: false, message: '', color: 'info' })

        try {
            console.log('Sending SMS to mobile:', mobile)

            // Make API call
            const response = await fetch(`${globalThis.apiBaseUrl}/send-sms/${mobile}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            const result = await response.json()
            console.log('API Response:', result)

            if (response.ok) {
                // Success - Display the success message from response
                setAlert({
                    visible: true,
                    message: result.message || 'SMS sent successfully.',
                    color: 'success',
                })
                // Clear the mobile input after successful submission
                setMobile('')

            } else {
                // Error from server
                setAlert({
                    visible: true,
                    message: result.message || result.detail || 'Failed to send SMS. Please try again.',
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
        <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
            <CContainer>
                <CRow className="justify-content-center">
                    <CCol md={6} lg={5}>
                        <CCard className="shadow-lg border-0 rounded-4">
                            <CCardHeader className="bg-primary text-white text-center rounded-top-4">
                                <h4 className="mb-0">Forgot User ID</h4>
                            </CCardHeader>
                            <CCardBody className="p-4">
                                <p className="text-muted text-center mb-4">
                                    Enter your registered mobile number to receive your User ID.
                                </p>

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
                                    <CFormInput
                                        type="tel"
                                        label="Mobile Number"
                                        placeholder="Enter your 10-digit mobile number"
                                        value={mobile}
                                        maxLength={10}
                                        onChange={handleChange}
                                        className="mb-2"
                                        disabled={isSubmitting}
                                        invalid={!!error}
                                    />
                                    {error && (
                                        <p className="text-danger small mt-1 mb-3">{error}</p>
                                    )}

                                    <div className="d-grid gap-2 mt-4">
                                        <CButton
                                            type="submit"
                                            color="primary"
                                            size="lg"
                                            className="rounded-pill"
                                            disabled={mobile.length !== 10 || isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <CSpinner size="sm" className="me-2" />
                                                    Sending...
                                                </>
                                            ) : (
                                                'Send User ID'
                                            )}
                                        </CButton>

                                        <CButton
                                            type="button"
                                            color="secondary"
                                            variant="outline"
                                            className="rounded-pill"
                                            onClick={() => navigate('/AdminDashboard')}
                                            disabled={isSubmitting}
                                        >
                                            Back
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

export default ForgotUserId
