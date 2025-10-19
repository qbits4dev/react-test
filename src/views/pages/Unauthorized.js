import React from 'react'
import { CButton, CCard, CCardBody, CCol, CContainer, CRow } from '@coreui/react'
import { useNavigate } from 'react-router-dom'

const Unauthorized = () => {
  const navigate = useNavigate()
  return (
    <div className="bg-white min-vh-100 d-flex align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8} lg={6}>
            <CCard className="p-4 text-center">
              <CCardBody>
                <h2 className="text-danger mb-3">Unauthorized</h2>
                <p className="mb-4">You do not have permission to access this page.</p>
                <div>
                  <CButton color="primary" onClick={() => navigate(-1)} className="me-2">
                    Go Back
                  </CButton>
                  <CButton color="secondary" onClick={() => navigate('/')}>
                    Home
                  </CButton>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Unauthorized

