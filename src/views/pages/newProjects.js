// src/views/pages/newProjects.js
import React, { useState, useEffect, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import {
    CContainer,
    CCard,
    CCardBody,
    CCardHeader,
    CRow,
    CCol,
    CCardImage,
    CCardTitle,
    CCardText,
    CFormSelect,
    CFormInput,
    CFormLabel,
    CFormFeedback,
    CFormTextarea,
    CButton,
    CInputGroup,
    CSpinner,
    CAlert,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CBadge,
} from "@coreui/react"
import { cilLocationPin, cilFilter, cilSortAlphaDown, cilSortNumericDown } from "@coreui/icons"
import CIcon from "@coreui/icons-react"

import { sanitizeNumeric, sanitizeText, sanitizeRestrictedText } from "../../utils/validation"
import { extractErrorMessage, getResponseErrorMessage } from "../../utils/errorUtils"

import image1 from './../../assets/images/projects/images.jpeg'

// Helper function to determine progress bar color based on availability
const getAvailabilityColor = (percentage) => {
    if (percentage > 60) return "#4CAF50" // Green
    if (percentage > 20) return "#FFC107" // Yellow
    return "#F44336" // Red
}

// Sub-component to fetch and render each plot card in the modal on-demand
const PlotCard = ({ plot, onViewDetails, canManagePlots, onEditPlot }) => {
    const navigate = useNavigate()
    const [plotImage, setPlotImage] = useState(null)
    const [loadingImg, setLoadingImg] = useState(true)

    useEffect(() => {
        let isMounted = true
        const fetchPlotImage = async () => {
            try {
                const res = await fetch(`${globalThis.apiBaseUrl}/plot/images?plot_number=${encodeURIComponent(plot.plot_number)}`)
                if (res.ok) {
                    const data = await res.json()
                    let url = null
                    if (Array.isArray(data) && data.length > 0) {
                        const first = data[0]
                        url = typeof first === 'string' ? first : first.image_url || first.url || first.image || first.image_path
                    } else if (data && typeof data === 'object') {
                        url = data.image_url || data.url || data.image || data.image_path
                    }
                    if (isMounted && url) setPlotImage(url)
                }
            } catch (e) {
                console.error("Failed to fetch plot image", e)
            } finally {
                if (isMounted) setLoadingImg(false)
            }
        }
        fetchPlotImage()
        return () => {
            isMounted = false
        }
    }, [plot.plot_number])

    const statusColor =
        plot.status === "available"
            ? "success"
            : plot.status === "sold"
            ? "danger"
            : plot.status === "reserved"
            ? "warning"
            : "secondary"

    return (
        <CCard
            className="h-100 shadow-sm border-0 d-flex flex-column justify-content-between"
            style={{ borderRadius: "12px", overflow: "hidden", border: "1px solid #e3e6f0", cursor: "pointer", transition: "transform 0.2s" }}
            onClick={() => onViewDetails && onViewDetails(plot)}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)' }}
        >
            <div>
                <div style={{ height: "140px", background: "#f8f9fc", display: "flex", alignItems: "center", justifycontent: "center", position: "relative" }}>
                    {loadingImg ? (
                        <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                            <CSpinner size="sm" color="primary" />
                        </div>
                    ) : plotImage ? (
                        <img src={plotImage} alt={`Plot ${plot.plot_number}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                        <div className="w-100 h-100 d-flex align-items-center justify-content-center" style={{ fontSize: "2.5rem" }}>🏡</div>
                    )}
                    <CBadge color={statusColor} style={{ position: "absolute", top: "10px", right: "10px", fontSize: "0.75rem", padding: "5px 8px" }}>
                        {plot.status}
                    </CBadge>
                </div>
                <CCardBody className="p-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                        <h6 className="fw-bold mb-0" style={{ color: "#4e73df" }}>Plot No: {plot.plot_number}</h6>
                        {canManagePlots && (
                            <CButton
                                color="warning"
                                size="sm"
                                className="text-white px-2 py-0"
                                style={{ borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold', zIndex: 10 }}
                                onClick={(e) => {
                                    e.stopPropagation() // Prevent opening detail modal
                                    onEditPlot && onEditPlot(plot)
                                }}
                            >
                                Edit
                            </CButton>
                        )}
                    </div>
                    <p className="text-muted mb-1" style={{ fontSize: "0.85rem" }}>Size: {plot.size} sq. ft</p>
                    <p className="fw-semibold text-dark mb-0" style={{ fontSize: "0.95rem" }}>
                        Price: {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(plot.price)}
                    </p>
                </CCardBody>
            </div>
            {plot.status === "available" && (
                <div className="px-3 pb-3">
                    <CButton
                        color="primary"
                        size="sm"
                        className="w-100"
                        style={{ borderRadius: "8px", fontWeight: "600" }}
                        onClick={(e) => {
                            e.stopPropagation()
                            navigate(`/GetBookings?project_name=${encodeURIComponent(plot.project_name)}&plot_id=${encodeURIComponent(plot.id || plot.plot_number)}`)
                        }}
                    >
                        Book Plot
                    </CButton>
                </div>
            )}
        </CCard>
    )
}

export default function AvailableProjects() {
    const [projects, setProjects] = useState([])
    const [allPlots, setAllPlots] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [hoveredCardId, setHoveredCardId] = useState(null)
    const [filterLocation, setFilterLocation] = useState("")
    const [sortBy, setSortBy] = useState(null) // 'name' or 'availability'
    const [selectedProject, setSelectedProject] = useState(null) // Project chosen for detail modal

    // Add Plot form states
    const [addPlotModalVisible, setAddPlotModalVisible] = useState(false)
    const [formPlotNumber, setFormPlotNumber] = useState("")
    const [formSize, setFormSize] = useState("")
    const [formPrice, setFormPrice] = useState("")
    const [formStatus, setFormStatus] = useState("available")
    const [addingPlot, setAddingPlot] = useState(false)
    const [addPlotError, setAddPlotError] = useState(null)

    // Add Project form states
    const [addProjectModalVisible, setAddProjectModalVisible] = useState(false)
    const [projectForm, setProjectForm] = useState({
        name: '',
        description: '',
        location: '',
        start_date: '',
        end_date: '',
        status: '',
        total_area: '',
    })
    const [projectErrors, setProjectErrors] = useState({})
    const [addingProject, setAddingProject] = useState(false)
    const [addProjectError, setAddProjectError] = useState(null)

    // Initial Plot Details during Project Creation
    const [includeInitialPlot, setIncludeInitialPlot] = useState(false)
    const [projectPlotForm, setProjectPlotForm] = useState({
        plot_number: '',
        size: '',
        price: '',
        status: 'available'
    })

    // Plot Details & Booking Details states
    const [detailsPlot, setDetailsPlot] = useState(null)
    const [bookingDetails, setBookingDetails] = useState(null)
    const [bookingLoading, setBookingLoading] = useState(false)
    const [customerDetails, setCustomerDetails] = useState(null)
    const [plotDetailsModalVisible, setPlotDetailsModalVisible] = useState(false)

    // Edit Project form states
    const [editProjectModalVisible, setEditProjectModalVisible] = useState(false)
    const [selectedProjectForEdit, setSelectedProjectForEdit] = useState(null)
    const [editProjectForm, setEditProjectForm] = useState({
        name: '',
        description: '',
        location: '',
        developer: '',
        start_date: '',
        end_date: '',
        status: '',
        total_area: '',
    })
    const [editProjectErrors, setEditProjectErrors] = useState({})
    const [savingProject, setSavingProject] = useState(false)
    const [editProjectError, setEditProjectError] = useState(null)

    // Edit Plot form states
    const [editPlotModalVisible, setEditPlotModalVisible] = useState(false)
    const [selectedPlotForEdit, setSelectedPlotForEdit] = useState(null)
    const [editPlotForm, setEditPlotForm] = useState({
        plot_number: '',
        size: '',
        price: '',
        status: 'available',
        project_name: ''
    })
    const [editingPlot, setEditingPlot] = useState(false)
    const [editPlotError, setEditPlotError] = useState(null)

    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const userRole = user?.role?.toLowerCase()
    const canManagePlots = userRole === 'admin' || userRole === 'agent'
    const canManageProjects = userRole === 'admin'

    const fetchData = async () => {
        try {
            setLoading(true)
            setError(null)

            // 1. Fetch projects
            const projectsRes = await fetch(`${globalThis.apiBaseUrl}/projects/`)
            if (!projectsRes.ok) throw new Error("Failed to fetch projects list from server")
            const projectsJson = await projectsRes.json()
            const rawProjects = Array.isArray(projectsJson.data) ? projectsJson.data : []

            // 2. Fetch plots
            const plotsRes = await fetch(`${globalThis.apiBaseUrl}/projects/plots`)
            if (!plotsRes.ok) throw new Error("Failed to fetch plots list from server")
            const plotsJson = await plotsRes.json()
            const rawPlots = Array.isArray(plotsJson) ? plotsJson : plotsJson.plots || []
            setAllPlots(rawPlots)

            // 3. Compile projects with images & plot counts
            const compiled = await Promise.all(
                rawProjects.map(async (proj) => {
                    const matchedPlots = rawPlots.filter(
                        (pl) => pl.project_name?.toLowerCase() === proj.name?.toLowerCase()
                    )
                    const totalPlots = matchedPlots.length
                    const availablePlots = matchedPlots.filter(
                        (pl) => pl.status?.toLowerCase() === "available"
                    ).length

                    // Fetch project image
                    let imgUrl = image1
                    try {
                        const imgRes = await fetch(`${globalThis.apiBaseUrl}/project/images?project_id=${proj.id}`)
                        if (imgRes.ok) {
                            const imgData = await imgRes.json()
                            if (Array.isArray(imgData) && imgData.length > 0) {
                                const first = imgData[0]
                                imgUrl = typeof first === "string" ? first : first.image_url || first.url || first.image || first.image_path || image1
                            } else if (imgData && typeof imgData === "object") {
                                imgUrl = imgData.image_url || imgData.url || imgData.image || imgData.image_path || image1
                            }
                        }
                    } catch (e) {
                        console.error(`Error fetching project image for ${proj.id}:`, e)
                    }

                    return {
                        id: proj.id,
                        image: imgUrl,
                        title: proj.name,
                        location: proj.location || "Unknown",
                        total: totalPlots,
                        available: availablePlots,
                        description: proj.description || "",
                        developer: proj.developer || "",
                        start_date: proj.start_date || "",
                        end_date: proj.end_date || "",
                        status: proj.status || "",
                        total_area: proj.total_area || "",
                        rawProject: proj
                    }
                })
            )

            setProjects(compiled)
        } catch (err) {
            console.error(err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const validateProjectField = (name, value, currentFormState = projectForm) => {
        const v = String(value || '').trim()
        if (name === 'name' && !v) return 'Project Name is required'
        if (name === 'location' && !v) return 'Location is required'
        
        if (name === 'description') {
            if (!v) return 'Description is required'
            if (v.length < 10) return 'Description must be at least 10 characters'
            if (v.length > 500) return 'Description cannot exceed 500 characters'
            if (/[^A-Za-z0-9 .,\-()\/]/.test(v)) {
                return 'Description contains invalid characters. Only letters, numbers, spaces, and . , - ( ) / are allowed.'
            }
        }
        
        if (name === 'total_area') {
            if (!v) return 'Total Area is required'
            if (Number(v) <= 0) return 'Total Area must be greater than 0'
        }
        
        if (name === 'start_date') {
            if (!v) return 'Start Date is required'
            const tenYearsAgo = new Date()
            tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 10)
            tenYearsAgo.setHours(0, 0, 0, 0)
            const selectedStart = new Date(v)
            if (selectedStart < tenYearsAgo) {
                return 'Start Date cannot be older than 10 years'
            }
            if (currentFormState.end_date && new Date(currentFormState.end_date) <= selectedStart) {
                return 'Start Date must be before the End Date'
            }
        }
        
        if (name === 'end_date') {
            if (!v) return 'End Date is required'
            const selectedEnd = new Date(v)
            if (currentFormState.start_date) {
                const selectedStart = new Date(currentFormState.start_date)
                if (selectedEnd <= selectedStart) {
                    return 'End Date must be after the Start Date'
                }
            } else {
                const tenYearsAgo = new Date()
                tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 10)
                tenYearsAgo.setHours(0, 0, 0, 0)
                if (selectedEnd < tenYearsAgo) {
                    return 'End Date cannot be older than 10 years'
                }
            }
        }
        
        if (name === 'status' && !v) return 'Status is required'
        
        return ''
    }

    const handleProjectChange = (e) => {
        const { name, value } = e.target
        let nextValue = value
        if (name === 'total_area') {
            nextValue = sanitizeNumeric(value, 10)
        } else if (['name', 'location'].includes(name)) {
            nextValue = sanitizeRestrictedText(value, 120)
        } else if (name === 'description') {
            nextValue = value.replace(/[^A-Za-z0-9 .,\-()\/]/g, '').slice(0, 500)
        } else {
            nextValue = sanitizeText(value, 120)
        }

        setProjectForm((prev) => {
            const updatedForm = { ...prev, [name]: nextValue }
            
            setProjectErrors((prevErrors) => {
                const newErrors = { ...prevErrors }
                newErrors[name] = validateProjectField(name, nextValue, updatedForm)
                
                if (name === 'start_date' && updatedForm.end_date) {
                    newErrors.end_date = validateProjectField('end_date', updatedForm.end_date, updatedForm)
                }
                if (name === 'end_date' && updatedForm.start_date) {
                    newErrors.start_date = validateProjectField('start_date', updatedForm.start_date, updatedForm)
                }
                
                return newErrors
            })
            
            return updatedForm
        })
    }

    const handleProjectSubmit = async (e) => {
        e.preventDefault()
        const nextErrors = {
            name: validateProjectField('name', projectForm.name),
            description: validateProjectField('description', projectForm.description),
            location: validateProjectField('location', projectForm.location),
            start_date: validateProjectField('start_date', projectForm.start_date),
            end_date: validateProjectField('end_date', projectForm.end_date),
            status: validateProjectField('status', projectForm.status),
            total_area: validateProjectField('total_area', projectForm.total_area),
        }
        setProjectErrors(nextErrors)
        if (Object.values(nextErrors).some(Boolean)) return

        if (includeInitialPlot) {
            if (!projectPlotForm.plot_number || !projectPlotForm.size || !projectPlotForm.price) {
                setAddProjectError("Please fill in all initial plot fields.")
                return
            }
        }

        setAddingProject(true)
        setAddProjectError(null)

        const payload = {
            ...projectForm,
            status: projectForm.status.toLowerCase(),
            total_area: Number(projectForm.total_area),
        }

        try {
            const apiUrl = `${globalThis.apiBaseUrl}/projects/`
            const res = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            if (!res.ok) {
                const errorMsg = await getResponseErrorMessage(res, 'Failed to add project.')
                setAddProjectError(errorMsg)
                return
            }

            // Optional: add initial plot if switch is on
            if (includeInitialPlot) {
                const plotPayload = {
                    project_name: projectForm.name,
                    plot_number: projectPlotForm.plot_number,
                    size: Number(projectPlotForm.size),
                    price: Number(projectPlotForm.price),
                    status: projectPlotForm.status.toLowerCase(),
                }
                const plotRes = await fetch(`${globalThis.apiBaseUrl}/projects/plots`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(plotPayload),
                })
                if (!plotRes.ok) {
                    const plotErrorMsg = await plotRes.text()
                    console.error("Failed to add initial plot during project creation:", plotErrorMsg)
                    alert(`Project created successfully, but initial plot creation failed: ${plotErrorMsg}`)
                }
            }

            // Success: refresh list
            await fetchData()

            // Close and reset form
            setAddProjectModalVisible(false)
            setProjectForm({
                name: '',
                description: '',
                location: '',
                start_date: '',
                end_date: '',
                status: '',
                total_area: '',
            })
            setProjectErrors({})
            setIncludeInitialPlot(false)
            setProjectPlotForm({
                plot_number: '',
                size: '',
                price: '',
                status: 'available'
            })
        } catch (err) {
            setAddProjectError(extractErrorMessage(err, 'Failed to submit project.'))
        } finally {
            setAddingProject(false)
        }
    }

    const openEditProjectModal = (project) => {
        setSelectedProjectForEdit(project)
        setEditProjectForm({
            name: project.title || '',
            description: project.description || '',
            location: project.location || '',
            developer: project.developer || '',
            start_date: project.start_date ? project.start_date.split('T')[0] : '',
            end_date: project.end_date ? project.end_date.split('T')[0] : '',
            status: project.status || '',
            total_area: project.total_area || '',
        })
        setEditProjectErrors({})
        setEditProjectError(null)
        setEditProjectModalVisible(true)
    }

    const handleEditProjectChange = (e) => {
        const { name, value } = e.target
        const err = validateProjectField(name, value, editProjectForm)
        setEditProjectErrors(prev => ({
            ...prev,
            [name]: err
        }))
        setEditProjectForm(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleEditProjectSubmit = async (e) => {
        e.preventDefault()
        const errs = {}
        Object.keys(editProjectForm).forEach(k => {
            const err = validateProjectField(k, editProjectForm[k], editProjectForm)
            if (err) errs[k] = err
        })
        if (Object.keys(errs).length > 0) {
            setEditProjectErrors(errs)
            return
        }

        setSavingProject(true)
        setEditProjectError(null)
        try {
            const payload = {
                name: editProjectForm.name,
                description: editProjectForm.description,
                location: editProjectForm.location,
                developer: editProjectForm.developer,
                status: editProjectForm.status,
                total_area: Number(editProjectForm.total_area) || 0,
                start_date: editProjectForm.start_date || null,
                end_date: editProjectForm.end_date || null
            }

            const res = await fetch(`${globalThis.apiBaseUrl}/projects/${selectedProjectForEdit.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            if (res.ok) {
                setEditProjectModalVisible(false)
                setSelectedProjectForEdit(null)
                fetchData() // Refresh list
            } else {
                const text = await res.text()
                setEditProjectError(text || 'Failed to update project.')
            }
        } catch (err) {
            setEditProjectError(err.message || 'Failed to submit project changes.')
        } finally {
            setSavingProject(false)
        }
    }

    const openEditPlotModal = (plot) => {
        setSelectedPlotForEdit(plot)
        setEditPlotForm({
            plot_number: plot.plot_number || '',
            size: plot.size || '',
            price: plot.price || '',
            status: plot.status || 'available',
            project_name: plot.project_name || selectedProject?.title || ''
        })
        setEditPlotError(null)
        setEditPlotModalVisible(true)
    }

    const handleEditPlotSubmit = async (e) => {
        e.preventDefault()
        setEditingPlot(true)
        setEditPlotError(null)
        try {
            const plotObj = {
                ...selectedPlotForEdit,
                plot_number: editPlotForm.plot_number,
                size: Number(editPlotForm.size) || 0,
                price: Number(editPlotForm.price) || 0,
                status: editPlotForm.status,
                project_name: editPlotForm.project_name
            }

            const success = await updatePlotOnServer(plotObj)
            if (success) {
                setEditPlotModalVisible(false)
                setSelectedPlotForEdit(null)
                
                // Refresh plots list
                const plotsRes = await fetch(`${globalThis.apiBaseUrl}/projects/plots`)
                if (plotsRes.ok) {
                    const plotsJson = await plotsRes.json()
                    const rawPlots = Array.isArray(plotsJson) ? plotsJson : plotsJson.plots || []
                    setAllPlots(rawPlots)
                }

                if (detailsPlot && String(detailsPlot.id || detailsPlot.plot_number) === String(plotObj.id || plotObj.plot_number)) {
                    setDetailsPlot(plotObj)
                }
            } else {
                setEditPlotError('Failed to update plot details on server.')
            }
        } catch (err) {
            setEditPlotError(err.message || 'Failed to submit plot updates.')
        } finally {
            setEditingPlot(false)
        }
    }

    const updatePlotOnServer = async (plot) => {
        const payload = {
            project_name: plot.project_name,
            plot_number: plot.plot_number,
            size: Number(plot.size),
            price: Number(plot.price),
            status: String(plot.status || '').toLowerCase(),
        }

        const plotId = plot.id || plot.plot_number
        const urls = [
            `${globalThis.apiBaseUrl}/projects/${encodeURIComponent(plot.project_name)}/plots/${encodeURIComponent(plot.plot_number)}`,
            `${globalThis.apiBaseUrl}/projects/plots/${encodeURIComponent(plotId)}`,
            `${globalThis.apiBaseUrl}/projects/plots/${encodeURIComponent(plot.plot_number)}`,
            `${globalThis.apiBaseUrl}/projects/plots`,
        ]

        for (const url of urls) {
            for (const method of ['PUT', 'PATCH']) {
                try {
                    console.log('Edit Plot — payload being sent to PUT/PATCH:', url, method, payload)
                    const res = await fetch(url, {
                        method,
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload),
                    })
                    if (res.ok) return true
                } catch (e) {
                    console.error('Error attempting plot update at ' + url, e)
                }
            }
        }

        return false
    }

    const handleViewPlotDetails = async (plot) => {
        setDetailsPlot(plot)
        setBookingDetails(null)
        setCustomerDetails(null)
        setPlotDetailsModalVisible(true)
        if (plot.status === "available") return

        setBookingLoading(true)
        try {
            const res = await fetch(`${globalThis.apiBaseUrl}/bookings/`)
            if (res.ok) {
                const bookingsList = await res.json()
                const list = Array.isArray(bookingsList) ? bookingsList : (bookingsList.bookings || bookingsList.data || [])
                const match = list.find(b => b && (String(b.plot_id) === String(plot.id) || String(b.plot_number) === String(plot.plot_number)))
                if (match) {
                    setBookingDetails(match)
                    // Fetch customer details
                    const custRes = await fetch(`${globalThis.apiBaseUrl}/users/${match.customer_id}`)
                    if (custRes.ok) {
                        const custData = await custRes.json()
                        setCustomerDetails(custData)
                    }
                }
            }
        } catch (e) {
            console.error("Error loading booking details:", e)
        } finally {
            setBookingLoading(false)
        }
    }

    const handleAddPlotSubmit = async (e) => {
        e.preventDefault()
        if (!formPlotNumber || !formSize || !formPrice) {
            setAddPlotError("Please fill in all fields.")
            return
        }
        setAddingPlot(true)
        setAddPlotError(null)

        const payload = {
            project_name: selectedProject.title,
            plot_number: formPlotNumber,
            size: Number(formSize),
            price: Number(formPrice),
            status: formStatus.toLowerCase(),
        }

        try {
            const res = await fetch(`${globalThis.apiBaseUrl}/projects/plots`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })
            if (res.ok) {
                // Success: refresh plots list
                const plotsRes = await fetch(`${globalThis.apiBaseUrl}/projects/plots`)
                if (plotsRes.ok) {
                    const plotsJson = await plotsRes.json()
                    const rawPlots = Array.isArray(plotsJson) ? plotsJson : plotsJson.plots || []
                    setAllPlots(rawPlots)
                }

                // Close and reset form
                setAddPlotModalVisible(false)
                setFormPlotNumber("")
                setFormSize("")
                setFormPrice("")
                setFormStatus("available")
            } else {
                const errDetail = await res.text()
                setAddPlotError(errDetail || "Failed to create plot.")
            }
        } catch (err) {
            setAddPlotError(err.message || "Failed to submit plot.")
        } finally {
            setAddingPlot(false)
        }
    }

    // Filter and sort display items
    const displayedProjects = useMemo(() => {
        let processed = [...projects]

        // Filter
        if (filterLocation) {
            processed = processed.filter((p) => p.location === filterLocation)
        }

        // Sort
        if (sortBy === "name") {
            processed.sort((a, b) => a.title.localeCompare(b.title))
        } else if (sortBy === "availability") {
            processed.sort((a, b) => {
                const pctA = a.total > 0 ? a.available / a.total : 0
                const pctB = b.total > 0 ? b.available / b.total : 0
                return pctB - pctA
            })
        }

        return processed
    }, [projects, filterLocation, sortBy])

    // Get unique locations
    const uniqueLocations = useMemo(() => {
        return [...new Set(projects.map((p) => p.location).filter(Boolean))]
    }, [projects])

    // Selected project's plots
    const selectedProjectPlots = useMemo(() => {
        if (!selectedProject) return []
        return allPlots.filter(
            (p) => p.project_name?.toLowerCase() === selectedProject.title?.toLowerCase()
        )
    }, [selectedProject, allPlots])

    const styles = {
        mainCard: { borderRadius: "15px" },
        header: { background: "linear-gradient(135deg, #6a11cb, #2575fc)", borderRadius: "12px", padding: "25px", fontWeight: "bold", fontSize: "2.2rem", boxShadow: "0 4px 10px rgba(0,0,0,0.15)" },
        projectCard: { borderRadius: "15px", transition: "all 0.3s ease", boxShadow: "0 4px 10px rgba(0,0,0,0.08)", cursor: "pointer", overflow: "hidden" },
        projectCardHover: { transform: "scale(1.02)", boxShadow: "0 8px 20px rgba(0,0,0,0.15)" },
        projectImage: { width: "100px", height: "100px", borderRadius: "12px", objectFit: "cover" },
        projectTitle: { fontSize: "1.1rem", fontWeight: "700", color: "#000", textTransform: "uppercase", marginBottom: "0" },
        projectLocation: { display: "flex", alignItems: "center", fontSize: "0.9rem", marginBottom: "0.5rem" },
        statTextTotal: { color: "#D32F2F", fontWeight: "600" },
        statTextAvailable: { color: "#388E3C", fontWeight: "600" },
        statTextOccupied: { color: "#FF9800", fontWeight: "600" },
        availabilityBar: { position: "relative", height: "20px", backgroundColor: "#e9ecef", borderRadius: "10px", overflow: "hidden" },
        availabilityBarInner: { height: "100%", borderRadius: "10px", transition: "width 0.5s ease-in-out" },
        availabilityBarText: { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", color: "#fff", fontWeight: "bold", fontSize: "0.8rem", textShadow: "1px 1px 2px rgba(0,0,0,0.5)", zIndex: 1, pointerEvents: "none" },
    }

    return (
        <CContainer className="py-5">
            <CCard className="p-4 shadow-sm mb-4" style={styles.mainCard}>
                <CCardHeader className="text-white d-flex justify-content-between align-items-center" style={styles.header}>
                    <div style={{ flexGrow: 1, textAlign: 'center', marginLeft: canManageProjects ? '120px' : '0' }}>
                        Available Plots
                    </div>
                    {canManageProjects && (
                        <CButton
                            color="light"
                            className="fw-bold text-primary px-3 py-2"
                            style={{ borderRadius: '8px' }}
                            onClick={() => {
                                setAddProjectError(null)
                                setAddProjectModalVisible(true)
                            }}
                        >
                            + Add Project
                        </CButton>
                    )}
                </CCardHeader>

                <CCardBody>
                    {loading && (
                        <div className="text-center my-5">
                            <CSpinner color="primary" size="lg" />
                            <p className="text-muted mt-3">Loading projects and plots details...</p>
                        </div>
                    )}

                    {error && (
                        <CAlert color="danger" className="text-center my-4">
                            Error loading project details: {error}
                        </CAlert>
                    )}

                    {!loading && !error && (
                        <>
                            {/* Filter controls */}
                            <CRow className="mb-4 p-3 bg-light rounded g-3">
                                <CCol md={6}>
                                    <CInputGroup>
                                        <CButton type="button" color="secondary" variant="outline">
                                            <CIcon icon={cilFilter} className="me-1" /> Filter
                                        </CButton>
                                        <CFormSelect
                                            aria-label="Filter by location"
                                            onChange={(e) => setFilterLocation(e.target.value)}
                                            value={filterLocation}
                                        >
                                            <option value="">All Locations</option>
                                            {uniqueLocations.map((loc) => (
                                                <option key={loc} value={loc}>
                                                    {loc}
                                                </option>
                                            ))}
                                        </CFormSelect>
                                    </CInputGroup>
                                </CCol>
                                <CCol md={6} className="d-flex justify-content-md-end align-items-center mt-2 mt-md-0">
                                    <span className="me-3 text-muted" style={{ fontSize: "0.95rem" }}>Sort by:</span>
                                    <CButton
                                        color={sortBy === "name" ? "primary" : "secondary"}
                                        variant="outline"
                                        className="me-2"
                                        onClick={() => setSortBy("name")}
                                    >
                                        <CIcon icon={cilSortAlphaDown} className="me-1" /> Name
                                    </CButton>
                                    <CButton
                                        color={sortBy === "availability" ? "primary" : "secondary"}
                                        variant="outline"
                                        onClick={() => setSortBy("availability")}
                                    >
                                        <CIcon icon={cilSortNumericDown} className="me-1" /> Availability
                                    </CButton>
                                </CCol>
                            </CRow>

                            {/* Project cards */}
                            {displayedProjects.length > 0 ? (
                                displayedProjects.map((p) => {
                                    const occupiedPlots = p.total - p.available
                                    const availablePercentage = p.total > 0 ? (p.available / p.total) * 100 : 0
                                    const barColor = getAvailabilityColor(availablePercentage)
                                    const combinedCardStyle = {
                                        ...styles.projectCard,
                                        ...(hoveredCardId === p.id && styles.projectCardHover),
                                    }

                                    return (
                                        <CCard
                                            key={p.id}
                                            className="d-flex flex-column flex-md-row align-items-center p-3 mb-3"
                                            style={combinedCardStyle}
                                            onMouseEnter={() => setHoveredCardId(p.id)}
                                            onMouseLeave={() => setHoveredCardId(null)}
                                            onClick={() => setSelectedProject(p)}
                                        >
                                            <CCardImage
                                                src={p.image}
                                                className="me-md-3 mb-3 mb-md-0"
                                                style={styles.projectImage}
                                                alt={`Image of ${p.title} project`}
                                            />

                                            <div className="flex-grow-1 w-100">
                                                <div className="d-flex justify-content-between align-items-center mb-1">
                                                    <CCardTitle as="h5" style={styles.projectTitle}>
                                                        {p.title}
                                                    </CCardTitle>
                                                    {canManageProjects && (
                                                        <CButton
                                                            color="warning"
                                                            size="sm"
                                                            className="text-white fw-bold px-3 py-1"
                                                            style={{ borderRadius: '8px', zIndex: 10 }}
                                                            onClick={(e) => {
                                                                e.stopPropagation() // Prevent opening the plots grid modal
                                                                openEditProjectModal(p)
                                                            }}
                                                        >
                                                            Edit
                                                        </CButton>
                                                    )}
                                                </div>
                                                <CCardText className="text-muted" style={styles.projectLocation}>
                                                    <CIcon icon={cilLocationPin} className="me-1" style={{ color: "#C2185B" }} />
                                                    {p.location}
                                                </CCardText>
                                                <CRow className="align-items-center g-2">
                                                    <CCol xs={12} sm={5} style={{ fontSize: "0.95rem" }}>
                                                        <span style={styles.statTextTotal}>Total: {p.total}</span>
                                                        <br />
                                                        <span style={styles.statTextAvailable}>Available: {p.available}</span>
                                                        <br />
                                                        <span style={styles.statTextOccupied}>Occupied: {occupiedPlots}</span>
                                                    </CCol>
                                                    <CCol xs={12} sm={7}>
                                                        <div className="flex-grow-1" style={styles.availabilityBar}>
                                                            <div
                                                                style={{ ...styles.availabilityBarInner, width: `${availablePercentage}%`, backgroundColor: barColor }}
                                                                title={`${Math.round(availablePercentage)}% Available`}
                                                            ></div>
                                                            <span style={styles.availabilityBarText}>
                                                                {`${Math.round(availablePercentage)}% Available`}
                                                            </span>
                                                        </div>
                                                    </CCol>
                                                </CRow>
                                            </div>
                                        </CCard>
                                    )
                                })
                            ) : (
                                <p className="text-center text-muted py-4">No projects match the selected location.</p>
                            )}
                        </>
                    )}
                </CCardBody>
            </CCard>

            {/* Plot Details Modal */}
            <CModal
                visible={!!selectedProject}
                onClose={() => setSelectedProject(null)}
                size="xl"
                scrollable
                backdrop="static"
            >
                {selectedProject && (
                    <>
                        <CModalHeader style={{ background: "linear-gradient(135deg, #6a11cb, #2575fc)", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <CModalTitle>Plots for {selectedProject.title}</CModalTitle>
                            {canManagePlots && (
                                <CButton
                                    color="light"
                                    size="sm"
                                    className="ms-3 fw-bold text-primary"
                                    onClick={() => {
                                        setAddPlotError(null)
                                        setAddPlotModalVisible(true)
                                    }}
                                >
                                    + Add Plot
                                </CButton>
                            )}
                        </CModalHeader>
                        <CModalBody className="p-4" style={{ backgroundColor: "#f8f9fa" }}>
                            <p className="text-muted mb-4">
                                📍 <strong>Location:</strong> {selectedProject.location} | {selectedProject.description}
                            </p>
                            {selectedProjectPlots.length > 0 ? (
                                <CRow className="g-4">
                                    {selectedProjectPlots.map((plot) => (
                                        <CCol key={plot.id} xs={12} sm={6} md={4} lg={3}>
                                            <PlotCard 
                                                plot={plot} 
                                                onViewDetails={handleViewPlotDetails} 
                                                canManagePlots={canManagePlots}
                                                onEditPlot={openEditPlotModal}
                                            />
                                        </CCol>
                                    ))}
                                </CRow>
                            ) : (
                                <div className="text-center py-5">
                                    <span style={{ fontSize: "3rem" }}>📭</span>
                                    <p className="text-muted mt-3 fs-5">No plots registered for this project yet.</p>
                                </div>
                            )}
                        </CModalBody>
                        <CModalFooter>
                            <CButton color="secondary" variant="ghost" onClick={() => setSelectedProject(null)}>
                                Close
                            </CButton>
                        </CModalFooter>
                    </>
                )}
            </CModal>

            {/* Add Plot Inline Modal */}
            <CModal
                visible={addPlotModalVisible}
                onClose={() => setAddPlotModalVisible(false)}
                backdrop="static"
                centered
            >
                <CModalHeader style={{ background: "#4e73df", color: "#fff" }}>
                    <CModalTitle>Add Plot to {selectedProject?.title}</CModalTitle>
                </CModalHeader>
                <form onSubmit={handleAddPlotSubmit}>
                    <CModalBody className="p-4">
                        {addPlotError && (
                            <CAlert color="danger" className="py-2">
                                {addPlotError}
                            </CAlert>
                        )}
                        <div className="mb-3">
                            <CFormLabel htmlFor="plot_number">Plot Number *</CFormLabel>
                            <CFormInput
                                id="plot_number"
                                type="text"
                                placeholder="e.g. 101, 102A"
                                value={formPlotNumber}
                                onChange={(e) => setFormPlotNumber(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <CFormLabel htmlFor="plot_size">Size (sq. ft) *</CFormLabel>
                            <CFormInput
                                id="plot_size"
                                type="number"
                                placeholder="e.g. 1200"
                                value={formSize}
                                onChange={(e) => setFormSize(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <CFormLabel htmlFor="plot_price">Price (INR) *</CFormLabel>
                            <CFormInput
                                id="plot_price"
                                type="number"
                                placeholder="e.g. 1500000"
                                value={formPrice}
                                onChange={(e) => setFormPrice(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <CFormLabel htmlFor="plot_status">Status *</CFormLabel>
                            <CFormSelect
                                id="plot_status"
                                value={formStatus}
                                onChange={(e) => setFormStatus(e.target.value)}
                                required
                            >
                                <option value="available">Available</option>
                                <option value="reserved">Reserved</option>
                                <option value="sold">Sold</option>
                                <option value="on hold">On Hold</option>
                            </CFormSelect>
                        </div>
                    </CModalBody>
                    <CModalFooter>
                        <CButton color="secondary" variant="ghost" onClick={() => setAddPlotModalVisible(false)}>
                            Cancel
                        </CButton>
                        <CButton type="submit" color="primary" disabled={addingPlot}>
                            {addingPlot ? "Adding..." : "Add Plot"}
                        </CButton>
                    </CModalFooter>
                </form>
            </CModal>

            {/* Plot & Booking Details Modal */}
            <CModal
                visible={plotDetailsModalVisible}
                onClose={() => setPlotDetailsModalVisible(false)}
                size="lg"
                backdrop="static"
                centered
            >
                <CModalHeader style={{ background: "#36b9cc", color: "#fff" }}>
                    <CModalTitle>Plot {detailsPlot?.plot_number} Details</CModalTitle>
                </CModalHeader>
                <CModalBody className="p-4">
                    {detailsPlot && (
                        <div>
                            {/* Plot Info Summary */}
                            <h5 className="border-bottom pb-2 mb-3 text-info fw-bold">Plot Information</h5>
                            <CRow className="mb-4">
                                <CCol sm={6}>
                                    <div className="text-muted small">Project/Venture Name</div>
                                    <div className="fw-semibold fs-5 text-dark mb-2">{detailsPlot.project_name || selectedProject?.title}</div>

                                    <div className="text-muted small">Plot Number</div>
                                    <div className="fw-bold fs-5 text-dark mb-2">Plot {detailsPlot.plot_number}</div>
                                </CCol>
                                <CCol sm={6}>
                                    <div className="text-muted small">Plot Size</div>
                                    <div className="fw-semibold fs-5 text-dark mb-2">{detailsPlot.size} sq. ft</div>

                                    <div className="text-muted small">Price</div>
                                    <div className="fw-bold fs-5 text-primary mb-2">
                                        {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(detailsPlot.price)}
                                    </div>
                                </CCol>
                                <CCol sm={12} className="mt-2">
                                    <div className="text-muted small">Status</div>
                                    <div className="d-flex justify-content-between align-items-center mt-1">
                                        <CBadge color={
                                            detailsPlot.status === "available" ? "success" :
                                            detailsPlot.status === "sold" ? "danger" :
                                            detailsPlot.status === "reserved" ? "warning" : "secondary"
                                        } className="fs-6 py-2 px-3">
                                            {String(detailsPlot.status).toUpperCase()}
                                        </CBadge>
                                        {canManagePlots && (
                                            <CButton
                                                color="warning"
                                                size="sm"
                                                className="text-white fw-bold px-3 py-2"
                                                style={{ borderRadius: '8px' }}
                                                onClick={() => {
                                                    setPlotDetailsModalVisible(false)
                                                    openEditPlotModal(detailsPlot)
                                                }}
                                            >
                                                Edit Plot
                                            </CButton>
                                        )}
                                    </div>
                                </CCol>
                            </CRow>

                            {/* Booking Info Summary */}
                            <h5 className="border-bottom pb-2 mb-3 text-info fw-bold">Booking Details</h5>
                            {bookingLoading ? (
                                <div className="text-center py-4">
                                    <CSpinner size="sm" color="info" />
                                    <span className="ms-2 text-muted">Retrieving booking records...</span>
                                </div>
                            ) : detailsPlot.status === "available" ? (
                                <div className="p-3 bg-light rounded text-center my-3 border">
                                    <h6 className="text-success fw-bold mb-2">This plot is available for booking!</h6>
                                    <p className="small text-muted mb-3">No active booking or purchase history found.</p>
                                    <CButton
                                        color="primary"
                                        size="sm"
                                        onClick={() => {
                                            setPlotDetailsModalVisible(false);
                                            setSelectedProject(null);
                                            navigate(`/GetBookings?project_name=${encodeURIComponent(detailsPlot.project_name || selectedProject?.title)}&plot_id=${encodeURIComponent(detailsPlot.id || detailsPlot.plot_number)}`);
                                        }}
                                    >
                                        Go to Bookings Form
                                    </CButton>
                                </div>
                            ) : bookingDetails ? (
                                <div className="p-3 bg-white rounded border">
                                    <CRow className="g-3">
                                        <CCol sm={6}>
                                            <div className="text-muted small">Booking ID</div>
                                            <div className="fw-bold text-dark">#{bookingDetails.id}</div>
                                        </CCol>
                                        <CCol sm={6}>
                                            <div className="text-muted small">Booking Status</div>
                                            <div>
                                                <CBadge color={bookingDetails.status === 'confirmed' ? 'success' : bookingDetails.status === 'pending' ? 'warning' : 'danger'}>
                                                    {String(bookingDetails.status || 'pending').toUpperCase()}
                                                </CBadge>
                                            </div>
                                        </CCol>
                                        <CCol sm={6}>
                                            <div className="text-muted small">Customer Name</div>
                                            <div className="fw-semibold text-dark">
                                                {customerDetails ? `${customerDetails.first_name || ''} ${customerDetails.last_name || ''}`.trim() || customerDetails.name : bookingDetails.customer_id}
                                            </div>
                                        </CCol>
                                        <CCol sm={6}>
                                            <div className="text-muted small">Customer Mobile / Contact</div>
                                            <div className="fw-semibold text-dark">
                                                {customerDetails?.mobile || customerDetails?.phone || '—'}
                                            </div>
                                        </CCol>
                                        <hr className="my-2" />
                                        <CCol xs={4}>
                                            <div className="text-muted small">Total Cost</div>
                                            <div className="fw-bold text-dark">₹ {parseFloat(bookingDetails.total_amount || 0).toLocaleString('en-IN')}</div>
                                        </CCol>
                                        <CCol xs={4}>
                                            <div className="text-muted small">Advance Paid</div>
                                            <div className="fw-bold text-success">₹ {parseFloat(bookingDetails.advance_amount || 0).toLocaleString('en-IN')}</div>
                                        </CCol>
                                        <CCol xs={4}>
                                            <div className="text-muted small">Balance Due</div>
                                            <div className="fw-bold text-danger">₹ {parseFloat(bookingDetails.balance_amount || 0).toLocaleString('en-IN')}</div>
                                        </CCol>
                                    </CRow>
                                </div>
                            ) : (
                                <div className="p-3 bg-light rounded text-center text-muted border">
                                    No active booking details were found in the database.
                                </div>
                            )}
                        </div>
                    )}
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" variant="ghost" onClick={() => setPlotDetailsModalVisible(false)}>
                        Close
                    </CButton>
                </CModalFooter>
            </CModal>
            {/* Add Project Modal */}
            <CModal
                visible={addProjectModalVisible}
                onClose={() => setAddProjectModalVisible(false)}
                backdrop="static"
                size="lg"
                centered
            >
                <CModalHeader style={{ background: "linear-gradient(135deg, #6a11cb, #2575fc)", color: "#fff" }}>
                    <CModalTitle>Create a New Project</CModalTitle>
                </CModalHeader>
                <form onSubmit={handleProjectSubmit}>
                    <CModalBody className="p-4" style={{ backgroundColor: "#f8f9fa" }}>
                        {addProjectError && (
                            <CAlert color="danger" className="py-2">
                                {addProjectError}
                            </CAlert>
                        )}
                        <CRow className="g-3 mb-3">
                            <CCol md={6}>
                                <CFormLabel htmlFor="project_name" className="fw-semibold">Project Name *</CFormLabel>
                                <CFormInput
                                    id="project_name"
                                    name="name"
                                    type="text"
                                    placeholder="Enter project name"
                                    value={projectForm.name}
                                    onChange={handleProjectChange}
                                    invalid={!!projectErrors.name}
                                    required
                                />
                                {projectErrors.name && <CFormFeedback className="d-block">{projectErrors.name}</CFormFeedback>}
                            </CCol>
                            <CCol md={6}>
                                <CFormLabel htmlFor="project_location" className="fw-semibold">Location *</CFormLabel>
                                <CFormInput
                                    id="project_location"
                                    name="location"
                                    type="text"
                                    placeholder="Enter location"
                                    value={projectForm.location}
                                    onChange={handleProjectChange}
                                    invalid={!!projectErrors.location}
                                    required
                                />
                                {projectErrors.location && <CFormFeedback className="d-block">{projectErrors.location}</CFormFeedback>}
                            </CCol>
                        </CRow>

                        <CRow className="g-3 mb-3">
                            <CCol md={6}>
                                <CFormLabel htmlFor="project_total_area" className="fw-semibold">Total Area (sq. ft) *</CFormLabel>
                                <CFormInput
                                    id="project_total_area"
                                    name="total_area"
                                    type="number"
                                    placeholder="e.g. 50000"
                                    value={projectForm.total_area}
                                    onChange={handleProjectChange}
                                    invalid={!!projectErrors.total_area}
                                    required
                                />
                                {projectErrors.total_area && <CFormFeedback className="d-block">{projectErrors.total_area}</CFormFeedback>}
                            </CCol>
                            <CCol md={6}>
                                <CFormLabel htmlFor="project_status" className="fw-semibold">Project Status *</CFormLabel>
                                <CFormSelect
                                    id="project_status"
                                    name="status"
                                    value={projectForm.status}
                                    onChange={handleProjectChange}
                                    invalid={!!projectErrors.status}
                                    required
                                >
                                    <option value="">Select status</option>
                                    <option value="Ongoing">Ongoing</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Planned">Planned</option>
                                    <option value="On Hold">On Hold</option>
                                </CFormSelect>
                                {projectErrors.status && <CFormFeedback className="d-block">{projectErrors.status}</CFormFeedback>}
                            </CCol>
                        </CRow>

                        <CRow className="g-3 mb-3">
                            <CCol md={6}>
                                <CFormLabel htmlFor="project_start_date" className="fw-semibold">Start Date *</CFormLabel>
                                <CFormInput
                                    id="project_start_date"
                                    name="start_date"
                                    type="date"
                                    value={projectForm.start_date}
                                    onChange={handleProjectChange}
                                    invalid={!!projectErrors.start_date}
                                    required
                                />
                                {projectErrors.start_date && <CFormFeedback className="d-block">{projectErrors.start_date}</CFormFeedback>}
                            </CCol>
                            <CCol md={6}>
                                <CFormLabel htmlFor="project_end_date" className="fw-semibold">End Date *</CFormLabel>
                                <CFormInput
                                    id="project_end_date"
                                    name="end_date"
                                    type="date"
                                    value={projectForm.end_date}
                                    onChange={handleProjectChange}
                                    invalid={!!projectErrors.end_date}
                                    required
                                />
                                {projectErrors.end_date && <CFormFeedback className="d-block">{projectErrors.end_date}</CFormFeedback>}
                            </CCol>
                        </CRow>

                        <div className="mb-3">
                            <CFormLabel htmlFor="project_description" className="fw-semibold">Project Description *</CFormLabel>
                            <CFormTextarea
                                id="project_description"
                                name="description"
                                placeholder="Enter description"
                                value={projectForm.description}
                                onChange={handleProjectChange}
                                rows={4}
                                invalid={!!projectErrors.description}
                                required
                            />
                            {projectErrors.description && <CFormFeedback className="d-block">{projectErrors.description}</CFormFeedback>}
                        </div>

                        {/* Optional initial plot addition fields */}
                        <div className="mb-3 border-top pt-3">
                            <div className="form-check form-switch mb-3">
                                <input 
                                    className="form-check-input" 
                                    type="checkbox" 
                                    id="includePlotSwitch" 
                                    checked={includeInitialPlot} 
                                    onChange={(e) => setIncludeInitialPlot(e.target.checked)} 
                                />
                                <label className="form-check-label fw-semibold" htmlFor="includePlotSwitch">
                                    Add an initial plot to this project now
                                </label>
                            </div>
                            
                            {includeInitialPlot && (
                                <div className="bg-light p-3 rounded" style={{ border: '1px dashed #cbd5e1' }}>
                                    <h6 className="fw-bold mb-3 text-primary">Initial Plot Details</h6>
                                    <CRow className="g-3">
                                        <CCol md={6}>
                                            <CFormLabel htmlFor="initPlotNo" className="fw-semibold">Plot Number *</CFormLabel>
                                            <CFormInput 
                                                type="text" 
                                                id="initPlotNo" 
                                                value={projectPlotForm.plot_number} 
                                                onChange={(e) => setProjectPlotForm(prev => ({...prev, plot_number: e.target.value}))} 
                                                placeholder="e.g. 101" 
                                                required={includeInitialPlot}
                                            />
                                        </CCol>
                                        <CCol md={6}>
                                            <CFormLabel htmlFor="initPlotSize" className="fw-semibold">Plot Size (sq.ft) *</CFormLabel>
                                            <CFormInput 
                                                type="number" 
                                                id="initPlotSize" 
                                                value={projectPlotForm.size} 
                                                onChange={(e) => setProjectPlotForm(prev => ({...prev, size: e.target.value}))} 
                                                placeholder="e.g. 1200" 
                                                required={includeInitialPlot}
                                            />
                                        </CCol>
                                        <CCol md={6}>
                                            <CFormLabel htmlFor="initPlotPrice" className="fw-semibold">Plot Price (₹) *</CFormLabel>
                                            <CFormInput 
                                                type="number" 
                                                id="initPlotPrice" 
                                                value={projectPlotForm.price} 
                                                onChange={(e) => setProjectPlotForm(prev => ({...prev, price: e.target.value}))} 
                                                placeholder="e.g. 600000" 
                                                required={includeInitialPlot}
                                            />
                                        </CCol>
                                        <CCol md={6}>
                                            <CFormLabel htmlFor="initPlotStatus" className="fw-semibold">Status</CFormLabel>
                                            <CFormSelect 
                                                id="initPlotStatus" 
                                                value={projectPlotForm.status} 
                                                onChange={(e) => setProjectPlotForm(prev => ({...prev, status: e.target.value}))}
                                            >
                                                <option value="available">Available</option>
                                                <option value="reserved">Reserved</option>
                                                <option value="sold">Sold</option>
                                            </CFormSelect>
                                        </CCol>
                                    </CRow>
                                </div>
                            )}
                        </div>
                    </CModalBody>
                    <CModalFooter>
                        <CButton color="secondary" variant="ghost" onClick={() => setAddProjectModalVisible(false)}>
                            Cancel
                        </CButton>
                        <CButton type="submit" color="primary" disabled={addingProject} style={{ background: "linear-gradient(135deg, #6a11cb, #2575fc)", border: "none" }}>
                            {addingProject ? (
                                <>
                                    <CSpinner size="sm" className="me-2" /> Submitting...
                                </>
                            ) : "Add Project"}
                        </CButton>
                    </CModalFooter>
                </form>
            </CModal>

            {/* Edit Project Modal */}
            <CModal
                visible={editProjectModalVisible}
                onClose={() => setEditProjectModalVisible(false)}
                backdrop="static"
                size="lg"
                centered
            >
                <CModalHeader style={{ background: "linear-gradient(135deg, #f59e0b, #eab308)", color: "#fff" }}>
                    <CModalTitle>Edit Project</CModalTitle>
                </CModalHeader>
                <form onSubmit={handleEditProjectSubmit}>
                    <CModalBody className="p-4" style={{ backgroundColor: "#f8f9fa" }}>
                        {editProjectError && (
                            <CAlert color="danger" className="py-2">
                                {editProjectError}
                            </CAlert>
                        )}
                        <CRow className="g-3 mb-3">
                            <CCol md={6}>
                                <CFormLabel htmlFor="edit_project_name" className="fw-semibold">Project Name *</CFormLabel>
                                <CFormInput
                                    id="edit_project_name"
                                    name="name"
                                    type="text"
                                    placeholder="Enter project name"
                                    value={editProjectForm.name}
                                    onChange={handleEditProjectChange}
                                    invalid={!!editProjectErrors.name}
                                    required
                                />
                                {editProjectErrors.name && <CFormFeedback className="d-block">{editProjectErrors.name}</CFormFeedback>}
                            </CCol>
                            <CCol md={6}>
                                <CFormLabel htmlFor="edit_project_location" className="fw-semibold">Location *</CFormLabel>
                                <CFormInput
                                    id="edit_project_location"
                                    name="location"
                                    type="text"
                                    placeholder="Enter location"
                                    value={editProjectForm.location}
                                    onChange={handleEditProjectChange}
                                    invalid={!!editProjectErrors.location}
                                    required
                                />
                                {editProjectErrors.location && <CFormFeedback className="d-block">{editProjectErrors.location}</CFormFeedback>}
                            </CCol>
                        </CRow>

                        <CRow className="g-3 mb-3">
                            <CCol md={6}>
                                <CFormLabel htmlFor="edit_project_total_area" className="fw-semibold">Total Area (sq. ft) *</CFormLabel>
                                <CFormInput
                                    id="edit_project_total_area"
                                    name="total_area"
                                    type="number"
                                    placeholder="e.g. 50000"
                                    value={editProjectForm.total_area}
                                    onChange={handleEditProjectChange}
                                    invalid={!!editProjectErrors.total_area}
                                    required
                                />
                                {editProjectErrors.total_area && <CFormFeedback className="d-block">{editProjectErrors.total_area}</CFormFeedback>}
                            </CCol>
                            <CCol md={6}>
                                <CFormLabel htmlFor="edit_project_status" className="fw-semibold">Project Status *</CFormLabel>
                                <CFormSelect
                                    id="edit_project_status"
                                    name="status"
                                    value={editProjectForm.status}
                                    onChange={handleEditProjectChange}
                                    invalid={!!editProjectErrors.status}
                                    required
                                >
                                    <option value="">Select status</option>
                                    <option value="Ongoing">Ongoing</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Planned">Planned</option>
                                    <option value="On Hold">On Hold</option>
                                </CFormSelect>
                                {editProjectErrors.status && <CFormFeedback className="d-block">{editProjectErrors.status}</CFormFeedback>}
                            </CCol>
                        </CRow>

                        <CRow className="g-3 mb-3">
                            <CCol md={6}>
                                <CFormLabel htmlFor="edit_project_start_date" className="fw-semibold">Start Date</CFormLabel>
                                <CFormInput
                                    id="edit_project_start_date"
                                    name="start_date"
                                    type="date"
                                    value={editProjectForm.start_date}
                                    onChange={handleEditProjectChange}
                                />
                            </CCol>
                            <CCol md={6}>
                                <CFormLabel htmlFor="edit_project_end_date" className="fw-semibold">End Date</CFormLabel>
                                <CFormInput
                                    id="edit_project_end_date"
                                    name="end_date"
                                    type="date"
                                    value={editProjectForm.end_date}
                                    onChange={handleEditProjectChange}
                                />
                            </CCol>
                        </CRow>

                        <div className="mb-3">
                            <CFormLabel htmlFor="edit_project_developer" className="fw-semibold">Developer</CFormLabel>
                            <CFormInput
                                id="edit_project_developer"
                                name="developer"
                                type="text"
                                placeholder="Enter developer name"
                                value={editProjectForm.developer}
                                onChange={handleEditProjectChange}
                            />
                        </div>

                        <div className="mb-3">
                            <CFormLabel htmlFor="edit_project_description" className="fw-semibold">Project Description *</CFormLabel>
                            <CFormTextarea
                                id="edit_project_description"
                                name="description"
                                rows={3}
                                placeholder="Enter project description..."
                                value={editProjectForm.description}
                                onChange={handleEditProjectChange}
                                invalid={!!editProjectErrors.description}
                                required
                            />
                            {editProjectErrors.description && <CFormFeedback className="d-block">{editProjectErrors.description}</CFormFeedback>}
                        </div>
                    </CModalBody>
                    <CModalFooter>
                        <CButton color="secondary" variant="ghost" onClick={() => setEditProjectModalVisible(false)}>
                            Cancel
                        </CButton>
                        <CButton type="submit" color="warning" disabled={savingProject} className="text-white" style={{ background: "linear-gradient(135deg, #f59e0b, #eab308)", border: "none" }}>
                            {savingProject ? (
                                <>
                                    <CSpinner size="sm" className="me-2" /> Saving...
                                </>
                            ) : "Save Changes"}
                        </CButton>
                    </CModalFooter>
                </form>
            </CModal>

            {/* Edit Plot Modal */}
            <CModal
                visible={editPlotModalVisible}
                onClose={() => setEditPlotModalVisible(false)}
                backdrop="static"
                centered
            >
                <CModalHeader style={{ background: "#f59e0b", color: "#fff" }}>
                    <CModalTitle>Edit Plot {selectedPlotForEdit?.plot_number}</CModalTitle>
                </CModalHeader>
                <form onSubmit={handleEditPlotSubmit}>
                    <CModalBody className="p-4">
                        {editPlotError && (
                            <CAlert color="danger" className="py-2">
                                {editPlotError}
                            </CAlert>
                        )}
                        <div className="mb-3">
                            <CFormLabel htmlFor="edit_plot_number">Plot Number *</CFormLabel>
                            <CFormInput
                                id="edit_plot_number"
                                type="text"
                                placeholder="e.g. 101, 102A"
                                value={editPlotForm.plot_number}
                                onChange={(e) => setEditPlotForm(prev => ({...prev, plot_number: e.target.value}))}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <CFormLabel htmlFor="edit_plot_size">Size (sq. ft) *</CFormLabel>
                            <CFormInput
                                id="edit_plot_size"
                                type="number"
                                placeholder="e.g. 1200"
                                value={editPlotForm.size}
                                onChange={(e) => setEditPlotForm(prev => ({...prev, size: e.target.value}))}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <CFormLabel htmlFor="edit_plot_price">Price (INR) *</CFormLabel>
                            <CFormInput
                                id="edit_plot_price"
                                type="number"
                                placeholder="e.g. 1500000"
                                value={editPlotForm.price}
                                onChange={(e) => setEditPlotForm(prev => ({...prev, price: e.target.value}))}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <CFormLabel htmlFor="edit_plot_status">Status *</CFormLabel>
                            <CFormSelect
                                id="edit_plot_status"
                                value={editPlotForm.status}
                                onChange={(e) => setEditPlotForm(prev => ({...prev, status: e.target.value}))}
                                required
                            >
                                <option value="available">Available</option>
                                <option value="reserved">Reserved</option>
                                <option value="sold">Sold</option>
                                <option value="on hold">On Hold</option>
                            </CFormSelect>
                        </div>
                    </CModalBody>
                    <CModalFooter>
                        <CButton color="secondary" variant="ghost" onClick={() => setEditPlotModalVisible(false)}>
                            Cancel
                        </CButton>
                        <CButton type="submit" color="warning" className="text-white" disabled={editingPlot}>
                            {editingPlot ? "Saving..." : "Save Plot"}
                        </CButton>
                    </CModalFooter>
                </form>
            </CModal>
        </CContainer>
    )
}