import React, { useState, useEffect } from 'react'
import {
    CContainer, CRow, CCol, CCard, CCardHeader, CCardBody,
    CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell,
    CSpinner, CButton
} from '@coreui/react'

const GetTargets = () => {
    const [loading, setLoading] = useState(true)
    const [targets, setTargets] = useState([])

    useEffect(() => {
        setTimeout(() => {
            setTargets([
                {
                    id: 1,
                    designation: 'Marketing Executive',
                    stage: '1st Stage',
                    insurance_cover: '5L',
                    tour: '3-Star Hotel Party (family package)',
                    rewards: 'ID card, Visiting cards, Executive bag',
                },
            ])
            setLoading(false)
        }, 1200)
    }, [])

    return (
        <CContainer className="py-4">
            <CRow className="justify-content-center">
                <CCol md={10}>
                    <CCard className="shadow-lg border-0 rounded-4">
                        <CCardHeader className="bg-gradient-primary text-primary rounded-top-4">
                            <h4 className="m-2 text-center fw-bold">Targets Overview</h4>
                        </CCardHeader>
                        <CCardBody>
                            {loading ? (
                                <div className="text-center py-5">
                                    <CSpinner color="primary" />
                                    <p className="mt-3">Loading targets...</p>
                                </div>
                            ) : (
                                <CTable hover responsive align="middle">
                                    <CTableHead color="light">
                                        <CTableRow>
                                            <CTableHeaderCell scope="col">#</CTableHeaderCell>
                                            <CTableHeaderCell scope="col">Designation</CTableHeaderCell>
                                            <CTableHeaderCell scope="col">Stage</CTableHeaderCell>
                                            <CTableHeaderCell scope="col">Insurance Cover</CTableHeaderCell>
                                            <CTableHeaderCell scope="col">Tour</CTableHeaderCell>
                                            <CTableHeaderCell scope="col">Rewards</CTableHeaderCell>
                                            <CTableHeaderCell scope="col" className="text-center">Actions</CTableHeaderCell>
                                        </CTableRow>
                                    </CTableHead>
                                    <CTableBody>
                                        {targets.map((t, index) => (
                                            <CTableRow key={t.id}>
                                                <CTableDataCell>{index + 1}</CTableDataCell>
                                                <CTableDataCell>{t.designation}</CTableDataCell>
                                                <CTableDataCell>{t.stage}</CTableDataCell>
                                                <CTableDataCell>{t.insurance_cover}</CTableDataCell>
                                                <CTableDataCell>{t.tour}</CTableDataCell>
                                                <CTableDataCell>{t.rewards}</CTableDataCell>
                                                <CTableDataCell className="text-center">
                                                    <CButton color="info" size="sm" variant="outline">
                                                        View
                                                    </CButton>
                                                </CTableDataCell>
                                            </CTableRow>
                                        ))}
                                    </CTableBody>
                                </CTable>
                            )}
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </CContainer>
    )
}

export default GetTargets
