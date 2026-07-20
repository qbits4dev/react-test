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

const updateVisitOnServer = async (visit, projectsList = [], plotsList = []) => {
    // Find plot number in projectPlots or visit.plot_data
    const foundPlot = plotsList.find(p => String(p.id) === String(visit.plot_id))
    const plotNumber = foundPlot ? foundPlot.plot_number : (visit.plot_number || visit.plot_data?.plot_number || visit.plot_id)

    // Find project name
    const foundProj = projectsList.find(p => String(p.id) === String(visit.project_id))
    const projectName = foundProj ? foundProj.name : (visit.project_name || '')

    const payload = {
        customer_id: visit.customer_id || '',
        plot_number: parseInt(plotNumber, 10),
        agent_id: visit.agent_id || '',
        visit_date: visit.visit_date || '',
        visit_time: visit.visit_time || '',
        purpose: visit.purpose || '',
        feedback: visit.feedback || '',
        status: visit.status || 'scheduled',
        project_name: projectName || '',
    }

    const url = `${globalThis.apiBaseUrl}/visits/${visit.id}`

    console.log('Edit Visit — payload being sent to PUT:', url, payload)

    const res = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    })

    if (!res.ok) {
        let errMsg = `Server returned ${res.status} (${res.statusText})`
        try {
            const errBody = await res.text()
            if (errBody && !errBody.includes('<html>')) {
                errMsg = errBody
            }
        } catch (_) {
            // ignore parse error
        }
        throw new Error(errMsg)
    }

    return true
}

