import React, { useState, useEffect } from 'react'
import {
    CContainer,
    CRow,
    CCol,
    CCard,
    CCardHeader,
    CCardBody,
    CForm,
    CFormLabel,
    CFormInput,
    CFormTextarea,
    CButton,
    CAlert,
    CDropdown,
    CDropdownToggle,
    CDropdownMenu,
    CDropdownItem,
    CSpinner,
} from '@coreui/react'

const PostTargets = () => {
    const [designations, setDesignations] = useState([])
    const [designationName, setDesignationName] = useState('Select Designation')
    const [loadingDesignations, setLoadingDesignations] = useState(true)
    const [designationError, setDesignationError] = useState('')

    const [formData, setFormData] = useState({
        designation: '',
        description: '',
        sqyards: '',
        Units: '',
        Amount: '',
        Time: '', // Added Time to formData state
    })

    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const [selectedTarget, setSelectedTarget] = useState('Select Target Type')

    const handleSelect = (targetType) => {
        setSelectedTarget(targetType)
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleDesignationSelect = (designation) => {
        setDesignationName(designation.name)
        setFormData((prev) => ({ ...prev, designation: designation.name }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setMessage('')
        setError('')

        if (selectedTarget === 'Select Target Type' || !formData.designation) {
            setError('Please select a Target Type and a Designation before submitting.')
            return
        }

        fetch('http://localhost:5000/api/targets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...formData,
                targetType: selectedTarget, // Include target type in submission
            }),
        })
            .then((res) => {
                if (!res.ok) throw new Error('Network response was not ok')
                return res.json()
            })
            .then(() => {
                setMessage('✅ Target posted successfully!')
                // Reset form after successful submission
                setFormData({
                    designation: '',
                    description: '',
                    sqyards: '',
                    Units: '',
                    Amount: '',
                    Time: '',
                })
                setDesignationName('Select Designation')
                setSelectedTarget('Select Target Type')
            })
            .catch((err) => setError(`Submission failed: ${err.message}`))
    }

    useEffect(() => {
        fetch(`${apiBaseUrl}/register/?key=designation`, {
            headers: { accept: 'application/json' },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.status === 'ok' && Array.isArray(data.designation)) {
                    setDesignations(data.designation)
                } else {
                    setDesignationError('No designations found')
                }
            })
            .catch(() => setDesignationError('Failed to fetch designations'))
            .finally(() => setLoadingDesignations(false))
    }, [])

    return (
        // Added background color and vertical alignment for a better page layout
        <CContainer fluid className="bg-light py-5 d-flex align-items-center min-vh-100">
            <CRow className="justify-content-center w-100">
                <CCol md={9} lg={7} xl={6}>
                    {/* Enhanced card with shadow, border, and rounded corners */}
                    <CCard className="shadow-lg border-0 rounded-4">
                        {/* A vibrant, gradient header */}
                        <CCardHeader className=" bg-gradient text-primary text-center p-4 rounded-top-4">
                            <h4 className="mb-0">Post New Target</h4>
                        </CCardHeader>
                        <CCardBody className="p-4 p-md-5">
                            <CForm onSubmit={handleSubmit}>
                                {/* Target Type Dropdown */}
                                <div className="mb-4">
                                    <CFormLabel className="fw-semibold text-muted">Target Type</CFormLabel>
                                    <CDropdown className="w-100">
                                        <CDropdownToggle
                                            variant="outline"
                                            color="secondary"
                                            className="text-start w-100 d-flex justify-content-between align-items-center"
                                        >
                                            {selectedTarget}
                                        </CDropdownToggle>
                                        <CDropdownMenu className="w-100">
                                            <CDropdownItem onClick={() => handleSelect('Team Target')}>
                                                Team Target
                                            </CDropdownItem>
                                            <CDropdownItem onClick={() => handleSelect('Individual Target')}>
                                                Individual Target
                                            </CDropdownItem>
                                        </CDropdownMenu>
                                    </CDropdown>
                                </div>

                                {/* Designation Dropdown */}
                                <div className="mb-4">
                                    <CFormLabel className="fw-semibold text-muted">Designation</CFormLabel>
                                    <CDropdown className="w-100">
                                        <CDropdownToggle
                                            variant="outline"
                                            color="secondary"
                                            className="text-start w-100 d-flex justify-content-between align-items-center"
                                        >
                                            {loadingDesignations ? (
                                                <span>
                                                    <CSpinner size="sm" className="me-2" />
                                                    Loading...
                                                </span>
                                            ) : (
                                                designationName
                                            )}
                                        </CDropdownToggle>
                                        <CDropdownMenu className="w-100">
                                            {/* Logic for loading/error/data states */}
                                            {!loadingDesignations && !designationError ? (
                                                designations.map((d) => (
                                                    <CDropdownItem key={d.id} onClick={() => handleDesignationSelect(d)}>
                                                        {d.name}
                                                    </CDropdownItem>
                                                ))
                                            ) : (
                                                <CDropdownItem disabled>
                                                    {loadingDesignations ? 'Loading...' : designationError}
                                                </CDropdownItem>
                                            )}
                                        </CDropdownMenu>
                                    </CDropdown>
                                </div>

                                {/* Form Fields */}
                                <div className="mb-3">
                                    <CFormLabel className="fw-semibold text-muted">Description</CFormLabel>
                                    <CFormTextarea name="description" value={formData.description} onChange={handleChange} required />
                                </div>

                                <CRow>
                                    <CCol sm={6} className="mb-3">
                                        <CFormLabel className="fw-semibold text-muted">Sq Yards</CFormLabel>
                                        <CFormInput type="number" name="sqyards" value={formData.sqyards} onChange={handleChange} required />
                                    </CCol>
                                    <CCol sm={6} className="mb-3">
                                        <CFormLabel className="fw-semibold text-muted">Units</CFormLabel>
                                        <CFormInput type="number" name="Units" value={formData.Units} onChange={handleChange} required />
                                    </CCol>
                                </CRow>

                                <div className="mb-4">
                                    <CFormLabel className="fw-semibold text-muted">Time (Month)</CFormLabel>
                                    <CFormInput type="number" name="Time" placeholder="e.g., 2 months" value={formData.Time} onChange={handleChange} required />
                                </div>

                                {/* Submit Button */}
                                <div className="d-grid mt-4">
                                    <CButton color="primary" type="submit" size="lg" className="fw-semibold">
                                        Submit Target
                                    </CButton>
                                </div>
                            </CForm>

                            {/* Alerts with solid variant for better visibility */}
                            {message && (
                                <CAlert color="success" variant="solid" className="mt-4 text-center">
                                    {message}
                                </CAlert>
                            )}
                            {error && (
                                <CAlert color="danger" variant="solid" className="mt-4 text-center">
                                    {error}
                                </CAlert>
                            )}
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </CContainer>
    )
}

export default PostTargets