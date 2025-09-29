import React from 'react'
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
    CButton
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'

export default function Projects() {
    const navigate = useNavigate()

    const projects = [
        {
            title: "SKANDA GREEN VALLEY RESORT",
            location: "Hamsavaram, Andhra Pradesh",
            description: "Nestled in the serene landscapes of Hamsavaram, Skanda Green Valley Resort",
            image: "src/assets/images/skandagreenvalley.png",
            link: "/projects/skanda"
        },
        {
            title: "Portfolio Website",
            rating: 4.7,
            reviews: 95,
            description: "Personal branding with animations and contact form",
            tags: ["HTML", "CSS", "JavaScript"],
            image: "https://via.placeholder.com/200x150",
            link: "https://yourportfolio.com"
        },
        {
            title: "Mobile Fitness App",
            rating: 4.9,
            reviews: 150,
            description: "Workout tracking and diet planner app",
            tags: ["Flutter", "Firebase", "API"],
            image: "https://via.placeholder.com/200x150",
            link: "/projects/fitness"
        },
    ]

    const handleRedirect = (link) => {
        if (link.startsWith("http")) {
            window.open(link, "_blank")
        } else {
            navigate(link)
        }
    }

    return (
        <CContainer className="py-5">
            <CCard className="p-4 shadow-sm">
                <CCardHeader
                    className="mb-4"
                    style={{
                        background: 'linear-gradient(135deg, #6a11cb, #2575fc)',
                        borderRadius: '12px',
                        color: 'white',
                        padding: '20px',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                        textAlign: 'center'
                    }}
                >
                    <h1 className="display-5 mb-0" style={{ fontWeight: 'bold', fontSize: '60px', }}>Projects</h1>
                </CCardHeader>

                <CCardBody>
                    {projects.map((project, index) => (
                        <CRow key={index} className="mb-4">
                            <CCol>
                                <CCard
                                    className="d-flex flex-row align-items-center p-3 project-card"
                                    style={{
                                        cursor: "pointer",
                                        borderRadius: "15px",
                                        transition: "transform 0.2s, box-shadow 0.2s",
                                    }}
                                    onClick={() => handleRedirect(project.link)}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.transform = 'scale(1.03)';
                                        e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.15)';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.transform = 'scale(1)';
                                        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                                    }}
                                >

                                    <CCardImage
                                        src={project.image}
                                        className="me-4"
                                        style={{ width: '220px', height: '19    0px', objectFit: 'cover', borderRadius: '12px' }}
                                    />

                                    <div className="flex-grow-1">
                                        <CCardTitle className="mb-2" style={{ fontSize: '1.5rem', fontWeight: '700' }}>
                                            {project.title}
                                        </CCardTitle>

                                        {project.location && (
                                            <CCardText className="text-muted mb-2" style={{ fontSize: '0.95rem' }}>
                                                📍 {project.location}
                                            </CCardText>
                                        )}

                                        <CCardText className="text-muted mb-3" style={{ fontSize: '1rem' }}>
                                            {project.description}
                                        </CCardText>

                                        {/* Tags */}
                                        <div className="mb-3">
                                            {project.tags?.map((tag, i) => (
                                                <span
                                                    key={i}
                                                    style={{
                                                        display: 'inline-block',
                                                        padding: '5px 12px',
                                                        background: 'linear-gradient(90deg, #6a11cb, #2575fc)',
                                                        color: 'white',
                                                        borderRadius: '20px',
                                                        fontSize: '0.85rem',
                                                        marginRight: '6px',
                                                        marginBottom: '6px'
                                                    }}
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Button */}
                                        <CButton
                                            style={{
                                                background: 'linear-gradient(90deg, #2575fc, #0575e6)',
                                                border: 'none',
                                                fontWeight: '600',
                                                color: 'white',
                                                padding: '8px 20px',
                                                borderRadius: '25px',
                                                boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                                                transition: 'transform 0.2s'
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                                            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                navigate("/booksite")
                                            }}
                                        >
                                            Book Site
                                    </CButton>
                                </div>
                            </CCard>
                        </CCol>
                        </CRow>
                    ))}
            </CCardBody>
        </CCard>
        </CContainer >
    )
}
