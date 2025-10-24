import React from "react"
import {
    CContainer,
    CRow,
    CCol,
    CButton,
    CCard,
    CCardBody,
    CForm,
    CInputGroup,
    CFormInput,
} from "@coreui/react"

const Verification = () => {
    return (
        <div className="bg-light min-vh-100 d-flex justify-content-center align-items-center">
            <CContainer>
                <CRow className="justify-content-center">
                    <CCol md={6} lg={5}>
                        <CCard className="shadow-lg border-0">
                            <CCardBody className="p-4">
                                <h2 className="text-center mb-3 text-primary fw-bold">Account Verification</h2>
                                <p className="text-center text-muted mb-4">
                                    Enter the 6-digit OTP sent to your email address/mobile number
                                </p>

                                <CForm>
                                    <CInputGroup className="mb-4">
                                        <CFormInput
                                            name="otp"
                                            placeholder="Enter OTP"
                                            autoComplete="off"
                                            maxLength={6}
                                            className="py-2"
                                            required
                                        />
                                    </CInputGroup>

                                    <div className="d-grid">
                                        <CButton color="primary" className="py-2 fw-semibold">
                                            Verify Now
                                        </CButton>
                                    </div>

                                    <p className="text-center text-muted mt-4" style={{ fontSize: "0.9rem" }}>
                                        Didn’t receive the code?{" "}
                                        <a href="#" className="text-primary fw-semibold" style={{ textDecoration: "none" }}>
                                            Resend OTP
                                        </a>
                                    </p>
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
