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
import { useNavigate } from 'react-router-dom'

export default function LeadForm() {
  const navigate = useNavigate()

  const agentIdFromStorage = localStorage.getItem('u_id') || ''
  const [leadType, setLeadType] = useState('')
  const [formData, setFormData] = useState({
    customerId: '',
    agentId: agentIdFromStorage,
    phone: '',
    firstName: '',
    lastName: '',
    interestedIn: '',
    plot: '',
    dateOfVisit: '',
    purpose: '',
    feedback: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  // Example projects with plots and IDs - replace with real data
  const projectsList = [
    {
      name: 'Aditya Heights',
      id: 1,
      plots: [
        { label: 'Plot 101 - East - 200sqyd', id: 101 },
        { label: 'Plot 102 - West - 300sqyd', id: 102 },
      ],
    },
    {
      name: 'Aditya Medows',
      id: 2,
      plots: [
        { label: 'Plot 201 - North - 250sqyd', id: 201 },
        { label: 'Plot 202 - South - 400sqyd', id: 202 },
      ],
    },
  ]

  const chosenProject = projectsList.find(
    (p) => p.name === formData.interestedIn
  )
  const chosenPlot = chosenProject?.plots.find((pl) => pl.label === formData.plot)
  const projectId = chosenProject?.id || 0
  const plotId = chosenPlot?.id || 0

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

    if (formData.dateOfVisit) {
      const selected = new Date(formData.dateOfVisit)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    const apiBody = {
      customer_id: formData.customerId || '',
      plot_id: plotId,
      agent_id: formData.agentId,
      visit_date: formData.dateOfVisit,
      purpose: formData.purpose || 'Site Visit',
      feedback: formData.feedback || '',
      status: 'scheduled',
      project_id: projectId,
    }

    try {
      const res = await fetch('https://api.qbits4dev.com/visits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiBody),
      })
      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(errorText || 'Failed to submit form')
      }
      alert('Form Submitted Successfully ✅')
      navigate('/GetBookVisit')
    } catch (err) {
      alert('Submission failed: ' + err.message)
    } finally {
      setLoading(false)
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

              {/* Agent ID (Read-only) */}
              <CFormLabel>Agent ID</CFormLabel>
              <CFormInput
                name="agentId"
                value={formData.agentId}
                onChange={handleChange}
                placeholder="Ex: AG123456"
                invalid={!!errors.agentId}
                readOnly
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
                invalid={!!errors.interestedIn}
              >
                <option value="">Select Project</option>
                {projectsList.map((proj) => (
                  <option key={proj.id} value={proj.name}>
                    {proj.name}
                  </option>
                ))}
              </CFormSelect>
              <small className="text-danger">{errors.interestedIn}</small>
              <br />

              {/* Plot select */}
              {chosenProject && (
                <>
                  <CFormLabel>Plot Number & Facing</CFormLabel>
                  <CFormSelect
                    name="plot"
                    value={formData.plot}
                    onChange={handleChange}
                    invalid={!!errors.plot}
                  >
                    <option value="">Select Plot</option>
                    {chosenProject.plots.map((p) => (
                      <option key={p.id} value={p.label}>
                        {p.label}
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

              {/* Purpose */}
              <CFormLabel>Purpose</CFormLabel>
              <CFormInput
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                placeholder="Purpose of visit"
              />
              <br />
              {/* Feedback */}
              <CFormLabel>Feedback</CFormLabel>
              <CFormInput
                name="feedback"
                value={formData.feedback}
                onChange={handleChange}
                placeholder="Feedback (optional)"
              />
              <br />

              <CButton color="primary" type="submit" className="mt-3" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit'}
              </CButton>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}
