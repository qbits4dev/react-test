import React, { useState } from 'react'
import {
    CContainer, CCardBody, CCard, CForm,
    CRow, CCol, CInputGroup, CFormInput,
    CButton, CSpinner
} from '@coreui/react'

export default function Plots() {
    const [projectId, setProjectId] = useState("")
    const [loading, setLoading] = useState(false)
    const [projectData, setProjectData] = useState(null)
    const [error, setError] = useState("")


    const mockProjects = {
        1: { id: 1, name: "Green Meadows", location: "Hyderabad", total_plots: 85 },
        2: { id: 2, name: "Blue Valley", location: "Bengaluru", total_plots: 60 },
        3: { id: 3, name: "Sunrise Enclave", location: "Chennai", total_plots: 120 },
    }


    const handleFetchProject = async (e) => {
        e.preventDefault()

        if (!projectId) {
            setError("Please enter a Project ID")
            return
        }

        setLoading(true)
        setError("")
        setProjectData(null)

        setTimeout(() => {
            const data = mockProjects[projectId]
            if (data) {
                setProjectData(data)
            } else {
                setError("No project found with this ID")
            }
            setLoading(false)
        }, 1000)
    }

    return (
        <CContainer>
            <CRow className='justify-content-center'>
                <CCol md={12} lg={6} xl={5}>
                    <CCard className='mx-4'>
                        <CCardBody className='p-4'>
                            <h1 className='mb-4 text-primary' style={{ fontWeight: 'bold' }}>Plots</h1>

                            <CForm onSubmit={handleFetchProject}>
                                <CInputGroup className='mb-3'>
                                    <CFormInput
                                        name='project_id'
                                        placeholder="Enter Project ID (e.g., 1, 2, or 3)"
                                        value={projectId}
                                        onChange={(e) => setProjectId(e.target.value)}
                                    />
                                </CInputGroup>

                                <CButton type="submit" color="primary" disabled={loading}>
                                    {loading ? <CSpinner size='sm' /> : "Fetch Project"}
                                </CButton>
                            </CForm>


                            {error && <p className='text-danger mt-3'>{error}</p>}


                            {projectData && (
                                <div className='mt-4'>
                                    <h5>Project Details</h5>
                                    <p><strong>Name:</strong> {projectData.name}</p>
                                    <p><strong>Location:</strong> {projectData.location}</p>
                                    <p><strong>Total Plots:</strong> {projectData.total_plots}</p>


                                    <CForm className='mt-3'>
                                        <CInputGroup className='mb-3'>
                                            <CFormInput
                                                placeholder="Duplicated - Project Name"
                                                value={projectData.name}
                                                readOnly
                                            />
                                        </CInputGroup>

                                        <CInputGroup className='mb-3'>
                                            <CFormInput
                                                placeholder="Duplicated - Project Location"
                                                value={projectData.location}
                                                readOnly
                                            />
                                        </CInputGroup>
                                    </CForm>
                                </div>
                            )}
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </CContainer>
    )
}
