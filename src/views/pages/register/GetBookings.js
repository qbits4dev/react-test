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
    CBadge,
} from '@coreui/react'
import { useNavigate, useLocation } from 'react-router-dom'
import ErrorModal from '../../../components/ErrorModal'
import { extractErrorMessage, getResponseErrorMessage } from '../../../utils/errorUtils'

const normalizeBooking = (b) => {
    if (!b) return b
    const total = b.total_amount !== undefined ? b.total_amount : (b.total_price !== undefined ? b.total_price : (b.price !== undefined ? b.price : 0))
    const advance = b.advance_amount !== undefined ? b.advance_amount : (b.amount !== undefined ? b.amount : 0)
    const amenities = b.amenities_charges !== undefined ? b.amenities_charges : 0
    const other = b.other_charges !== undefined ? b.other_charges : 0
    const calculatedBal = Math.max(0, (parseFloat(total) || 0) + (parseFloat(amenities) || 0) + (parseFloat(other) || 0) - (parseFloat(advance) || 0))
    const balance = b.balance_amount !== undefined ? b.balance_amount : calculatedBal
    return {
        ...b,
        plot_id: b.plot_id || b.plot_number || '',
        total_amount: total,
        advance_amount: advance,
        amenities_charges: amenities,
        other_charges: other,
        balance_amount: balance,
        amount: advance || total
    }
}

