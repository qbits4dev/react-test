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
import { CIcon } from '@coreui/icons-react'
import { cilArrowLeft, cilPhone } from '@coreui/icons'
import banner from './../../../assets/images/projects/varahi.jpg'

const VaarahiGardens = () => {
    const siteDevelopments = [
        '100% Vasthu',
        'Water Facility',
        'Compound Wall',
        'Black Top Roads',
        'Clear Title',
        'Electricity',
        'Park',
        'Avenue Plantation',
        'Entrance Arch',
        'Drainage System',
        'Children Play Area',
    ]

    const surroundingDevelopments = [
        'Gadala Village',
        'Madhurapudi Airport just 3 km',
        'Laurel Global School',
        'Rajahmundry 4th Bridge',
        'Rajahmundry City',
        'Vikas Institute of Pharmaceutical Sciences',
        'Near by Vizag - Vijayawada National Highway',
        'Near by Bhadrachalam Highway',
    ]

    return (
        <CContainer className="py-5">
            {/* Header */}
            <CRow
                className="align-items-center mb-4 rounded-4 px-3 py-3"
                style={{
                    background: 'linear-gradient(to right, #00a651, #8dc63f)',
                }}
            >
                <CCol xs="2" className="text-start">
                    <CButton color="light" variant="ghost" className="p-0">
                        <CIcon icon={cilArrowLeft} size="lg" style={{ color: 'white' }} />
                    </CButton>
                </CCol>
                <CCol xs="8" className="text-center">
                    <h3 className="fw-bold text-white mb-0">Vaarahi Gardens</h3>
                </CCol>
            </CRow>

            {/* Banner */}
            <CRow className="mb-4">
                <CCol>
                    <CCard className="border-0 shadow-sm rounded-4">
                        <CImage
                            src={banner}
                            alt="Vaarahi Gardens Banner"
                            fluid
                            className="rounded-4"
                            style={{
                                height: '400px',      // Adjust banner height
                                objectFit: 'contain',   // Cover without stretching
                                width: '100%',
                            }}
                        />
                    </CCard>
                </CCol>
            </CRow>

            {/* Site Developments */}
            <CRow className="mb-4">
                <CCol md="6">
                    <CCard className="border-0 shadow-sm rounded-4">
                        <CCardHeader
                            className="text-uppercase fw-bold text-white"
                            style={{ background: '#28a745' }}
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

                {/* Surrounding Developments */}
                <CCol md="6">
                    <CCard className="border-0 shadow-sm rounded-4">
                        <CCardHeader
                            className="text-uppercase fw-bold text-white"
                            style={{ background: '#17a2b8' }}
                        >
                            Surrounding Developments
                        </CCardHeader>
                        <CCardBody>
                            <ul className="list-unstyled mb-0">
                                {surroundingDevelopments.map((item, idx) => (
                                    <li key={idx} className="mb-2">
                                        • {item}
                                    </li>
                                ))}
                            </ul>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>

            {/* Price and Contact */}
            <CRow className="mb-4">
                <CCol md="6">
                    <CCard className="border-0 shadow-sm rounded-4 p-3 text-center">
                        <h5>1 sq Yard Only</h5>
                        <h3 className="text-success fw-bold">₹14,999/-</h3>
                        <p className="text-muted">Get your plot now!</p>
                    </CCard>
                </CCol>
                <CCol md="6" className="d-flex align-items-center justify-content-center">
                    <CButton color="primary" size="lg" className="fw-bold rounded-3">
                        <CIcon icon={cilPhone} className="me-2" /> Contact Now
                    </CButton>
                </CCol>
            </CRow>
        </CContainer>
    )
}

export default VaarahiGardens
