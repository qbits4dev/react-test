import { React } from 'react'
import {
    CCard,
    CCardBody,
    CContainer,
    CRow,
    CCol,
    CButton,
    CLink,
    CImage,
    CCardHeader,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilArrowLeft, cilMap } from '@coreui/icons'
import image from './../../../assets/images/projects/images.jpeg'

const VentureDetails = () => {
    return (
        <CContainer className="py-5">
            {/* Header with Gradient */}
            <CRow
                className="align-items-center mb-5 rounded-4 px-3 py-3"
                style={{
                    background: 'linear-gradient(to right, var(--cui-primary), var(--cui-secondary))',
                }}
            >
                <CCol xs="2" sm="1" className="text-start">
                    <CButton color="light" variant="ghost" className="p-0">
                        <CIcon icon={cilArrowLeft} size="lg" style={{ color: 'white' }} />
                    </CButton>
                </CCol>
                <CCol xs="8" sm="10" className="text-center">
                    <h3 className="fw-bold text-white mb-0">Venture Details</h3>
                </CCol>
            </CRow>

            {/* Main Layout */}
            <CRow className="g-4">
                {/* Left Side - Venture Image and Info */}
                <CCol md="8">
                    <CCard className="border-0 shadow-sm rounded-4 mb-4">
                        <CCardBody className="p-4 text-center">
                            <CImage
                                src={image}
                                alt="Golden Heights Logo"
                                fluid
                                className="rounded-4 mb-3"
                                style={{ maxHeight: '260px', objectFit: 'cover', width: '60%' }}
                            />
                            <div>
                                <h4 className="fw-semibold text-dark mb-1">
                                    GOLDEN HEIGHTS RAJAPUR PHASE 1
                                </h4>
                                <p className="text-secondary mb-1">
                                    <CIcon icon={cilMap} className="me-1" />
                                    Rajapur
                                </p>
                                <p className="text-muted small mb-0">
                                    GOLDEN HEIGHTS RAJAPUR - 1
                                </p>
                            </div>
                        </CCardBody>
                    </CCard>
                </CCol>

                {/* Right Side - Documents and Actions */}
                <CCol md="4">
                    {/* Documents Section */}
                    <CCard className="border-0 shadow-sm rounded-4 mb-4">
                        <CCardHeader className="text-uppercase  fw-semibold small text-light rounded-top-4"
                            style={{
                                background: 'linear-gradient(to right, var(--cui-secondary), var(--cui-primary))',
                                color: 'white',
                            }}
                        >
                            Documents
                        </CCardHeader>
                        <CCardBody>
                            <ul className="list-unstyled mb-0">
                                {['Proceeding Letter', 'Approved Layout', 'Brochure / Leaflet', 'RERA'].map(
                                    (doc, index) => (
                                        <li key={index} className="mb-3">
                                            <CLink
                                                href="#"
                                                className="fw-semibold text-primary text-decoration-none"
                                            >
                                                {doc}
                                            </CLink>
                                        </li>
                                    ),
                                )}
                            </ul>
                        </CCardBody>
                    </CCard>

                    {/* Buttons */}
                    <div className="d-grid gap-3">
                        <CButton
                            color="primary"
                            variant="outline"
                            className="fw-semibold rounded-3"
                            style={{ padding: '0.85rem' }}
                        >
                            View Layout
                        </CButton>
                        <CButton
                            color="primary"
                            className="fw-semibold text-white rounded-3"
                            style={{ padding: '0.85rem' }}
                        >
                            Check Plot Availability
                        </CButton>
                    </div>
                </CCol>
            </CRow>
        </CContainer>
    )
}

export default VentureDetails
