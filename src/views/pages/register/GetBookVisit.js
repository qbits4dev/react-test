import React, { useState, useEffect } from 'react'
import {
    CCard,
    CCardBody,
    CCardHeader,
    CTable,
    CTableHead,
    CTableBody,
    CTableRow,
    CTableHeaderCell,
    CTableDataCell,
    CContainer,
    CButton,
} from '@coreui/react'

import { useNavigate } from 'react-router-dom'

export default function SiteVisitsTable() {
    const navigate = useNavigate()

    const [siteVisits, setSiteVisits] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetch('https://api.qbits4dev.com/visits/')
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
                return response.json()
            })
            .then((data) => {
                setSiteVisits(data)
                setLoading(false)
            })
            .catch((error) => {
                setError(error.message)
                setLoading(false)
            })
    }, [])

    return (
        <CContainer className="mt-4">
            <CCard className="shadow-lg border-0 rounded-4">
                <CCardHeader className="text-primary text-center fw-bold fs-3">
                    Booked Site Visits
                </CCardHeader>
                <CCardBody>
                    {loading && <div>Loading site visits...</div>}
                    {error && <div className="text-danger">Error: {error}</div>}
                    {!loading && !error && (
                        <CTable hover responsive bordered align="middle" className="mb-0 text-center">
                            <CTableHead color="light">
                                <CTableRow>
                                    <CTableHeaderCell>#</CTableHeaderCell>
                                    <CTableHeaderCell>Lead Type</CTableHeaderCell>
                                    <CTableHeaderCell>Customer ID</CTableHeaderCell>
                                    <CTableHeaderCell>Agent ID</CTableHeaderCell>
                                    <CTableHeaderCell>Phone</CTableHeaderCell>
                                    <CTableHeaderCell>Project</CTableHeaderCell>
                                    <CTableHeaderCell>Plot Details</CTableHeaderCell>
                                    <CTableHeaderCell>Date of Visit</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {siteVisits.map((visit, index) => (
                                    <CTableRow key={visit.id}>
                                        <CTableDataCell>{index + 1}</CTableDataCell>
                                        <CTableDataCell>
                                            {visit.customer_id.startsWith('cu') ? 'Existing' : 'New'}
                                        </CTableDataCell>
                                        <CTableDataCell>{visit.customer_id}</CTableDataCell>
                                        <CTableDataCell>{visit.agent_id}</CTableDataCell>
                                        <CTableDataCell>{/* Phone not in API, placeholder */}</CTableDataCell>
                                        <CTableDataCell>{`Project ${visit.project_id}`}</CTableDataCell>
                                        <CTableDataCell>{`Plot ${visit.plot_id}`}</CTableDataCell>
                                        <CTableDataCell>{visit.visit_date}</CTableDataCell>
                                    </CTableRow>
                                ))}
                            </CTableBody>
                        </CTable>
                    )}

                    <div className="text-end mt-3">
                        <CButton color="primary" onClick={() => navigate('/bookvisit')}>
                            + Add New Site Visit
                        </CButton>
                    </div>
                </CCardBody>
            </CCard>
        </CContainer>
    )
}
