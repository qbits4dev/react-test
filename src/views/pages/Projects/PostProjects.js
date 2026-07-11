import React, { useState } from 'react'
import {
  CCard,
  CCardBody,
  CForm,
  CFormInput,
  CFormTextarea,
  CFormSelect,
  CRow,
  CCol,
  CButton,
  CFormLabel,
  CSpinner,
  CFormFeedback,
} from '@coreui/react'
import { sanitizeNumeric, sanitizeText, sanitizeRestrictedText } from '../../../utils/validation'

const statusOptions = ['Ongoing', 'Completed', 'Planned', 'On Hold']

export default function ProjectForm() {
  const today = new Date()
  const past10YearsDate = new Date(today.getFullYear() - 10, today.getMonth(), today.getDate()).toISOString().split('T')[0]

  const [form, setForm] = useState({
    name: '',
    description: '',
    location: '',
    start_date: '',
    end_date: '',
    status: '',
    total_area: '',
  })
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [modalMessage, setModalMessage] = useState('')
  const [errors, setErrors] = useState({})

  const validateField = (name, value, currentFormState = form) => {
    const v = String(value || '').trim()
    if (name === 'name' && !v) return 'Project Name is required'
    if (name === 'location' && !v) return 'Location is required'
    
    if (name === 'description') {
      if (!v) return 'Description is required'
      if (v.length < 10) return 'Description must be at least 10 characters'
      if (v.length > 500) return 'Description cannot exceed 500 characters'
      if (/[^A-Za-z0-9 .,\-()\/]/.test(v)) {
        return 'Description contains invalid characters. Only letters, numbers, spaces, and . , - ( ) / are allowed.'
      }
    }
    
    if (name === 'total_area') {
      if (!v) return 'Total Area is required'
      if (Number(v) <= 0) return 'Total Area must be greater than 0'
    }
    
    if (name === 'start_date') {
      if (!v) return 'Start Date is required'
      const tenYearsAgo = new Date()
      tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 10)
      tenYearsAgo.setHours(0, 0, 0, 0)
      const selectedStart = new Date(v)
      if (selectedStart < tenYearsAgo) {
        return 'Start Date cannot be older than 10 years'
      }
      if (currentFormState.end_date && new Date(currentFormState.end_date) <= selectedStart) {
        return 'Start Date must be before the End Date'
      }
    }
    
    if (name === 'end_date') {
      if (!v) return 'End Date is required'
      const selectedEnd = new Date(v)
      if (currentFormState.start_date) {
        const selectedStart = new Date(currentFormState.start_date)
        if (selectedEnd <= selectedStart) {
          return 'End Date must be after the Start Date'
        }
      } else {
        const tenYearsAgo = new Date()
        tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 10)
        tenYearsAgo.setHours(0, 0, 0, 0)
        if (selectedEnd < tenYearsAgo) {
          return 'End Date cannot be older than 10 years'
        }
      }
    }
    
    if (name === 'status' && !v) return 'Status is required'
    
    return ''
  }

  // Handle text & select input
  const handleChange = (e) => {
    const { name, value } = e.target
    let nextValue = value
    if (name === 'total_area') {
      nextValue = sanitizeNumeric(value, 10)
    } else if (['name', 'location'].includes(name)) {
      nextValue = sanitizeRestrictedText(value, 120)
    } else if (name === 'description') {
      nextValue = value.replace(/[^A-Za-z0-9 .,\-()\/]/g, '').slice(0, 500)
    } else {
      nextValue = sanitizeText(value, 120)
    }

    setForm((prev) => {
      const updatedForm = { ...prev, [name]: nextValue }
      
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors }
        newErrors[name] = validateField(name, nextValue, updatedForm)
        
        if (name === 'start_date' && updatedForm.end_date) {
          newErrors.end_date = validateField('end_date', updatedForm.end_date, updatedForm)
        }
        if (name === 'end_date' && updatedForm.start_date) {
          newErrors.start_date = validateField('start_date', updatedForm.start_date, updatedForm)
        }
        
        return newErrors
      })
      
      return updatedForm
    })
  }

  // Handle multiple photo uploads
  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files)
    const validFiles = files.filter((f) => /^image\/(jpeg|jpg|png|webp)$/i.test(f.type) && f.size <= 5 * 1024 * 1024)
    if (validFiles.length !== files.length) {
      setModalMessage('Error: Some files were ignored. Only JPG/PNG/WEBP up to 5MB are allowed.')
      setShowModal(true)
    }
    setPhotos((prev) => [...prev, ...validFiles])
  }

  const removePhoto = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const nextErrors = {
      name: validateField('name', form.name),
      description: validateField('description', form.description),
      location: validateField('location', form.location),
      start_date: validateField('start_date', form.start_date),
      end_date: validateField('end_date', form.end_date),
      status: validateField('status', form.status),
      total_area: validateField('total_area', form.total_area),
    }
    setErrors(nextErrors)
    if (Object.values(nextErrors).some(Boolean)) return
    setLoading(true)

    // Prepare data as per API requirements
    const payload = {
      ...form,
      status: form.status.toLowerCase(),
      total_area: Number(form.total_area),
    }

    try {
      const apiUrl = `${globalThis.apiBaseUrl}/projects/`
      // console.log('API:', apiUrl, '\nData:', payload)

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const responseText = await response.text()
      if (!response.ok) {
        // Try to extract a readable error message
        let errorMsg = responseText
        try {
          const errorObj = JSON.parse(responseText)
          errorMsg = errorObj.detail || errorObj.message || responseText
        } catch {
          errorMsg = responseText
        }
        errorMsg = errorMsg.replace(/[{}"]/g, '')
        setModalMessage(`Error: ${errorMsg}`)
        setShowModal(true)
        throw new Error(errorMsg || 'Failed to submit')
      }

      setModalMessage('Success: Project added successfully')
      setShowModal(true)
      setForm({
        name: '',
        description: '',
        location: '',
        start_date: '',
        end_date: '',
        status: '',
        total_area: '',
      })
      setPhotos([])
    } catch (err) {
      setModalMessage(`Error: ${err.message.replace(/[{}"]/g, '')}`)
      setShowModal(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container my-5">
      <CCard
        className="shadow-lg border-0 rounded-4"
        style={{
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-5px)'
          e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.12)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = '0 15px 50px rgba(0,0,0,0.08)'
        }}
      >
        <CCardBody className="p-4 p-md-5">
          {/* Header */}
          <div className="text-center mb-5">
            <h1
              className="fw-bold"
              style={{
                background: 'linear-gradient(90deg, #7b2ff7, #f107a3)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: 'clamp(1.8rem, 2vw + 0.5rem, 2.5rem)',
              }}
            >
              Create a New Project
            </h1>
            <p
              className="text-medium-emphasis"
              style={{
                color: '#666',
                fontWeight: 500,
              }}
            >
              Fill in the project details below.
            </p>
          </div>

          <CForm onSubmit={handleSubmit}>
            {/* Project Name + Location */}
            <CRow className="g-3 mb-3">
              <CCol md={6}>
                <div style={{ minHeight: '90px' }}>
                  <CFormInput
                    floating
                    label="Project Name *"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Project Name"
                    invalid={!!errors.name}
                    required
                  />
                  {errors.name && <CFormFeedback className="d-block">{errors.name}</CFormFeedback>}
                </div>
              </CCol>
              <CCol md={6}>
                <div style={{ minHeight: '90px' }}>
                  <CFormInput
                    floating
                    label="Location *"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="Location"
                    invalid={!!errors.location}
                    required
                  />
                  {errors.location && <CFormFeedback className="d-block">{errors.location}</CFormFeedback>}
                </div>
              </CCol>
            </CRow>

            {/* Total Area */}
            <CRow className="g-3 mb-3">
              <CCol md={6}>
                <div style={{ minHeight: '90px' }}>
                  <CFormInput
                    floating
                    type="number"
                    label="Total Area (sq. ft) *"
                    name="total_area"
                    value={form.total_area}
                    onChange={handleChange}
                    placeholder="Total Area (sq. ft)"
                    invalid={!!errors.total_area}
                    required
                  />
                  {errors.total_area && <CFormFeedback className="d-block">{errors.total_area}</CFormFeedback>}
                </div>
              </CCol>
              <CCol md={6}>
                <div style={{ minHeight: '90px' }}>
                  <CFormSelect
                    floating
                    label="Project Status *"
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    invalid={!!errors.status}
                    required
                  >
                    <option value="">Select a status</option>
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </CFormSelect>
                  {errors.status && <CFormFeedback className="d-block">{errors.status}</CFormFeedback>}
                </div>
              </CCol>
            </CRow>

            {/* Dates */}
            <CRow className="g-3 mb-3">
              <CCol md={6}>
                <div style={{ minHeight: '90px' }}>
                  <CFormInput
                    floating
                    type="date"
                    label="Start Date *"
                    name="start_date"
                    value={form.start_date}
                    onChange={handleChange}
                    invalid={!!errors.start_date}
                    required
                    min={past10YearsDate}
                  />
                  {errors.start_date && <CFormFeedback className="d-block">{errors.start_date}</CFormFeedback>}
                </div>
              </CCol>
              <CCol md={6}>
                <div style={{ minHeight: '90px' }}>
                  <CFormInput
                    floating
                    type="date"
                    label="End Date *"
                    name="end_date"
                    value={form.end_date}
                    onChange={handleChange}
                    invalid={!!errors.end_date}
                    required
                    min={form.start_date || past10YearsDate}
                  />
                  {errors.end_date && <CFormFeedback className="d-block">{errors.end_date}</CFormFeedback>}
                </div>
              </CCol>
            </CRow>

            {/* Description */}
            <CRow className="g-3 mb-4">
              <CCol>
                <div style={{ minHeight: '120px' }}>
                  <CFormTextarea
                    floating
                    label="Project Description *"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Project Description"
                    rows={3}
                    invalid={!!errors.description}
                    required
                  />
                  {errors.description && <CFormFeedback className="d-block">{errors.description}</CFormFeedback>}
                </div>
              </CCol>
            </CRow>

            {/* Project Photos */}
            <CRow className="mb-4">
              <CCol>
                <CFormLabel className="fw-semibold">Project Photos</CFormLabel>
                <div
                  className="border border-2 border-primary rounded p-4 text-center"
                  style={{
                    cursor: 'pointer',
                    background: '#f8f9fa',
                  }}
                  onClick={() => document.getElementById('projectPhotos').click()}
                >
                  <p className="text-primary mb-1">📸 Click or Drag & Drop to Upload</p>
                  <small className="text-muted">Upload multiple images (max 5MB each)</small>
                </div>

                <input
                  type="file"
                  id="projectPhotos"
                  name="project_photos"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoChange}
                  style={{ display: 'none' }}
                />

                {/* Preview */}
                {photos.length > 0 && (
                  <div className="d-flex flex-wrap gap-3 mt-3">
                    {photos.map((photo, index) => (
                      <div key={index} className="position-relative">
                        <img
                          src={URL.createObjectURL(photo)}
                          alt="preview"
                          style={{
                            width: '100px',
                            height: '100px',
                            objectFit: 'cover',
                            borderRadius: '10px',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                          }}
                        />
                        <CButton
                          size="sm"
                          color="danger"
                          variant="ghost"
                          className="position-absolute top-0 end-0"
                          style={{
                            borderRadius: '50%',
                            transform: 'translate(20%, -20%)',
                          }}
                          onClick={() => removePhoto(index)}
                        >
                          ✕
                        </CButton>
                      </div>
                    ))}
                  </div>
                )}
              </CCol>
            </CRow>

            {/* Submit */}
            <div className="d-grid mt-4">
              <CButton
                color="primary"
                type="submit"
                size="lg"
                style={{
                  fontWeight: 600,
                  borderRadius: '12px',
                }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <CSpinner size="sm" className="me-2" /> Submitting...
                  </>
                ) : (
                  'Add Project'
                )}
              </CButton>
            </div>
          </CForm>
        </CCardBody>
      </CCard>

      {/* Modal for success/error messages */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              background: '#fff',
              padding: '2rem',
              borderRadius: '12px',
              minWidth: '300px',
              textAlign: 'center',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            }}
          >
            <div
              style={{
                marginBottom: '1rem',
                color: modalMessage.startsWith('Error:') ? '#d32f2f' : '#388e3c',
                fontWeight: 600,
                fontSize: '1.1rem',
              }}
            >
              {modalMessage.replace(/^Error:\s*/, '').replace(/^Success:\s*/, '')}
            </div>
            <button
              style={{
                padding: '0.5rem 1.5rem',
                borderRadius: '8px',
                border: 'none',
                background: '#4e54c8',
                color: '#fff',
                fontWeight: 600,
                cursor: 'pointer',
              }}
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
