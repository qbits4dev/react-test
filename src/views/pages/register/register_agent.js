import React, { useState, useEffect } from 'react'
import {
  CCard, CCardBody, CCol, CContainer, CRow, CForm, CFormInput, CFormSelect,
  CSpinner, CFormLabel, CButton, CAlert, CFormTextarea, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter,
  CProgress
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilArrowLeft } from '@coreui/icons'
import CoreUIProfileCropper from './CoreUIProfileCropper'
import {
  getPasswordStrength,
  sanitizeAlphaNumericBasic,
  sanitizeName,
  sanitizeText,
  sanitizeAddress,
  validateAgeRangeFromDob,
  validateStrongPassword,
} from '../../../utils/validation'
import ErrorModal from '../../../components/ErrorModal'
import { extractErrorMessage } from '../../../utils/errorUtils'

export default function RegisterAgentWizard() {
  const navigate = useNavigate()
  const emptyForm = {
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
  }

  const today = new Date()
  const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate()).toISOString().split('T')[0]
  const minDate = new Date(today.getFullYear() - 80, today.getMonth(), today.getDate()).toISOString().split('T')[0]

  const getRequiredLabel = (labelText) => (
    <span>
      {labelText} <span className="text-danger">*</span>
    </span>
  )

  // --- form state with all fields ---
  const [form, setForm] = useState(emptyForm)

  const [designations, setDesignations] = useState([])
  const [designationError, setDesignationError] = useState('')
  const [loadingDesignations, setLoadingDesignations] = useState(true)

  const [errors, setErrors] = useState({})
  const [alert, setAlert] = useState({ visible: false, message: '', color: 'success' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [registeredUID, setRegisteredUID] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // Restore form state from localStorage when page loads
  useEffect(() => {
    const hasSession = Boolean(localStorage.getItem('access_token') || localStorage.getItem('user'))
    if (!hasSession) {
      localStorage.removeItem('registerAgentForm')
      setForm(emptyForm)
      return
    }
    const saved = localStorage.getItem('registerAgentForm')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        // Files cannot be persisted, always null on reload
        parsed.aadhaar_file = null
        parsed.pan_file = null
        parsed.photo = null
        setForm(parsed)
      } catch { }
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
      const err = validateField(name, file)
      setErrors(prev => ({ ...prev, [name]: err }))
    }
  }

  // Universal change handler (persists on every change)
  const handleChange = (e) => {
    const name = e.target.name
    let value = e.target.value

    // Input sanitation per field type
    if (name === 'pan') value = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10)
    else if (name === 'ifsc_code') value = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 11)
    else if (['first_name', 'last_name', 'father_name'].includes(name)) value = sanitizeName(value, 50)
    else if (['nominiee', 'relationship'].includes(name)) value = sanitizeName(value, 60)
    else if (['city', 'state'].includes(name)) value = sanitizeName(value, 50)
    else if (name === 'bank_name') value = sanitizeName(value, 80)
    else if (['work_location', 'branch'].includes(name))
      value = value.replace(/[^A-Za-z0-9 ,\-]/g, '').slice(0, 80)
    else if (name === 'education')
      value = value.replace(/[^A-Za-z0-9 ,.\-\/()]/g, '').slice(0, 80)
    else if (name === 'language')
      value = value.replace(/[^A-Za-z ]/g, '').slice(0, 80)
    else if (name === 'occupation')
      value = sanitizeText(value, 80)
    else if (name === 'email')
      value = value.replace(/[^A-Za-z0-9.@_\-+]/g, '').slice(0, 100)
    else if (name === 'mobile' || name === 'nominee_mobile')
      value = value.replace(/[^0-9]/g, '').slice(0, 10)
    else if (name === 'adhar')
      value = value.replace(/[^0-9]/g, '').slice(0, 12)
    else if (name === 'pincode')
      value = value.replace(/[^0-9]/g, '').slice(0, 6)
    else if (name === 'account_number')
      value = value.replace(/[^0-9]/g, '').slice(0, 18)
    else if (name === 'work_experience')
      value = value.replace(/[^0-9]/g, '').slice(0, 2)
    else if (name === 'income')
      value = value.replace(/[^0-9]/g, '').slice(0, 12)
    else if (name === 'reference_agent' || name === 'agent_team')
      value = sanitizeAlphaNumericBasic(value, 30)
    else if (name === 'password') value = value.replace(/\s/g, '').slice(0, 32)
    else if (['address', 'address_line1', 'address_line2'].includes(name)) value = sanitizeAddress(value, 150)

    setFormField(name, value)

    // Run real-time validation on change
    const err = validateField(name, value)
    setErrors(prev => ({ ...prev, [name]: err }))
  }

  // Validate on blur for immediate feedback
  const handleBlur = (e) => {
    const { name, value } = e.target
    const err = validateField(name, value)
    setErrors(prev => ({ ...prev, [name]: err }))
  }

  const renderError = (field) => errors[field] && (
    <small className="text-danger d-block mt-1">{errors[field]}</small>
  )

  const validateField = (name, value) => {
    const v = typeof value === 'string' ? value.trim() : value

    switch (name) {
      // ── Name fields: required, letters only, 2–50 chars ──
      case 'first_name':
        if (!v) return 'First Name is required'
        if (v.length < 2) return 'First Name must be at least 2 characters'
        if (v.length > 50) return 'First Name must not exceed 50 characters'
        if (!/^[A-Za-z ]+$/.test(v)) return 'First Name must contain only letters'
        break
      case 'last_name':
        if (!v) return 'Last Name is required'
        if (v.length < 1) return 'Last Name must be at least 1 character'
        if (v.length > 50) return 'Last Name must not exceed 50 characters'
        if (!/^[A-Za-z ]+$/.test(v)) return 'Last Name must contain only letters'
        break
      case 'father_name':
        if (!v) return "Father's Name is required"
        if (v.length < 2) return "Father's Name must be at least 2 characters"
        if (v.length > 50) return "Father's Name must not exceed 50 characters"
        if (!/^[A-Za-z ]+$/.test(v)) return "Father's Name must contain only letters"
        break

      // ── Contact fields ──
      case 'mobile':
        if (!v) return 'Mobile number is required'
        if (!/^[6-9][0-9]{9}$/.test(v)) return 'Mobile must be a valid 10-digit Indian number starting with 6-9'
        break
      case 'nominee_mobile':
        if (!v) return 'Nominee Mobile is required'
        if (!/^[6-9][0-9]{9}$/.test(v)) return 'Nominee Mobile must be a valid 10-digit number starting with 6-9'
        break
      case 'email':
        if (!v) return 'Email is required'
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Enter a valid email address (e.g. name@example.com)'
        if (v.length > 100) return 'Email must not exceed 100 characters'
        break
      case 'password':
        if (!v) return 'Password is required'
        return validateStrongPassword(v)
        break

      // ── Date of Birth ──
      case 'dob': {
        if (!v) return 'Date of Birth is required'
        if (!validateAgeRangeFromDob(v, 18, 80)) return 'Age must be between 18 and 80 years old'
        break
      }

      // ── Select dropdowns ──
      case 'gender':
        if (!v) return 'Gender is required'
        break
      case 'marital_status':
        if (!v) return 'Marital Status is required'
        break
      case 'education':
        if (!v) return 'Education is required'
        if (v.length > 80) return 'Education must not exceed 80 characters'
        if (/[^A-Za-z0-9 ,.\-\/()]/.test(v)) return 'Education can only contain letters, numbers, spaces, dots, commas, hyphens, slashes, and parentheses'
        break
      case 'language':
        if (!v) return 'Language is required'
        break
      case 'designation':
        if (!v) return 'Designation is required'
        break

      // ── Occupation / work ──
      case 'occupation':
        if (!v) return 'Occupation is required'
        if (v.length > 80) return 'Occupation must not exceed 80 characters'
        break
      case 'work_experience':
        if (!v) return 'Work Experience is required'
        if (!/^[0-9]{1,2}$/.test(v)) return 'Work Experience must be 0–99 years'
        if (Number(v) > 60) return 'Work Experience cannot exceed 60 years'
        break
      case 'income':
        if (!v) return 'Annual Income is required'
        if (!/^[0-9]+$/.test(v)) return 'Income must be a number'
        if (v.length > 12) return 'Income value is too large'
        break

      // ── Identity documents ──
      case 'adhar':
        if (!v) return 'Aadhaar Number is required'
        if (!/^[0-9]{12}$/.test(v)) return 'Aadhaar must be exactly 12 digits'
        break
      case 'pan':
        if (!v) return 'PAN Number is required'
        if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(v)) return 'PAN must be in format: ABCDE1234F'
        break

      // ── Work & Team ──
      case 'reference_agent':
        if (!v) return 'Reference Agent Code is required'
        if (v.length > 30) return 'Reference Agent Code must not exceed 30 characters'
        break
      case 'agent_team':
        if (!v) return 'Agent Team is required'
        if (v.length > 30) return 'Agent Team must not exceed 30 characters'
        break
      case 'work_location':
        if (!v) return 'Work Location is required'
        if (v.length > 80) return 'Work Location must not exceed 80 characters'
        if (/[^A-Za-z0-9 ,\-]/.test(v)) return 'Work Location can only contain letters, numbers, spaces, commas, and hyphens'
        break

      // ── Bank details ──
      case 'bank_name':
        if (!v) return 'Bank Name is required'
        if (v.length < 2) return 'Bank Name must be at least 2 characters'
        if (v.length > 80) return 'Bank Name must not exceed 80 characters'
        if (!/^[A-Za-z ]+$/.test(v)) return 'Bank Name must contain only letters'
        break
      case 'branch':
        if (!v) return 'Branch is required'
        if (v.length > 80) return 'Branch must not exceed 80 characters'
        if (/[^A-Za-z0-9 ,\-]/.test(v)) return 'Branch can only contain letters, numbers, spaces, commas, and hyphens'
        break
      case 'account_number':
        if (!v) return 'Account Number is required'
        if (!/^[0-9]{9,18}$/.test(v)) return 'Account Number must be 9–18 digits'
        break
      case 'ifsc_code':
        if (!v) return 'IFSC Code is required'
        if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(v)) return 'IFSC must be in format: ABCD0123456'
        break

      // ── Nominee ──
      case 'nominiee':
        if (!v) return 'Nominee Name is required'
        if (v.length < 2) return 'Nominee Name must be at least 2 characters'
        if (v.length > 60) return 'Nominee Name must not exceed 60 characters'
        if (!/^[A-Za-z ]+$/.test(v)) return 'Nominee Name must contain only letters'
        break
      case 'relationship':
        if (!v) return 'Relationship with Nominee is required'
        if (v.length > 60) return 'Relationship must not exceed 60 characters'
        if (!/^[A-Za-z ]+$/.test(v)) return 'Relationship must contain only letters'
        break

      // ── Address ──
      case 'address':
        if (!v) return 'Address is required'
        if (/[^A-Za-z0-9 .,\-()/#]/.test(v)) {
          return 'Address contains invalid characters. Only letters, numbers, spaces, and . , - ( ) / # are allowed.'
        }
        break
      case 'address_line1':
        if (!v) return 'Address Line 1 is required'
        if (/[^A-Za-z0-9 .,\-()/#]/.test(v)) {
          return 'Address contains invalid characters. Only letters, numbers, spaces, and . , - ( ) / # are allowed.'
        }
        break
      case 'address_line2':
        if (v && /[^A-Za-z0-9 .,\-()/#]/.test(v)) {
          return 'Address contains invalid characters. Only letters, numbers, spaces, and . , - ( ) / # are allowed.'
        }
        break
      case 'city':
        if (!v) return 'City is required'
        if (v.length < 2) return 'City must be at least 2 characters'
        if (v.length > 50) return 'City must not exceed 50 characters'
        if (!/^[A-Za-z ]+$/.test(v)) return 'City must contain only letters'
        break
      case 'state':
        if (!v) return 'State is required'
        if (v.length < 2) return 'State must be at least 2 characters'
        if (v.length > 50) return 'State must not exceed 50 characters'
        if (!/^[A-Za-z ]+$/.test(v)) return 'State must contain only letters'
        break
      case 'pincode':
        if (!v) return 'Pincode is required'
        if (!/^[1-9][0-9]{5}$/.test(v)) return 'Pincode must be a valid 6-digit code (cannot start with 0)'
        break

      // ── File uploads ──
      case 'photo':
        if (v && !/^image\/(jpeg|jpg|png|webp)$/i.test(v.type)) return 'Photo must be JPG, PNG, or WEBP'
        if (v && v.size > 2 * 1024 * 1024) return 'Photo must be under 2MB'
        break
      case 'aadhaar_file':
        if (!v) return 'Aadhaar document upload is required'
        if (!/^image\/(jpeg|jpg|png|webp)$|^application\/pdf$/i.test(v.type)) return 'Aadhaar file must be JPG, PNG, WEBP, or PDF'
        if (v.size > 2 * 1024 * 1024) return 'Aadhaar file must be under 2MB'
        break
      case 'pan_file':
        if (!v) return 'PAN document upload is required'
        if (!/^image\/(jpeg|jpg|png|webp)$|^application\/pdf$/i.test(v.type)) return 'PAN file must be JPG, PNG, WEBP, or PDF'
        if (v.size > 2 * 1024 * 1024) return 'PAN file must be under 2MB'
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
      'aadhaar_file', 'pan_file', 'address', 'city', 'state', 'pincode'
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
        const errorMsg = extractErrorMessage(data, 'Agent registration failed.')
        setErrorModalMsg(errorMsg)
        setErrorModalVisible(true)
      }
    } catch (err) {
      console.error(err)
      setErrorModalMsg(extractErrorMessage(err, 'Network error. Please try again.'))
      setErrorModalVisible(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const [errorModalVisible, setErrorModalVisible] = useState(false)
  const [errorModalMsg, setErrorModalMsg] = useState('')

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
              <div className="d-flex align-items-center justify-content-between flex-wrap mb-4">
                {/* Back Button */}
                <CButton
                  color="primary"
                  variant="ghost"
                  className="d-flex align-items-center justify-content-center"
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: '50%',
                  }}
                  onClick={() => navigate(-1)}
                >
                  <CIcon icon={cilArrowLeft} size="lg" />
                </CButton>

                {/* Title */}
                <h2
                  className="fw-bold text-primary text-center flex-grow-1 mb-0"
                  style={{
                    fontSize: 'clamp(1.25rem, 2vw + 0.25rem, 2rem)',
                    letterSpacing: '0.5px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  Agent Registration
                </h2>

                {/* Spacer to balance layout */}
                <div
                  className="d-none d-sm-block"
                  style={{ width: 42 }}
                />
              </div>


              {alert.visible &&
                <CAlert color={alert.color} dismissible onClose={() => setAlert({ ...alert, visible: false })}>{alert.message}</CAlert>
              }

              <CForm onSubmit={handleSubmit}>
                {/* Personal Details */}
                <h5 className="text-primary mb-3">Personal Details</h5>
                <CRow className="g-3 mb-3">
                  <CCol md={6}><CFormInput floating="true" label={getRequiredLabel("First Name")} name="first_name" maxLength={50} value={form.first_name} onChange={handleChange} onBlur={handleBlur} invalid={!!errors.first_name} required />{renderError('first_name')}</CCol>
                  <CCol md={6}><CFormInput floating="true" label={getRequiredLabel("Last Name")} name="last_name" maxLength={50} value={form.last_name} onChange={handleChange} onBlur={handleBlur} invalid={!!errors.last_name} required />{renderError('last_name')}</CCol>
                </CRow>
                <CRow className="g-3 mb-3">
                  <CCol md={6}><CFormInput floating="true" label={getRequiredLabel("Father's Name")} name="father_name" maxLength={50} value={form.father_name} onChange={handleChange} onBlur={handleBlur} invalid={!!errors.father_name} required />{renderError('father_name')}</CCol>
                  <CCol md={6}><CFormInput floating="true" label={getRequiredLabel("Email")} name="email" type="email" maxLength={100} value={form.email} onChange={handleChange} onBlur={handleBlur} invalid={!!errors.email} required />{renderError('email')}</CCol>
                </CRow>
                <CRow className="g-3 mb-3">
                  <CCol md={6}><CFormInput floating="true" label={getRequiredLabel("Mobile")} name="mobile" maxLength={10} value={form.mobile} onChange={handleChange} onBlur={handleBlur} invalid={!!errors.mobile} required />{renderError('mobile')}</CCol>
                  <CCol md={6}>
                    <div style={{ position: 'relative' }}>
                      <CFormInput floating="true" label={getRequiredLabel('Password')} name="password" type={showPassword ? 'text' : 'password'} maxLength={32} value={form.password} onChange={handleChange} onBlur={handleBlur} invalid={!!errors.password} required style={{ paddingRight: 68 }} />
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
                </CRow>
                <CRow className="g-3 mb-3">
                  <CCol md={6}><CFormInput floating="true" label={getRequiredLabel("Date of Birth")} type="date" name="dob" value={form.dob} onChange={handleChange} onBlur={handleBlur} invalid={!!errors.dob} min={minDate} max={maxDate} required />{renderError('dob')}</CCol>
                  <CCol md={6}>
                    <CFormSelect floating="true" label={getRequiredLabel("Gender")} name="gender" value={form.gender} onChange={handleChange} invalid={!!errors.gender} required>
                      <option value="">Select</option>
                      <option>Male</option>
                      <option>Female</option>
                    </CFormSelect>
                    {renderError('gender')}
                  </CCol>
                </CRow>
                <CRow className="g-3 mb-3">
                  <CCol md={4}><CFormSelect floating="true" label={getRequiredLabel("Marital Status")} name="marital_status" value={form.marital_status} onChange={handleChange} invalid={!!errors.marital_status}>
                    <option value="">Select</option>
                    <option>Single</option>
                    <option>Married</option>
                  </CFormSelect>{renderError('marital_status')}</CCol>
                  <CCol md={4}><CFormInput floating="true" label={getRequiredLabel("Education")} name="education" value={form.education} onChange={handleChange} invalid={!!errors.education} />{renderError('education')}</CCol>
                  <CCol md={4}><CFormSelect floating="true" label={getRequiredLabel("Language")} name="language" value={form.language} onChange={handleChange} invalid={!!errors.language}>
                    <option value="">Select</option>
                    <option>English</option>
                    <option>Hindi</option>
                    <option>Telugu</option>
                  </CFormSelect>{renderError('language')}</CCol>
                </CRow>
                <CRow className="g-3 mb-3">
                  <CCol md={6}><CFormInput floating="true" label={getRequiredLabel("Occupation")} name="occupation" maxLength={80} value={form.occupation} onChange={handleChange} onBlur={handleBlur} invalid={!!errors.occupation} />{renderError('occupation')}</CCol>
                  <CCol md={6}><CFormInput floating="true" label={getRequiredLabel("Work Experience (Years)")} name="work_experience" maxLength={2} value={form.work_experience} onChange={handleChange} onBlur={handleBlur} invalid={!!errors.work_experience} />{renderError('work_experience')}</CCol>
                </CRow>
                <CRow className="g-3 mb-3">
                  <CCol md={6}><CFormInput floating="true" label={getRequiredLabel("Annual Income")} name="income" maxLength={12} value={form.income} onChange={handleChange} onBlur={handleBlur} invalid={!!errors.income} />{renderError('income')}</CCol>
                  <CCol md={6}><CFormInput floating="true" label={getRequiredLabel("Aadhaar Number")} name="adhar" maxLength={12} value={form.adhar} onChange={handleChange} onBlur={handleBlur} invalid={!!errors.adhar} />{renderError('adhar')}</CCol>
                </CRow>
                <CRow className="g-3 mb-3">
                  <CCol md={6}><CFormInput floating="true" label={getRequiredLabel("PAN Number")} name="pan" maxLength={10} value={form.pan} onChange={handleChange} onBlur={handleBlur} invalid={!!errors.pan} />{renderError('pan')}</CCol>
                  <CCol md={6}>
                    <CFormSelect
                      floating
                      label={getRequiredLabel("Designation")}
                      name="designation"
                      value={form.designation}
                      onChange={handleChange}
                      disabled={loadingDesignations}
                      invalid={!!errors.designation}
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
                  <CCol md={6}><CFormInput floating="true" label={getRequiredLabel("Reference Agent Code")} name="reference_agent" maxLength={30} value={form.reference_agent} onChange={handleChange} onBlur={handleBlur} invalid={!!errors.reference_agent} />{renderError('reference_agent')}</CCol>
                  <CCol md={6}><CFormInput floating="true" label={getRequiredLabel("Agent Team")} name="agent_team" maxLength={30} value={form.agent_team} onChange={handleChange} onBlur={handleBlur} invalid={!!errors.agent_team} />{renderError('agent_team')}</CCol>
                </CRow>
                <CRow className="g-3 mb-3">
                  <CCol md={6}><CFormInput floating="true" label={getRequiredLabel("Work Location")} name="work_location" maxLength={80} value={form.work_location} onChange={handleChange} onBlur={handleBlur} invalid={!!errors.work_location} />{renderError('work_location')}</CCol>
                  <CCol md={6}><CFormInput floating="true" label={getRequiredLabel("Bank Name")} name="bank_name" maxLength={80} value={form.bank_name} onChange={handleChange} onBlur={handleBlur} invalid={!!errors.bank_name} />{renderError('bank_name')}</CCol>
                </CRow>
                <CRow className="g-3 mb-3">
                  <CCol md={6}><CFormInput floating="true" label={getRequiredLabel("Branch")} name="branch" maxLength={80} value={form.branch} onChange={handleChange} onBlur={handleBlur} invalid={!!errors.branch} />{renderError('branch')}</CCol>
                  <CCol md={6}><CFormInput floating="true" label={getRequiredLabel("Account Number")} name="account_number" maxLength={18} value={form.account_number} onChange={handleChange} onBlur={handleBlur} invalid={!!errors.account_number} />{renderError('account_number')}</CCol>
                </CRow>
                <CRow className="g-3 mb-3">
                  <CCol md={6}><CFormInput floating="true" label={getRequiredLabel("IFSC Code")} name="ifsc_code" maxLength={11} value={form.ifsc_code} onChange={handleChange} onBlur={handleBlur} invalid={!!errors.ifsc_code} />{renderError('ifsc_code')}</CCol>
                  <CCol md={6}><CFormInput floating="true" label={getRequiredLabel("Nominee Name")} name="nominiee" maxLength={60} value={form.nominiee} onChange={handleChange} onBlur={handleBlur} invalid={!!errors.nominiee} />{renderError('nominiee')}</CCol>
                </CRow>
                <CRow className="g-3 mb-3">
                  <CCol md={6}><CFormInput floating="true" label={getRequiredLabel("Relation with Nominee")} name="relationship" maxLength={60} value={form.relationship} onChange={handleChange} onBlur={handleBlur} invalid={!!errors.relationship} />{renderError('relationship')}</CCol>
                  <CCol md={6}><CFormInput floating="true" label={getRequiredLabel("Nominee Mobile")} name="nominee_mobile" maxLength={10} value={form.nominee_mobile} onChange={handleChange} onBlur={handleBlur} invalid={!!errors.nominee_mobile} />{renderError('nominee_mobile')}</CCol>
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

                      {form.photo ? (
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
                              onClick={() => {
                                setForm(prev => ({ ...prev, photo: null }))
                                setErrors(prev => ({ ...prev, photo: '' }))
                              }}
                            >
                              Remove Photo
                            </CButton>
                          </div>
                        </>
                      ) : (
                        <div
                          className="d-flex flex-column align-items-center justify-content-center p-3 rounded-3 border border-dashed w-100"
                          style={{
                            borderStyle: 'dashed',
                            borderColor: '#6c757d',
                            minHeight: 240,
                            maxWidth: 280,
                          }}
                        >
                          {/* Instruction message */}
                          <small className="text-muted mb-3">
                            Uploading or cropping may take a few seconds. Please wait...
                          </small>

                          {/* Profile Cropper */}
                          <div className="w-100 d-flex justify-content-center">
                            <CoreUIProfileCropper
                              onChange={({ file, previewUrl }) => {
                                const photoData = { file, previewUrl }
                                setForm(prev => ({ ...prev, photo: photoData }))
                                const err = validateField('photo', photoData)
                                setErrors(prev => ({ ...prev, photo: err }))
                              }}
                            />
                          </div>

                          <small className="text-muted mt-3">JPG / PNG • Max 2 MB</small>
                        </div>
                      )}
                      {renderError('photo')}
                    </div>
                  </CCol>


                  {/* Aadhaar + PAN Upload */}
                  <CCol xs={12} md={6}>
                    <div
                      className="p-4 rounded-4 shadow-sm border bg-white h-100 d-flex flex-column align-items-center"
                      style={{ minHeight: 400 }}
                    >
                      <CFormLabel className="fw-semibold fs-5 text-primary mb-4 text-center">
                        Aadhaar & PAN Uploads <span className="text-danger">*</span>
                      </CFormLabel>

                      <CRow className="g-4 w-100 text-center">
                        {/* Aadhaar Upload */}
                        <CCol xs={12} sm={6}>
                          <div
                            className="p-3 rounded-4 border h-100 d-flex flex-column align-items-center justify-content-center bg-light-subtle hover-shadow"
                            style={{
                              borderStyle: form.aadhaar_file ? 'solid' : 'dashed',
                              borderColor: form.aadhaar_file ? '#198754' : '#adb5bd',
                              transition: 'all 0.3s ease-in-out',
                              minHeight: 180,
                            }}
                          >
                            {form.aadhaar_file ? (
                              <>
                                <i className="bi bi-file-earmark-pdf text-danger fs-1 mb-2"></i>
                                <div className="fw-semibold text-break small mb-3 px-2">
                                  {form.aadhaar_file.name}
                                </div>
                                <CButton
                                  color="danger"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setFormField('aadhaar_file', null)
                                    setErrors(prev => ({ ...prev, aadhaar_file: 'Aadhaar document upload is required' }))
                                  }}
                                >
                                  Remove Aadhaar
                                </CButton>
                              </>
                            ) : (
                              <>
                                <CButton
                                  color="primary"
                                  variant="ghost"
                                  className="fw-semibold"
                                  onClick={() => document.getElementById('aadhaarFileInput').click()}
                                >
                                  <i className="bi bi-upload me-2"></i>Upload Aadhaar (PDF)
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
                              </>
                            )}
                            {renderError('aadhaar_file')}
                          </div>
                        </CCol>

                        {/* PAN Upload */}
                        <CCol xs={12} sm={6}>
                          <div
                            className="p-3 rounded-4 border h-100 d-flex flex-column align-items-center justify-content-center bg-light-subtle hover-shadow"
                            style={{
                              borderStyle: form.pan_file ? 'solid' : 'dashed',
                              borderColor: form.pan_file ? '#198754' : '#adb5bd',
                              transition: 'all 0.3s ease-in-out',
                              minHeight: 180,
                            }}
                          >
                            {form.pan_file ? (
                              <>
                                <i className="bi bi-file-earmark-pdf text-danger fs-1 mb-2"></i>
                                <div className="fw-semibold text-break small mb-3 px-2">
                                  {form.pan_file.name}
                                </div>
                                <CButton
                                  color="danger"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setFormField('pan_file', null)
                                    setErrors(prev => ({ ...prev, pan_file: 'PAN document upload is required' }))
                                  }}
                                >
                                  Remove PAN
                                </CButton>
                              </>
                            ) : (
                              <>
                                <CButton
                                  color="primary"
                                  variant="ghost"
                                  className="fw-semibold"
                                  onClick={() => document.getElementById('panFileInput').click()}
                                >
                                  <i className="bi bi-upload me-2"></i>Upload PAN (PDF)
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
                              </>
                            )}
                            {renderError('pan_file')}
                          </div>
                        </CCol>
                      </CRow>
                    </div>
                  </CCol>
                </CRow>
                {/* Address */}
                <h5 className="text-primary mb-3 mt-4">Address</h5>
                <CRow className="g-3 mb-3">
                  <CCol md={12}><CFormTextarea floating="true" label={getRequiredLabel("Address")} name="address" rows={2} value={form.address} onChange={handleChange} invalid={!!errors.address} />{renderError('address')}</CCol>
                </CRow>
                <CRow className="g-3 mb-3">
                  <CCol md={6}><CFormInput floating="true" label={getRequiredLabel("City")} name="city" maxLength={50} value={form.city} onChange={handleChange} onBlur={handleBlur} invalid={!!errors.city} />{renderError('city')}</CCol>
                  <CCol md={6}><CFormInput floating="true" label={getRequiredLabel("State")} name="state" maxLength={50} value={form.state} onChange={handleChange} onBlur={handleBlur} invalid={!!errors.state} />{renderError('state')}</CCol>
                </CRow>
                <CRow className="g-3 mb-3">
                  <CCol md={6}><CFormInput floating="true" label={getRequiredLabel("Pincode")} name="pincode" maxLength={6} value={form.pincode} onChange={handleChange} onBlur={handleBlur} invalid={!!errors.pincode} />{renderError('pincode')}</CCol>
                </CRow>

                <div className="d-grid mt-4">
                  <CButton color="primary" size="lg" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <><CSpinner size="sm" className="me-2" />Submitting...</> : 'Register Agent'}
                  </CButton>
                </div>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol >
      </CRow >

      <CModal visible={showSuccessModal} onClose={handleModalClose} alignment="center" backdrop="static">
        <CModalHeader><CModalTitle>Registration  Successful!</CModalTitle></CModalHeader>
        <CModalBody>
          <p>The agent has been registered successfully.</p>
          <p><strong>Agent UID:</strong> {registeredUID}</p>
        </CModalBody>
        <CModalFooter><CButton color="primary" onClick={handleModalClose}>Go to Dashboard</CButton></CModalFooter>
      </CModal>

      {/* Designated Error Modal */}
      <ErrorModal
        visible={errorModalVisible}
        title="Agent Registration Failed"
        errorMessage={errorModalMsg}
        onClose={() => setErrorModalVisible(false)}
      />
    </CContainer >
  )
}
