import React from 'react'
import {
    CContainer,
    CRow,
    CCol,
    CCard,
    CCardBody,
    CCardHeader,
    CButton,
    CImage,
    CLink,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilArrowLeft, cilMap, cilPhone } from '@coreui/icons'
import image from './../../../assets/images/projects/images.jpeg'

const VentureDetails = () => {
    const documents = [
        'Proceeding Letter',
        'Approved Layout',
        'Brochure / Leaflet',
        'RERA',
    ]

    const ventureInfo = {
        name: 'GOLDEN HEIGHTS RAJAPUR PHASE 1',
        location: 'Rajapur',
        code: 'GOLDEN HEIGHTS RAJAPUR - 1',
    }

    return (
        <CContainer className="py-5">
            {/* Header */}
            <CRow
                className="align-items-center mb-4 rounded-4 px-3 py-3"
                style={{
                    background: 'linear-gradient(to right, var(--cui-primary), var(--cui-secondary))',
                }}
            >
                <CCol xs="2" className="text-start">
                    <CButton color="light" variant="ghost" className="p-0">
                        <CIcon icon={cilArrowLeft} size="lg" style={{ color: 'white' }} />
                    </CButton>
                </CCol>
                <CCol xs="8" className="text-center">
                    <h3 className="fw-bold text-white mb-0">Venture Details</h3>
                </CCol>
            </CRow>

            {/* Banner */}
            <CRow className="mb-4">
                <CCol>
                    <CCard className="border-0 shadow-sm rounded-4">
                        <CImage
                            src={image}
                            alt="Venture Banner"
                            fluid
                            className="rounded-4"
                            style={{
                                height: '400px',
                                objectFit: 'cover',
                                width: '100%',
                            }}
                        />
                    </CCard>
                </CCol>
            </CRow>

            {/* Venture Info & Documents */}
            <CRow className="mb-4">
                {/* Venture Info */}
                <CCol md="6">
                    <CCard className="border-0 shadow-sm rounded-4">
                        <CCardHeader
                            className="text-uppercase fw-bold text-white"
                            style={{
                                background: 'linear-gradient(to right, var(--cui-secondary), var(--cui-primary))',
                            }}
                        >
                            Venture Information
                        </CCardHeader>
                        <CCardBody className="text-center">
                            <h4 className="fw-semibold text-dark mb-1">{ventureInfo.name}</h4>
                            <p className="text-secondary mb-1">
                                <CIcon icon={cilMap} className="me-1" />
                                {ventureInfo.location}
                            </p>
                            <p className="text-muted small mb-0">{ventureInfo.code}</p>
                        </CCardBody>
                    </CCard>
                </CCol>

                {/* Documents */}
                <CCol md="6">
                    <CCard className="border-0 shadow-sm rounded-4">
                        <CCardHeader
                            className="text-uppercase fw-bold text-white"
                            style={{
                                background: 'linear-gradient(to right, var(--cui-primary), var(--cui-secondary))',
                            }}
                        >
                            Documents
                        </CCardHeader>
                        <CCardBody>
                            <ul className="list-unstyled mb-0">
                                {documents.map((doc, idx) => (
                                    <li key={idx} className="mb-2">
                                        • <CLink href="#" className="fw-semibold text-primary text-decoration-none">
                                            {doc}
                                        </CLink>
                                    </li>
                                ))}
                            </ul>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>

            {/* Buttons / Contact Section */}
            <CRow className="mb-4">
                <CCol md="6">
                    <CCard className="border-0 shadow-sm rounded-4 p-3 text-center">
                        <h5>Explore the Layout</h5>
                        <CButton
                            color="primary"
                            variant="outline"
                            className="fw-semibold rounded-3 mt-2"
                            style={{ padding: '0.85rem' }}
                        >
                            View Layout
                        </CButton>
                    </CCard>
                </CCol>
                <CCol
                    md="6"
                    className="d-flex align-items-center justify-content-center"
                >
                    <CButton color="primary" size="lg" className="fw-bold rounded-3">
                        <CIcon icon={cilPhone} className="me-2" /> Check Plot Availability
                    </CButton>
                </CCol>
            </CRow>
        </CContainer>
    )
}

export default VentureDetails
