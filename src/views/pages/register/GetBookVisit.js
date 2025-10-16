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
    CSpinner,
} from '@coreui/react'

import { useNavigate } from 'react-router-dom'

export default function SiteVisitsTable() {
    const navigate = useNavigate()

    const [siteVisits, setSiteVisits] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchVisits = async () => {
            try {
                const response = await fetch(`${globalThis.apiBaseUrl}/visits/`)
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`)
                }
                const data = await response.json()
                setSiteVisits(data)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchVisits()
    }, [])

    return (
        <CContainer className="mt-4">
            <CCard className="shadow-lg border-0 rounded-4">
                <CCardHeader className="text-primary text-center fw-bold fs-3">
                    Booked Site Visits
                </CCardHeader>

                <CCardBody>
                    {loading && (
                        <div className="text-center py-3">
                            <CSpinner color="primary" /> <span className="ms-2">Loading site visits...</span>
                        </div>
                    )}

                    {error && (
                        <div className="text-danger text-center py-3">
                            <strong>Error:</strong> {error}
                        </div>
                    )}

                    {!loading && !error && (
                        <>
                            {siteVisits.length > 0 ? (
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
                                            <CTableRow key={visit.id || index}>
                                                <CTableDataCell>{index + 1}</CTableDataCell>
                                                <CTableDataCell>
                                                    {visit.customer_id && visit.customer_id.startsWith('cu') ? 'Existing' : 'New'}
                                                </CTableDataCell>
                                                <CTableDataCell>{visit.customer_id || '—'}</CTableDataCell> 
                                                <CTableDataCell>{visit.agent_id || '—'}</CTableDataCell>
                                                <CTableDataCell>{visit.phone || '—'}</CTableDataCell>
                                                <CTableDataCell>{visit.project_id ? `Project ${visit.project_id}` : '—'}</CTableDataCell>
                                                <CTableDataCell>{visit.plot_id ? `Plot ${visit.plot_id}` : '—'}</CTableDataCell>
                                                <CTableDataCell>{visit.visit_date || '—'}</CTableDataCell>
                                            </CTableRow>
                                        ))}
                                    </CTableBody>
                                </CTable>
                            ) : (
                                <div className="text-center py-3 text-muted">No site visits found.</div>
                            )}
                        </>
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
