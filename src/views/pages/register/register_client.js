import React, { useState, useEffect } from 'react'
import {
  CCard, CCardBody, CCol, CContainer, CRow, CForm, CFormInput, CFormSelect,
  CSpinner, CFormLabel, CButton, CAlert, CFormTextarea, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter,
  CProgress
} from '@coreui/react'
import { useNavigate, useLocation } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilArrowLeft } from '@coreui/icons'
import {
  getPasswordStrength,
  sanitizeAlphaNumericBasic,
  sanitizeName,
  sanitizeAddress,
  validateAgeRangeFromDob,
  validateStrongPassword,
} from '../../../utils/validation'

export default function RegisterClientWizard() {
  const navigate = useNavigate()
  const location = useLocation()
  
  const emptyForm = {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    dob: '',
    gender: '',
    reference_agent: '',
    address: '',
    u_id: ''
  }

  const today = new Date()
  const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate()).toISOString().split('T')[0]
  const minDate = new Date(today.getFullYear() - 80, today.getMonth(), today.getDate()).toISOString().split('T')[0]

  const [form, setForm] = useState(emptyForm)
  const [photoFile, setPhotoFile] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [errors, setErrors] = useState({})
  const [alert, setAlert] = useState({ visible: false, message: '', color: 'success' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [registeredUID, setRegisteredUID] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [modalMessage, setModalMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [agentsAndAdmins, setAgentsAndAdmins] = useState([])

  useEffect(() => {
    const fetchAgentsAndAdmins = async () => {
      try {
        const resAgents = await fetch(`${globalThis.apiBaseUrl}/users/`)
        let agentUserIds = []
        if (resAgents.ok) {
          const agentData = await resAgents.json()
          if (agentData?.success && Array.isArray(agentData.users)) {
            agentUserIds = agentData.users
          } else if (Array.isArray(agentData)) {
            agentUserIds = agentData
          }
        }

        let adminData = null
        try {
          const resAdmins = await fetch(`${globalThis.apiBaseUrl}/users/admin`)
          if (resAdmins.ok) {
            adminData = await resAdmins.json()
          } else {
            const resAdminsBackup = await fetch(`${globalThis.apiBaseUrl}/users/admin/`)
            if (resAdminsBackup.ok) {
              adminData = await resAdminsBackup.json()
            }
          }
        } catch (e) {
          console.error('Failed to fetch admin list without trailing slash, trying backup:', e)
          try {
            const resAdminsBackup = await fetch(`${globalThis.apiBaseUrl}/users/admin/`)
            if (resAdminsBackup.ok) {
              adminData = await resAdminsBackup.json()
            }
          } catch (errBackup) {
            console.error('Backup admin fetch failed:', errBackup)
          }
        }

        let adminUserIds = []
        let directAdminDetails = []
        if (adminData) {
          const rawAdmins = adminData?.users || adminData?.admins || adminData || []
          if (Array.isArray(rawAdmins)) {
            rawAdmins.forEach(item => {
              if (typeof item === 'string' || typeof item === 'number') {
                adminUserIds.push(String(item))
              } else if (item && typeof item === 'object') {
                directAdminDetails.push(item)
              }
            })
          }
        }

        const idsToFetch = Array.from(new Set([...agentUserIds, ...adminUserIds]))
        
        const fetchedDetails = await Promise.all(
          idsToFetch.map(async (uId) => {
            try {
              const userRes = await fetch(`${globalThis.apiBaseUrl}/users/${uId}`)
              if (userRes.ok) {
                return await userRes.json()
              }
            } catch (e) {
              console.error(e)
            }
            return null
          })
        )

        const allDetails = [...fetchedDetails, ...directAdminDetails]

        const filtered = allDetails.filter(
          (u) => u && (u.success || u.u_id || u.id) && (String(u.role || '').toLowerCase() === 'agent' || String(u.role || '').toLowerCase() === 'admin')
        ).map((u) => ({
          u_id: u.u_id || u.id,
          name: `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.u_id
        }))

        const uniqueFiltered = []
        const seen = new Set()
        for (const item of filtered) {
          if (item.u_id && !seen.has(item.u_id)) {
            seen.add(item.u_id)
            uniqueFiltered.push(item)
          }
        }

        setAgentsAndAdmins(uniqueFiltered)
      } catch (err) {
        console.error('Error fetching agents/admins:', err)
      }
    }
    fetchAgentsAndAdmins()
  }, [])

  // Populate from navigation state if converting a lead
  useEffect(() => {
    if (location.state?.lead) {
      const lead = location.state.lead
      setForm({
        ...emptyForm,
        first_name: lead.first_name || '',
        last_name: lead.last_name || '',
        email: lead.email || '',
        phone: lead.phone || lead.mobile || '',
        reference_agent: lead.reference_agent || '',
        u_id: lead.u_id || '',
        address: lead.address || '',
      })
    }
  }, [location.state])

  const handleChange = (e) => {
    const name = e.target.name
    let value = e.target.value

    // Input sanitation
    if (['first_name', 'last_name'].includes(name)) value = sanitizeName(value, 50)
    else if (name === 'email') value = value.replace(/[^A-Za-z0-9.@_\-+]/g, '').slice(0, 100)
    else if (name === 'phone') value = value.replace(/[^0-9]/g, '').slice(0, 10)
    else if (name === 'password') value = value.replace(/\s/g, '').slice(0, 32)
    else if (name === 'address') value = sanitizeAddress(value, 150)
    else if (name === 'reference_agent') value = sanitizeAlphaNumericBasic(value, 30)

    setForm(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))

    if (name === 'dob' && value) {
      const birthDate = new Date(value)
      const today = new Date()
      let age = today.getFullYear() - birthDate.getFullYear()
      const m = today.getMonth() - birthDate.getMonth()
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--
      if (age < 18 || age > 80) setErrors(prev => ({ ...prev, dob: 'Age must be between 18 and 80 years old' }))
    }
  }

  const validateField = (name, value) => {
    switch (name) {
      case 'first_name':
        if (!value) return 'First Name is required'
        break
      case 'last_name':
        if (!value) return 'Last Name is required'
        break
      case 'phone':
        if (!value) return 'Phone number is required'
        if (!/^[6-9][0-9]{9}$/.test(value)) return 'Enter a valid 10-digit mobile number starting with 6-9'
        break
      case 'email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter a valid email address'
        break
      case 'password':
        if (!value) return 'Password is required'
        return validateStrongPassword(value)
      case 'gender':
        if (!value) return 'Gender is required'
        break
      case 'dob':
        if (!value) return 'Date of Birth is required'
        if (!validateAgeRangeFromDob(value, 18, 80)) return 'Age must be between 18 and 80 years old'
        break
      case 'address':
        if (!value) return 'Address is required'
        if (/[^A-Za-z0-9 .,\-()/#]/.test(value)) {
          return 'Address contains invalid characters. Only letters, numbers, spaces, and . , - ( ) / # are allowed.'
        }
        break
      default:
        return ''
    }
    return ''
  }

  const validateAll = () => {
    const requiredFields = ['first_name', 'last_name', 'dob', 'gender', 'phone', 'password', 'address']
    const newErrors = {}
    requiredFields.forEach(f => {
      const err = validateField(f, form[f])
      if (err) newErrors[f] = err
    })
    if (form.email) {
      const emailErr = validateField('email', form.email)
      if (emailErr) newErrors.email = emailErr
    }
    if (photoFile) {
      if (!/^image\/(jpeg|jpg|png|webp)$/i.test(photoFile.type)) {
        newErrors.photo_file = 'Photo must be JPG, PNG, or WEBP'
      } else if (photoFile.size > 2 * 1024 * 1024) {
        newErrors.photo_file = 'Photo must be under 2MB'
      }
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const renderError = (field) => errors[field] && (
    <small className="text-danger d-block mt-1">{errors[field]}</small>
  )

  const handleSubmit = async (e) => {
    e && e.preventDefault()
    if (!validateAll()) {
      setAlert({ visible: true, message: 'Please fix the validation errors.', color: 'danger' })
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    setIsSubmitting(true)
    setAlert({ visible: false, message: '' })
    setModalMessage('Submitting...')
    setShowModal(true)

    try {
      const formData = new FormData()
      Object.entries(form).forEach(([key, val]) => {
        if (val !== null && val !== undefined && val !== '') {
          formData.append(key, val)
        }
      })
      if (photoFile) {
        formData.append('photo_file', photoFile)
      }
      formData.append('role', 'customer')

      console.log('Submitting form data:')
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value)
      }

      const isConverting = !!form.u_id
      const url = `${globalThis.apiBaseUrl}/register/customer`

      const res = await fetch(url, { method: 'POST', body: formData })
      const data = await res.json()

      if (res.ok) {
        setRegisteredUID(data.u_id || data.user_id || form.u_id || 'N/A')
        
        if (isConverting) {
          try {
            const deleteUrl = `${globalThis.apiBaseUrl}/users/client/${form.u_id}`
            const deleteRes = await fetch(deleteUrl, { method: 'DELETE' })
            if (deleteRes.ok) {
              console.log(`Converted lead ${form.u_id} deleted successfully.`)
            } else {
              console.error(`Failed to delete converted lead ${form.u_id}. Status: ${deleteRes.status}`)
            }
          } catch (err) {
            console.error('Error deleting lead after conversion:', err)
          }
        }

        setModalMessage(isConverting ? 'Success: Lead converted to client successfully' : 'Success: Client registered successfully')
        setShowModal(true)
      } else {
        let errorMsg = data.message || 'Registration failed.'
        errorMsg = errorMsg.replace(/[{}"]/g, '')
        setModalMessage(`Error: ${errorMsg}`)
        setShowModal(true)
      }
    } catch (err) {
      setModalMessage('Error: Network error.')
      setShowModal(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <CContainer className="py-5">
      <CRow className="justify-content-center">
        <CCol xs={12} lg={10} xl={8}>
          <CCard className="mb-4" style={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}>
            <CCardBody className="p-4 p-md-5">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <CButton color="primary" variant="ghost" onClick={() => navigate(-1)}>
                  <CIcon icon={cilArrowLeft} className="me-2" />
                </CButton>
                <h2 className="m-0">{form.u_id ? 'Convert Lead to Client' : 'Client Registration'}</h2>
                <div style={{ width: 80 }} />
              </div>

              {alert.visible && (
                <CAlert color={alert.color} dismissible onClose={() => setAlert({ ...alert, visible: false })}>{alert.message}</CAlert>
              )}

              <CForm onSubmit={handleSubmit}>
                <h5 className="text-primary mb-3">Personal Details</h5>
                
                <CRow className="g-3 mb-3">
                  <CCol md={6}>
                    <CFormInput floating="true" label="First Name *" name="first_name" value={form.first_name} onChange={handleChange} required />
                    {renderError('first_name')}
                  </CCol>
                  <CCol md={6}>
                    <CFormInput floating="true" label="Last Name *" name="last_name" value={form.last_name} onChange={handleChange} required />
                    {renderError('last_name')}
                  </CCol>
                </CRow>

                <CRow className="g-3 mb-3">
                  <CCol md={6}>
                    <CFormInput floating="true" label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
                    {renderError('email')}
                  </CCol>
                  <CCol md={6}>
                    <CFormInput floating="true" label="Phone Number *" name="phone" maxLength={10} value={form.phone} onChange={handleChange} required />
                    {renderError('phone')}
                  </CCol>
                </CRow>

                <CRow className="g-3 mb-3">
                  <CCol md={6}>
                    <div style={{ position: 'relative' }}>
                      <CFormInput floating="true" label="Password *" name="password" type={showPassword ? 'text' : 'password'} maxLength={32} value={form.password} onChange={handleChange} required style={{ paddingRight: 68 }} />
                      <CButton
                        type="button"
                        color="link"
                        onClick={() => setShowPassword((s) => !s)}
                        style={{ position: 'absolute', right: 10, top: 20, textDecoration: 'none', padding: 0, fontSize: '0.8rem', zIndex: 3, lineHeight: 1 }}
                      >
                        {showPassword ? 'Hide' : 'Show'}
                      </CButton>
                    </div>
                    {form.password && !errors.password && (
                      <div className="mt-2">
                        <small className="text-body-secondary">Password strength: {getPasswordStrength(form.password).label}</small>
                        <CProgress thin color={getPasswordStrength(form.password).color} value={getPasswordStrength(form.password).value} />
                      </div>
                    )}
                    {renderError('password')}
                  </CCol>
                  <CCol md={6}>
                    <CFormInput floating="true" label="Date of Birth *" type="date" name="dob" value={form.dob} onChange={handleChange} min={minDate} max={maxDate} required />
                    {renderError('dob')}
                  </CCol>
                </CRow>

                <CRow className="g-3 mb-3">
                  <CCol md={6}>
                    <CFormSelect floating="true" label="Gender *" name="gender" value={form.gender} onChange={handleChange} required>
                      <option value="">Select Gender</option>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </CFormSelect>
                    {renderError('gender')}
                  </CCol>
                  <CCol md={6}>
                    <CFormSelect floating="true" label="Reference Agent" name="reference_agent" value={form.reference_agent} onChange={handleChange}>
                      <option value="">Select Reference Agent / Admin</option>
                      {agentsAndAdmins.map((item) => (
                        <option key={item.u_id} value={item.u_id}>
                          {item.name} ({item.u_id})
                        </option>
                      ))}
                    </CFormSelect>
                    {renderError('reference_agent')}
                  </CCol>
                </CRow>

                <CRow className="g-3 mb-3">
                  <CCol md={12}>
                    <CFormTextarea floating="true" label="Address *" name="address" rows={2} value={form.address} onChange={handleChange} required />
                    {renderError('address')}
                  </CCol>
                </CRow>

                <h5 className="text-primary mb-3 mt-4">Profile Photo</h5>
                <CRow className="mb-4 justify-content-center">
                  <CCol xs={12} md={6}>
                    <div
                      className="p-4 rounded-4 shadow-sm border bg-white d-flex flex-column align-items-center justify-content-center"
                      style={{ minHeight: 250 }}
                    >
                      {photoPreview ? (
                        <>
                          <img
                            src={photoPreview}
                            alt="Profile Preview"
                            className="rounded-circle shadow-sm mb-3 border border-primary"
                            style={{
                              width: 140,
                              height: 140,
                              objectFit: 'cover',
                            }}
                          />
                          <CButton
                            color="danger"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setPhotoFile(null)
                              setPhotoPreview(null)
                            }}
                          >
                            Remove Photo
                          </CButton>
                        </>
                      ) : (
                        <div
                          className="d-flex flex-column align-items-center justify-content-center p-3 rounded-3 border border-dashed w-100"
                          style={{
                            borderStyle: 'dashed',
                            borderColor: '#6c757d',
                            minHeight: 150,
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
                          <small className="text-muted">JPG / PNG • Max 2 MB</small>
                          <input
                            id="photoInput"
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={e => {
                              const file = e.target.files[0]
                              if (!file) return
                              if (file.size > 2 * 1024 * 1024) {
                                setErrors(prev => ({ ...prev, photo_file: 'Photo must be under 2MB' }))
                                return
                              }
                              setPhotoFile(file)
                              setPhotoPreview(URL.createObjectURL(file))
                              setErrors(prev => ({ ...prev, photo_file: '' }))
                            }}
                          />
                        </div>
                      )}
                      {errors.photo_file && (
                        <small className="text-danger d-block mt-2">{errors.photo_file}</small>
                      )}
                    </div>
                  </CCol>
                </CRow>

                <div className="d-grid mt-4">
                  <CButton color="primary" size="lg" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <><CSpinner size="sm" className="me-2" />Submitting...</> : (form.u_id ? 'Convert to Client' : 'Register Client')}
                  </CButton>
                </div>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

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
          onClick={() => {
            setShowModal(false)
            if (modalMessage.startsWith('Success:') || !modalMessage.startsWith('Error:')) {
              navigate(form.u_id ? '/GetClients?type=clients' : '/AdminDashboard')
            }
          }}
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
            onClick={(e) => e.stopPropagation()}
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
            {modalMessage.startsWith('Success:') && registeredUID && (
              <div className="mb-3">
                <strong>Registered UID:</strong> {registeredUID}
              </div>
            )}
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
              onClick={() => {
                setShowModal(false)
                if (modalMessage.startsWith('Success:') || !modalMessage.startsWith('Error:')) {
                  navigate(form.u_id ? '/GetClients?type=clients' : '/AdminDashboard')
                }
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </CContainer>
  )
}
