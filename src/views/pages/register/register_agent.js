import React, { useState, useEffect } from 'react'
import {
  CCard, CCardBody, CCol, CContainer, CRow, CForm, CInputGroup, CFormInput, CInputGroupText,
  CButton, CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem, CFormSelect, CSpinner,CFormLabel
} from '@coreui/react'
import { cilUser, cilCalendar } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useNavigate } from 'react-router-dom'
import { AppFooter, AppHeader } from './../../../components/index'

export default function RegisterAgentWizard() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)

  // Designations
  const [designations, setDesignations] = useState([])
  const [designationName, setDesignationName] = useState("Select Designation")
  const [loadingDesignations, setLoadingDesignations] = useState(true)
  const [designationError, setDesignationError] = useState("")

  const [form, setForm] = useState({
    firstName: '', lastName: '', fatherName: '', spouseName: '', age: '', dob: '', email: '', phone: '',
    occupation: '', experience: '', language: '', maritalStatus: '', education: '',
    designation: '', nomineeName: '', nomineeRelation: '', bankName: '', accountNumber: '', ifsc: '',
    permanentAddress: '', presentAddress: '',
    photoFile: null, aadhaarFile: null, panFile: null
  })
  const [errors, setErrors] = useState({})

  // Restrict input & handle changes
  const handleChange = (e) => {
    let { name, value, files } = e.target

    // File inputs
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

    // Restrict alphabets only
    if (['firstName', 'lastName', 'fatherName', 'spouseName', 'nomineeName', 'nomineeRelation', 'language', 'education', 'occupation'].includes(name)) {
      value = value.replace(/[^A-Za-z ]/g, '')
    }

    // Numbers only
    if (['phone', 'experience', 'accountNumber'].includes(name)) {
      value = value.replace(/[^0-9]/g, '')
    }

    // Alphanumeric & special chars for address, bank, IFSC
    if (['permanentAddress', 'presentAddress', 'bankName', 'ifsc'].includes(name)) {
      value = value.replace(/[^A-Za-z0-9 ,]/g, '')
    }

    setForm(prev => ({ ...prev, [name]: value }))

    // Auto calculate age
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

  // Fetch designations
  useEffect(() => {
    setLoadingDesignations(true)
    fetch('http://127.0.0.1:5000/test?key=designation')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data.Designation)) {
          setDesignations(data.Designation)
          setDesignationError("")
        } else {
          setDesignations([])
          setDesignationError("No designations found")
        }
      })
      .catch(() => {
        setDesignations([])
        setDesignationError("Failed to fetch designations")
      })
      .finally(() => setLoadingDesignations(false))
  }, [])

  const handleDesignationSelect = (designation) => {
    setDesignationName(designation.Role)
    setForm(prev => ({ ...prev, designation: designation.Role }))
  }

  // Field-level validation
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
        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) return 'Invalid email'
        break
      case 'occupation':
      case 'language':
      case 'bankName':
        if (!/^[A-Za-z0-9 ,]*$/.test(value)) return 'Invalid characters'
        break
      case 'experience':
        if (!/^[0-9]{1,2}$/.test(value)) return 'Only numbers allowed'
        break
      case 'accountNumber':
        if (!/^[0-9]{1,20}$/.test(value)) return 'Invalid account number'
        break
      case 'ifsc':
        if (!/^[A-Za-z0-9]{0,11}$/.test(value)) return 'Invalid IFSC'
        break
      case 'education':
      case 'permanentAddress':
      case 'presentAddress':
        if (!value) return 'Required'
        break
      case 'maritalStatus':
      case 'designation':
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

  // Validate step
  const validateStep = () => {
    let newErrors = {}
    if (step === 1) {
      ['firstName', 'lastName', 'fatherName', 'spouseName', 'dob', 'email', 'phone', 'experience', 'language', 'maritalStatus', 'education'].forEach(f => {
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

  const nextStep = () => { if (!validateStep()) return; setStep(prev => prev + 1) }
  const prevStep = () => setStep(prev => prev - 1)

  const handleSubmit = async () => {
    if (!validateStep()) return
    try {
      const formData = new FormData()
      Object.entries(form).forEach(([key, value]) => formData.append(key, value))

      const res = await fetch('http://127.0.0.1:5000/test/', {
        method: 'POST',
        body: formData
      })

      const result = await res.json()
      if (res.ok) {
        alert('Agent registered successfully!')
        navigate('/')
      } else {
        alert(result.message || 'Registration failed')
      }
    } catch (err) {
      alert('Something went wrong!')
    }
  }

  return (
    <div>
      <AppHeader />
      <div className='bg-light min-vh-100 d-flex flex-row align-items-center py-5'>
        <CContainer>
          <CRow className='justify-content-center'>
            <CCol md={12} lg={6}>
              <CCard className='shadow-sm rounded-4'>
                <CCardBody className='p-5'>
                  <h1 className='mb-4 text-primary' style={{ fontWeight: 'bold' }}>Agent Registration</h1>
                  <CForm>

                    {/* STEP 1 */}
                    {step === 1 && (
                      <CCard className="mb-4 p-3 bg-white shadow-sm">
                        <h5 className="text-info mb-3">Personal Details</h5>
                        <CRow className="mb-3">
                          <CCol><CInputGroup><CInputGroupText><CIcon icon={cilUser} /></CInputGroupText><CFormInput placeholder="First Name" name="firstName" value={form.firstName} maxLength={30} onChange={handleChange} /></CInputGroup>{errors.firstName && <small className="text-danger">{errors.firstName}</small>}</CCol>
                        </CRow>
                        <CRow className="mb-3">
                          <CCol><CInputGroup><CInputGroupText><CIcon icon={cilUser} /></CInputGroupText><CFormInput placeholder="Last Name" name="lastName" value={form.lastName} maxLength={30} onChange={handleChange} /></CInputGroup>{errors.lastName && <small className="text-danger">{errors.lastName}</small>}</CCol>
                        </CRow>
                        <CRow className="mb-3"><CCol><CFormInput placeholder="Father Name" name="fatherName" value={form.fatherName} maxLength={30} onChange={handleChange} /></CCol></CRow>
                        <CRow className="mb-3"><CCol><CFormInput placeholder="Spouse Name" name="spouseName" value={form.spouseName} maxLength={30} onChange={handleChange} /></CCol></CRow>
                        <CRow className="mb-3"><CCol><CInputGroup><CInputGroupText><CIcon icon={cilCalendar} /></CInputGroupText><CFormInput type="date" name="dob" value={form.dob} onChange={handleChange} /></CInputGroup>{errors.dob && <small className="text-danger">{errors.dob}</small>}</CCol></CRow>
                        <CRow className="mb-3"><CCol><CFormInput placeholder="Age" name="age" value={form.age} readOnly /></CCol></CRow>
                        <CRow className="mb-3"><CCol><CFormInput placeholder="Email" name="email" value={form.email} maxLength={50} onChange={handleChange} />{errors.email && <small className="text-danger">{errors.email}</small>}</CCol></CRow>
                        <CRow className="mb-3"><CCol><CFormInput placeholder="Phone" name="phone" value={form.phone} maxLength={10} onChange={handleChange} />{errors.phone && <small className="text-danger">{errors.phone}</small>}</CCol></CRow>
                        <CRow className="mb-3"><CCol><CFormInput placeholder="Occupation" name="occupation" value={form.occupation} maxLength={30} onChange={handleChange} /></CCol></CRow>
                        <CRow className="mb-3"><CCol><CFormInput placeholder="Experience (Years)" name="experience" value={form.experience} maxLength={2} onChange={handleChange} /></CCol></CRow>
                        <CRow className="mb-3"><CCol><CFormSelect name="language" value={form.language} onChange={handleChange}><option value="">Select Language</option><option value="Telugu">Telugu</option><option value="English">English</option><option value="Hindi">Hindi</option></CFormSelect></CCol></CRow>
                        <CRow className="mb-3"><CCol><CFormSelect name="maritalStatus" value={form.maritalStatus} onChange={handleChange}><option value="">Select Marital Status</option><option value="Married">Married</option><option value="Unmarried">Unmarried</option></CFormSelect>{errors.maritalStatus && <small className="text-danger">{errors.maritalStatus}</small>}</CCol></CRow>
                        <CRow className="mb-3"><CCol><CFormInput placeholder="Education" name="education" value={form.education} maxLength={50} onChange={handleChange} /></CCol></CRow>
                        <div className="d-flex justify-content-end mt-3"><CButton color="primary" onClick={nextStep}>Next</CButton></div>
                      </CCard>
                    )}

                    {/* STEP 2 */}
                    {step === 2 && (
                      <CCard className='mb-4 p-3 bg-white shadow-sm'>
                        <h5 className='text-info mb-3'>Designation, Nominee/Bank & Files</h5>
                        <CInputGroup className='mb-3'>
                          <CDropdown className='flex-grow-1'>
                            <CInputGroupText><CIcon icon={cilUser} /></CInputGroupText>
                            <CDropdownToggle color='light' className='text-start w-100'>{loadingDesignations ? <span><CSpinner size="sm" className="me-2" />Loading...</span> : designationName}</CDropdownToggle>
                            <CDropdownMenu>
                              {loadingDesignations && <CDropdownItem disabled>Loading...</CDropdownItem>}
                              {!loadingDesignations && designationError && <CDropdownItem disabled>{designationError}</CDropdownItem>}
                              {!loadingDesignations && !designationError && designations.map((d, idx) => <CDropdownItem key={idx} onClick={() => handleDesignationSelect(d)}>{d.Role}</CDropdownItem>)}
                            </CDropdownMenu>
                          </CDropdown>
                        </CInputGroup>
                        {errors.designation && <small className="text-danger">{errors.designation}</small>}

                        <CRow>
                          <CCol md={6}>
                            <CCard className='p-3 bg-white shadow-sm mb-3'>
                              <h6 className='text-info mb-3'>Nominee Details</h6>
                              <CFormInput placeholder='Nominee Name' name='nomineeName' value={form.nomineeName} maxLength={30} onChange={handleChange} className='mb-2' />
                              {errors.nomineeName && <small className="text-danger">{errors.nomineeName}</small>}
                              <CFormInput placeholder='Relation' name='nomineeRelation' value={form.nomineeRelation} maxLength={20} onChange={handleChange} />
                              {errors.nomineeRelation && <small className="text-danger">{errors.nomineeRelation}</small>}
                            </CCard>
                          </CCol>
                          <CCol md={6}>
                            <CCard className='p-3 bg-white shadow-sm mb-3'>
                              <h6 className='text-info mb-3'>Bank Details</h6>
                              <CFormInput placeholder='Bank Name' name='bankName' value={form.bankName} maxLength={50} onChange={handleChange} className='mb-2' />
                              {errors.bankName && <small className="text-danger">{errors.bankName}</small>}
                              <CFormInput placeholder='Account Number' name='accountNumber' value={form.accountNumber} maxLength={20} onChange={handleChange} className='mb-2' />
                              {errors.accountNumber && <small className="text-danger">{errors.accountNumber}</small>}
                              <CFormInput placeholder='IFSC Code' name='ifsc' value={form.ifsc} maxLength={11} onChange={handleChange} />
                              {errors.ifsc && <small className="text-danger">{errors.ifsc}</small>}
                            </CCard>
                          </CCol>
                        </CRow>
                        <CCard className='p-3 bg-white shadow-sm'>
                        <CRow className="mb-3">
                          <CCol xs={12} md={4} className="mb-3 mb-md-0">
                            <CFormLabel>Photo (JPEG only)</CFormLabel>
                            <CFormInput type="file" name="photoFile" accept="image/jpeg" onChange={handleChange} />
                            {errors.photoFile && <small className="text-danger">{errors.photoFile}</small>}
                          </CCol>

                          <CCol xs={12} md={4} className="mb-3 mb-md-0">
                            <CFormLabel>Aadhaar File (PDF only)</CFormLabel>
                            <CFormInput type="file" name="aadhaarFile" accept="application/pdf" onChange={handleChange} />
                            {errors.aadhaarFile && <small className="text-danger">{errors.aadhaarFile}</small>}
                          </CCol>

                          <CCol xs={12} md={4}>
                            <CFormLabel>PAN File (PDF only)</CFormLabel>
                            <CFormInput type="file" name="panFile" accept="application/pdf" onChange={handleChange} />
                            {errors.panFile && <small className="text-danger">{errors.panFile}</small>}
                          </CCol>
                        </CRow>
                        </CCard>

                        <div className='d-flex justify-content-between mt-3'>
                          <CButton color='secondary' onClick={prevStep}>Back</CButton>
                          <CButton color='primary' onClick={nextStep}>Next</CButton>
                        </div>
                      </CCard>
                    )}

                    {/* STEP 3 */}
                    {step === 3 && (
                      <CCard className='mb-4 p-3 bg-white shadow-sm'>
                        <h5 className='text-info mb-3'>Address Details</h5>
                        <CRow className="mb-3">
                          <CCol><CFormInput placeholder='Permanent Address' name='permanentAddress' value={form.permanentAddress} onChange={handleChange} /></CCol>
                        </CRow>
                        <CRow className="mb-3">
                          <CCol><CFormInput placeholder='Present Address' name='presentAddress' value={form.presentAddress} onChange={handleChange} /></CCol>
                        </CRow>
                        <div className='d-flex justify-content-between mt-3'>
                          <CButton color='secondary' onClick={prevStep}>Back</CButton>
                          <CButton color='success' onClick={handleSubmit}>Submit</CButton>
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
