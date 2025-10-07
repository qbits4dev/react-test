import React, { useState } from 'react'
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

    const [siteVisits, setSiteVisits] = useState([
        {
            id: 1,
            leadType: 'New',
            firstName: 'Ravi',
            lastName: 'Kumar',
            agentId: 'AG123456',
            phone: '9876543210',
            interestedIn: 'Aditya Heights',
            plot: 'Plot 101 - East - 200sqyd',
            dateOfVisit: '2025-10-10',
        },
        {
            id: 2,
            leadType: 'Existing',
            customerId: 'CU987654',
            agentId: 'AG654321',
            phone: '9998887776',
            interestedIn: 'Aditya Medows',
            plot: 'Plot 201 - North - 250sqyd',
            dateOfVisit: '2025-10-12',
        },
        {
            id: 3,
            leadType: 'New',
            firstName: 'Lalith',
            lastName: 'Yadlapalli',
            agentId: 'AG111222',
            phone: '9123456789',
            interestedIn: 'Aditya Heights',
            plot: 'Plot 102 - West - 300sqyd',
            dateOfVisit: '2025-10-15',
        },
    ])

    return (
        <CContainer className="mt-4">
            <CCard className="shadow-lg border-0 rounded-4">
                <CCardHeader className="text-primary text-center fw-bold fs-3">
                    Booked Site Visits
                </CCardHeader>
                <CCardBody>
                    <CTable hover responsive bordered align="middle" className="mb-0 text-center">
                        <CTableHead color="light">
                            <CTableRow>
                                <CTableHeaderCell>#</CTableHeaderCell>
                                <CTableHeaderCell>Lead Type</CTableHeaderCell>
                                <CTableHeaderCell>Customer / Name</CTableHeaderCell>
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
                                    <CTableDataCell>{visit.leadType}</CTableDataCell>
                                    <CTableDataCell>
                                        {visit.leadType === 'Existing'
                                            ? visit.customerId
                                            : `${visit.firstName} ${visit.lastName}`}
                                    </CTableDataCell>
                                    <CTableDataCell>{visit.agentId}</CTableDataCell>
                                    <CTableDataCell>{visit.phone}</CTableDataCell>
                                    <CTableDataCell>{visit.interestedIn}</CTableDataCell>
                                    <CTableDataCell>{visit.plot}</CTableDataCell>
                                    <CTableDataCell>{visit.dateOfVisit}</CTableDataCell>
                                </CTableRow>
                            ))}
                        </CTableBody>
                    </CTable>

                    <div className="text-end mt-3">
                        <div className="text-end mt-3">
                            <CButton color="primary" onClick={() => navigate('/bookvisit')}>
                                + Add New Site Visit
                            </CButton>
                        </div>
                    </div>
                </CCardBody>
            </CCard>
        </CContainer>
    )
}