export default function BookingsManager() {
    const navigate = useNavigate()

    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const userRole = user?.role?.toLowerCase()
    const userUid = user?.u_id || user?.user_id

    const isAdmin = userRole === 'admin'
    const isAgent = userRole === 'agent'
    const isCustomer = userRole === 'customer' || userRole === 'client'

    const [bookings, setBookings] = useState([])
    const [usersList, setUsersList] = useState([]) // For mapping customer IDs to names
    const [projects, setProjects] = useState([])
    const [plots, setPlots] = useState([]) // Flat list of all plots across projects
    const [announcements, setAnnouncements] = useState([])

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [message, setMessage] = useState({ visible: false, color: 'success', text: '' })

    // Error modal state
    const [errorModalVisible, setErrorModalVisible] = useState(false)
    const [errorModalTitle, setErrorModalTitle] = useState('')
    const [errorModalMsg, setErrorModalMsg] = useState('')

    const triggerErrorModal = (msg, title = 'Booking Error') => {
        setErrorModalTitle(title)
        setErrorModalMsg(msg)
        setErrorModalVisible(true)
    }

    // Modal state
    const [modalVisible, setModalVisible] = useState(false)
    const [modalMode, setModalMode] = useState('add') // 'add' or 'edit'
    const [selectedBooking, setSelectedBooking] = useState(null)

    // Form inputs
    const [formCustomerId, setFormCustomerId] = useState('')
    const [formProjectName, setFormProjectName] = useState('')
    const [formPlotId, setFormPlotId] = useState('')
    const [formTotalAmount, setFormTotalAmount] = useState('')
    const [formAdvanceAmount, setFormAdvanceAmount] = useState('')
    const [formAmenitiesCharges, setFormAmenitiesCharges] = useState('')
    const [formOtherCharges, setFormOtherCharges] = useState('')
    const [formStatus, setFormStatus] = useState('pending')
    const [saving, setSaving] = useState(false)

    // Automatically calculated Balance Amount
    const formBalanceAmount = Math.max(
        0,
        (parseFloat(formTotalAmount) || 0) +
        (parseFloat(formAmenitiesCharges) || 0) +
        (parseFloat(formOtherCharges) || 0) -
        (parseFloat(formAdvanceAmount) || 0)
    )

    // Delete modal
    const [deleteModalVisible, setDeleteModalVisible] = useState(false)
    const [bookingToDelete, setBookingToDelete] = useState(null)
    const [deleting, setDeleting] = useState(false)

    // Plots loading state for dynamic dropdowns
    const [plotsLoading, setPlotsLoading] = useState(false)
    const [projectPlots, setProjectPlots] = useState([]) // Plots for currently selected project in Form

    // Fetch initial data
    useEffect(() => {
        const loadAllData = async () => {
            setLoading(true)
            setError(null)
            try {
                // 1. Fetch bookings
                let bookingsList = []
                try {
                    const resBookings = await fetch(`${globalThis.apiBaseUrl}/bookings/`)
                    if (resBookings.ok) {
                        const bookingsData = await resBookings.json()
                        bookingsList = Array.isArray(bookingsData) ? bookingsData : (bookingsData.bookings || bookingsData.data || [])
                    } else {
                        const errText = await getResponseErrorMessage(resBookings, 'Failed to fetch bookings')
                        console.error('Bookings API error:', errText)
                    }
                } catch (e) {
                    console.error('Fetch bookings error:', e)
                }
                setBookings(bookingsList.map(normalizeBooking))

                // 2. Fetch projects
                let projectsData = []
                try {
                    const resProjects = await fetch(`${globalThis.apiBaseUrl}/projects/`)
                    if (resProjects.ok) {
                        const parsed = await resProjects.json()
                        projectsData = Array.isArray(parsed?.data) ? parsed.data : (Array.isArray(parsed) ? parsed : [])
                    }
                } catch (e) {
                    console.error('Fetch projects error:', e)
                }
                setProjects(projectsData)

                // 3. Fetch all plots
                let allPlots = []
                try {
                    const resAllPlots = await fetch(`${globalThis.apiBaseUrl}/projects/plots`)
                    if (resAllPlots.ok) {
                        const dataAllPlots = await resAllPlots.json()
                        allPlots = Array.isArray(dataAllPlots) ? dataAllPlots : (dataAllPlots.plots || dataAllPlots.data || [])
                    }
                } catch (e) {
                    console.error('Fetch all plots error:', e)
                }

                // Fallback: If flat plots API didn't return plots, query per project
                if (allPlots.length === 0 && projectsData.length > 0) {
                    for (const proj of projectsData) {
                        if (!proj || !proj.name) continue
                        try {
                            const resPlots = await fetch(`${globalThis.apiBaseUrl}/projects/plots?project_name=${encodeURIComponent(proj.name)}`)
                            if (resPlots.ok) {
                                const plotsList = await resPlots.json()
                                const arr = Array.isArray(plotsList) ? plotsList : (plotsList.plots || plotsList.data || [])
                                arr.forEach(p => {
                                    allPlots.push({
                                        ...p,
                                        projectName: proj.name,
                                        projectId: proj.id
                                    })
                                })
                            }
                        } catch (e) {
                            console.error('Error fetching plots for project ' + proj.name, e)
                        }
                    }
                }
                setPlots(allPlots)

                // 4. Fetch users/customers & clients for dropdown mapping
                const resolvedUsers = []
                try {
                    const [resCust, resClients] = await Promise.all([
                        fetch(`${globalThis.apiBaseUrl}/users/customers`).catch(() => null),
                        fetch(`${globalThis.apiBaseUrl}/users/clients`).catch(() => null)
                    ])

                    const parseList = async (res) => {
                        if (!res || !res.ok) return []
                        try {
                            const listData = await res.json()
                            let items = []
                            if (Array.isArray(listData)) items = listData
                            else if (listData && typeof listData === 'object') {
                                items = listData.users || listData.clients || listData.customers || listData.data || []
                            }
                            if (!Array.isArray(items) || items.length === 0) return []

                            if (typeof items[0] === 'string' || typeof items[0] === 'number') {
                                const detailed = await Promise.all(
                                    items.map(async (uId) => {
                                        try {
                                            const r = await fetch(`${globalThis.apiBaseUrl}/users/${uId}`)
                                            if (r.ok) return await r.json()
                                        } catch (e) {
                                            console.error(e)
                                        }
                                        return { id: uId, u_id: uId, name: String(uId) }
                                    })
                                )
                                return detailed.filter(Boolean)
                            }
                            return items
                        } catch (e) {
                            return []
                        }
                    }

                    if (resCust) {
                        const cList = await parseList(resCust)
                        cList.forEach(d => resolvedUsers.push(d))
                    }
                    if (resClients) {
                        const clList = await parseList(resClients)
                        clList.forEach(d => resolvedUsers.push(d))
                    }
                } catch (e) {
                    console.error('Error fetching users lists:', e)
                }

                const uniqueUsers = []
                const seenUids = new Set()
                resolvedUsers.forEach(u => {
                    if (!u) return
                    const uidStr = u.u_id || u.id
                    if (uidStr && !seenUids.has(String(uidStr))) {
                        seenUids.add(String(uidStr))
                        uniqueUsers.push({
                            id: u.id || uidStr,
                            u_id: String(uidStr),
                            name: `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.name || String(uidStr),
                            role: u.role || 'customer'
                        })
                    }
                })
                setUsersList(uniqueUsers)

                // 5. Fetch announcements
                try {
                    const resAnn = await fetch(`${globalThis.apiBaseUrl}/announcements/`)
                    if (resAnn.ok) {
                        const dataAnn = await resAnn.json()
                        setAnnouncements(Array.isArray(dataAnn) ? dataAnn : (dataAnn.announcements || dataAnn.data || []))
                    }
                } catch (e) {
                    console.error('Error loading announcements:', e)
                }

            } catch (err) {
                setError(extractErrorMessage(err))
            } finally {
                setLoading(false)
            }
        }

        loadAllData()
    }, [])

    const location = useLocation()

    useEffect(() => {
        if (loading) return

        const queryParams = new URLSearchParams(location.search)
        const preselectProject = queryParams.get('project_name')
        const preselectPlotId = queryParams.get('plot_id')

        if (preselectProject && preselectPlotId) {
            setModalMode('add')
            setFormProjectName(preselectProject)
            if (isCustomer) {
                setFormCustomerId(userUid)
            } else {
                setFormCustomerId('')
            }
            setFormTotalAmount('')
            setFormAdvanceAmount('')
            setFormAmenitiesCharges('')
            setFormOtherCharges('')
            setFormStatus('pending')

            const fetchProjPlots = async () => {
                setPlotsLoading(true)
                try {
                    const res = await fetch(`${globalThis.apiBaseUrl}/projects/plots?project_name=${encodeURIComponent(preselectProject)}`)
                    if (res.ok) {
                        const data = await res.json()
                        const plotsArr = Array.isArray(data) ? data : []
                        setProjectPlots(plotsArr)
                        const selPlot = plotsArr.find(p => String(p.id) === String(preselectPlotId) || String(p.plot_number) === String(preselectPlotId))
                        if (selPlot) {
                            const plotPrice = selPlot.price !== undefined ? selPlot.price : (selPlot.amount !== undefined ? selPlot.amount : (selPlot.total_price || ''))
                            if (plotPrice) setFormTotalAmount(String(plotPrice))
                        }
                    }
                } catch (e) {
                    console.error('Failed to load project plots in preselection:', e)
                } finally {
                    setPlotsLoading(false)
                    setFormPlotId(preselectPlotId)
                    setModalVisible(true)
                }
            }
            fetchProjPlots()
            navigate(location.pathname, { replace: true })
        }
    }, [loading, location.search])

    // Load plots for currently selected project in Form
    const handleProjectChange = async (projectName) => {
        setFormProjectName(projectName)
        setFormPlotId('')
        setFormTotalAmount('')
        setProjectPlots([])

        if (!projectName) return

        setPlotsLoading(true)
        try {
            const res = await fetch(`${globalThis.apiBaseUrl}/projects/plots?project_name=${encodeURIComponent(projectName)}`)
            if (res.ok) {
                const data = await res.json()
                const plotsList = Array.isArray(data) ? data : (data.plots || data.data || [])
                setProjectPlots(plotsList)
            }
        } catch (err) {
            console.error('Failed to fetch plots:', err)
        } finally {
            setPlotsLoading(false)
        }
    }

    // Handle plot selection and auto-populate total amount from plot price
    const handlePlotChange = async (plotId) => {
        setFormPlotId(plotId)
        if (!plotId) {
            setFormTotalAmount('')
            return
        }

        const selectedPlot = projectPlots.find(
            (p) => String(p.id) === String(plotId) || String(p.plot_number) === String(plotId)
        )

        let plotPrice = selectedPlot ? (
            selectedPlot.price !== undefined && selectedPlot.price !== null && selectedPlot.price !== ''
                ? selectedPlot.price
                : (selectedPlot.amount !== undefined && selectedPlot.amount !== null && selectedPlot.amount !== ''
                    ? selectedPlot.amount
                    : (selectedPlot.total_price || selectedPlot.total_amount || selectedPlot.cost || selectedPlot.rate || ''))
        ) : ''

        // Fallback if price is not on the in-memory plot object
        if (selectedPlot && (plotPrice === '' || plotPrice === undefined || plotPrice === null || parseFloat(plotPrice) === 0)) {
            try {
                const plotNum = selectedPlot.plot_number || plotId
                const projName = selectedPlot.project_name || formProjectName
                const res = await fetch(`${globalThis.apiBaseUrl}/projects/plots?project_name=${encodeURIComponent(projName)}`)
                if (res.ok) {
                    const data = await res.json()
                    const plotsList = Array.isArray(data) ? data : (data.plots || data.data || [])
                    const match = plotsList.find((p) => String(p.plot_number) === String(plotNum) || String(p.id) === String(plotId))
                    if (match) {
                        const pAmt = match.price !== undefined ? match.price : (match.amount !== undefined ? match.amount : (match.total_price || match.total_amount || ''))
                        if (pAmt) plotPrice = pAmt
                    }
                }
            } catch (err) {
                console.error('Error fetching plot price fallback:', err)
            }
        }

        if (plotPrice !== undefined && plotPrice !== null && plotPrice !== '') {
            setFormTotalAmount(String(plotPrice))
        }
    }

    // Helper: find project and plot names for a plot_id
    const resolvePlotDetails = (plotId) => {
        if (!plotId) return { projectName: formProjectName || 'Main Venture', plotNumber: '—' }
        const found = plots.find(p => p && (String(p.id) === String(plotId) || String(p.plot_number) === String(plotId)))
        if (found) {
            return {
                projectName: found.projectName || found.project_name || formProjectName || 'Main Venture',
                plotNumber: found.plot_number || found.id || plotId
            }
        }
        return {
            projectName: formProjectName || 'Main Venture',
            plotNumber: plotId || '—'
        }
    }

    // Helper: lookup customer name by ID/u_id
    const resolveCustomerName = (customerId) => {
        if (!customerId) return '—'
        const found = usersList.find(
            u => u && (String(u.u_id || '').toLowerCase() === String(customerId).toLowerCase() ||
                String(u.id || '').toLowerCase() === String(customerId).toLowerCase())
        )
        return found ? found.name : customerId || '—'
    }

    // Find the logged-in client's integer ID if they are a customer
    const loggedInUserObj = usersList.find(u => u && String(u.u_id || u.id || '').toLowerCase() === String(userUid || '').toLowerCase())
    const loggedInIntegerId = loggedInUserObj ? loggedInUserObj.id : null

    // Adapt bookings list for customers
    const displayBookings = bookings.filter(b => {
        if (!b) return false
        if (isCustomer) {
            return (loggedInIntegerId && String(b.customer_id) === String(loggedInIntegerId)) ||
                String(b.customer_id || '').toLowerCase() === String(userUid || '').toLowerCase()
        }
        return true
    })

    // Find announcements relevant to a booking
    const getAnnouncementsForBooking = (booking) => {
        const details = resolvePlotDetails(booking.plot_id)
        return announcements.filter(ann => {
            const isPublished = ann.published || ann.status === 'published'
            if (!isPublished) return false

            const isSpecificUser = ann.visibility === 'specific_client' &&
                (String(ann.selected_client).toLowerCase() === String(booking.customer_id).toLowerCase() ||
                    (loggedInIntegerId && String(ann.selected_client).toLowerCase() === String(loggedInIntegerId).toLowerCase()))
            const isGeneralOrClients = ann.visibility === 'both' || ann.visibility === 'clients'

            const matchProject = String(ann.project).toLowerCase() === String(details.projectName).toLowerCase()
            const matchPlot = String(ann.plot_number).toLowerCase() === String(details.plotNumber).toLowerCase()

            // Matches if either specific to this client, or matches project and plot number
            return (isSpecificUser) || (isGeneralOrClients && matchProject && matchPlot)
        })
    }

    const openAddModal = () => {
        setModalMode('add')
        setFormCustomerId('')
        setFormProjectName('')
        setFormPlotId('')
        setFormTotalAmount('')
        setFormAdvanceAmount('')
        setFormAmenitiesCharges('')
        setFormOtherCharges('')
        setFormStatus('pending')
        setProjectPlots([])
        setModalVisible(true)
    }

    const openEditModal = (booking) => {
        setModalMode('edit')
        setSelectedBooking(booking)
        setFormCustomerId(booking.customer_id !== undefined && booking.customer_id !== null ? String(booking.customer_id) : '')

        // Find project name for plot_id
        const details = resolvePlotDetails(booking.plot_id)
        setFormProjectName(details.projectName || '')

        // Trigger load plots for that project
        if (details.projectName) {
            setPlotsLoading(true)
            fetch(`${globalThis.apiBaseUrl}/projects/plots?project_name=${encodeURIComponent(details.projectName)}`)
                .then(r => r.json())
                .then(data => {
                    const plotsList = Array.isArray(data) ? data : []
                    setProjectPlots(plotsList)
                    setFormPlotId(booking.plot_id || '')
                    if (!booking.total_amount && !booking.price) {
                        const sel = plotsList.find(p => String(p.id) === String(booking.plot_id) || String(p.plot_number) === String(booking.plot_id))
                        if (sel) {
                            const pAmt = sel.price !== undefined ? sel.price : (sel.amount !== undefined ? sel.amount : 0)
                            if (pAmt) setFormTotalAmount(String(pAmt))
                        }
                    }
                })
                .catch(e => console.error(e))
                .finally(() => setPlotsLoading(false))
        }

        setFormTotalAmount(booking.total_amount !== undefined && booking.total_amount !== '' ? String(booking.total_amount) : (booking.price ? String(booking.price) : ''))
        setFormAdvanceAmount(booking.advance_amount !== undefined && booking.advance_amount !== '' ? String(booking.advance_amount) : (booking.amount ? String(booking.amount) : ''))
        setFormAmenitiesCharges(booking.amenities_charges !== undefined && booking.amenities_charges !== '' ? String(booking.amenities_charges) : '')
        setFormOtherCharges(booking.other_charges !== undefined && booking.other_charges !== '' ? String(booking.other_charges) : '')
        setFormStatus(booking.status || 'pending')
        setModalVisible(true)
    }

    const handleSave = async () => {
        if (!formCustomerId || !formPlotId || !formTotalAmount) {
            triggerErrorModal('Please fill in all required fields (Customer, Project, Plot, Total Amount).', 'Validation Error')
            return
        }

        setSaving(true)
        const total = parseFloat(formTotalAmount) || 0
        const advance = parseFloat(formAdvanceAmount) || 0
        const amenities = parseFloat(formAmenitiesCharges) || 0
        const other = parseFloat(formOtherCharges) || 0
        const balance = Math.max(0, total + amenities + other - advance)

        const payload = {
            customer_id: formCustomerId,
            plot_number: parseInt(formPlotId, 10) || formPlotId,
            total_amount: total,
            advance_amount: advance,
            amenities_charges: amenities,
            other_charges: other,
            balance_amount: balance,
            amount: advance || total,
            status: formStatus,
            project_name: formProjectName
        }

        try {
            if (modalMode === 'add') {
                const res = await fetch(`${globalThis.apiBaseUrl}/bookings/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                })
                if (res.ok) {
                    const newBook = await res.json()
                    setBookings(prev => [...prev, normalizeBooking(newBook)])
                    setMessage({ visible: true, color: 'success', text: 'Booking created successfully.' })
                    setModalVisible(false)
                } else {
                    const errDetail = await getResponseErrorMessage(res, 'Failed to create booking.')
                    triggerErrorModal(errDetail, 'Create Booking Failed')
                }
            } else {
                // Edit
                const res = await fetch(`${globalThis.apiBaseUrl}/bookings/${selectedBooking.id}/`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                })
                if (res.ok) {
                    const updatedBook = await res.json()
                    setBookings(prev => prev.map(b => b.id === selectedBooking.id ? normalizeBooking(updatedBook) : b))
                    setMessage({ visible: true, color: 'success', text: 'Booking updated successfully.' })
                    setModalVisible(false)
                } else {
                    const errDetail = await getResponseErrorMessage(res, 'Failed to update booking.')
                    triggerErrorModal(errDetail, 'Update Booking Failed')
                }
            }
        } catch (err) {
            triggerErrorModal(extractErrorMessage(err), 'Booking Network / Request Error')
        } finally {
            setSaving(false)
        }
    }

    const openDeleteModal = (booking) => {
        setBookingToDelete(booking)
        setDeleteModalVisible(true)
    }

    const handleDelete = async () => {
        if (!bookingToDelete) return
        setDeleting(true)

        try {
            const res = await fetch(`${globalThis.apiBaseUrl}/bookings/${bookingToDelete.id}/`, {
                method: 'DELETE'
            })
            if (res.ok) {
                setBookings(prev => prev.filter(b => b.id !== bookingToDelete.id))
                setMessage({ visible: true, color: 'success', text: 'Booking deleted successfully.' })
                setDeleteModalVisible(false)
            } else {
                const errDetail = await getResponseErrorMessage(res, 'Failed to delete booking.')
                triggerErrorModal(errDetail, 'Delete Booking Failed')
            }
        } catch (err) {
            triggerErrorModal(extractErrorMessage(err), 'Delete Booking Error')
        } finally {
            setDeleting(false)
            setBookingToDelete(null)
        }
    }

    return (
        <CContainer className="mt-4">
            {message.visible && (
                <CAlert color={message.color} dismissible onClose={() => setMessage({ ...message, visible: false })}>
                    {message.text}
                </CAlert>
            )}

            <CCard className="shadow-lg border-0 rounded-4 mb-4">
                <CCardHeader className="text-primary text-center fw-bold fs-3 py-3">
                    {isCustomer ? 'My Bookings & Installments' : 'Plot Bookings Management'}
                </CCardHeader>

                <CCardBody className="p-4">
                    {loading && (
                        <div className="text-center py-5">
                            <CSpinner color="primary" /> <span className="ms-2">Loading bookings data...</span>
                        </div>
                    )}

                    {error && (
                        <div className="text-danger text-center py-3">
                            <strong>Error:</strong> {error}
                        </div>
                    )}

                    {!loading && !error && (
                        <>
                            {isCustomer ? (
                                // CLIENT CUSTOMER PERSPECTIVE VIEW
                                <>
                                    {displayBookings.length > 0 ? (
                                        <CRow className="g-4">
                                            {displayBookings.map((booking, idx) => {
                                                const details = resolvePlotDetails(booking.plot_id)
                                                const relatedAnns = getAnnouncementsForBooking(booking)

                                                return (
                                                    <CCol xs={12} key={booking.id || idx}>
                                                        <CCard className="border shadow-sm rounded-3">
                                                            <CCardHeader className="bg-light fw-bold d-flex justify-content-between align-items-center">
                                                                <span>Booking ID: #{booking.id}</span>
                                                                <CBadge color={booking.status === 'confirmed' ? 'success' : booking.status === 'pending' ? 'warning' : 'danger'}>
                                                                    {String(booking.status || 'pending').toUpperCase()}
                                                                </CBadge>
                                                            </CCardHeader>
                                                            <CCardBody>
                                                                <CRow className="mb-3 g-2">
                                                                    <CCol md={3} sm={6}>
                                                                        <div className="text-muted small">Project Venture</div>
                                                                        <h5 className="text-dark fw-semibold">{details.projectName}</h5>
                                                                    </CCol>
                                                                    <CCol md={3} sm={6}>
                                                                        <div className="text-muted small">Plot Number</div>
                                                                        <h5 className="text-dark fw-semibold">Plot {details.plotNumber}</h5>
                                                                    </CCol>
                                                                    <CCol md={3} sm={6}>
                                                                        <div className="text-muted small">Total Amount</div>
                                                                        <h6 className="text-dark fw-bold">₹ {parseFloat(booking.total_amount || booking.amount || 0).toLocaleString('en-IN')}</h6>
                                                                    </CCol>
                                                                    <CCol md={3} sm={6}>
                                                                        <div className="text-muted small">Advance Paid</div>
                                                                        <h6 className="text-success fw-bold">₹ {parseFloat(booking.advance_amount || 0).toLocaleString('en-IN')}</h6>
                                                                    </CCol>
                                                                    <CCol md={3} sm={6} className="mt-2">
                                                                        <div className="text-muted small">Amenities Charges</div>
                                                                        <span className="fw-semibold">₹ {parseFloat(booking.amenities_charges || 0).toLocaleString('en-IN')}</span>
                                                                    </CCol>
                                                                    <CCol md={3} sm={6} className="mt-2">
                                                                        <div className="text-muted small">Other Charges</div>
                                                                        <span className="fw-semibold">₹ {parseFloat(booking.other_charges || 0).toLocaleString('en-IN')}</span>
                                                                    </CCol>
                                                                    <CCol md={6} sm={12} className="mt-2">
                                                                        <div className="text-muted small">Balance Amount Due</div>
                                                                        <h5 className={booking.balance_amount > 0 ? "text-danger fw-bold" : "text-success fw-bold"}>
                                                                            ₹ {parseFloat(booking.balance_amount || 0).toLocaleString('en-IN')}
                                                                        </h5>
                                                                    </CCol>
                                                                </CRow>

                                                                <hr />

                                                                <div className="mt-3">
                                                                    <h6 className="text-info fw-bold mb-3">Related Payment Reminders & Venture Updates</h6>
                                                                    {relatedAnns.length > 0 ? (
                                                                        <CRow className="g-3">
                                                                            {relatedAnns.map((ann, annIdx) => (
                                                                                <CCol md={6} key={ann.id || annIdx}>
                                                                                    <CCard className="border-0 bg-light p-3 rounded-3 shadow-sm h-100">
                                                                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                                                                            <span className="badge bg-primary text-uppercase">{ann.reminder_priority || 'payment'}</span>
                                                                                            <small className="text-muted">{ann.payment_due_date || ann.start_date || 'General'}</small>
                                                                                        </div>
                                                                                        <h6 className="fw-bold mb-1">{ann.title}</h6>
                                                                                        <p className="text-secondary small mb-2">{ann.description || ann.offer_description}</p>
                                                                                        {ann.payment_amount && (
                                                                                            <div className="fw-semibold text-danger small">
                                                                                                Due Amount: ₹ {parseFloat(ann.payment_amount).toLocaleString('en-IN')}
                                                                                            </div>
                                                                                        )}
                                                                                    </CCard>
                                                                                </CCol>
                                                                            ))}
                                                                        </CRow>
                                                                    ) : (
                                                                        <div className="text-muted small py-2">No active announcements or payment reminders for this booking.</div>
                                                                    )}
                                                                </div>
                                                            </CCardBody>
                                                        </CCard>
                                                    </CCol>
                                                )
                                            })}
                                        </CRow>
                                    ) : (
                                        <div className="text-center py-5 text-muted">
                                            <h4>No active bookings found under your Customer ID.</h4>
                                            <p className="mb-0">Please contact your relationship manager or agent to book a plot.</p>
                                        </div>
                                    )}
                                </>
                            ) : (
                                // ADMIN & AGENT VIEW
                                <>
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <div className="text-muted small">Manage all active and pending plot bookings.</div>
                                        <CButton color="primary" onClick={openAddModal}>
                                            + Add New Booking
                                        </CButton>
                                    </div>

                                    {displayBookings.length > 0 ? (
                                        <CTable hover responsive bordered align="middle" className="mb-0 text-center">
                                            <CTableHead color="light">
                                                <CTableRow>
                                                    <CTableHeaderCell>Booking ID</CTableHeaderCell>
                                                    <CTableHeaderCell>Customer Name</CTableHeaderCell>
                                                    <CTableHeaderCell>Customer ID</CTableHeaderCell>
                                                    <CTableHeaderCell>Project / Venture</CTableHeaderCell>
                                                    <CTableHeaderCell>Plot ID</CTableHeaderCell>
                                                    <CTableHeaderCell>Total Amount</CTableHeaderCell>
                                                    <CTableHeaderCell>Advance Paid</CTableHeaderCell>
                                                    <CTableHeaderCell>Balance Due</CTableHeaderCell>
                                                    <CTableHeaderCell>Status</CTableHeaderCell>
                                                    <CTableHeaderCell>Actions</CTableHeaderCell>
                                                </CTableRow>
                                            </CTableHead>
                                            <CTableBody>
                                                {displayBookings.map((booking, idx) => {
                                                    const details = resolvePlotDetails(booking.plot_id)
                                                    return (
                                                        <CTableRow key={booking.id || idx}>
                                                            <CTableDataCell className="fw-semibold">#{booking.id}</CTableDataCell>
                                                            <CTableDataCell>{resolveCustomerName(booking.customer_id)}</CTableDataCell>
                                                            <CTableDataCell>{booking.customer_id || '—'}</CTableDataCell>
                                                            <CTableDataCell>{details.projectName}</CTableDataCell>
                                                            <CTableDataCell>Plot {details.plotNumber}</CTableDataCell>
                                                            <CTableDataCell className="fw-bold text-dark">
                                                                ₹ {parseFloat(booking.total_amount || 0).toLocaleString('en-IN')}
                                                            </CTableDataCell>
                                                            <CTableDataCell className="text-success fw-bold">
                                                                ₹ {parseFloat(booking.advance_amount || 0).toLocaleString('en-IN')}
                                                            </CTableDataCell>
                                                            <CTableDataCell className={booking.balance_amount > 0 ? "text-danger fw-bold" : "text-success fw-bold"}>
                                                                ₹ {parseFloat(booking.balance_amount || 0).toLocaleString('en-IN')}
                                                            </CTableDataCell>
                                                            <CTableDataCell>
                                                                <CBadge color={booking.status === 'confirmed' ? 'success' : booking.status === 'pending' ? 'warning' : 'danger'}>
                                                                    {booking.status || 'pending'}
                                                                </CBadge>
                                                            </CTableDataCell>
                                                            <CTableDataCell>
                                                                <div className="d-flex gap-2 justify-content-center">
                                                                    <CButton color="info" size="sm" variant="outline" onClick={() => openEditModal(booking)}>
                                                                        Edit
                                                                    </CButton>
                                                                    {isAdmin && (
                                                                        <CButton color="danger" size="sm" variant="outline" onClick={() => openDeleteModal(booking)}>
                                                                            Delete
                                                                        </CButton>
                                                                    )}
                                                                </div>
                                                            </CTableDataCell>
                                                        </CTableRow>
                                                    )
                                                })}
                                            </CTableBody>
                                        </CTable>
                                    ) : (
                                        <div className="text-center py-5 text-muted">No plot bookings found.</div>
                                    )}
                                </>
                            )}
                        </>
                    )}
                </CCardBody>
            </CCard>

            {/* Create / Edit Booking Modal */}
            <CModal visible={modalVisible} onClose={() => setModalVisible(false)} size="lg" backdrop="static">
                <CModalHeader>
                    <CModalTitle>{modalMode === 'add' ? 'Create New Plot Booking' : 'Edit Booking Details'}</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CRow className="g-3">
                        <CCol md={6}>
                            <CFormLabel>Customer / Client *</CFormLabel>
                            <CFormSelect value={formCustomerId} onChange={(e) => setFormCustomerId(e.target.value)}>
                                <option value="">Select Customer / Client</option>
                                {usersList.map((c) => (
                                    <option key={c.u_id} value={c.u_id}>
                                        {c.name} ({c.u_id})
                                    </option>
                                ))}
                            </CFormSelect>
                        </CCol>

                        <CCol md={6}>
                            <CFormLabel>Venture Project *</CFormLabel>
                            <CFormSelect value={formProjectName} onChange={(e) => handleProjectChange(e.target.value)}>
                                <option value="">Select Project</option>
                                {projects.map((p) => (
                                    <option key={p.id} value={p.name}>
                                        {p.name}
                                    </option>
                                ))}
                            </CFormSelect>
                        </CCol>

                        <CCol md={6}>
                            <CFormLabel>Plot *</CFormLabel>
                            <CFormSelect value={formPlotId} onChange={(e) => handlePlotChange(e.target.value)} disabled={!formProjectName || plotsLoading}>
                                <option value="">{plotsLoading ? 'Loading plots...' : 'Select Plot'}</option>
                                {projectPlots.map((plot, idx) => {
                                    const plotVal = (plot.id !== undefined && plot.id !== null && plot.id !== '') ? String(plot.id) : String(plot.plot_number || '')
                                    const priceVal = plot.price !== undefined && plot.price !== null && plot.price !== ''
                                        ? plot.price
                                        : (plot.amount !== undefined && plot.amount !== null && plot.amount !== ''
                                            ? plot.amount
                                            : (plot.total_price || plot.total_amount || 0))
                                    return (
                                        <option key={plotVal || idx} value={plotVal}>
                                            Plot {plot.plot_number || plotVal} ({plot.status || 'available'}){priceVal ? ` - ₹ ${parseFloat(priceVal).toLocaleString('en-IN')}` : ''}
                                        </option>
                                    )
                                })}
                            </CFormSelect>
                        </CCol>

                        <CCol md={6}>
                            <CFormLabel>Total Amount (INR) *</CFormLabel>
                            <CFormInput type="number" value={formTotalAmount} onChange={(e) => setFormTotalAmount(e.target.value)} placeholder="Auto-filled from plot price" />
                        </CCol>

                        <CCol md={6}>
                            <CFormLabel>Advance Amount (INR)</CFormLabel>
                            <CFormInput type="number" value={formAdvanceAmount} onChange={(e) => setFormAdvanceAmount(e.target.value)} placeholder="Enter advance amount" />
                        </CCol>

                        <CCol md={6}>
                            <CFormLabel>Amenities Charges (INR)</CFormLabel>
                            <CFormInput type="number" value={formAmenitiesCharges} onChange={(e) => setFormAmenitiesCharges(e.target.value)} placeholder="Enter amenities charges" />
                        </CCol>

                        <CCol md={6}>
                            <CFormLabel>Other Charges (INR)</CFormLabel>
                            <CFormInput type="number" value={formOtherCharges} onChange={(e) => setFormOtherCharges(e.target.value)} placeholder="Enter other charges" />
                        </CCol>

                        <CCol md={6}>
                            <CFormLabel>Balance Amount (INR) <small className="text-muted">(Auto-calculated)</small></CFormLabel>
                            <CFormInput
                                type="number"
                                value={formBalanceAmount}
                                readOnly
                                style={{ backgroundColor: '#eef2f7', fontWeight: 'bold', color: '#00416a' }}
                            />
                        </CCol>

                        <CCol md={12}>
                            <CFormLabel>Booking Status</CFormLabel>
                            <CFormSelect value={formStatus} onChange={(e) => setFormStatus(e.target.value)}>
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="cancelled">Cancelled</option>
                            </CFormSelect>
                        </CCol>
                    </CRow>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" variant="ghost" onClick={() => setModalVisible(false)}>Cancel</CButton>
                    <CButton color="primary" onClick={handleSave} disabled={saving}>
                        {saving ? 'Saving...' : 'Save Booking'}
                    </CButton>
                </CModalFooter>
            </CModal>

            {/* Delete Booking Modal */}
            <CModal visible={deleteModalVisible} onClose={() => setDeleteModalVisible(false)} backdrop="static">
                <CModalHeader>
                    <CModalTitle>Delete Plot Booking</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    Are you sure you want to delete Booking <strong>#{bookingToDelete?.id}</strong>? This action is irreversible.
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" variant="ghost" onClick={() => setDeleteModalVisible(false)}>Cancel</CButton>
                    <CButton color="danger" onClick={handleDelete} disabled={deleting}>
                        {deleting ? 'Deleting...' : 'Delete Booking'}
                    </CButton>
                </CModalFooter>
            </CModal>

            {/* Designated Error Modal */}
            <ErrorModal
                visible={errorModalVisible}
                title={errorModalTitle}
                errorMessage={errorModalMsg}
                onClose={() => setErrorModalVisible(false)}
            />
        </CContainer>
    )
}
