import React, { useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormFeedback,
  CButton,
  CRow,
  CCol,
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'

export default function LeadForm() {
  const navigate = useNavigate()

  // Get agent ID from localStorage using possible keys
  const agentIdFromStorage =
    localStorage.getItem('user_id') || localStorage.getItem('u_id') || ''

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
  const [touched, setTouched] = useState({})
  const [loading, setLoading] = useState(false)

  // Example static project and plot data
  const projectsList = [
    {
      name: 'Aditya Heights',
      id: 1,
      plots: [
        { label: 'Plot 101 - East - 200sqyd', id: 1 },
        { label: 'Plot 102 - West - 300sqyd', id: 2 },
      ],
    },
    {
      name: 'Aditya Medows',
      id: 2,
      plots: [
        { label: 'Plot 201 - North - 250sqyd', id: 1 },
        { label: 'Plot 202 - South - 400sqyd', id: 2 },
      ],
    },
  ]

  const chosenProject = projectsList.find((p) => p.name === formData.interestedIn)
  const chosenPlot = chosenProject?.plots.find((pl) => pl.label === formData.plot)
  const projectId = chosenProject?.id || 0
  const plotId = chosenPlot?.id || 0

  // -------------------- VALIDATION --------------------
  const validate = () => {
    let errs = {}

    if (leadType === 'Existing') {
      if (!/^[A-Za-z]{2}[0-9]{6}$/.test(formData.customerId)) {
        errs.customerId = 'Customer ID must be 2 letters followed by 6 digits'
      }
    }

    if (!formData.agentId) {
      errs.agentId = 'Agent ID missing from session'
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

  // -------------------- HANDLERS --------------------
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleBlur = (e) => {
    const { name } = e.target
    setTouched({ ...touched, [name]: true })
    validate()
  }

  // -------------------- SUBMIT --------------------
  const handleSubmit = async (e) => {
    e.preventDefault()
    setTouched({
      customerId: true,
      agentId: true,
      phone: true,
      firstName: true,
      lastName: true,
      interestedIn: true,
      plot: true,
      dateOfVisit: true,
    })
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
      
      const res = await fetch(`${globalThis.apiBaseUrl}/visits`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(apiBody),
      })

      if (!res.ok) {
        const errorText = await res.text()
        const message = errorText.includes('<html>')
          ? `Server returned ${res.status} (${res.statusText}). Check API method or URL.`
          : errorText
        throw new Error(message)
      }

      alert('Form Submitted Successfully ✅')
      navigate('/GetBookVisit')
    } catch (err) {
      alert('Submission failed: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  // -------------------- UI --------------------
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
                onBlur={handleBlur}
                invalid={touched.leadType && !leadType}
              >
                <option value="">Select Lead Type</option>
                <option value="New">New Lead</option>
                <option value="Existing">Existing Lead</option>
              </CFormSelect>
              <CFormFeedback invalid>Please select lead type</CFormFeedback>
              <br />

              {leadType === 'Existing' && (
                <>
                  <CFormLabel>Customer ID</CFormLabel>
                  <CFormInput
                    name="customerId"
                    value={formData.customerId}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Ex: AB123456"
                    invalid={touched.customerId && !!errors.customerId}
                  />
                  <CFormFeedback invalid>{errors.customerId}</CFormFeedback>
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
                    onBlur={handleBlur}
                    placeholder="Enter first name"
                    invalid={touched.firstName && !!errors.firstName}
                  />
                  <CFormFeedback invalid>{errors.firstName}</CFormFeedback>
                  <br />

                  <CFormLabel>Last Name</CFormLabel>
                  <CFormInput
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter last name"
                    invalid={touched.lastName && !!errors.lastName}
                  />
                  <CFormFeedback invalid>{errors.lastName}</CFormFeedback>
                  <br />
                </>
              )}

              {/* Agent ID */}
              <CFormLabel>Agent ID</CFormLabel>
              <CFormInput
                name="agentId"
                value={formData.agentId}
                readOnly
                invalid={touched.agentId && !!errors.agentId}
              />
              <CFormFeedback invalid>{errors.agentId}</CFormFeedback>
              <br />

              {/* Phone */}
              <CFormLabel>Phone Number</CFormLabel>
              <CFormInput
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="10-digit phone number"
                invalid={touched.phone && !!errors.phone}
              />
              <CFormFeedback invalid>{errors.phone}</CFormFeedback>
              <br />

              {/* Interested In */}
              <CFormLabel>Interested In</CFormLabel>
              <CFormSelect
                name="interestedIn"
                value={formData.interestedIn}
                onChange={handleChange}
                onBlur={handleBlur}
                invalid={touched.interestedIn && !!errors.interestedIn}
              >
                <option value="">Select Project</option>
                {projectsList.map((proj) => (
                  <option key={proj.id} value={proj.name}>
                    {proj.name}
                  </option>
                ))}
              </CFormSelect>
              <CFormFeedback invalid>{errors.interestedIn}</CFormFeedback>
              <br />

              {/* Plot */}
              {chosenProject && (
                <>
                  <CFormLabel>Plot Number & Facing</CFormLabel>
                  <CFormSelect
                    name="plot"
                    value={formData.plot}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    invalid={touched.plot && !!errors.plot}
                  >
                    <option value="">Select Plot</option>
                    {chosenProject.plots.map((p) => (
                      <option key={p.id} value={p.label}>
                        {p.label}
                      </option>
                    ))}
                  </CFormSelect>
                  <CFormFeedback invalid>{errors.plot}</CFormFeedback>
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
                onBlur={handleBlur}
                invalid={touched.dateOfVisit && !!errors.dateOfVisit}
              />
              <CFormFeedback invalid>{errors.dateOfVisit}</CFormFeedback>
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
