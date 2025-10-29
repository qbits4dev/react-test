import React, { useState, useEffect } from 'react'
import {
  CCard, CCardBody, CCol, CContainer, CRow, CForm, CFormInput, CFormSelect,
  CSpinner, CFormLabel, CButton, CAlert, CFormTextarea, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilArrowLeft } from '@coreui/icons'

export default function RegisterAgentWizard() {
  const navigate = useNavigate()

  // --- form state with all fields ---
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    father_name: '',
    dob: '',
    gender: '',
    email: '',
    mobile: '',
    password: '',
    marital_status: '',
    education: '',
    language: '',
    occupation: '',
    work_experience: '',
    income: '',
    adhar: '',
    pan: '',
    designation: '',
    reference_agent: '',
    agent_team: '',
    work_location: '',
    bank_name: '',
    branch: '',
    account_number: '',
    ifsc_code: '',
    address: '',
    nominiee: '',
    relationship: '',
    nominee_mobile: '',
    aadhaar_file: null,
    pan_file: null,
    photo: null,
    u_id: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    pincode: ''
  })

  const [designations, setDesignations] = useState([])
  const [designationError, setDesignationError] = useState('')
  const [loadingDesignations, setLoadingDesignations] = useState(true)

  const [errors, setErrors] = useState({})
  const [alert, setAlert] = useState({ visible: false, message: '', color: 'success' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [registeredUID, setRegisteredUID] = useState('')

  // Restore form state from localStorage when page loads
  useEffect(() => {
    const saved = localStorage.getItem('registerAgentForm')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        // Files cannot be persisted, always null on reload
        parsed.aadhaar_file = null
        parsed.pan_file = null
        parsed.photo = null
        setForm(parsed)
      } catch {}
    }
  }, [])

  useEffect(() => {
    fetch(`${globalThis.apiBaseUrl}/register/?key=designation`, { headers: { accept: 'application/json' } })
      .then(res => res.json())
      .then(data => {
        if (data && data.status === 'ok' && Array.isArray(data.designation)) setDesignations(data.designation)
        else setDesignationError('No designations found')
      })
      .catch(() => setDesignationError('Failed to fetch designations'))
      .finally(() => setLoadingDesignations(false))
  }, [])

  // Helper: updates field and persists to localStorage
  const setFormField = (name, value) => {
    setForm(prev => {
      const updated = { ...prev, [name]: value }
      // Only primitive values, files are not persisted
      const serializable = { ...updated, aadhaar_file: null, pan_file: null, photo: null }
      localStorage.setItem('registerAgentForm', JSON.stringify(serializable))
      return updated
    })
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  // Handle file input (do not persist file/blobs)
  const handleFileChange = (e) => {
    const { name, files } = e.target
    if (!files || files.length === 0) return
    const file = files[0]
    if (file.size > 2 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, [name]: 'File size must be less than 2MB' }))
      setForm(prev => ({ ...prev, [name]: null }))
    } else {
      setFormField(name, file)
    }
  }

  // Universal change handler (persists on every change)
  const handleChange = (e) => {
    const name = e.target.name
    let value = e.target.value

    // Input sanitation
    if (name === 'pan') value = value.toUpperCase().replace(/[^A-Z0-9]/g, '')
    else if (['first_name', 'last_name', 'father_name', 'nominiee', 'relationship', 'language', 'education', 'occupation', 'work_location', 'branch', 'bank_name', 'address_line1', 'address_line2', 'city', 'state'].includes(name))
      value = value.replace(/[^A-Za-z0-9 ,\-\/]/g, '')
    else if (['mobile', 'work_experience', 'account_number', 'income', 'adhar', 'nominee_mobile', 'pincode'].includes(name))
      value = value.replace(/[^0-9]/g, '')
    else if (name === 'ifsc_code') value = value.toUpperCase().replace(/[^A-Z0-9]/g, '')

    setFormField(name, value)

    if (name === 'dob' && value) {
      const birthDate = new Date(value)
      const today = new Date()
      let age = today.getFullYear() - birthDate.getFullYear()
      const m = today.getMonth() - birthDate.getMonth()
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--
      if (age < 18) setErrors(prev => ({ ...prev, dob: 'Age must be at least 18' }))
    }
  }

  const renderError = (field) => errors[field] && (
    <small className="text-danger d-block mt-1">{errors[field]}</small>
  )

  const validateField = (name, value) => {
    switch (name) {
      case 'first_name': case 'last_name': case 'father_name': case 'nominiee': case 'relationship':
      case 'reference_agent': case 'agent_team': case 'branch': case 'bank_name': case 'work_location':
      case 'address': case 'address_line1': case 'city': case 'state': case 'pincode':
        if (!value) return 'This field is required'
        break
      case 'mobile': case 'nominee_mobile':
        if (!/^[0-9]{10}$/.test(value)) return 'Enter a valid 10-digit phone number'
        break
      case 'email':
        if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email'
        break
      case 'work_experience':
        if (value && !/^[0-9]{1,2}$/.test(value)) return 'Enter valid experience'
        break
      case 'account_number':
        if (value && !/^[0-9]{9,18}$/.test(value)) return 'Invalid account number'
        break
      case 'ifsc_code':
        if (value && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(value)) return 'Invalid IFSC code'
        break
      case 'adhar':
        if (!/^[0-9]{12}$/.test(value)) return 'Aadhaar must be 12 digits'
        break
      case 'pan':
        if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value)) return 'Invalid PAN format'
        break
      case 'password':
        if (!value) return 'Password required'
        if (value.length < 6) return 'Password must be ≥ 6 chars'
        break
      case 'dob':
        if (!value) return 'Required'
        const birthDate = new Date(value)
        const today = new Date()
        let age = today.getFullYear() - birthDate.getFullYear()
        if (age < 18) return 'Age must be ≥ 18'
        break
      case 'photo': case 'aadhaar_file': case 'pan_file':
        if (!value) return 'File required'
        break
      default:
        return ''
    }
    return ''
  }

  const validateAll = () => {
    const requiredFields = [
      'first_name', 'last_name', 'father_name', 'dob', 'gender', 'email', 'mobile', 'password', 'marital_status', 'education', 'language', 'occupation', 'work_experience', 'income', 'adhar', 'pan',
      'designation', 'reference_agent', 'agent_team', 'work_location', 'bank_name', 'branch', 'account_number', 'ifsc_code', 'nominiee', 'relationship', 'nominee_mobile',
      'aadhaar_file', 'pan_file', 'photo', 'address', 'city', 'state', 'pincode'
    ]
    const newErrors = {}
    requiredFields.forEach(f => {
      const err = validateField(f, form[f])
      if (err) newErrors[f] = err
    })
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e && e.preventDefault()
    if (!validateAll()) {
      setAlert({ visible: true, message: 'Please fix the validation errors.', color: 'danger' })
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    setIsSubmitting(true)
    setAlert({ visible: false, message: '' })

    try {
      const formData = new FormData()
      Object.entries(form).forEach(([key, val]) => {
        if (val !== null && val !== undefined && val !== '') {
          if (key === 'photo' && val?.file) formData.append('photo', val.file)
          else if (['aadhaar_file', 'pan_file'].includes(key)) formData.append(key, val)
          else formData.append(key, val)
        }
      })
      formData.append('role', 'agent')

      const res = await fetch(`${globalThis.apiBaseUrl}/auth/register`, { method: 'POST', body: formData })
      const data = await res.json()
      if (res.ok) {
        setRegisteredUID(data.u_id || data.user_id || 'N/A')
        setShowSuccessModal(true)
        localStorage.removeItem('registerAgentForm')
      } else {
        setAlert({ visible: true, message: data.message || 'Registration failed.', color: 'danger' })
      }
    } catch (err) {
      console.error(err)
      setAlert({ visible: true, message: 'Network error.', color: 'danger' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleModalClose = () => {
    localStorage.removeItem('registerAgentForm')
    setShowSuccessModal(false)
    navigate('/AdminDashboard')
  }

  // --- UI ---
  return (
    <CContainer className="py-5">
      <CRow className="justify-content-center">
        <CCol xs={12} lg={10} xl={8}>
          <CCard className="mb-4" style={{ borderRadius: '16px', border: 'none' }}>
            <CCardBody className="p-4 p-md-5">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <CButton color="primary" variant="ghost" onClick={() => navigate(-1)}>
                  <CIcon icon={cilArrowLeft} className="me-2" />
                </CButton>
                <h2 className="m-0">Agent Registration</h2>
                <div style={{ width: 80 }} />
              </div>

              {alert.visible &&
                <CAlert color={alert.color} dismissible onClose={() => setAlert({ ...alert, visible: false })}>{alert.message}</CAlert>
              }

              <CForm onSubmit={handleSubmit}>
                {/* Personal Details */}
                <h5 className="text-primary mb-3">Personal Details</h5>
                <CRow className="g-3 mb-3">
                  <CCol md={6}><CFormInput floating="true" label="First Name" name="first_name" value={form.first_name} onChange={handleChange} required />{renderError('first_name')}</CCol>
                  <CCol md={6}><CFormInput floating="true" label="Last Name" name="last_name" value={form.last_name} onChange={handleChange} required />{renderError('last_name')}</CCol>
                </CRow>
                <CRow className="g-3 mb-3">
                  <CCol md={6}><CFormInput floating="true" label="Father's Name" name="father_name" value={form.father_name} onChange={handleChange} required />{renderError('father_name')}</CCol>
                  <CCol md={6}><CFormInput floating="true" label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />{renderError('email')}</CCol>
                </CRow>
                <CRow className="g-3 mb-3">
                  <CCol md={6}><CFormInput floating="true" label="Mobile" name="mobile" maxLength={10} value={form.mobile} onChange={handleChange} required />{renderError('mobile')}</CCol>
                  <CCol md={6}><CFormInput floating="true" label="Password" name="password" type="password" value={form.password} onChange={handleChange} required />{renderError('password')}</CCol>
                </CRow>
                <CRow className="g-3 mb-3">
                  <CCol md={6}><CFormInput floating="true" label="Date of Birth" type="date" name="dob" value={form.dob} onChange={handleChange} required />{renderError('dob')}</CCol>
                  <CCol md={6}>
                    <CFormSelect floating="true" label="Gender" name="gender" value={form.gender} onChange={handleChange} required>
                      <option value="">Select</option>
                      <option>Male</option>
                      <option>Female</option>
                    </CFormSelect>
                    {renderError('gender')}
                  </CCol>
                </CRow>
                <CRow className="g-3 mb-3">
                  <CCol md={4}><CFormSelect floating="true" label="Marital Status" name="marital_status" value={form.marital_status} onChange={handleChange}>
                    <option value="">Select</option>
                    <option>Single</option>
                    <option>Married</option>
                  </CFormSelect>{renderError('marital_status')}</CCol>
                  <CCol md={4}><CFormInput floating="true" label="Education" name="education" value={form.education} onChange={handleChange} />{renderError('education')}</CCol>
                  <CCol md={4}><CFormSelect floating="true" label="Language" name="language" value={form.language} onChange={handleChange}>
                    <option value="">Select</option>
                    <option>English</option>
                    <option>Hindi</option>
                    <option>Telugu</option>
                  </CFormSelect>{renderError('language')}</CCol>
                </CRow>
                <CRow className="g-3 mb-3">
                  <CCol md={6}><CFormInput floating="true" label="Occupation" name="occupation" value={form.occupation} onChange={handleChange} />{renderError('occupation')}</CCol>
                  <CCol md={6}><CFormInput floating="true" label="Work Experience (Years)" name="work_experience" maxLength={2} value={form.work_experience} onChange={handleChange} />{renderError('work_experience')}</CCol>
                </CRow>
                <CRow className="g-3 mb-3">
                  <CCol md={6}><CFormInput floating="true" label="Annual Income" name="income" value={form.income} onChange={handleChange} />{renderError('income')}</CCol>
                  <CCol md={6}><CFormInput floating="true" label="Aadhaar Number" name="adhar" maxLength={12} value={form.adhar} onChange={handleChange} />{renderError('adhar')}</CCol>
                </CRow>
                <CRow className="g-3 mb-3">
                  <CCol md={6}><CFormInput floating="true" label="PAN Number" name="pan" maxLength={10} value={form.pan} onChange={handleChange} />{renderError('pan')}</CCol>
                  <CCol md={6}>
                    <CFormSelect
                      floating
                      label="Designation"
                      name="designation"
                      value={form.designation}
                      onChange={handleChange}
                      disabled={loadingDesignations}
                    >
                      <option value="">Select Designation</option>
                      {!loadingDesignations && !designationError && designations.map((d, idx) => (
                        <option key={idx} value={d.id || d.name}>{d.name}</option>
                      ))}
                    </CFormSelect>
                    {designationError && <div className="text-danger small mt-1">{designationError}</div>}
                    {renderError('designation')}
                  </CCol>
                </CRow>

                {/* Work & Bank */}
                <h5 className="text-primary mb-3 mt-4">Work & Bank Details</h5>
                <CRow className="g-3 mb-3">
                  <CCol md={6}><CFormInput floating="true" label="Reference Agent Code" name="reference_agent" value={form.reference_agent} onChange={handleChange} />{renderError('reference_agent')}</CCol>
                  <CCol md={6}><CFormInput floating="true" label="Agent Team" name="agent_team" value={form.agent_team} onChange={handleChange} />{renderError('agent_team')}</CCol>
                </CRow>
                <CRow className="g-3 mb-3">
                  <CCol md={6}><CFormInput floating="true" label="Work Location" name="work_location" value={form.work_location} onChange={handleChange} />{renderError('work_location')}</CCol>
                  <CCol md={6}><CFormInput floating="true" label="Bank Name" name="bank_name" value={form.bank_name} onChange={handleChange} />{renderError('bank_name')}</CCol>
                </CRow>
                <CRow className="g-3 mb-3">
                  <CCol md={6}><CFormInput floating="true" label="Branch" name="branch" value={form.branch} onChange={handleChange} />{renderError('branch')}</CCol>
                  <CCol md={6}><CFormInput floating="true" label="Account Number" name="account_number" value={form.account_number} onChange={handleChange} />{renderError('account_number')}</CCol>
                </CRow>
                <CRow className="g-3 mb-3">
                  <CCol md={6}><CFormInput floating="true" label="IFSC Code" name="ifsc_code" maxLength={11} value={form.ifsc_code} onChange={handleChange} />{renderError('ifsc_code')}</CCol>
                  <CCol md={6}><CFormInput floating="true" label="Nominee Name" name="nominiee" value={form.nominiee} onChange={handleChange} />{renderError('nominiee')}</CCol>
                </CRow>
                <CRow className="g-3 mb-3">
                  <CCol md={6}><CFormInput floating="true" label="Relation with Nominee" name="relationship" value={form.relationship} onChange={handleChange} />{renderError('relationship')}</CCol>
                  <CCol md={6}><CFormInput floating="true" label="Nominee Mobile" name="nominee_mobile" maxLength={10} value={form.nominee_mobile} onChange={handleChange} />{renderError('nominee_mobile')}</CCol>
                </CRow>

                {/* Upload Documents */}
                <h5 className="text-primary mb-3 mt-4">Upload Documents</h5>
                <CRow className="g-4 align-items-stretch text-center mb-4">
                  {/* Profile Photo */}
                  <CCol xs={12} md={6}>
                    <div
                      className="p-4 rounded-4 shadow-sm border bg-white h-100 d-flex flex-column align-items-center justify-content-center"
                      style={{ minHeight: 400 }}
                    >
                      <CFormLabel className="fw-semibold d-block mb-3 fs-5 text-primary">
                        Profile Photo
                      </CFormLabel>
                      {form.photo ?
                        <>
                          <img
                            src={form.photo.previewUrl}
                            alt="Profile Preview"
                            className="rounded-circle shadow-sm mb-3 border border-primary"
                            style={{
                              width: 140,
                              height: 140,
                              objectFit: 'cover',
                              transition: 'transform 0.2s ease-in-out',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                            onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                          />
                          <div className="d-flex justify-content-center gap-2">
                            <CButton
                              color="danger"
                              variant="outline"
                              size="sm"
                              onClick={() => setFormField('photo', null)}
                            >
                              Remove Photo
                            </CButton>
                          </div>
                        </>
                        : (
                          <div
                            className="d-flex flex-column align-items-center justify-content-center p-3 rounded-3 border border-dashed w-100"
                            style={{
                              borderStyle: 'dashed',
                              borderColor: '#6c757d',
                              minHeight: 200,
                              maxWidth: 260,
                            }}
                          >
                            <CButton
                              color="primary"
                              variant="ghost"
                              className="fw-semibold mb-2"
                              onClick={() => document.getElementById('photoInput').click()}
                            >
                              Upload Photo
                            </CButton>
                            <small className="text-muted mt-2">JPG / PNG • Max 2 MB</small>
                            <input
                              id="photoInput"
                              type="file"
                              accept="image/*"
                              hidden
                              onChange={e => {
                                const file = e.target.files[0]
                                if (!file) return
                                const previewUrl = URL.createObjectURL(file)
                                setFormField('photo', { file, previewUrl })
                              }}
                            />
                          </div>
                        )}
                      {renderError('photo')}
                    </div>
                  </CCol>
                  {/* Aadhaar + PAN Upload */}
                  <CCol xs={12} md={6}>
                    <div
                      className="p-4 rounded-4 shadow-sm border bg-white h-100 d-flex flex-column justify-content-between"
                      style={{ minHeight: 400 }}
                    >
                      <CFormLabel className="fw-semibold d-block mb-4 fs-5 text-primary text-center">
                        Aadhaar & PAN Uploads
                      </CFormLabel>
                      <CRow className="g-4 text-center flex-grow-1">
                        <CCol xs={12} sm={6}>
                          {form.aadhaar_file ? (
                            <div className="border border-success rounded-3 p-3 bg-light d-flex flex-column align-items-center justify-content-between h-100">
                              <div>
                                <i className="bi bi-file-earmark-pdf text-danger fs-1"></i>
                                <div className="fw-semibold mt-2">{form.aadhaar_file.name}</div>
                              </div>
                              <CButton
                                color="danger"
                                variant="outline"
                                size="sm"
                                className="mt-3"
                                onClick={() => setFormField('aadhaar_file', null)}
                              >
                                Remove Aadhaar
                              </CButton>
                            </div>
                          ) : (
                            <div
                              className="d-flex flex-column align-items-center justify-content-center p-3 rounded-3 border border-dashed h-100"
                              style={{ borderStyle: 'dashed', borderColor: '#6c757d', minHeight: 160 }}
                            >
                              <CButton
                                color="primary"
                                variant="ghost"
                                className="fw-semibold"
                                onClick={() => document.getElementById('aadhaarFileInput').click()}
                              >
                                Upload Aadhaar (PDF)
                              </CButton>
                              <small className="text-muted mt-2">PDF • Max 2 MB</small>
                              <input
                                id="aadhaarFileInput"
                                type="file"
                                accept="application/pdf"
                                hidden
                                name="aadhaar_file"
                                onChange={handleFileChange}
                              />
                            </div>
                          )}
                          {renderError('aadhaar_file')}
                        </CCol>
                        <CCol xs={12} sm={6}>
                          {form.pan_file ? (
                            <div className="border border-success rounded-3 p-3 bg-light d-flex flex-column align-items-center justify-content-between h-100">
                              <div>
                                <i className="bi bi-file-earmark-pdf text-danger fs-1"></i>
                                <div className="fw-semibold mt-2">{form.pan_file.name}</div>
                              </div>
                              <CButton
                                color="danger"
                                variant="outline"
                                size="sm"
                                className="mt-3"
                                onClick={() => setFormField('pan_file', null)}
                              >
                                Remove PAN
                              </CButton>
                            </div>
                          ) : (
                            <div
                              className="d-flex flex-column align-items-center justify-content-center p-3 rounded-3 border border-dashed h-100"
                              style={{ borderStyle: 'dashed', borderColor: '#6c757d', minHeight: 160 }}
                            >
                              <CButton
                                color="primary"
                                variant="ghost"
                                className="fw-semibold"
                                onClick={() => document.getElementById('panFileInput').click()}
                              >
                                Upload PAN (PDF)
                              </CButton>
                              <small className="text-muted mt-2">PDF • Max 2 MB</small>
                              <input
                                id="panFileInput"
                                type="file"
                                accept="application/pdf"
                                hidden
                                name="pan_file"
                                onChange={handleFileChange}
                              />
                            </div>
                          )}
                          {renderError('pan_file')}
                        </CCol>
                      </CRow>
                    </div>
                  </CCol>
                </CRow>

                {/* Address */}
                <h5 className="text-primary mb-3 mt-4">Address</h5>
                <CRow className="g-3 mb-3">
                  <CCol md={12}><CFormTextarea floating="true" label="Address" name="address" rows={2} value={form.address} onChange={handleChange} />{renderError('address')}</CCol>
                </CRow>
                <CRow className="g-3 mb-3">
                  <CCol md={6}><CFormInput floating="true" label="City" name="city" value={form.city} onChange={handleChange} />{renderError('city')}</CCol>
                  <CCol md={6}><CFormInput floating="true" label="State" name="state" value={form.state} onChange={handleChange} />{renderError('state')}</CCol>
                </CRow>
                <CRow className="g-3 mb-3">
                  <CCol md={6}><CFormInput floating="true" label="Pincode" name="pincode" maxLength={6} value={form.pincode} onChange={handleChange} />{renderError('pincode')}</CCol>
                </CRow>

                <div className="d-grid mt-4">
                  <CButton color="primary" size="lg" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <><CSpinner size="sm" className="me-2" />Submitting...</> : 'Register Agent'}
                  </CButton>
                </div>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CModal visible={showSuccessModal} onClose={handleModalClose} alignment="center" backdrop="static">
        <CModalHeader><CModalTitle>Registration  Successful!</CModalTitle></CModalHeader>
        <CModalBody>
          <p>The agent has been registered successfully.</p>
          <p><strong>Agent UID:</strong> {registeredUID}</p>
        </CModalBody>
        <CModalFooter><CButton color="primary" onClick={handleModalClose}>Go to Dashboard</CButton></CModalFooter>
      </CModal>
    </CContainer>
  )
}
