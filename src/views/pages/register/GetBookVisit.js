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
    CAlert,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CRow,
    CCol,
    CFormInput,
    CFormSelect,
    CFormLabel,
} from '@coreui/react'

import { useNavigate } from 'react-router-dom'

const updateVisitOnServer = async (visit) => {
  const payload = {
    customer_id: visit.customer_id || '',
    plot_id: visit.plot_id ? Number(visit.plot_id) : null,
    agent_id: visit.agent_id || '',
    visit_date: visit.visit_date || '',
    purpose: visit.purpose || '',
    feedback: visit.feedback || '',
    status: visit.status || 'scheduled',
    project_id: visit.project_id ? Number(visit.project_id) : null,
  }

  const urls = [
    `${globalThis.apiBaseUrl}/visits/${visit.id}`,
    `${globalThis.apiBaseUrl}/visits`,
  ]

  for (const url of urls) {
    for (const method of ['PUT', 'PATCH']) {
      try {
        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (res.ok) return true
      } catch (e) {
        console.error(e)
      }
    }
  }
  return false
}

export default function SiteVisitsTable() {
    const navigate = useNavigate()

    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const userRole = user?.role?.toLowerCase()
    const userUid = user?.u_id || user?.user_id

    const [siteVisits, setSiteVisits] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Search state
    const [searchAgentId, setSearchAgentId] = useState('')

    // Edit modal state
    const [editModalVisible, setEditModalVisible] = useState(false)
    const [selectedVisit, setSelectedVisit] = useState(null)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState({ visible: false, color: 'success', text: '' })

    useEffect(() => {
        const fetchVisits = async () => {
            try {
                const response = await fetch(`${globalThis.apiBaseUrl}/visits/`)
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`)
                }
                const data = await response.json()
                setSiteVisits(Array.isArray(data) ? data : [])
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchVisits()
    }, [])

    const displayVisits = siteVisits.filter(visit => {
        // If agent, only show their own visits
        if (userRole === 'agent') {
            return String(visit.agent_id || '').toLowerCase() === String(userUid || '').toLowerCase()
        }
        // If admin, show all, but filter if searchAgentId is entered
        if (userRole === 'admin' && searchAgentId.trim() !== '') {
            return String(visit.agent_id || '').toLowerCase().includes(searchAgentId.toLowerCase().trim())
        }
        return true
    })

    const handleEditOpen = (visit) => {
        setSelectedVisit({ ...visit })
        setEditModalVisible(true)
    }

    const handleEditChange = (e) => {
        const { name, value } = e.target
        setSelectedVisit(prev => ({ ...prev, [name]: value }))
    }

    const handleSave = async () => {
        if (!selectedVisit) return
        setSaving(true)
        try {
            const success = await updateVisitOnServer(selectedVisit)
            if (success) {
                setSiteVisits(prev => prev.map(v => v.id === selectedVisit.id ? selectedVisit : v))
                setMessage({ visible: true, color: 'success', text: 'Site visit updated successfully.' })
                setEditModalVisible(false)
            } else {
                setMessage({ visible: true, color: 'danger', text: 'Failed to update site visit.' })
            }
        } catch (err) {
            setMessage({ visible: true, color: 'danger', text: 'Error: ' + err.message })
        } finally {
            setSaving(false)
            setSelectedVisit(null)
        }
    }

    return (
        <CContainer className="mt-4">
            {message.visible && (
                <CAlert color={message.color} dismissible onClose={() => setMessage({ ...message, visible: false })}>
                    {message.text}
                </CAlert>
            )}

            <CCard className="shadow-lg border-0 rounded-4">
                <CCardHeader className="text-primary text-center fw-bold fs-3">
                    Booked Site Visits
                </CCardHeader>

                <CCardBody>
                    {userRole === 'admin' && (
                        <CRow className="mb-4">
                            <CCol md={6} lg={4}>
                                <CFormLabel className="fw-semibold text-muted">Search Agent visits (Agent ID)</CFormLabel>
                                <CFormInput
                                    type="text"
                                    placeholder="Enter Agent ID (e.g. AG123456)"
                                    value={searchAgentId}
                                    onChange={(e) => setSearchAgentId(e.target.value)}
                                />
                            </CCol>
                        </CRow>
                    )}

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
                            {displayVisits.length > 0 ? (
                                <CTable hover responsive bordered align="middle" className="mb-0 text-center">
                                    <CTableHead color="light">
                                        <CTableRow>
                                            <CTableHeaderCell>#</CTableHeaderCell>
                                            <CTableHeaderCell>Lead Type</CTableHeaderCell>
                                            <CTableHeaderCell>Customer ID</CTableHeaderCell>
                                            <CTableHeaderCell>Agent ID</CTableHeaderCell>
                                            <CTableHeaderCell>Phone</CTableHeaderCell>
                                            <CTableHeaderCell>Project ID</CTableHeaderCell>
                                            <CTableHeaderCell>Plot ID</CTableHeaderCell>
                                            <CTableHeaderCell>Date of Visit</CTableHeaderCell>
                                            <CTableHeaderCell>Status</CTableHeaderCell>
                                            <CTableHeaderCell>Actions</CTableHeaderCell>
                                        </CTableRow>
                                    </CTableHead>
                                    <CTableBody>
                                        {displayVisits.map((visit, index) => (
                                            <CTableRow key={visit.id || index}>
                                                <CTableDataCell>{index + 1}</CTableDataCell>
                                                <CTableDataCell>
                                                    {visit.customer_id && visit.customer_id.startsWith('cu') ? 'Existing' : 'New'}
                                                </CTableDataCell>
                                                <CTableDataCell>{visit.customer_id || '—'}</CTableDataCell> 
                                                <CTableDataCell>{visit.agent_id || '—'}</CTableDataCell>
                                                <CTableDataCell>{visit.phone || '—'}</CTableDataCell>
                                                <CTableDataCell>{visit.project_id ? `${visit.project_id}` : '—'}</CTableDataCell>
                                                <CTableDataCell>{visit.plot_id ? `${visit.plot_id}` : '—'}</CTableDataCell>
                                                <CTableDataCell>{visit.visit_date || '—'}</CTableDataCell>
                                                <CTableDataCell>{visit.status || 'scheduled'}</CTableDataCell>
                                                <CTableDataCell>
                                                    <CButton color="info" size="sm" variant="outline" onClick={() => handleEditOpen(visit)}>
                                                        Edit
                                                    </CButton>
                                                </CTableDataCell>
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

            {/* Edit Modal */}
            <CModal visible={editModalVisible} onClose={() => setEditModalVisible(false)} size="lg" backdrop="static">
                <CModalHeader>
                    <CModalTitle>Edit Site Visit</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    {selectedVisit && (
                        <CRow className="g-3">
                            <CCol md={6}>
                                <CFormLabel>Customer ID</CFormLabel>
                                <CFormInput name="customer_id" value={selectedVisit.customer_id || ''} onChange={handleEditChange} />
                            </CCol>
                            <CCol md={6}>
                                <CFormLabel>Agent ID</CFormLabel>
                                <CFormInput name="agent_id" value={selectedVisit.agent_id || ''} onChange={handleEditChange} />
                            </CCol>
                            <CCol md={6}>
                                <CFormLabel>Phone</CFormLabel>
                                <CFormInput name="phone" value={selectedVisit.phone || ''} onChange={handleEditChange} />
                            </CCol>
                            <CCol md={6}>
                                <CFormLabel>Date of Visit</CFormLabel>
                                <CFormInput type="date" name="visit_date" value={selectedVisit.visit_date || ''} onChange={handleEditChange} />
                            </CCol>
                            <CCol md={6}>
                                <CFormLabel>Project ID</CFormLabel>
                                <CFormInput type="number" name="project_id" value={selectedVisit.project_id || ''} onChange={handleEditChange} />
                            </CCol>
                            <CCol md={6}>
                                <CFormLabel>Plot ID</CFormLabel>
                                <CFormInput type="number" name="plot_id" value={selectedVisit.plot_id || ''} onChange={handleEditChange} />
                            </CCol>
                            <CCol md={6}>
                                <CFormLabel>Status</CFormLabel>
                                <CFormSelect name="status" value={selectedVisit.status || 'scheduled'} onChange={handleEditChange}>
                                    <option value="scheduled">Scheduled</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </CFormSelect>
                            </CCol>
                            <CCol md={6}>
                                <CFormLabel>Purpose</CFormLabel>
                                <CFormInput name="purpose" value={selectedVisit.purpose || ''} onChange={handleEditChange} />
                            </CCol>
                            <CCol md={12}>
                                <CFormLabel>Feedback</CFormLabel>
                                <CFormInput name="feedback" value={selectedVisit.feedback || ''} onChange={handleEditChange} />
                            </CCol>
                        </CRow>
                    )}
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" variant="ghost" onClick={() => setEditModalVisible(false)}>Cancel</CButton>
                    <CButton color="primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</CButton>
                </CModalFooter>
            </CModal>
        </CContainer>
    )
}
