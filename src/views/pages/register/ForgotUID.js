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
            // Create URLSearchParams for application/x-www-form-urlencoded
            const params = new URLSearchParams()
            params.append('mobile', mobile)

            console.log('Submitting forgot UID request for mobile:', mobile)

            // Make API call
            const response = await fetch('https://q.qbits4dev.com/register/forgot-uid', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                },
                body: params.toString(),
            })

            const result = await response.json()
            console.log('API Response:', result)

            if (response.ok) {
                // Success - Display the UID from response
                setAlert({
                    visible: true,
                    message: result.message || `Your User ID has been sent to your mobile number.`,
                    color: 'success',
                })

                // If UID is in the response, show it
                if (result.uid || result.u_id) {
                    setAlert({
                        visible: true,
                        message: `Your User ID is: ${result.uid || result.u_id}`,
                        color: 'success',
                    })
                }

                // Clear the mobile input after successful submission
                setMobile('')

                // Optional: Redirect to login after showing UID
                // setTimeout(() => {
                //     navigate('/login')
                // }, 5000)
            } else {
                // Error from server
                setAlert({
                    visible: true,
                    message: result.message || result.detail || 'Mobile number not found. Please check and try again.',
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
                                    Enter your registered mobile number to recover your User ID.
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
                                                    Submitting...
                                                </>
                                            ) : (
                                                'Submit'
                                            )}
                                        </CButton>

                                        <CButton
                                            type="button"
                                            color="secondary"
                                            variant="outline"
                                            className="rounded-pill"
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
        </div>
    )
}

export default ForgotUserId
