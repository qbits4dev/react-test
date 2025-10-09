// ForgotUserId.tsx
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
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'

const ForgotUserId = () => {
    const [mobile, setMobile] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleChange = (e) => {
        const value = e.target.value
        if (/^\d*$/.test(value)) {
            setMobile(value)
            setError('')
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!mobile) {
            setError('Please enter your mobile number')
            return
        }

        if (mobile.length !== 10) {
            setError('Mobile number must be exactly 10 digits')
            return
        }

        setError('')
        navigate('/verification', { state: { mobile } })
    }

    return (
        <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
            <CContainer>
                <CRow className="justify-content-center">
                    <CCol md={6} lg={5}>
                        <CCard className="shadow-lg border-0 rounded-4">
                            <CCardHeader className="bg-primary text-white text-center rounded-top-4">
                                <h4 className="mb-0"> Forgot User ID</h4>
                            </CCardHeader>
                            <CCardBody className="p-4">
                                <p className="text-muted text-center mb-4">
                                    Enter your registered mobile number to recover your User ID.
                                </p>
                                <CForm onSubmit={handleSubmit}>
                                    <CFormInput
                                        type="tel"
                                        label="Mobile Number"
                                        placeholder="Enter your 10-digit mobile number"
                                        value={mobile}
                                        maxLength={10}
                                        onChange={handleChange}
                                        className="mb-2"
                                    />
                                    {error && (
                                        <p className="text-danger small mt-1">{error}</p>
                                    )}
                                    <div className="d-grid mt-4">
                                        <CButton
                                            type="submit"
                                            color="primary"
                                            size="lg"
                                            className="rounded-pill"
                                            disabled={mobile.length !== 10}
                                        >
                                            Submit
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
