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
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilArrowLeft, cilPhone } from '@coreui/icons'
import img from '/assets/images/projects/coastalgarden.jpg'


const CoastalGardenPhase2 = () => {
    const siteDevelopments = [
        '100% Vaastu',
        'Entrance Arch',
        'Avenue Plantation',
        'Clear Title',
        'Electricity',
        'Roads & Drainage System',
        'Compound Wall',
    ]

    const nearbyHighlights = [
        'Kakinada Smart City',
        'Uppada Beach – 4 km',
        'Mulapeta Beach – 0.5 km',
        'Vakalapudi Industrial Area – 0.5 km',
        'Deep Water Port – 5 km',
        'IIFT Campus – 10 km',
        'SEZ – 10 km',
        'ONGC Base Complex – 15 km',
        'APEPDCL Office – 15 km',
        'Annavaram Temple – 35 km',
    ]

    return (
        <CContainer className="py-5">
            {/* Header */}
            <CRow
                className="align-items-center mb-4 rounded-4 px-3 py-3"
                style={{
                    background: 'linear-gradient(to right, #0077b6, #00b4d8)',
                }}
            >
                <CCol xs="2" className="text-start">
                    <CButton color="light" variant="ghost" className="p-0">
                        <CIcon icon={cilArrowLeft} size="lg" style={{ color: 'white' }} />
                    </CButton>
                </CCol>
                <CCol xs="8" className="text-center">
                    <h3 className="fw-bold text-white mb-0">Coastal Garden Phase – 2</h3>
                    <p className="text-white mb-0" style={{ fontSize: '0.9rem' }}>
                        Mulapeta, Near Uppada, Kakinada
                    </p>
                </CCol>
            </CRow>

            {/* Banner */}
            <CRow className="mb-4">
                <CCol>
                    <CCard className="border-0 shadow-sm rounded-4 overflow-hidden">
                        <CImage
                            src={img}
                            alt="Coastal Garden Phase 2 Banner"
                            fluid
                            className="w-100"
                            style={{
                                height: 'auto',
                                maxHeight: '420px',
                                objectFit: 'contain',
                            }}
                        />
                    </CCard>
                </CCol>
            </CRow>

            {/* Site & Nearby Developments */}
            <CRow className="g-4 mb-4">
                {/* Site Developments */}
                <CCol md="6">
                    <CCard className="border-0 shadow-sm rounded-4 h-100">
                        <CCardHeader
                            className="text-uppercase fw-bold text-white text-center"
                            style={{ background: '#0077b6' }}
                        >
                            Site Developments
                        </CCardHeader>
                        <CCardBody>
                            <ul className="list-unstyled mb-0">
                                {siteDevelopments.map((item, idx) => (
                                    <li key={idx} className="mb-2">
                                        • {item}
                                    </li>
                                ))}
                            </ul>
                        </CCardBody>
                    </CCard>
                </CCol>

                {/* Nearby Highlights */}
                <CCol md="6">
                    <CCard className="border-0 shadow-sm rounded-4 h-100">
                        <CCardHeader
                            className="text-uppercase fw-bold text-white text-center"
                            style={{ background: '#00b4d8' }}
                        >
                            Nearby Highlights
                        </CCardHeader>
                        <CCardBody>
                            <ul className="list-unstyled mb-0">
                                {nearbyHighlights.map((item, idx) => (
                                    <li key={idx} className="mb-2">
                                        • {item}
                                    </li>
                                ))}
                            </ul>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>

            {/* Price & Contact */}
            <CRow className="gy-3">
                <CCol md="6">
                    <CCard className="border-0 shadow-sm rounded-4 text-center p-4 h-100">
                        <h5 className="fw-semibold mb-2">1 Sq. Yard Only</h5>
                        <h3 className="text-success fw-bold mb-2">₹6,999/-</h3>
                        <p className="text-muted mb-0">Book your coastal plot today!</p>
                    </CCard>
                </CCol>

                <CCol md="6" className="d-flex align-items-center justify-content-center">
                    <CButton
                        color="primary"
                        size="lg"
                        className="fw-bold rounded-3 px-5 py-3 shadow-sm"
                    >
                        <CIcon icon={cilPhone} className="me-2" /> Contact Now
                    </CButton>
                </CCol>
            </CRow>
        </CContainer>
    )
}

export default CoastalGardenPhase2
