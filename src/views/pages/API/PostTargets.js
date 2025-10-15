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
        sale_type: '',
        stage: '',
        timeframe: '',
        target_units: '',
        insurance_cover: '',
        medical_cover: '',
        tour: '',
        rewards: '',
        salary_monthly: '',
        commission_notes: '',
        salary_eligibility_notes: '',
        other_notes: '',
    })

    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const [selectedTarget, setSelectedTarget] = useState('Select Target Type')

    const handleSelect = (targetType) => setSelectedTarget(targetType)

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
                sale_type: formData.sale_type || 'Direct sale', // default value if blank
                targetType: selectedTarget,
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
                    sale_type: '',
                    stage: '',
                    timeframe: '',
                    target_units: '',
                    insurance_cover: '',
                    medical_cover: '',
                    tour: '',
                    rewards: '',
                    salary_monthly: '',
                    commission_notes: '',
                    salary_eligibility_notes: '',
                    other_notes: '',
                })
                setDesignationName('Select Designation')
                setSelectedTarget('Select Target Type')
            })
            .catch((err) => setError(`Submission failed: ${err.message}`))
    }

    useEffect(() => {
        fetch(`${apiBaseUrl}/register/?key=designation`, { headers: { accept: 'application/json' } })
            .then((res) => res.json())
            .then((data) => {
                if (data.status === 'ok' && Array.isArray(data.designation)) setDesignations(data.designation)
                else setDesignationError('No designations found')
            })
            .catch(() => setDesignationError('Failed to fetch designations'))
            .finally(() => setLoadingDesignations(false))
    }, [])

    return (
        <CContainer fluid className="bg-light py-5 d-flex align-items-center min-vh-100">
            <CRow className="justify-content-center w-100">
                <CCol md={9} lg={7} xl={6}>
                    <CCard className="shadow-lg border-0 rounded-4">
                        <CCardHeader className="bg-gradient text-primary text-center p-4 rounded-top-4">
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
                                            <CDropdownItem onClick={() => handleSelect('Team Target')}>Team Target</CDropdownItem>
                                            <CDropdownItem onClick={() => handleSelect('Individual Target')}>Individual Target</CDropdownItem>
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
                                            {!loadingDesignations && !designationError ? (
                                                designations.map((d) => (
                                                    <CDropdownItem key={d.id} onClick={() => handleDesignationSelect(d)}>
                                                        {d.name}
                                                    </CDropdownItem>
                                                ))
                                            ) : (
                                                <CDropdownItem disabled>{loadingDesignations ? 'Loading...' : designationError}</CDropdownItem>
                                            )}
                                        </CDropdownMenu>
                                    </CDropdown>
                                </div>

                                {/* Core Form Fields from JSON */}
                                <CRow>
                                    <CCol sm={6} className="mb-3">
                                        <CFormLabel className="fw-semibold text-muted">Stage</CFormLabel>
                                        <CFormInput name="stage" value={formData.stage} onChange={handleChange} required />
                                    </CCol>
                                    <CCol sm={6} className="mb-3">
                                        <CFormLabel className="fw-semibold text-muted">Timeframe (Month)</CFormLabel>
                                        <CFormInput name="timeframe" type="number" value={formData.timeframe} onChange={handleChange} required />
                                    </CCol>
                                </CRow>

                                <CRow>
                                    <CCol sm={6} className="mb-3">
                                        <CFormLabel className="fw-semibold text-muted">Target Units</CFormLabel>
                                        <CFormInput name="target_units" type="number" value={formData.target_units} onChange={handleChange} required />
                                    </CCol>
                                    <CCol sm={6} className="mb-3">
                                        <CFormLabel className="fw-semibold text-muted">Insurance Cover</CFormLabel>
                                        <CFormInput name="insurance_cover" value={formData.insurance_cover} onChange={handleChange} required />
                                    </CCol>
                                </CRow>

                                <CRow>
                                    <CCol sm={6} className="mb-3">
                                        <CFormLabel className="fw-semibold text-muted">Medical Cover</CFormLabel>
                                        <CFormInput name="medical_cover" value={formData.medical_cover} onChange={handleChange} required />
                                    </CCol>
                                    <CCol sm={6} className="mb-3">
                                        <CFormLabel className="fw-semibold text-muted">Tour</CFormLabel>
                                        <CFormInput name="tour" value={formData.tour} onChange={handleChange} />
                                    </CCol>
                                </CRow>

                                <div className="mb-3">
                                    <CFormLabel className="fw-semibold text-muted">Rewards</CFormLabel>
                                    <CFormTextarea name="rewards" value={formData.rewards} onChange={handleChange} />
                                </div>

                                <div className="d-grid mt-4">
                                    <CButton color="primary" type="submit" size="lg" className="fw-semibold">
                                        Submit Target
                                    </CButton>
                                </div>
                            </CForm>

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