const deleteVisitOnServer = async (id) => {
    const url = `${globalThis.apiBaseUrl}/visits/${id}`
    console.log('Delete Visit — request being sent:', url)
    const res = await fetch(url, {
        method: 'DELETE',
    })

    if (!res.ok) {
        let errMsg = `Server returned ${res.status} (${res.statusText})`
        try {
            const errBody = await res.text()
            if (errBody && !errBody.includes('<html>')) {
                errMsg = errBody
            }
        } catch (_) {
            // ignore parse error
        }
        throw new Error(errMsg)
    }

    return true
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

    // Delete modal state
    const [deleteModalVisible, setDeleteModalVisible] = useState(false)
    const [visitToDelete, setVisitToDelete] = useState(null)
    const [deleting, setDeleting] = useState(false)

    const [agentsAndAdmins, setAgentsAndAdmins] = useState([])
    const [projects, setProjects] = useState([])
    const [projectPlots, setProjectPlots] = useState([])
    const [plotsLoading, setPlotsLoading] = useState(false)

    useEffect(() => {
        const fetchAgentsAndAdmins = async () => {
            try {
                const resAgents = await fetch(`${globalThis.apiBaseUrl}/users/`)
                let agentUserIds = []
                if (resAgents.ok) {
                    const agentData = await resAgents.json()
                    if (agentData?.success && Array.isArray(agentData.users)) {
                        agentUserIds = agentData.users
                    } else if (Array.isArray(agentData)) {
                        agentUserIds = agentData
                    }
                }

                let adminData = null
                try {
                    const resAdmins = await fetch(`${globalThis.apiBaseUrl}/users/admin`)
                    if (resAdmins.ok) {
                        adminData = await resAdmins.json()
                    } else {
                        const resAdminsBackup = await fetch(`${globalThis.apiBaseUrl}/users/admin/`)
                        if (resAdminsBackup.ok) {
                            adminData = await resAdminsBackup.json()
                        }
                    }
                } catch (e) {
                    console.error('Failed to fetch admin list without trailing slash, trying backup:', e)
                    try {
                        const resAdminsBackup = await fetch(`${globalThis.apiBaseUrl}/users/admin/`)
                        if (resAdminsBackup.ok) {
                            adminData = await resAdminsBackup.json()
                        }
                    } catch (errBackup) {
                        console.error('Backup admin fetch failed:', errBackup)
                    }
                }

                let adminUserIds = []
                let directAdminDetails = []
                if (adminData) {
                    const rawAdmins = adminData?.users || adminData?.admins || adminData || []
                    if (Array.isArray(rawAdmins)) {
                        rawAdmins.forEach(item => {
                            if (typeof item === 'string' || typeof item === 'number') {
                                adminUserIds.push(String(item))
                            } else if (item && typeof item === 'object') {
                                directAdminDetails.push(item)
                            }
                        })
                    }
                }

                const idsToFetch = Array.from(new Set([...agentUserIds, ...adminUserIds]))
                
                const fetchedDetails = await Promise.all(
                    idsToFetch.map(async (uId) => {
                        try {
                            const userRes = await fetch(`${globalThis.apiBaseUrl}/users/${uId}`)
                            if (userRes.ok) {
                                return await userRes.json()
                            }
                        } catch (e) {
                            console.error(e)
                        }
                        return null
                    })
                )

                const allDetails = [...fetchedDetails, ...directAdminDetails]

                const filtered = allDetails.filter(
                    (u) => u && (u.success || u.u_id || u.id) && (String(u.role || '').toLowerCase() === 'agent' || String(u.role || '').toLowerCase() === 'admin')
                ).map((u) => ({
                    u_id: u.u_id || u.id,
                    name: `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.u_id
                }))

                const uniqueFiltered = []
                const seen = new Set()
                for (const item of filtered) {
                    if (item.u_id && !seen.has(item.u_id)) {
                        seen.add(item.u_id)
                        uniqueFiltered.push(item)
                    }
                }

                setAgentsAndAdmins(uniqueFiltered)
            } catch (err) {
                console.error('Error fetching agents/admins:', err)
            }
        }
        fetchAgentsAndAdmins()
    }, [])

    useEffect(() => {
        const loadAllData = async () => {
            try {
                // 1. Fetch visits
                const response = await fetch(`${globalThis.apiBaseUrl}/visits/`)
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`)
                }
                const data = await response.json()
                setSiteVisits(Array.isArray(data) ? data : [])

                // 2. Fetch projects
                const resProjects = await fetch(`${globalThis.apiBaseUrl}/projects/`)
                let projectsData = []
                if (resProjects.ok) {
                    const parsed = await resProjects.json()
                    projectsData = Array.isArray(parsed?.data) ? parsed.data : (Array.isArray(parsed) ? parsed : [])
                }
                setProjects(projectsData)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        loadAllData()
    }, [])

    const displayVisits = siteVisits.filter(visit => {
        // If agent, only show their own visits
        if (userRole === 'agent') {
            return String(visit.agent_id || '').toLowerCase() === String(userUid || '').toLowerCase()
        }
        // If admin, show all, but filter if searchAgentId is entered
        if (userRole === 'admin' && searchAgentId.trim() !== '') {
            return String(visit.agent_id || '').toLowerCase() === String(searchAgentId || '').toLowerCase()
        }
        return true
    })

    // Name resolving helpers
    const resolveAgentName = (agentId) => {
        if (!agentId) return '—'
        const found = agentsAndAdmins.find(
            (u) =>
                String(u.u_id).toLowerCase() === String(agentId).toLowerCase() ||
                String(u.id) === String(agentId)
        )
        return found ? found.name : agentId
    }

    const formatTime12h = (timeStr) => {
        if (!timeStr) return '—'
        const parts = timeStr.split(/[T ]/)
        const tPart = parts.length > 1 ? parts[1] : parts[0]
        const rawTime = tPart.slice(0, 5) // "HH:mm"
        const [hourStr, minStr] = rawTime.split(':')
        const hour = parseInt(hourStr, 10)
        if (!isNaN(hour)) {
            const ampm = hour >= 12 ? 'PM' : 'AM'
            const hour12 = hour % 12 || 12
            return `${String(hour12).padStart(2, '0')}:${minStr} ${ampm}`
        }
        return timeStr
    }

    const handleEditOpen = async (visit) => {
        const projName = visit.project_name || visit.project_id
        let resolvedProjId = ''
        if (projName) {
            const proj = projects.find(p => String(p.id) === String(projName) || String(p.name).toLowerCase() === String(projName).toLowerCase())
            if (proj) {
                resolvedProjId = proj.id
                setPlotsLoading(true)
                try {
                    const res = await fetch(`${globalThis.apiBaseUrl}/projects/plots?project_name=${encodeURIComponent(proj.name)}`)
                    if (res.ok) {
                        const data = await res.json()
                        setProjectPlots(Array.isArray(data) ? data : [])
                    }
                } catch (e) {
                    console.error('Failed to load plots in edit modal:', e)
                } finally {
                    setPlotsLoading(false)
                }
            }
        }

        setSelectedVisit({
            ...visit,
            phone: visit.customer_mobile || visit.phone || '',
            visit_date_only: visit.visit_date || '',
            visit_time_only: visit.visit_time || '',
            project_id: resolvedProjId,
            plot_id: visit.plot_data?.id || visit.plot_id || ''
        })
        setEditModalVisible(true)
    }

    const handleEditProjectChange = async (e) => {
        const selectedProjId = e.target.value
        setSelectedVisit(prev => ({
            ...prev,
            project_id: selectedProjId,
            plot_id: '' // reset plot
        }))
        setProjectPlots([])

        const proj = projects.find(p => String(p.id) === String(selectedProjId))
        if (!proj) return

        setPlotsLoading(true)
        try {
            const res = await fetch(`${globalThis.apiBaseUrl}/projects/plots?project_name=${encodeURIComponent(proj.name)}`)
            if (res.ok) {
                const data = await res.json()
                setProjectPlots(Array.isArray(data) ? data : [])
            }
        } catch (err) {
            console.error('Failed to fetch plots for project:', err)
        } finally {
            setPlotsLoading(false)
        }
    }

    const handleEditChange = (e) => {
        const { name, value } = e.target
        let cleanValue = value
        if (name === 'phone') {
            cleanValue = value.replace(/[^0-9]/g, '').slice(0, 10)
        } else if (name === 'customer_id') {
            cleanValue = value.replace(/[^A-Za-z0-9\-]/g, '').toUpperCase()
        } else if (name === 'purpose' || name === 'feedback') {
            cleanValue = value.replace(/[^A-Za-z0-9 ,.\-\/()]/g, '')
        }

        setSelectedVisit(prev => {
            const nextVisit = { ...prev, [name]: cleanValue }
            if (name === 'visit_date_only') {
                nextVisit.visit_date = cleanValue
            } else if (name === 'visit_time_only') {
                nextVisit.visit_time = cleanValue
            }
            return nextVisit
        })
    }

    const handleSave = async () => {
        if (!selectedVisit) return
        setSaving(true)
        try {
            const success = await updateVisitOnServer(selectedVisit, projects, projectPlots)
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

    const handleDeleteOpen = (visit) => {
        setVisitToDelete(visit)
        setDeleteModalVisible(true)
    }

    const handleDelete = async () => {
        if (!visitToDelete) return
        setDeleting(true)
        try {
            const success = await deleteVisitOnServer(visitToDelete.id)
            if (success) {
                setSiteVisits(prev => prev.filter(v => v.id !== visitToDelete.id))
                setMessage({ visible: true, color: 'success', text: 'Site visit deleted successfully.' })
                setDeleteModalVisible(false)
            } else {
                setMessage({ visible: true, color: 'danger', text: 'Failed to delete site visit.' })
            }
        } catch (err) {
            setMessage({ visible: true, color: 'danger', text: 'Error: ' + err.message })
        } finally {
            setDeleting(false)
            setVisitToDelete(null)
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
                                <CFormLabel className="fw-semibold text-muted">Filter by Agent / Admin</CFormLabel>
                                <CFormSelect
                                    value={searchAgentId}
                                    onChange={(e) => setSearchAgentId(e.target.value)}
                                >
                                    <option value="">All Agents & Admins</option>
                                    {agentsAndAdmins.map((item) => (
                                        <option key={item.u_id} value={item.u_id}>
                                            {item.name} ({item.u_id})
                                        </option>
                                    ))}
                                </CFormSelect>
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
                                            <CTableHeaderCell>Client Type</CTableHeaderCell>
                                            <CTableHeaderCell>Customer Name</CTableHeaderCell>
                                            <CTableHeaderCell>Agent Name</CTableHeaderCell>
                                            <CTableHeaderCell>Phone</CTableHeaderCell>
                                            <CTableHeaderCell>Project Name</CTableHeaderCell>
                                            <CTableHeaderCell>Plot Name</CTableHeaderCell>
                                            <CTableHeaderCell>Date of Visit</CTableHeaderCell>
                                            <CTableHeaderCell>Time of Visit</CTableHeaderCell>
                                            <CTableHeaderCell>Status</CTableHeaderCell>
                                            <CTableHeaderCell>Actions</CTableHeaderCell>
                                        </CTableRow>
                                    </CTableHead>
                                    <CTableBody>
                                        {displayVisits.map((visit, index) => (
                                            <CTableRow key={visit.id || index}>
                                                <CTableDataCell>{index + 1}</CTableDataCell>
                                                <CTableDataCell>
                                                    {visit.customer_id && (visit.customer_id.startsWith('cu') || visit.customer_id.startsWith('cl')) ? 'Existing' : 'New'}
                                                </CTableDataCell>
                                                <CTableDataCell>{visit.customer_name || visit.customer_id || '—'}</CTableDataCell>
                                                <CTableDataCell>{resolveAgentName(visit.agent_id)}</CTableDataCell>
                                                <CTableDataCell>{visit.customer_mobile || visit.phone || '—'}</CTableDataCell>
                                                <CTableDataCell>{visit.project_name || visit.project_id || '—'}</CTableDataCell>
                                                <CTableDataCell>{visit.plot_data?.plot_number || visit.plot_id || '—'}</CTableDataCell>
                                                <CTableDataCell>{visit.visit_date || '—'}</CTableDataCell>
                                                <CTableDataCell>{formatTime12h(visit.visit_time)}</CTableDataCell>
                                                <CTableDataCell>{visit.status || 'scheduled'}</CTableDataCell>
                                                 <CTableDataCell>
                                                     <div className="d-flex gap-2 justify-content-center">
                                                         <CButton color="info" size="sm" variant="outline" onClick={() => handleEditOpen(visit)}>
                                                             Edit
                                                         </CButton>
                                                         <CButton color="danger" size="sm" variant="outline" onClick={() => handleDeleteOpen(visit)}>
                                                             Delete
                                                         </CButton>
                                                     </div>
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
                                <CFormLabel>Agent / Admin</CFormLabel>
                                <CFormSelect name="agent_id" value={selectedVisit.agent_id || ''} onChange={handleEditChange}>
                                    <option value="">Select Agent / Admin</option>
                                    {agentsAndAdmins.map((item) => (
                                        <option key={item.u_id} value={item.u_id}>
                                            {item.name} ({item.u_id})
                                        </option>
                                    ))}
                                </CFormSelect>
                            </CCol>
                            <CCol md={6}>
                                <CFormLabel>Phone</CFormLabel>
                                <CFormInput name="phone" value={selectedVisit.phone || ''} onChange={handleEditChange} />
                            </CCol>
                            <CCol md={3}>
                                <CFormLabel>Date of Visit</CFormLabel>
                                <CFormInput type="date" name="visit_date_only" value={selectedVisit.visit_date_only || ''} onChange={handleEditChange} />
                            </CCol>
                            <CCol md={3}>
                                <CFormLabel>Time of Visit</CFormLabel>
                                <CFormInput type="time" name="visit_time_only" value={selectedVisit.visit_time_only || ''} onChange={handleEditChange} />
                            </CCol>
                            <CCol md={6}>
                                <CFormLabel>Project Name</CFormLabel>
                                <CFormSelect name="project_id" value={selectedVisit.project_id || ''} onChange={handleEditProjectChange}>
                                    <option value="">Select Project</option>
                                    {projects.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.name}
                                        </option>
                                    ))}
                                </CFormSelect>
                            </CCol>
                            <CCol md={6}>
                                <CFormLabel>Plot Name</CFormLabel>
                                <CFormSelect name="plot_id" value={selectedVisit.plot_id || ''} onChange={handleEditChange} disabled={!selectedVisit.project_id || plotsLoading}>
                                    <option value="">{plotsLoading ? 'Loading plots...' : 'Select Plot'}</option>
                                    {projectPlots.map((plot) => (
                                        <option key={plot.id} value={plot.id}>
                                            Plot {plot.plot_number} ({plot.status || 'available'})
                                        </option>
                                    ))}
                                </CFormSelect>
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

            {/* Delete Confirmation Modal */}
            <CModal visible={deleteModalVisible} onClose={() => setDeleteModalVisible(false)} backdrop="static">
                <CModalHeader>
                    <CModalTitle>Delete Site Visit</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    Are you sure you want to delete the site visit for customer <strong>{visitToDelete?.customer_id || visitToDelete?.phone || 'Unknown'}</strong>?
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" variant="ghost" onClick={() => setDeleteModalVisible(false)}>Cancel</CButton>
                    <CButton color="danger" onClick={handleDelete} disabled={deleting}>
                        {deleting ? 'Deleting...' : 'Delete'}
                    </CButton>
                </CModalFooter>
            </CModal>
        </CContainer>
    )
}
