// src/views/projects/AvailableProjects.js
import React, { useState, useEffect, useMemo } from "react"
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
    CButton,
    CInputGroup,
    CSpinner,
    CAlert,
} from "@coreui/react"
import {
    cilLocationPin,
    cilFilter,
    cilSortAlphaDown,
    cilSortNumericDown,
} from "@coreui/icons"
import CIcon from "@coreui/icons-react"

// Helper function for bar color
const getAvailabilityColor = (percentage) => {
    if (percentage > 60) return "#4CAF50" // Green
    if (percentage > 20) return "#FFC107" // Yellow
    return "#F44336" // Red
}

export default function AvailableProjects() {
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [hoveredCardId, setHoveredCardId] = useState(null)
    const [filterLocation, setFilterLocation] = useState("")
    const [sortBy, setSortBy] = useState(null) // 'name' | 'availability'

    // ✅ Fetch projects from API
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoading(true)
                setError(null)

                // Replace with your actual API base URL
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/projects/`)
                if (!response.ok) throw new Error("Failed to fetch projects")

                const data = await response.json()
                setProjects(data)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchProjects()
    }, [])

    // --- Filtering and sorting logic ---
    const displayedProjects = useMemo(() => {
        let processed = [...projects]
        if (filterLocation) {
            processed = processed.filter((p) => p.location === filterLocation)
        }

        if (sortBy === "name") {
            processed.sort((a, b) => a.title.localeCompare(b.title))
        } else if (sortBy === "availability") {
            processed.sort(
                (a, b) =>
                    b.available / b.total - a.available / a.total
            )
        }

        return processed
    }, [projects, filterLocation, sortBy])

    // Unique location list for dropdown
    const uniqueLocations = [...new Set(projects.map((p) => p.location))]

    // --- Internal Styles ---
    const styles = {
        mainCard: { borderRadius: "15px" },
        header: {
            background: "linear-gradient(135deg, #6a11cb, #2575fc)",
            borderRadius: "12px",
            padding: "25px",
            fontWeight: "bold",
            fontSize: "2.5rem",
            boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
        },
        projectCard: {
            borderRadius: "15px",
            transition: "all 0.3s ease",
            boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
            cursor: "pointer",
            overflow: "hidden",
        },
        projectCardHover: {
            transform: "scale(1.02)",
            boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
        },
        projectImage: {
            width: "100px",
            height: "100px",
            borderRadius: "12px",
            objectFit: "cover",
        },
        projectTitle: {
            fontSize: "1.1rem",
            fontWeight: "700",
            color: "#000",
            textTransform: "uppercase",
            marginBottom: "0",
        },
        projectLocation: {
            display: "flex",
            alignItems: "center",
            fontSize: "0.9rem",
            marginBottom: "0.5rem",
        },
        statTextTotal: { color: "#D32F2F", fontWeight: "600" },
        statTextAvailable: { color: "#388E3C", fontWeight: "600" },
        statTextOccupied: { color: "#FF9800", fontWeight: "600" },
        availabilityBar: {
            position: "relative",
            height: "20px",
            backgroundColor: "#e9ecef",
            borderRadius: "10px",
            overflow: "hidden",
        },
        availabilityBarInner: {
            height: "100%",
            borderRadius: "10px",
            transition: "width 0.5s ease-in-out",
        },
        availabilityBarText: {
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "#fff",
            fontWeight: "bold",
            fontSize: "0.8rem",
            textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
            zIndex: 1,
            pointerEvents: "none",
        },
    }

    return (
        <CContainer className="py-5">
            <CCard className="p-4 shadow-sm mb-4" style={styles.mainCard}>
                <CCardHeader className="text-center text-white" style={styles.header}>
                    Available Plots
                </CCardHeader>

                <CCardBody>
                    {/* Loading State */}
                    {loading && (
                        <div className="text-center my-5">
                            <CSpinner color="primary" size="lg" />
                            <p className="text-muted mt-3">Loading projects...</p>
                        </div>
                    )}

                    {/* Error State */}
                    {error && (
                        <CAlert color="danger" className="text-center">
                            Failed to load projects: {error}
                        </CAlert>
                    )}

                    {/* --- Filter + Sort Controls --- */}
                    {!loading && !error && projects.length > 0 && (
                        <CRow className="mb-4 p-3 bg-light rounded">
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

                            <CCol
                                md={6}
                                className="d-flex justify-content-md-end mt-2 mt-md-0"
                            >
                                <span className="me-3 text-muted d-flex align-items-center">
                                    Sort by:
                                </span>
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
                    )}

                    {/* --- Projects List --- */}
                    {!loading && !error && displayedProjects.length > 0 ? (
                        displayedProjects.map((p) => {
                            const occupied = p.total - p.available
                            const availablePercentage = (p.available / p.total) * 100
                            const barColor = getAvailabilityColor(availablePercentage)
                            const cardStyle = {
                                ...styles.projectCard,
                                ...(hoveredCardId === p.id && styles.projectCardHover),
                            }

                            return (
                                <CCard
                                    key={p.id}
                                    className="d-flex flex-column flex-md-row align-items-center p-3 mb-3"
                                    style={cardStyle}
                                    onMouseEnter={() => setHoveredCardId(p.id)}
                                    onMouseLeave={() => setHoveredCardId(null)}
                                >
                                    <CCardImage
                                        src={p.image}
                                        className="me-md-3 mb-3 mb-md-0"
                                        style={styles.projectImage}
                                        alt={p.title}
                                    />

                                    <div className="flex-grow-1 w-100">
                                        <CCardTitle as="h5" style={styles.projectTitle}>
                                            {p.title}
                                        </CCardTitle>
                                        <CCardText
                                            className="text-muted"
                                            style={styles.projectLocation}
                                        >
                                            <CIcon
                                                icon={cilLocationPin}
                                                className="me-1"
                                                style={{ color: "#C2185B" }}
                                            />
                                            {p.location}
                                        </CCardText>
                                        <CRow className="align-items-center g-2">
                                            <CCol xs={12} sm={5} style={{ fontSize: "0.95rem" }}>
                                                <span style={styles.statTextTotal}>Total: {p.total}</span>
                                                <br />
                                                <span style={styles.statTextAvailable}>
                                                    Available: {p.available}
                                                </span>
                                                <br />
                                                <span style={styles.statTextOccupied}>
                                                    Occupied: {occupied}
                                                </span>
                                            </CCol>
                                            <CCol xs={12} sm={7}>
                                                <div style={styles.availabilityBar}>
                                                    <div
                                                        style={{
                                                            ...styles.availabilityBarInner,
                                                            width: `${availablePercentage}%`,
                                                            backgroundColor: barColor,
                                                        }}
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
                        !loading &&
                        !error && (
                            <p className="text-center text-muted mt-4">
                                No projects found.
                            </p>
                        )
                    )}
                </CCardBody>
            </CCard>
        </CContainer>
    )
}
