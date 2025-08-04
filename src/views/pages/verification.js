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

const verification = () => {
    return (
        <div className="bg-body-tertiary min-vh-100 d-flex  align-items-center">
            <CContainer>
                <CRow className="justify-content-center">
                    <CCol md={8}>
                        <CCard className="text-white bg-primary p-4" style={{width:'55 %'}}>
                            <CCardBody>
                                <CForm>
                                    <h1>Verification</h1>
                                    <p className="text-body-secondary" style={{}}>Please verify your account, 
                                        Enter the 6 digit otp</p>
                                    <CInputGroup className="flex mb-3" >
                                        <CFormInput
                                            name="otp"
                                            placeholder="Enter OTP"
                                            autoComplete="otp"
                                            required
                                        />
                                    </CInputGroup>
                                    <CButton color="light" className="mb-3">Verify Now</CButton>
                                    <p className="text-body-secondary">If you have not received a verification email, please check your spam folder or request a new one.</p>
                                </CForm>
                            </CCardBody>
                        </CCard>
                    </CCol>
                </CRow>
            </CContainer>
        </div>
    )
}
export default verification