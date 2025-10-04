import React, { useState, useEffect } from 'react'
import {
  CCard, CCardBody, CCol, CContainer, CRow, CForm, CInputGroup, CFormInput, CInputGroupText,
  CButton, CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem, CFormSelect, CSpinner, CFormLabel
} from '@coreui/react'
import { cilUser, cilCalendar } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useNavigate } from 'react-router-dom'
import { AppFooter, AppHeader } from './../../../components/index'  // Adjust import path as needed

export default function RegisterAgentWizard() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)

  // Designations
  const [designations, setDesignations] = useState([])
  const [designationName, setDesignationName] = useState('Select Designation')
  const [loadingDesignations, setLoadingDesignations] = useState(true)
  const [designationError, setDesignationError] = useState('')

  // Form State
  const [form, setForm] = useState({
    firstName: '', lastName: '', fatherName: '', spouseName: '', age: '', dob: '', email: '', phone: '',
    occupation: '', workExperience: '', language: '', maritalStatus: '', education: '',
    gender: '', designation: '', nomineeName: '', nomineeRelation: '', bankName: '', accountNumber: '', ifsc: '',
    permanentAddress: '', presentAddress: '',
    photoFile: null, aadhaarFile: null, panFile: null
  })
  const [errors, setErrors] = useState({})

  // Handle input changes
  const handleChange = (e) => {
    let { name, value, files } = e.target

    if (['photoFile', 'aadhaarFile', 'panFile'].includes(name)) {
      if (files.length > 0) {
        const file = files[0]
        if (name === 'photoFile' && !['image/jpeg', 'image/jpg'].includes(file.type)) {
          alert('Photo must be JPEG format.')
          e.target.value = ''
          return
        }
        if (['aadhaarFile', 'panFile'].includes(name) && file.type !== 'application/pdf') {
          alert(`${name === 'aadhaarFile' ? 'Aadhaar' : 'PAN'} must be a PDF.`)
          e.target.value = ''
          return
        }
        setForm(prev => ({ ...prev, [name]: file }))
      }
      return
    }

    // Restrict alphabets only where applicable
    if (['firstName', 'lastName', 'fatherName', 'spouseName', 'nomineeName', 'nomineeRelation', 'language', 'education', 'occupation'].includes(name)) {
      value = value.replace(/[^A-Za-z ]/g, '')
    }

    // Numbers only where applicable
    if (['phone', 'workExperience', 'accountNumber'].includes(name)) {
      value = value.replace(/[^0-9]/g, '')
    }

    // Letters, numbers, spaces, comma only for addresses and bank inputs
    if (['permanentAddress', 'presentAddress', 'bankName', 'ifsc'].includes(name)) {
      value = value.replace(/[^A-Za-z0-9 ,]/g, '')
    }

    setForm(prev => ({ ...prev, [name]: value }))

    // Auto calculate age when dob changes
    if (name === 'dob' && value) {
      const birthDate = new Date(value)
      const today = new Date()
      let age = today.getFullYear() - birthDate.getFullYear()
      const m = today.getMonth() - birthDate.getMonth()
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--
      if (age >= 18) setForm(prev => ({ ...prev, age: age.toString() }))
      else {
        setForm(prev => ({ ...prev, age: '' }))
        alert('You must be at least 18 years old.')
      }
    }
  }

  // Fetch designations on mount
  useEffect(() => {
    setLoadingDesignations(true)
    fetch('https://api.qbits4dev.com/register/?key=designation', {
      headers: { accept: 'application/json' }
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'ok' && Array.isArray(data.designation)) {
          setDesignations(data.designation)
          setDesignationError('')
        } else {
          setDesignations([])
          setDesignationError('No designations found')
        }
      })
      .catch(() => {
        setDesignations([])
        setDesignationError('Failed to fetch designations')
      })
      .finally(() => setLoadingDesignations(false))
  }, [])

  // Select designation handler
  const handleDesignationSelect = (designation) => {
    setDesignationName(designation.name)
    setForm(prev => ({ ...prev, designation: designation.name }))
  }

  // Validation function
  const validateField = (name, value) => {
    switch (name) {
      case 'firstName':
      case 'lastName':
      case 'fatherName':
      case 'spouseName':
      case 'nomineeName':
      case 'nomineeRelation':
        if (!value) return 'Required'
        if (!/^[A-Za-z ]+$/.test(value)) return 'Only alphabets allowed'
        break
      case 'phone':
        if (!/^[0-9]{10}$/.test(value)) return 'Enter 10 digit phone number'
        break
      case 'email':
        if (value && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) return 'Invalid email'
        break
      case 'workExperience':
        if (value && !/^[0-9]{1,2}$/.test(value)) return 'Only numbers allowed'
        break
      case 'accountNumber':
        if (value && !/^[0-9]{1,20}$/.test(value)) return 'Invalid account number'
        break
      case 'ifsc':
        if (value && !/^[A-Za-z0-9]{0,11}$/.test(value)) return 'Invalid IFSC'
        break
      case 'maritalStatus':
      case 'designation':
      case 'dob':
      case 'gender':
        if (!value) return 'Required'
        break
      case 'photoFile':
      case 'aadhaarFile':
      case 'panFile':
        if (!value) return 'File required'
        break
      default:
        return ''
    }
    return ''
  }

  // Validate fields by current step
  const validateStep = () => {
    let newErrors = {}
    if (step === 1) {
      ['firstName', 'lastName', 'fatherName', 'spouseName', 'dob', 'gender', 'email', 'phone', 'workExperience', 'language', 'maritalStatus', 'education'].forEach(f => {
        const err = validateField(f, form[f])
        if (err) newErrors[f] = err
      })
    }
    if (step === 2) {
      ['designation', 'nomineeName', 'nomineeRelation', 'bankName', 'accountNumber', 'ifsc', 'photoFile', 'aadhaarFile', 'panFile'].forEach(f => {
        const err = validateField(f, form[f])
        if (err) newErrors[f] = err
      })
    }
    if (step === 3) {
      ['permanentAddress', 'presentAddress'].forEach(f => {
        const err = validateField(f, form[f])
        if (err) newErrors[f] = err
      })
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (!validateStep()) return
    setStep(prev => prev + 1)
  }

  const prevStep = () => setStep(prev => prev - 1)

  const handleSubmit = async () => {
    if (!validateStep()) return;  // validate inputs for current step

    try {
      const formData = new FormData();
      formData.append('first_name', form.firstName);
      formData.append('last_name', form.lastName);
      formData.append('father_name', form.fatherName);
      formData.append('spouse_name', form.spouseName);
      formData.append('mobile', form.phone);
      formData.append('email', form.email);
      formData.append('password', form.password);
      formData.append('dob', form.dob);
      formData.append('age', form.age);
      formData.append('gender', form.gender);
      formData.append('work_experience', form.workExperience);
      formData.append('designation', form.designation);
      formData.append('reference_agent', form.referenceAgent);
      formData.append('agent_team', form.agentTeam);
      formData.append('aadhaar', form.aadhaar);
      formData.append('pan', form.pan);
      formData.append('occupation', form.occupation);
      formData.append('language', form.language);
      formData.append('marital_status', form.maritalStatus);
      formData.append('education', form.education);
      formData.append('nominee_name', form.nomineeName);
      formData.append('nominee_relation', form.nomineeRelation);
      formData.append('bank_name', form.bankName);
      formData.append('account_number', form.accountNumber);
      formData.append('ifsc', form.ifsc);
      formData.append('permanent_address', form.permanentAddress);
      formData.append('present_address', form.presentAddress);

      formData.append('photo_file', form.photoFile);
      formData.append('aadhaar_file', form.aadhaarFile);
      formData.append('pan_file', form.panFile);

      const response = await fetch('https://api.qbits4dev.com/register/agent', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()
      if (response.ok) {
        alert('Agent registered successfully!')
      } else {
        alert(result.message || 'Registration failed')
      }
    } catch (error) {
      alert('Network or server error. Please try again.')
    }
  }

  return (
    <div>
      <AppHeader />
      <div className="bg-light min-vh-100 d-flex flex-row align-items-center py-5">
        <CContainer>
          <CRow className="justify-content-center">
            <CCol md={12} lg={6}>
              <CCard className="shadow-sm rounded-4">
                <CCardBody className="p-5">
                  <CForm>
                    <h1 className="mb-4 text-primary" style={{ fontWeight: 'bold' }}>Agent Registration</h1>

                    {/* Step 1 */}
                    {step === 1 && (
                      <CCard className="mb-4 p-3 bg-white shadow-sm">
                        <h5 className="text-info mb-3">Personal Details</h5>

                        {/* First Name */}
                        <CInputGroup className="mb-3">
                          <CInputGroupText><CIcon icon={cilUser} /></CInputGroupText>
                          <CFormInput
                            name="firstName"
                            placeholder="First Name"
                            value={form.firstName}
                            maxLength={30}
                            onChange={handleChange}
                            invalid={!!errors.firstName}
                          />
                        </CInputGroup>
                        {errors.firstName && <small className="text-danger">{errors.firstName}</small>}

                        {/* Last Name */}
                        <CInputGroup className="mb-3">
                          <CInputGroupText><CIcon icon={cilUser} /></CInputGroupText>
                          <CFormInput
                            name="lastName"
                            placeholder="Last Name"
                            value={form.lastName}
                            maxLength={30}
                            onChange={handleChange}
                            invalid={!!errors.lastName}
                          />
                        </CInputGroup>
                        {errors.lastName && <small className="text-danger">{errors.lastName}</small>}

                        {/* Father Name */}
                        <CInputGroup className="mb-3">
                          <CFormInput
                            name="fatherName"
                            placeholder="Father Name"
                            value={form.fatherName}
                            maxLength={30}
                            onChange={handleChange}
                          />
                        </CInputGroup>

                        {/* Spouse Name */}
                        <CInputGroup className="mb-3">
                          <CFormInput
                            name="spouseName"
                            placeholder="Spouse Name"
                            value={form.spouseName}
                            maxLength={30}
                            onChange={handleChange}
                          />
                        </CInputGroup>

                        {/* DOB */}
                        <CInputGroup className="mb-3">
                          <CInputGroupText><CIcon icon={cilCalendar} /></CInputGroupText>
                          <CFormInput
                            type="date"
                            name="dob"
                            value={form.dob}
                            onChange={handleChange}
                            invalid={!!errors.dob}
                          />
                        </CInputGroup>
                        {errors.dob && <small className="text-danger">{errors.dob}</small>}

                        {/* Age */}
                        <CInputGroup className="mb-3">
                          <CFormInput
                            name="age"
                            placeholder="Age"
                            value={form.age}
                            readOnly
                          />
                        </CInputGroup>

                        {/* Gender */}
                        <CFormSelect
                          name="gender"
                          value={form.gender}
                          onChange={handleChange}
                          className="mb-3"
                          invalid={!!errors.gender}
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </CFormSelect>
                        {errors.gender && <small className="text-danger">{errors.gender}</small>}

                        {/* Work Experience */}
                        <CInputGroup className="mb-3">
                          <CFormInput
                            name="workExperience"
                            placeholder="Work Experience (Years)"
                            maxLength={2}
                            value={form.workExperience}
                            onChange={handleChange}
                            invalid={!!errors.workExperience}
                          />
                        </CInputGroup>
                        {errors.workExperience && <small className="text-danger">{errors.workExperience}</small>}

                        {/* Email */}
                        <CInputGroup className="mb-3">
                          <CFormInput
                            name="email"
                            placeholder="Email"
                            maxLength={50}
                            value={form.email}
                            onChange={handleChange}
                            invalid={!!errors.email}
                          />
                        </CInputGroup>
                        {errors.email && <small className="text-danger">{errors.email}</small>}

                        {/* Phone */}
                        <CInputGroup className="mb-3">
                          <CFormInput
                            name="phone"
                            placeholder="Phone"
                            maxLength={10}
                            value={form.phone}
                            onChange={handleChange}
                            invalid={!!errors.phone}
                          />
                        </CInputGroup>
                        {errors.phone && <small className="text-danger">{errors.phone}</small>}

                        {/* Occupation */}
                        <CInputGroup className="mb-3">
                          <CFormInput
                            name="occupation"
                            placeholder="Occupation"
                            maxLength={30}
                            value={form.occupation}
                            onChange={handleChange}
                          />
                        </CInputGroup>

                        {/* Language */}
                        <CFormSelect
                          name="language"
                          value={form.language}
                          onChange={handleChange}
                          className="mb-3"
                        >
                          <option value="">Select Language</option>
                          <option value="Telugu">Telugu</option>
                          <option value="English">English</option>
                          <option value="Hindi">Hindi</option>
                        </CFormSelect>

                        {/* Marital Status */}
                        <CFormSelect
                          name="maritalStatus"
                          value={form.maritalStatus}
                          onChange={handleChange}
                          className="mb-3"
                          invalid={!!errors.maritalStatus}
                        >
                          <option value="">Select Marital Status</option>
                          <option value="Married">Married</option>
                          <option value="Unmarried">Unmarried</option>
                        </CFormSelect>
                        {errors.maritalStatus && <small className="text-danger">{errors.maritalStatus}</small>}

                        {/* Education */}
                        <CInputGroup className="mb-3">
                          <CFormInput
                            name="education"
                            placeholder="Education"
                            maxLength={50}
                            value={form.education}
                            onChange={handleChange}
                            invalid={!!errors.education}
                          />
                        </CInputGroup>
                        {errors.education && <small className="text-danger">{errors.education}</small>}

                        <div className="d-flex justify-content-end mt-3">
                          <CButton color="primary" onClick={nextStep}>
                            Next
                          </CButton>
                        </div>
                      </CCard>
                    )}

                    {step === 2 && (
                      <CCard className='mb-4 p-3 bg-white shadow-sm'>
                        <h5 className='text-info mb-3'>Designation, Nominee/Bank & Files</h5>
                        <CInputGroup className='mb-3'>
                          <CDropdown className='flex-grow-1'>
                            <CDropdownToggle color='light' className='text-start w-100'>{loadingDesignations ? <span><CSpinner size="sm" className="me-2" />Loading...</span> : designationName}</CDropdownToggle>
                            <CDropdownMenu>
                              {loadingDesignations && (
                                <CDropdownItem disabled>Loading...</CDropdownItem>
                              )}
                              {!loadingDesignations && designationError && (
                                <CDropdownItem disabled>{designationError}</CDropdownItem>
                              )}
                              {!loadingDesignations && !designationError && designations.map((d, idx) => (
                                <CDropdownItem key={idx} onClick={() => handleDesignationSelect(d)}>
                                  {d.name}
                                </CDropdownItem>
                              ))}
                            </CDropdownMenu>
                          </CDropdown>
                        </CInputGroup>
                        {errors.designation && <small className="text-danger">{errors.designation}</small>}

                        <h5 className='text-info mb-3'>Work Location</h5>
                        <CInputGroup className='mb-3'>
                          <CFormInput placeholder='Branch' name='Work Location' />
                        </CInputGroup>

                        <CRow>
                          {/* Bank Details Section */}
                          <CCol xs={12} md={12}>
                            <CCard className="p-3 bg-white shadow-sm mb-3 rounded-3">
                              <h6 className="text-info mb-3 fw-semibold">Employee Bank Details</h6>

                              {/* Bank Name */}
                              <div className="mb-3 d-flex flex-column">
                                <CFormInput
                                  placeholder="Bank Name"
                                  name="bankName"
                                  value={form.bankName}
                                  maxLength={50}
                                  onChange={handleChange}
                                  className="shadow-sm"
                                />
                                {errors.bankName && (
                                  <small className="text-danger mt-1">{errors.bankName}</small>
                                )}
                              </div>

                              {/* Branch Name (New Field) */}
                              <div className="mb-3 d-flex flex-column">
                                <CFormInput
                                  placeholder="Branch Name"
                                  name="branchName"
                                  value={form.branchName}
                                  maxLength={50}
                                  onChange={handleChange}
                                  className="shadow-sm"
                                />
                                {errors.branchName && (
                                  <small className="text-danger mt-1">{errors.branchName}</small>
                                )}
                              </div>

                              {/* Account Number */}
                              <div className="mb-3 d-flex flex-column">
                                <CFormInput
                                  placeholder="Employee bank Account Number"
                                  name="accountNumber"
                                  value={form.accountNumber}
                                  maxLength={20}
                                  onChange={handleChange}
                                  className="shadow-sm"
                                />
                                {errors.accountNumber && (
                                  <small className="text-danger mt-1">{errors.accountNumber}</small>
                                )}
                              </div>

                              {/* IFSC Code */}
                              <div className="d-flex flex-column">
                                <CFormInput
                                  placeholder="IFSC Code"
                                  name="ifsc"
                                  value={form.ifsc}
                                  maxLength={11}
                                  onChange={handleChange}
                                  className="shadow-sm"
                                />
                                {errors.ifsc && (
                                  <small className="text-danger mt-1">{errors.ifsc}</small>
                                )}
                              </div>
                            </CCard>
                          </CCol>
                        </CRow>
                        <CRow>

                          {/* Nominee Details Section */}
                          <CCol xs={12} md={12}>
                            <CCard className="p-3 bg-white shadow-sm mb-3 rounded-3">
                              <h6 className="text-info mb-3 fw-semibold">Nominee Details</h6>

                              {/* Nominee Name */}
                              <div className="mb-3 d-flex flex-column">
                                <CFormInput
                                  placeholder="Nominee Name"
                                  name="nomineeName"
                                  value={form.nomineeName}
                                  maxLength={50}
                                  onChange={handleChange}
                                  className="shadow-sm"
                                />
                                {errors.nomineeName && (
                                  <small className="text-danger mt-1">{errors.nomineeName}</small>
                                )}
                              </div>

                              {/* Nominee Relation */}
                              <div className="mb-3 d-flex flex-column">
                                <CFormInput
                                  placeholder="Relation with Nominee"
                                  name="nomineeRelation"
                                  value={form.nomineeRelation}
                                  maxLength={30}
                                  onChange={handleChange}
                                  className="shadow-sm"
                                />
                                {errors.nomineeRelation && (
                                  <small className="text-danger mt-1">{errors.nomineeRelation}</small>
                                )}
                              </div>

                              {/* Nominee Contact */}
                              <div className="d-flex flex-column">
                                <CFormInput
                                  placeholder="Nominee Contact Number"
                                  name="nomineeContact"
                                  value={form.nomineeContact}
                                  maxLength={15}
                                  onChange={handleChange}
                                  className="shadow-sm"
                                />
                                {errors.nomineeContact && (
                                  <small className="text-danger mt-1">{errors.nomineeContact}</small>
                                )}
                              </div>
                            </CCard>
                          </CCol>



                        </CRow>
                        <CCard className="p-4 border-1 shadow-sm rounded-3">
                          <h5 className="mb-4 fw-semibold text-info">Upload Documents</h5>
                          <CRow className="gy-4">

                            {/* Photo Upload */}
                            <CCol xs={12}>
                              <div className="d-flex flex-column">
                                <CFormLabel className="fw-medium mb-2">Photo (JPEG only)</CFormLabel>
                                <CFormInput
                                  type="file"
                                  name="photoFile"
                                  accept="image/jpeg"
                                  onChange={handleChange}
                                  className="shadow-sm"
                                />
                                {errors.photoFile && (
                                  <small className="text-danger mt-1">{errors.photoFile}</small>
                                )}
                              </div>
                            </CCol>

                            {/* Aadhaar Upload */}
                            <CCol xs={12}>
                              <div className="d-flex flex-column">
                                <CFormLabel className="fw-medium mb-2">Aadhaar File (PDF only)</CFormLabel>
                                <CFormInput
                                  type="file"
                                  name="aadhaarFile"
                                  accept="application/pdf"
                                  onChange={handleChange}
                                  className="shadow-sm"
                                />
                                {errors.aadhaarFile && (
                                  <small className="text-danger mt-1">{errors.aadhaarFile}</small>
                                )}
                              </div>
                            </CCol>

                            {/* PAN Upload */}
                            <CCol xs={12}>
                              <div className="d-flex flex-column">
                                <CFormLabel className="fw-medium mb-2">PAN File (PDF only)</CFormLabel>
                                <CFormInput
                                  type="file"
                                  name="panFile"
                                  accept="application/pdf"
                                  onChange={handleChange}
                                  className="shadow-sm"
                                />
                                {errors.panFile && (
                                  <small className="text-danger mt-1">{errors.panFile}</small>
                                )}
                              </div>
                            </CCol>

                          </CRow>
                        </CCard>



                        <div className="d-flex justify-content-between mt-3">
                          <CButton color="secondary" onClick={prevStep}>
                            Back
                          </CButton>
                          <CButton color="primary" onClick={nextStep}>
                            Next
                          </CButton>
                        </div>
                      </CCard>
                    )}

                    {/* Step 3 */}
                    {/* Step 3 */}
                    {step === 3 && (
                      <CCard className="mb-4 p-3 bg-white shadow-sm">
                        <h5 className="text-info mb-3">Address Details</h5>
                        <CInputGroup className="mb-3">
                          <CFormInput
                            placeholder="Permanent Address"
                            name="permanentAddress"
                            value={form.permanentAddress}
                            onChange={handleChange}
                          />
                        </CInputGroup>

                        <CInputGroup className="mb-3">
                          <CFormInput
                            placeholder="Present Address"
                            name="presentAddress"
                            value={form.presentAddress}
                            onChange={handleChange}
                          />
                        </CInputGroup>

                        <div className="d-flex justify-content-between mt-3">
                          <CButton color="secondary" onClick={prevStep}>
                            Back
                          </CButton>
                          <CButton color="success" onClick={handleSubmit}>
                            Submit
                          </CButton>
                        </div>
                      </CCard>
                    )}
                  </CForm>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CContainer>
      </div>
      <AppFooter />
    </div>
  )
}

