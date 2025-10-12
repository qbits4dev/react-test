// src/views/projects/AvailableProjects.js
import React, { useState, useMemo } from "react";
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
} from "@coreui/react";
import { cilLocationPin, cilFilter, cilSortAlphaDown, cilSortNumericDown } from "@coreui/icons";
import CIcon from "@coreui/icons-react";

import image1 from './../../assets/images/projects/images.jpeg';
import image2 from './../../assets/images/projects/image2.jpeg';
import image3 from './../../assets/images/projects/image3.jpeg';
import image4 from './../../assets/images/projects/image4.jpg';
import image5 from './../../assets/images/projects/image5.jpg';
import image6 from './../../assets/images/projects/image6.jpg';
import image7 from './../../assets/images/projects/image7.jpg';
import image8 from './../../assets/images/projects/image88.jpg';

// Helper function to determine progress bar color based on availability
const getAvailabilityColor = (percentage) => {
    if (percentage > 60) return "#4CAF50"; // Green
    if (percentage > 20) return "#FFC107"; // Yellow
    return "#F44336"; // Red
};

export default function AvailableProjects() {
    const [hoveredCardId, setHoveredCardId] = useState(null);
    const [filterLocation, setFilterLocation] = useState('');
    const [sortBy, setSortBy] = useState(null); // Can be 'name' or 'availability'

    // Data with unique IDs
    // ✅ Use the imported images here
    const projects = [
        { id: 1, image: image1, title: "GOLDEN HEIGHTS RAJAPUR PHASE 1", location: "RAJAPUR", total: 52, available: 17 },
        { id: 2, image: image2, title: "GOLDEN HEIGHTS RAJAPUR PHASE 2", location: "RAJAPUR", total: 318, available: 169 },
        { id: 3, image: image3, title: "DREAM VALLEY 3", location: "SHADNAGAR", total: 509, available: 336 },
        { id: 4, image: image4, title: "ICONIC 5", location: "SHADNAGAR", total: 65, available: 13 },
        { id: 5, image: image5, title: "ICONIC 4", location: "SHADNAGAR", total: 68, available: 26 },
        { id: 6, image: image6, title: "ICONIC 5", location: "KOTHUR", total: 72, available: 30 },
        { id: 7, image: image7, title: "ICONIC 6", location: "MAHESHWARAM", total: 80, available: 42 },
        { id: 8, image: image8, title: "ICONIC 7", location: "SHADNAGAR", total: 60, available: 18 },
    ];


    // Memoized logic for filtering and sorting
    const displayedProjects = useMemo(() => {
        let processedProjects = [...projects];

        // 1. Apply Filter
        if (filterLocation) {
            processedProjects = processedProjects.filter(p => p.location === filterLocation);
        }

        // 2. Apply Sort
        if (sortBy === 'name') {
            processedProjects.sort((a, b) => a.title.localeCompare(b.title));
        } else if (sortBy === 'availability') {
            processedProjects.sort((a, b) => (b.available / b.total) - (a.available / a.total));
        }

        return processedProjects;
    }, [projects, filterLocation, sortBy]);

    // Get unique locations for the dropdown
    const uniqueLocations = [...new Set(projects.map(p => p.location))];

    // --- Internal CSS Styles ---
    const styles = {
        mainCard: { borderRadius: "15px" },
        header: { background: "linear-gradient(135deg, #6a11cb, #2575fc)", borderRadius: "12px", padding: "25px", fontWeight: "bold", fontSize: "2.5rem", boxShadow: "0 4px 10px rgba(0,0,0,0.15)" },
        projectCard: { borderRadius: "15px", transition: "all 0.3s ease", boxShadow: "0 4px 10px rgba(0,0,0,0.08)", cursor: "pointer", overflow: "hidden" },
        projectCardHover: { transform: "scale(1.02)", boxShadow: "0 8px 20px rgba(0,0,0,0.15)" },
        projectImage: { width: "100px", height: "100px", borderRadius: "12px", objectFit: "cover" },
        projectTitle: { fontSize: "1.1rem", fontWeight: "700", color: "#000", textTransform: "uppercase", marginBottom: "0" },
        projectLocation: { display: "flex", alignItems: "center", fontSize: "0.9rem", marginBottom: "0.5rem" }, // <-- CORRECTED LINE
        statTextTotal: { color: "#D32F2F", fontWeight: "600" },
        statTextAvailable: { color: "#388E3C", fontWeight: "600" },
        statTextOccupied: { color: "#FF9800", fontWeight: "600" },
        availabilityBar: { position: 'relative', height: '20px', backgroundColor: '#e9ecef', borderRadius: '10px', overflow: 'hidden' },
        availabilityBarInner: { height: '100%', borderRadius: '10px', transition: 'width 0.5s ease-in-out' },
        availabilityBarText: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#fff', fontWeight: 'bold', fontSize: '0.8rem', textShadow: '1px 1px 2px rgba(0,0,0,0.5)', zIndex: 1, pointerEvents: 'none' },
    };

    return (
        <CContainer className="py-5">
            <CCard className="p-4 shadow-sm mb-4" style={styles.mainCard}>
                <CCardHeader className="text-center text-white" style={styles.header}>
                    Available Plots
                </CCardHeader>

                <CCardBody>
                    {/* --- UI Controls for Filtering and Sorting --- */}
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
                                    {uniqueLocations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                                </CFormSelect>
                            </CInputGroup>
                        </CCol>
                        <CCol md={6} className="d-flex justify-content-md-end mt-2 mt-md-0">
                            <span className="me-3 text-muted d-flex align-items-center">Sort by:</span>
                            <CButton
                                color={sortBy === 'name' ? 'primary' : 'secondary'}
                                variant="outline"
                                className="me-2"
                                onClick={() => setSortBy('name')}
                            >
                                <CIcon icon={cilSortAlphaDown} className="me-1" /> Name
                            </CButton>
                            <CButton
                                color={sortBy === 'availability' ? 'primary' : 'secondary'}
                                variant="outline"
                                onClick={() => setSortBy('availability')}
                            >
                                <CIcon icon={cilSortNumericDown} className="me-1" /> Availability
                            </CButton>
                        </CCol>
                    </CRow>

                    {/* --- Use the 'displayedProjects' array for mapping --- */}
                    {displayedProjects.map((p) => {
                        const occupiedPlots = p.total - p.available;
                        const availablePercentage = (p.available / p.total) * 100;
                        const barColor = getAvailabilityColor(availablePercentage);
                        const combinedCardStyle = {
                            ...styles.projectCard,
                            ...(hoveredCardId === p.id && styles.projectCardHover),
                        };

                        return (
                            <CCard
                                key={p.id}
                                className="d-flex flex-column flex-md-row align-items-center p-3 mb-3"
                                style={combinedCardStyle}
                                onMouseEnter={() => setHoveredCardId(p.id)}
                                onMouseLeave={() => setHoveredCardId(null)}
                            >
                                <CCardImage
                                    src={p.image}
                                    className="me-md-3 mb-3 mb-md-0"
                                    style={styles.projectImage}
                                    alt={`Image of ${p.title} project`}
                                />

                                <div className="flex-grow-1 w-100">
                                    <CCardTitle as="h5" style={styles.projectTitle}>{p.title}</CCardTitle>
                                    <CCardText className="text-muted" style={styles.projectLocation}>
                                        <CIcon icon={cilLocationPin} className="me-1" style={{ color: "#C2185B" }} />
                                        {p.location}
                                    </CCardText>
                                    <CRow className="align-items-center g-2">
                                        <CCol xs={12} sm={5} style={{ fontSize: "0.95rem" }}>
                                            <span style={styles.statTextTotal}>Total: {p.total}</span><br />
                                            <span style={styles.statTextAvailable}>Available: {p.available}</span><br />
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
                        );
                    })}
                </CCardBody>
            </CCard>
        </CContainer>
    );
}