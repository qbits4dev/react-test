import React, { useState } from 'react'
import {
    CCard,
    CCardBody,
    CCardHeader,
    CForm,
    CFormInput,
    CFormLabel,
    CFormSelect,
    CButton,
    CRow,
    CCol,
} from '@coreui/react'

import {useNavigate } from 'react-router-dom'

export default function LeadForm() {
    const navigate = useNavigate()
    const [leadType, setLeadType] = useState('')
    const [formData, setFormData] = useState({
        customerId: '',
        agentId: '',
        phone: '',
        firstName: '',
        lastName: '',
        interestedIn: '',
        plot: '',
        dateOfVisit: '',
    })
    const [errors, setErrors] = useState({})

    const projects = {
        'Aditya Heights': ['Plot 101 - East - 200sqyd', 'Plot 102 - West - 300sqyd'],
        'Aditya Medows': ['Plot 201 - North - 250sqyd', 'Plot 202 - South - 400sqyd'],
    }

    // validations
    const validate = () => {
        let errs = {}

        if (leadType === 'Existing') {
            if (!/^[A-Za-z]{2}[0-9]{6}$/.test(formData.customerId)) {
                errs.customerId = 'Customer ID must be 2 letters followed by 6 digits'
            }
        }

        if (!/^[A-Za-z]{2}[0-9]{6}$/.test(formData.agentId)) {
            errs.agentId = 'Agent ID must be 2 letters followed by 6 digits'
        }

        if (!/^[0-9]{10}$/.test(formData.phone)) {
            errs.phone = 'Phone must be 10 digits'
        }

        if (leadType === 'New') {
            if (!/^[A-Za-z]+$/.test(formData.firstName)) {
                errs.firstName = 'First name must contain only alphabets'
            }
            if (!/^[A-Za-z]+$/.test(formData.lastName)) {
                errs.lastName = 'Last name must contain only alphabets'
            }
        }

        if (!formData.interestedIn) {
            errs.interestedIn = 'Please select a project'
        } else if (!formData.plot) {
            errs.plot = 'Please select a plot'
        }

        // date must be 2 days before
        if (formData.dateOfVisit) {
            const selected = new Date(formData.dateOfVisit)
            const today = new Date()
            const diff = (selected - today) / (1000 * 60 * 60 * 24)
            if (diff < 2) {
                errs.dateOfVisit = 'Date must be at least 2 days from today'
            }
        } else {
            errs.dateOfVisit = 'Date of visit required'
        }

        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (validate()) {
            alert('Form Submitted Successfully ✅')
        }
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    return (
        <CRow className="justify-content-center mt-4">
            <CCol md={10} lg={6}>
                <CCard className="shadow-lg border-0 rounded-4">
                    <CCardHeader className="text-primary text-center fw-bold fs-1">
                        Book Site Visit
                    </CCardHeader>
                    <CCardBody>
                        <CForm onSubmit={handleSubmit}>
                            {/* Lead Type */}
                            <CFormLabel>Lead Type</CFormLabel>
                            <CFormSelect
                                name="leadType"
                                value={leadType}
                                onChange={(e) => setLeadType(e.target.value)}
                            >
                                <option value="">Select Lead Type</option>
                                <option value="New">New Lead</option>
                                <option value="Existing">Existing Lead</option>
                            </CFormSelect>
                            <br />

                            {leadType === 'Existing' && (
                                <>
                                    <CFormLabel>Customer ID</CFormLabel>
                                    <CFormInput
                                        name="customerId"
                                        value={formData.customerId}
                                        onChange={handleChange}
                                        placeholder="Ex: AB123456"
                                        invalid={!!errors.customerId}
                                    />
                                    <small className="text-danger">{errors.customerId}</small>
                                    <br />
                                </>
                            )}

                            {leadType === 'New' && (
                                <>
                                    <CFormLabel>First Name</CFormLabel>
                                    <CFormInput
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        placeholder="Enter first name"
                                        invalid={!!errors.firstName}
                                    />
                                    <small className="text-danger">{errors.firstName}</small>
                                    <br />

                                    <CFormLabel>Last Name</CFormLabel>
                                    <CFormInput
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        placeholder="Enter last name"
                                        invalid={!!errors.lastName}
                                    />
                                    <small className="text-danger">{errors.lastName}</small>
                                    <br />
                                </>
                            )}

                            {/* Agent ID */}
                            <CFormLabel>Agent ID</CFormLabel>
                            <CFormInput
                                name="agentId"
                                value={formData.agentId}
                                onChange={handleChange}
                                placeholder="Ex: AG123456"
                                invalid={!!errors.agentId}
                            />
                            <small className="text-danger">{errors.agentId}</small>
                            <br />

                            {/* Phone */}
                            <CFormLabel>Phone Number</CFormLabel>
                            <CFormInput
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="10-digit phone number"
                                invalid={!!errors.phone}
                            />
                            <small className="text-danger">{errors.phone}</small>
                            <br />

                            {/* Interested In */}
                            <CFormLabel>Interested In</CFormLabel>
                            <CFormSelect
                                name="interestedIn"
                                value={formData.interestedIn}
                                onChange={handleChange}
                            >
                                <option value="">Select Project</option>
                                {Object.keys(projects).map((proj, i) => (
                                    <option key={i} value={proj}>
                                        {proj}
                                    </option>
                                ))}
                            </CFormSelect>
                            <small className="text-danger">{errors.interestedIn}</small>
                            <br />

                            {formData.interestedIn && (
                                <>
                                    <CFormLabel>Plot Number & Facing</CFormLabel>
                                    <CFormSelect
                                        name="plot"
                                        value={formData.plot}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select Plot</option>
                                        {projects[formData.interestedIn].map((p, i) => (
                                            <option key={i} value={p}>
                                                {p}
                                            </option>
                                        ))}
                                    </CFormSelect>
                                    <small className="text-danger">{errors.plot}</small>
                                    <br />
                                </>
                            )}

                            {/* Date of Visit */}
                            <CFormLabel>Date of Visit</CFormLabel>
                            <CFormInput
                                type="date"
                                name="dateOfVisit"
                                value={formData.dateOfVisit}
                                onChange={handleChange}
                                invalid={!!errors.dateOfVisit}
                            />
                            <small className="text-danger">{errors.dateOfVisit}</small>
                            <br />

                            <CButton color="primary" type="submit" className="mt-3" onClick={() => navigate('/GetBookVisit')}>
                                Submit
                            </CButton>
                        </CForm>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    )
}
