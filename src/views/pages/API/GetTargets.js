import React, { useState, useEffect } from 'react'
import {
    CContainer, CRow, CCol, CCard, CCardHeader, CCardBody,
    CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell,
    CSpinner, CBadge, CButton
} from '@coreui/react'

const GetTargets = () => {
    const [loading, setLoading] = useState(true)
    const [targets, setTargets] = useState([])

    useEffect(() => {
        setTimeout(() => {
            setTargets([
                { id: 1, name: 'Revenue Goal', value: '$50,000', status: 'Achieved' },
                { id: 2, name: 'Customer Acquisition', value: '1200 users', status: 'In Progress' },
                { id: 3, name: 'App Downloads', value: '10,000', status: 'Pending' },
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
                            <h4 className="m-2 text-center fw-bold"> Targets</h4>
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
                                            <CTableHeaderCell scope="col">Target Name</CTableHeaderCell>
                                            <CTableHeaderCell scope="col">Value</CTableHeaderCell>
                                            <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                                            <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                                        </CTableRow>
                                    </CTableHead>
                                    <CTableBody>
                                        {targets.map((t, index) => (
                                            <CTableRow key={t.id}>
                                                <CTableDataCell>{index + 1}</CTableDataCell>
                                                <CTableDataCell>{t.name}</CTableDataCell>
                                                <CTableDataCell>{t.value}</CTableDataCell>
                                                <CTableDataCell>
                                                    <CBadge color={
                                                        t.status === 'Achieved'
                                                            ? 'success'
                                                            : t.status === 'In Progress'
                                                                ? 'warning'
                                                                : 'secondary'
                                                    }>
                                                        {t.status}
                                                    </CBadge>
                                                </CTableDataCell>
                                                <CTableDataCell>
                                                    <CButton color="info" size="sm" variant="outline">View</CButton>
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
