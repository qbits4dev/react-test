// src/views/projects/AvailableProjects.js
import React, { useState } from "react";
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
} from "@coreui/react";
import { cilLocationPin } from "@coreui/icons";
import CIcon from "@coreui/icons-react";

// Helper function to determine progress bar color based on availability
const getAvailabilityColor = (percentage) => {
    if (percentage > 60) return "#4CAF50"; // Green
    if (percentage > 20) return "#FFC107"; // Yellow
    return "#F44336"; // Red
};

export default function AvailableProjects() {
    const [hoveredCardId, setHoveredCardId] = useState(null);

    // --- Internal CSS Styles ---
    const styles = {
        mainCard: {
            borderRadius: "15px",
        },
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
            marginBottom: "0.25rem",
        },
        projectLocation: {
            display: "flex",
            alignItems: "center",
            fontSize: "0.9rem",
            marginBottom: "0.75rem",
        },
        statTextTotal: {
            color: "#D32F2F",
            fontWeight: "600",
        },
        statTextAvailable: {
            color: "#388E3C",
            fontWeight: "600",
        },
        // Style for the new "Occupied" text
        statTextOccupied: {
            color: "#FF9800", // Amber color
            fontWeight: "600",
        },
        availabilityBar: {
            height: "8px",
            backgroundColor: "#e0e0e0",
            borderRadius: "4px",
            overflow: "hidden",
        },
        availabilityBarInner: {
            height: "100%",
            borderRadius: "4px",
            transition: "width 0.5s ease-in-out",
        },
    };

    // Data with unique IDs
    const projects = [
        { id: 1, image: "src/assets/images/goldenheights1.png", title: "GOLDEN HEIGHTS RAJAPUR PHASE 1", location: "RAJAPUR", total: 52, available: 17 },
        { id: 2, image: "src/assets/images/goldenheights2.png", title: "GOLDEN HEIGHTS RAJAPUR PHASE 2", location: "RAJAPUR", total: 318, available: 169 },
        { id: 3, image: "src/assets/images/dreamvalley3.png", title: "DREAM VALLEY 3", location: "SHADNAGAR", total: 509, available: 336 },
        { id: 4, image: "src/assets/images/iconic5.png", title: "ICONIC 5", location: "SHADNAGAR", total: 65, available: 13 },
        { id: 5, image: "src/assets/images/iconic4.png", title: "ICONIC 4", location: "SHADNAGAR", total: 68, available: 26 },
        { id: 6, image: "src/assets/images/iconic5.png", title: "ICONIC 5", location: "KOTHUR", total: 72, available: 30 },
        { id: 7, image: "src/assets/images/iconic6.png", title: "ICONIC 6", location: "MAHESHWARAM", total: 80, available: 42 },
        { id: 8, image: "src/assets/images/iconic7.png", title: "ICONIC 7", location: "SHADNAGAR", total: 60, available: 18 },
        { id: 9, image: "src/assets/images/iconic8.png", title: "ICONIC 8", location: "JADCHERLA", total: 90, available: 40 },
        { id: 10, image: "src/assets/images/iconic9.png", title: "ICONIC 9", location: "BIBINAGAR", total: 75, available: 25 },
        { id: 11, image: "src/assets/images/iconic10.png", title: "ICONIC 10", location: "KANDUKUR", total: 100, available: 60 },
        { id: 12, image: "src/assets/images/iconic11.png", title: "ICONIC 11", location: "SHAMSHABAD", total: 55, available: 20 },
        { id: 13, image: "src/assets/images/iconic12.png", title: "ICONIC 12", location: "MAHESHWARAM", total: 68, available: 28 },
        { id: 14, image: "src/assets/images/iconic13.png", title: "ICONIC 13", location: "KOTHUR", total: 85, available: 33 },
    ];

    return (
        <CContainer className="py-5">
            <CCard className="p-4 shadow-sm mb-4" style={styles.mainCard}>
                <CCardHeader className="text-center text-white" style={styles.header}>
                    Available Plots
                </CCardHeader>

                <CCardBody>
                    {projects.map((p) => {
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
                                            <span style={styles.statTextTotal}>Total: {p.total}</span>
                                            <br />
                                            <span style={styles.statTextAvailable}>Available: {p.available}</span>
                                            <br />
                                            {/* Displaying the new Occupied plots count */}
                                            <span style={styles.statTextOccupied}>Occupied: {occupiedPlots}</span>
                                        </CCol>
                                        <CCol xs={12} sm={7} className="d-flex align-items-center">
                                            <div className="flex-grow-1" style={styles.availabilityBar}>
                                                <div
                                                    style={{
                                                        ...styles.availabilityBarInner,
                                                        width: `${availablePercentage}%`,
                                                        backgroundColor: barColor,
                                                    }}
                                                    title={`${Math.round(availablePercentage)}% Available`}
                                                ></div>
                                            </div>
                                            {/* Displaying the available percentage as text */}
                                            <span
                                                className="ms-2 fw-bold"
                                                style={{ color: barColor, minWidth: '55px', textAlign: 'right' }}
                                            >
                                                {`${Math.round(availablePercentage)}%`}
                                            </span>
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