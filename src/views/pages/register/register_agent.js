import React, { useState, useEffect } from 'react'
import {
  CCard, CCardBody, CCol, CContainer, CRow, CForm, CFormInput, CFormSelect,
  CSpinner, CFormLabel, CButton, CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem,
  CAlert, CInputGroup, CFormTextarea, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilArrowLeft } from '@coreui/icons'
import CoreUIProfileCropper from './CoreUIProfileCropper'

export default function RegisterAgentWizard() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [designations, setDesignations] = useState([])
  const [designationName, setDesignationName] = useState('Select Designation')
  const [loadingDesignations, setLoadingDesignations] = useState(true)
  const [designationError, setDesignationError] = useState('')

  const [form, setForm] = useState({
    first_name: '', last_name: '', father_name: '', dob: '', gender: '',
    email: '', mobile: '', password: '', marital_status: '', education: '',
    language: '', occupation: '', work_experience: '', income: '', adhar: '',
    pan: '', designation: '', reference_agent: '', agent_team: '', work_location: '',
    bank_name: '', branch: '', account_number: '', ifsc_code: '', address: '',
    nominiee: '', relationship: '', nominee_mobile: '',
    aadhaar_file: null, pan_file: null, photo: null, u_id: ''
  })

  const [errors, setErrors] = useState({})
  const [alert, setAlert] = useState({ visible: false, message: '', color: 'success' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [registeredUID, setRegisteredUID] = useState('')

  useEffect(() => {
    fetch(`${globalThis.apiBaseUrl}/register/?key=designation`, { headers: { accept: 'application/json' } })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'ok' && Array.isArray(data.designation))
          setDesignations(data.designation)
        else setDesignationError('No designations found')
      })
      .catch(() => setDesignationError('Failed to fetch designations'))
      .finally(() => setLoadingDesignations(false))
  }, [])

  const handleFileChange = (e) => {
    const { name, files } = e.target
    if (files.length === 0) return
    const file = files[0]
    if (file.size > 2 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, [name]: 'File size must be less than 2MB' }))
      setForm(prev => ({ ...prev, [name]: null }))
    } else {
      setForm(prev => ({ ...prev, [name]: file }))
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleChange = (e) => {
    let { name, value } = e.target

    if (['aadhaar_file', 'pan_file'].includes(name)) {
      handleFileChange(e)
      return
    }

    if (name === 'pan') value = value.toUpperCase().replace(/[^A-Z0-9]/g, '')
    else if (['first_name', 'last_name', 'father_name', 'nominiee', 'relationship', 'language', 'education', 'occupation', 'work_location'].includes(name))
      value = value.replace(/[^A-Za-z ]/g, '')
    else if (['mobile', 'work_experience', 'account_number', 'income', 'adhar', 'nominee_mobile'].includes(name))
      value = value.replace(/[^0-9]/g, '')
    else if (name === 'ifsc_code')
      value = value.toUpperCase().replace(/[^A-Z0-9]/g, '')
    else if (['address', 'bank_name', 'branch'].includes(name))
      value = value.replace(/[^A-Za-z0-9 ,/-]/g, '')

    setForm(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))

    if (name === 'dob' && value) {
      const birthDate = new Date(value)
      const today = new Date()
      let age = today.getFullYear() - birthDate.getFullYear()
      const m = today.getMonth() - birthDate.getMonth()
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--
      if (age < 18) setErrors(prev => ({ ...prev, dob: 'Age must be at least 18' }))
    }
  }

  const handleDesignationSelect = (designation) => {
    setDesignationName(designation.name)
    setForm(prev => ({ ...prev, designation: designation.name }))
    setErrors(prev => ({ ...prev, designation: '' }))
  }

  const renderError = (field) => errors[field] && (
    <small className="text-danger d-block mt-1">{errors[field]}</small>
  )

  const validateField = (name, value) => {
    switch (name) {
      case 'first_name': case 'last_name': case 'father_name': case 'nominiee': case 'relationship':
      case 'reference_agent': case 'agent_team': case 'branch': case 'bank_name': case 'work_location':
        if (!value) return 'This field is required'
        break
      case 'mobile': case 'nominee_mobile':
        if (!/^[0-9]{10}$/.test(value)) return 'Enter a valid 10-digit phone number'
        break
      case 'email':
        if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email'
        break
      case 'work_experience':
        if (!/^[0-9]{1,2}$/.test(value)) return 'Enter valid experience'
        break
      case 'account_number':
        if (!/^[0-9]{9,18}$/.test(value)) return 'Invalid account number'
        break
      case 'ifsc_code':
        if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(value)) return 'Invalid IFSC code'
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
      case 'address':
        if (!value) return 'Address required'
        break
      default:
        return ''
    }
    return ''
  }

  const validateStep = () => {
    let newErrors = {}
    const fieldsByStep = {
      1: ['first_name', 'last_name', 'father_name', 'dob', 'gender', 'email', 'mobile', 'marital_status', 'education', 'language', 'occupation', 'work_experience', 'income', 'adhar', 'pan', 'password'],
      2: ['designation', 'reference_agent', 'agent_team', 'work_location', 'bank_name', 'branch', 'account_number', 'ifsc_code', 'nominiee', 'relationship', 'nominee_mobile', 'photo', 'aadhaar_file', 'pan_file'],
      3: ['address']
    }
    fieldsByStep[step]?.forEach(f => {
      const err = validateField(f, form[f])
      if (err) newErrors[f] = err
    })
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => { if (validateStep()) setStep(s => s + 1) }
  const prevStep = () => setStep(s => s - 1)

  const handleSubmit = async () => {
    if (!validateStep()) return
    setIsSubmitting(true)
    setAlert({ visible: false, message: '' })

    const formData = new FormData()
    Object.entries(form).forEach(([key, val]) => {
      if (val) {
        if (['photo', 'aadhaar_file', 'pan_file'].includes(key)) {
          formData.append(key, val.file || val)
        } else formData.append(key, val)
      }
    })
    formData.append('role', 'agent')

    try {
      const res = await fetch(`${globalThis.apiBaseUrl}/auth/register`, { method: 'POST', body: formData })
      const data = await res.json()
      if (res.ok) {
        setRegisteredUID(data.u_id || data.user_id || 'N/A')
        setShowSuccessModal(true)
      } else setAlert({ visible: true, message: data.message || 'Registration failed.', color: 'danger' })
    } catch {
      setAlert({ visible: true, message: 'Network error.', color: 'danger' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleModalClose = () => {
    setShowSuccessModal(false)
    navigate('/AdminDashboard')
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center py-5">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={10} lg={6}>
            <CCard className="shadow-sm rounded-4">
              <CCardBody className="p-5">

                {alert.visible && (
                  <CAlert color={alert.color} dismissible onClose={() => setAlert({ ...alert, visible: false })}>
                    {alert.message}
                  </CAlert>
                )}

                <div className="d-flex justify-content-between align-items-center mb-4">
                  <CButton color="primary" variant="ghost" onClick={() => navigate(-1)}>
                    <CIcon icon={cilArrowLeft} className="me-2" />
                  </CButton>

                  <div className="flex-grow-1 text-center">
                    <h3 className="text-primary fw-bold m-0">Agent Registration</h3>
                  </div>
                </div>


                <CForm noValidate>
                  <CCard className="mb-4 p-4 bg-white shadow-sm border-0">

                    {/* Personal Details */}
                    <h6 className="text-primary mb-3">Personal Details</h6>
                    <div className="mb-3">
                      <CFormInput name="firstName" placeholder="First Name" value={form.first_name} onChange={handleChange} invalid={!!errors.firstName} />
                      {renderError('firstName')}
                    </div>
                    <div className="mb-3">
                      <CFormInput name="lastName" placeholder="Last Name" value={form.last_name} onChange={handleChange} invalid={!!errors.lastName} />
                      {renderError('lastName')}
                    </div>
                    <div className="mb-3">
                      <CFormInput name="fatherName" placeholder="Father's Name" value={form.father_name} onChange={handleChange} invalid={!!errors.fatherName} />
                      {renderError('fatherName')}
                    </div>
                    <div className="mb-3">
                      <CFormSelect name="maritalStatus" value={form.marital_status} onChange={handleChange} invalid={!!errors.maritalStatus}>
                        <option value="">Select Marital Status</option>
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                      </CFormSelect>
                      {renderError('maritalStatus')}
                    </div>
                    <div className="mb-3">
                      <CFormLabel>Date of Birth</CFormLabel>
                      <CFormInput type="date" name="dob" value={form.dob} onChange={handleChange} invalid={!!errors.dob} />
                      {renderError('dob')}
                    </div>
                    <div className="mb-3">
                      <CFormLabel>Age</CFormLabel>
                      <CFormInput name="age" placeholder="Age" value={form.age} readOnly />
                    </div>
                    <div className="mb-3">
                      <CFormSelect name="gender" value={form.gender} onChange={handleChange} invalid={!!errors.gender}>
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </CFormSelect>
                      {renderError('gender')}
                    </div>
                    <div className="mb-3">
                      <CFormInput name="email" placeholder="Email" autoComplete="email" value={form.email} onChange={handleChange} invalid={!!errors.email} />
                      {renderError('email')}
                    </div>
                    <div className="mb-3">
                      <CFormInput name="phone" placeholder="Phone Number" maxLength={10} value={form.phone} onChange={handleChange} invalid={!!errors.phone} />
                      {renderError('phone')}
                    </div>
                    <div className="mb-3">
                      <CFormInput name="occupation" placeholder="Occupation" value={form.occupation} onChange={handleChange} invalid={!!errors.occupation} />
                      {renderError('occupation')}
                    </div>
                    <div className="mb-3">
                      <CFormInput name="workExperience" placeholder="Work Experience (Years)" maxLength={2} value={form.work_experience} onChange={handleChange} invalid={!!errors.workExperience} />
                      {renderError('workExperience')}
                    </div>
                    <div className="mb-3">
                      <CFormSelect name="language" value={form.language} onChange={handleChange} invalid={!!errors.language}>
                        <option value="">Select Language</option>
                        <option value="English">English</option>
                        <option value="Hindi">Hindi</option>
                        <option value="Telugu">Telugu</option>
                      </CFormSelect>
                      {renderError('language')}
                    </div>
                    <div className="mb-3">
                      <CFormInput name="education" placeholder="Education" value={form.education} onChange={handleChange} invalid={!!errors.education} />
                      {renderError('education')}
                    </div>
                    <div className="mb-3">
                      <CFormInput name="password" type="password" placeholder="Password" autoComplete="new-password" value={form.password} onChange={handleChange} invalid={!!errors.password} />
                      {renderError('password')}
                    </div>
                    <div className="mb-3">
                      <CFormInput name="income" placeholder="Annual Income" value={form.income} onChange={handleChange} invalid={!!errors.income} />
                      {renderError('income')}
                    </div>
                    <div className="mb-3">
                      <CFormInput name="adhar" placeholder="Aadhaar Number" maxLength={12} value={form.adhar} onChange={handleChange} invalid={!!errors.adhar} />
                      {renderError('adhar')}
                    </div>
                    <div className="mb-3">
                      <CFormInput name="pan" placeholder="PAN Number" maxLength={10} value={form.pan} onChange={handleChange} invalid={!!errors.pan} />
                      {renderError('pan')}
                    </div>

                    {/* Designation, Bank & Nominee Details */}
                    <h6 className="text-primary mb-3 mt-4">Designation, Bank & Nominee Details</h6>

                    {/* Designation */}
                    <div className="mb-3">
                      <CDropdown className='w-100'>
                        <CDropdownToggle color='light' className='text-start w-100 d-flex justify-content-between align-items-center'>
                          {loadingDesignations ? <span><CSpinner size="sm" className="me-2" />Loading...</span> : designationName}
                        </CDropdownToggle>
                        <CDropdownMenu className="w-100">
                          {loadingDesignations && <CDropdownItem disabled>Loading...</CDropdownItem>}
                          {!loadingDesignations && designationError && <CDropdownItem disabled>{designationError}</CDropdownItem>}
                          {!loadingDesignations && !designationError && designations.map((d, idx) => (
                            <CDropdownItem key={idx} onClick={() => handleDesignationSelect(d)}>{d.name}</CDropdownItem>
                          ))}
                        </CDropdownMenu>
                      </CDropdown>
                      {renderError('designation')}
                    </div>

                    <div className="mb-3">
                      <CFormInput name="referenceAgent" placeholder="Reference Agent Code" value={form.reference_agent} onChange={handleChange} invalid={!!errors.referenceAgent} />
                      {renderError('referenceAgent')}
                    </div>
                    <div className="mb-3">
                      <CFormInput name="agentTeam" placeholder="Agent Team" value={form.agent_team} onChange={handleChange} invalid={!!errors.agentTeam} />
                      {renderError('agentTeam')}
                    </div>
                    <div className="mb-3">
                      <CFormInput name="workLocation" placeholder="Work Location" value={form.work_location} onChange={handleChange} invalid={!!errors.workLocation} />
                      {renderError('workLocation')}
                    </div>

                    {/* Bank Details */}
                    <h6 className="text-primary mb-3 mt-4">Bank Details</h6>
                    <div className="mb-3"><CFormInput name="bankName" placeholder="Bank Name" value={form.bank_name} onChange={handleChange} invalid={!!errors.bankName} />{renderError('bankName')}</div>
                    <div className="mb-3"><CFormInput name="branch" placeholder="Branch Name" value={form.branch} onChange={handleChange} invalid={!!errors.branch} />{renderError('branch')}</div>
                    <div className="mb-3"><CFormInput name="accountNumber" placeholder="Account Number" value={form.account_number} onChange={handleChange} invalid={!!errors.accountNumber} />{renderError('accountNumber')}</div>
                    <div className="mb-3"><CFormInput name="ifscCode" placeholder="IFSC Code" maxLength={11} value={form.ifsc_code} onChange={handleChange} invalid={!!errors.ifscCode} />{renderError('ifscCode')}</div>

                    {/* Nominee Details */}
                    <h6 className="text-primary mb-3 mt-4">Nominee Details</h6>
                    <div className="mb-3"><CFormInput name="nomineeName" placeholder="Nominee Name" value={form.nomineeName} onChange={handleChange} invalid={!!errors.nomineeName} />{renderError('nomineeName')}</div>
                    <div className="mb-3"><CFormInput name="nomineeRelation" placeholder="Relation with Nominee" value={form.nomineeRelation} onChange={handleChange} invalid={!!errors.nomineeRelation} />{renderError('nomineeRelation')}</div>
                    <div className="mb-3"><CFormInput name="nomineeMobile" placeholder="Nominee Mobile" maxLength={10} value={form.nominee_mobile} onChange={handleChange} invalid={!!errors.nomineeMobile} />{renderError('nomineeMobile')}</div>

                    {/* Upload Files */}
                    <h6 className="text-primary mb-3 mt-4">Upload Profile Photo & Documents</h6>
                    <div className="mb-4 text-center">
                      <CFormLabel className="fw-semibold mb-2 d-block">Profile Photo</CFormLabel>
                      {form.photo ? (
                        <>
                          <img
                            src={form.photo.previewUrl}
                            alt="Profile Preview"
                            className="rounded-circle mb-3 shadow-sm"
                            style={{ width: '150px', height: '150px', objectFit: 'cover', border: '3px solid #0d6efd' }}
                          />
                          <CButton
                            color="danger"
                            variant="outline"
                            size="sm"
                            onClick={() => setForm(prev => ({ ...prev, photo: null }))}
                          >
                            Remove Photo
                          </CButton>
                        </>
                      ) : (
                        <CoreUIProfileCropper
                          onChange={({ file, previewUrl }) => {
                            setForm(prev => ({ ...prev, photo: { file, previewUrl } }));
                            setErrors(prev => ({ ...prev, photo: '' }));
                          }}
                        />
                      )}
                      {renderError('photo')}
                    </div>

                    <div className="mb-3">
                      <CFormLabel htmlFor="aadhaarFile">Aadhaar File (PDF only, max 2MB)</CFormLabel>
                      {form.aadhaarFile ? (
                        <CInputGroup>
                          <CFormInput value={form.aadhaar_file.name} readOnly />
                          <CButton type="button" color="danger" variant="outline" onClick={() => setForm(prev => ({ ...prev, aadhaarFile: null }))}>Clear</CButton>
                        </CInputGroup>
                      ) : (
                        <CFormInput type="file" name="aadhaarFile" accept="application/pdf" onChange={handleFileChange} invalid={!!errors.aadhaarFile} />
                      )}
                      {renderError('aadhaarFile')}
                    </div>

                    <div className="mb-3">
                      <CFormLabel htmlFor="panFile">PAN File (PDF only, max 2MB)</CFormLabel>
                      {form.panFile ? (
                        <CInputGroup>
                          <CFormInput value={form.pan_file.name} readOnly />
                          <CButton type="button" color="danger" variant="outline" onClick={() => setForm(prev => ({ ...prev, panFile: null }))}>Clear</CButton>
                        </CInputGroup>
                      ) : (
                        <CFormInput type="file" name="panFile" accept="application/pdf" onChange={handleFileChange} invalid={!!errors.panFile} />
                      )}
                      {renderError('panFile')}
                    </div>

                    {/* Address */}
                    <h6 className="text-primary mb-3 mt-4">Address Details</h6>
                    <div className="mb-3">
                      <CFormTextarea
                        placeholder="Address"
                        name="presentAddress"
                        rows={4}
                        value={form.presentAddress}
                        onChange={handleChange}
                        invalid={!!errors.presentAddress}
                      />
                      {renderError('presentAddress')}
                    </div>

                    <div className="d-flex justify-content-end mt-4">
                      <CButton color="success" onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? (
                          <><CSpinner size="sm" className="me-2" />Submitting...</>
                        ) : (
                          'Submit'
                        )}
                      </CButton>
                    </div>
                  </CCard>
                </CForm>


              </CCardBody>
            </CCard>
          </CCol>
        </CRow>

        {/* Success Modal */}
        <CModal visible={showSuccessModal} onClose={handleModalClose} alignment="center" backdrop="static">
          <CModalHeader><CModalTitle>Registration Successful!</CModalTitle></CModalHeader>
          <CModalBody>
            <p>The agent has been registered successfully.</p>
            <p><strong>Agent UID:</strong> {registeredUID}</p>
          </CModalBody>
          <CModalFooter><CButton color="primary" onClick={handleModalClose}>Go to Dashboard</CButton></CModalFooter>
        </CModal>
      </CContainer>
    </div>
  )
}
