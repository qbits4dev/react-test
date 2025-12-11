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
} from '@coreui/react'

const statusOptions = ['Ongoing', 'Completed', 'Planned', 'On Hold']

export default function ProjectForm() {
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

  // Handle text & select input
  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  // Handle multiple photo uploads
  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files)
    setPhotos((prev) => [...prev, ...files])
  }

  const removePhoto = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Prepare data as per API requirements
    const payload = {
      ...form,
      status: form.status.toLowerCase(),
      total_area: Number(form.total_area),
    }

    try {
      // const apiUrl = `${globalThis.apiBaseUrl}/projects/`
      // console.log('API:', apiUrl, '\nData:', payload)

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('API Error:', errorText)
        throw new Error('Failed to submit')
      }

      alert('Project submitted successfully!')
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
      alert(`Error: ${err.message}`)
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
                <CFormInput
                  floating
                  label="Project Name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Project Name"
                  required
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  floating
                  label="Location"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Location"
                  required
                />
              </CCol>
            </CRow>

            {/* Total Area */}
            <CRow className="g-3 mb-3">
              <CCol md={6}>
                <CFormInput
                  floating
                  type="number"
                  label="Total Area (sq. ft)"
                  name="total_area"
                  value={form.total_area}
                  onChange={handleChange}
                  placeholder="Total Area (sq. ft)"
                  required
                />
              </CCol>
              <CCol md={6}>
                <CFormSelect
                  floating
                  label="Project Status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a status</option>
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>

            {/* Dates */}
            <CRow className="g-3 mb-3">
              <CCol md={6}>
                <CFormInput
                  floating
                  type="date"
                  label="Start Date"
                  name="start_date"
                  value={form.start_date}
                  onChange={handleChange}
                  required
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  floating
                  type="date"
                  label="End Date"
                  name="end_date"
                  value={form.end_date}
                  onChange={handleChange}
                  required
                />
              </CCol>
            </CRow>

            {/* Description */}
            <CRow className="g-3 mb-4">
              <CCol>
                <CFormTextarea
                  floating
                  label="Project Description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Project Description"
                  rows={3}
                  required
                />
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
    </div>
  )
}
