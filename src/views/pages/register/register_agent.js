import React, { useState, useEffect } from 'react'
import {
  CCard, CCardBody, CCol, CContainer, CRow, CForm, CInputGroup, CFormInput, CInputGroupText,
  CButton, CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem, CFormSelect, CSpinner
} from '@coreui/react'
import { cilUser, cilCalendar } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useNavigate } from 'react-router-dom'
import { AppFooter, AppHeader } from './../../../components/index'

export default function RegisterAgentWizard() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)

  const [designations, setDesignations] = useState([])
  const [designationName, setDesignationName] = useState("Select Designation")
  const [loadingDesignations, setLoadingDesignations] = useState(true)
  const [designationError, setDesignationError] = useState("")

  const [form, setForm] = useState({
    firstName: '', lastName: '', fatherName: '', spouseName: '', age: '', dob: '', email: '', phone: '',
    occupation: '', experience: '', language: '', maritalStatus: '', education: '',
    designation: '', nomineeName: '', nomineeRelation: '', bankName: '', accountNumber: '', ifsc: '',
    permanentAddress: '', presentAddress: '',
    photo_file: null, aadhaar_file: null, pan_file: null
  })
  const [errors, setErrors] = useState({})

  // Handle input changes & file validation
  const handleChange = (e) => {
    const { name, value, files } = e.target

    if (['photo_file', 'aadhaar_file', 'pan_file'].includes(name)) {
      if (files.length > 0) {
        const file = files[0]
        if (name === 'photo_file' && !file.type.includes('jpeg') && !file.type.includes('jpg')) {
          alert('Photo must be JPEG/JPG')
          e.target.value = ''
          return
        }
        if ((name === 'aadhaar_file' || name === 'pan_file') && file.type !== 'application/pdf') {
          alert(`${name === 'aadhaar_file' ? 'Aadhaar' : 'PAN'} must be PDF`)
          e.target.value = ''
          return
        }
        setForm(prev => ({ ...prev, [name]: file }))
      }
    } else {
      setForm(prev => ({ ...prev, [name]: value }))
    }

    // Auto calculate age from DOB
    if (name === 'dob' && value) {
      const birthDate = new Date(value)
      const today = new Date()
      let age = today.getFullYear() - birthDate.getFullYear()
      const m = today.getMonth() - birthDate.getMonth()
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--
      if (age >= 18) {
        setForm(prev => ({ ...prev, age: age.toString() }))
      } else {
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
      .catch(err => {
        console.error("Fetch error:", err)
        setDesignations([])
        setDesignationError("Failed to fetch designations")
      })
      .finally(() => setLoadingDesignations(false))
  }, [])

  const handleDesignationSelect = (designation) => {
    setDesignationName(designation.Role)
    setForm(prev => ({ ...prev, designation: designation.Role }))
  }

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
      case 'maritalStatus':
      case 'designation':
      case 'dob':
        if (!value) return 'Required'
        break
      case 'photo_file':
      case 'aadhaar_file':
      case 'pan_file':
        if (!value) return 'File required'
        break
      default:
        return ''
    }
    return ''
  }

  const validateStep = () => {
    let newErrors = {}
    if (step === 1) {
      ['firstName', 'lastName', 'fatherName', 'spouseName', 'dob', 'email', 'phone', 'occupation', 'experience', 'language', 'maritalStatus', 'education'].forEach(f => {
        const err = validateField(f, form[f])
        if (err) newErrors[f] = err
      })
    }
    if (step === 2) {
      ['designation', 'nomineeName', 'nomineeRelation', 'bankName', 'accountNumber', 'ifsc'].forEach(f => {
        const err = validateField(f, form[f])
        if (err) newErrors[f] = err
      })
    }
    if (step === 3) {
      ['permanentAddress', 'presentAddress', 'photo_file', 'aadhaar_file', 'pan_file'].forEach(f => {
        const err = validateField(f, form[f])
        if (err) newErrors[f] = err
      })
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => { if (validateStep()) setStep(prev => prev + 1) }
  const prevStep = () => setStep(prev => prev - 1)

  const handleSubmit = async () => {
    if (!validateStep()) return
    try {
      const formData = new FormData()
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value)
      })
      const res = await fetch('http://127.0.0.1:5000/test/', { method: 'POST', body: formData })
      const result = await res.json()
      if (res.ok) { alert('Agent registered successfully!'); navigate('/') }
      else { alert(result.message || 'Registration failed') }
    } catch (err) { alert('Something went wrong!') }
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
                  <h1 className='mb-4 text-primary'>Agent Registration</h1>
                  <CForm>
                    {/* STEP 1 */}
                    {step === 1 && <CCard className="mb-4 p-3"><h5>Personal Details</h5>
                      <CRow className="mb-3"><CCol><CInputGroup><CInputGroupText><CIcon icon={cilUser} /></CInputGroupText><CFormInput placeholder="First Name" name="firstName" value={form.firstName} onChange={handleChange} /></CInputGroup>{errors.firstName && <small className="text-danger">{errors.firstName}</small>}</CCol></CRow>
                      <CRow className="mb-3"><CCol><CInputGroup><CInputGroupText><CIcon icon={cilUser} /></CInputGroupText><CFormInput placeholder="Last Name" name="lastName" value={form.lastName} onChange={handleChange} /></CInputGroup>{errors.lastName && <small className="text-danger">{errors.lastName}</small>}</CCol></CRow>
                      <CRow className="mb-3"><CCol><CFormInput placeholder="Father Name" name="fatherName" value={form.fatherName} onChange={handleChange} /></CCol></CRow>
                      <CRow className="mb-3"><CCol><CFormInput placeholder="Spouse Name" name="spouseName" value={form.spouseName} onChange={handleChange} /></CCol></CRow>
                      <CRow className="mb-3"><CCol><CInputGroup><CInputGroupText><CIcon icon={cilCalendar} /></CInputGroupText><CFormInput type="date" name="dob" value={form.dob} onChange={handleChange} /></CInputGroup>{errors.dob && <small className="text-danger">{errors.dob}</small>}</CCol></CRow>
                      <CRow className="mb-3"><CCol><CFormInput placeholder="Age" name="age" value={form.age} readOnly /></CCol></CRow>
                      <CRow className="mb-3"><CCol><CFormInput placeholder="Email" name="email" value={form.email} onChange={handleChange} />{errors.email && <small className="text-danger">{errors.email}</small>}</CCol></CRow>
                      <CRow className="mb-3"><CCol><CFormInput placeholder="Phone" name="phone" value={form.phone} onChange={handleChange} />{errors.phone && <small className="text-danger">{errors.phone}</small>}</CCol></CRow>
                      <CRow className="mb-3"><CCol><CFormInput placeholder="Occupation" name="occupation" value={form.occupation} onChange={handleChange} /></CCol></CRow>
                      <CRow className="mb-3"><CCol><CFormInput placeholder="Experience" name="experience" value={form.experience} onChange={handleChange} /></CCol></CRow>
                      <CRow className="mb-3"><CCol><CFormSelect name="language" value={form.language} onChange={handleChange}><option value="">Select Language</option><option>Telugu</option><option>English</option><option>Hindi</option></CFormSelect></CCol></CRow>
                      <CRow className="mb-3"><CCol><CFormSelect name="maritalStatus" value={form.maritalStatus} onChange={handleChange}><option value="">Select Marital Status</option><option>Married</option><option>Unmarried</option></CFormSelect>{errors.maritalStatus && <small className="text-danger">{errors.maritalStatus}</small>}</CCol></CRow>
                      <CRow className="mb-3"><CCol><CFormInput placeholder="Education" name="education" value={form.education} onChange={handleChange} /></CCol></CRow>
                      <div className="d-flex justify-content-end"><CButton color="primary" onClick={nextStep}>Next</CButton></div>
                    </CCard>}

                    {/* STEP 2 */}
                    {step === 2 && <CCard className="mb-4 p-3"><h5>Designation & Nominee/Bank Details</h5>
                      <CInputGroup className="mb-3">
                        <CDropdown className="flex-grow-1">
                          <CInputGroupText><CIcon icon={cilUser} /></CInputGroupText>
                          <CDropdownToggle color="light" className="w-100">{loadingDesignations ? <span><CSpinner size="sm" /> Loading...</span> : designationName}</CDropdownToggle>
                          <CDropdownMenu>
                            {designations.map((d, idx) => <CDropdownItem key={idx} onClick={() => handleDesignationSelect(d)}>{d.Role}</CDropdownItem>)}
                          </CDropdownMenu>
                        </CDropdown>
                      </CInputGroup>
                      {errors.designation && <small className="text-danger">{errors.designation}</small>}
                      <CRow>
                        <CCol md={6}><CFormInput placeholder="Nominee Name" name="nomineeName" value={form.nomineeName} onChange={handleChange} />{errors.nomineeName && <small className="text-danger">{errors.nomineeName}</small>}<CFormInput placeholder="Relation" name="nomineeRelation" value={form.nomineeRelation} onChange={handleChange} />{errors.nomineeRelation && <small className="text-danger">{errors.nomineeRelation}</small>}</CCol>
                        <CCol md={6}><CFormInput placeholder="Bank Name" name="bankName" value={form.bankName} onChange={handleChange} />{errors.bankName && <small className="text-danger">{errors.bankName}</small>}<CRow><CCol><CFormInput placeholder="Account Number" name="accountNumber" value={form.accountNumber} onChange={handleChange} />{errors.accountNumber && <small className="text-danger">{errors.accountNumber}</small>}</CCol><CCol><CFormInput placeholder="IFSC" name="ifsc" value={form.ifsc} onChange={handleChange} />{errors.ifsc && <small className="text-danger">{errors.ifsc}</small>}</CCol></CRow></CCol>
                      </CRow>
                      <div className="d-flex justify-content-between mt-3"><CButton color="secondary" onClick={prevStep}>Back</CButton><CButton color="primary" onClick={nextStep}>Next</CButton></div>
                    </CCard>}

                    {/* STEP 3 */}
                    {step === 3 && <CCard className="mb-4 p-3"><h5>Address & Documents</h5>
                      <CRow className="mb-3"><CCol md={6}><CFormInput placeholder="Permanent Address" name="permanentAddress" value={form.permanentAddress} onChange={handleChange} />{errors.permanentAddress && <small className="text-danger">{errors.permanentAddress}</small>}</CCol><CCol md={6}><CFormInput placeholder="Present Address" name="presentAddress" value={form.presentAddress} onChange={handleChange} />{errors.presentAddress && <small className="text-danger">{errors.presentAddress}</small>}</CCol></CRow>
                      <CRow className="mb-3"><CCol><label>Photo (JPEG only)</label><CFormInput type="file" name="photo_file" accept="image/jpeg,image/jpg" onChange={handleChange} />{errors.photo_file && <small className="text-danger">{errors.photo_file}</small>}</CCol></CRow>
                      <CRow className="mb-3"><CCol><label>Aadhaar (PDF only)</label><CFormInput type="file" name="aadhaar_file" accept="application/pdf" onChange={handleChange} />{errors.aadhaar_file && <small className="text-danger">{errors.aadhaar_file}</small>}</CCol></CRow>
                      <CRow className="mb-3"><CCol><label>PAN (PDF only)</label><CFormInput type="file" name="pan_file" accept="application/pdf" onChange={handleChange} />{errors.pan_file && <small className="text-danger">{errors.pan_file}</small>}</CCol></CRow>
                      <div className="d-flex justify-content-between mt-3"><CButton color="secondary" onClick={prevStep}>Back</CButton><CButton color="success" onClick={handleSubmit}>Submit</CButton></div>
                    </CCard>}
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
