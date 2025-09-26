// import React, { useState, useEffect } from 'react'


// import {
//   CButton,
//   CCard,
//   CCardBody,
//   CCol,
//   CContainer,
//   CDropdown,
//   CDropdownMenu,
//   CForm,
//   CFormInput,
//   CInputGroup,
//   CDropdownToggle,
//   CDropdownItem,
//   CRow,
//   CInputGroupText,
// } from '@coreui/react'
// import { useNavigate } from 'react-router-dom'
// import { faIdCard } from '@fortawesome/free-solid-svg-icons'
// import { cilLockLocked, cilUser, cilPhone, cilCalendar } from '@coreui/icons'
// import CIcon from '@coreui/icons-react'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// const Register_agent = () => {
//   const navigate = useNavigate()

//   // Roles fetched from single API call
//   const [roles, setRoles] = useState([])

//   // Dropdown display states
//   const [designationName, setDesignationName] = useState('Select Designation')
//   const [agentTeamName, setAgentTeamName] = useState('Select Agent Team')
//   const [directorName, setDirectorName] = useState('Select Director')

//   // Gender selection
//   const [gender, setGender] = useState('')

//   // Form State with exact API field names
//   const [form, setForm] = useState({
//     first_name: '',
//     last_name: '',
//     email: '',
//     phone: '',
//     password: '',
//     confirmPassword: '',
//     aadhaar: '',
//     pan: '',
//     aadhaar_file: null,
//     pan_file: null,
//     photo_file: null,
//     dob: '',
//     designation: '',
//     agent_team: '',
//     directors: '',
//     reference_agent: '',
//     gender: ''
//   })

//   // Validation errors
//   const [errors, setErrors] = useState({})

//   // Fetch roles once
//   useEffect(() => {
//     fetch('https://api.qbits4dev.com/register/?key=role')
//       .then(res => res.json())
//       .then(data => {
//         if (data.status === 'ok' && Array.isArray(data.roles)) {
//           setRoles(data.roles)
//         } else {
//           setRoles([])
//         }
//       })
//       .catch(() => setRoles([]))
//   }, [])

//   // Handle dropdown select - sets display name and form id
//   const handleDesignationSelect = (role) => {
//     setDesignationName(role.name)
//     setForm(prev => ({ ...prev, designation: role.id }))
//   }
//   const handleAgentTeamSelect = (role) => {
//     setAgentTeamName(role.name)
//     setForm(prev => ({ ...prev, agent_team: role.id }))
//   }
//   const handleDirectorSelect = (role) => {
//     setDirectorName(role.name)
//     setForm(prev => ({ ...prev, directors: role.id }))
//   }

//   // Gender change handler
//   const handleGenderChange = (e) => {
//     setGender(e.target.value)
//     setForm(prev => ({ ...prev, gender: e.target.value }))
//   }

//   // Input & file change handler with PDF file check
//   const handleChange = (e) => {
//     const { name, value, files } = e.target
//     if (['aadhaar_file', 'pan_file', 'photo_file'].includes(name)) {
//       if (files.length > 0) {
//         const file = files[0]
//         if (file.type !== 'application/pdf') {
//           alert('Please upload a PDF file.')
//           e.target.value = ''
//           return
//         }
//         setForm(prev => ({ ...prev, [name]: file }))
//       }
//     } else if (name === 'aadhaar') {
//       let val = value.replace(/\D/g, '').substring(0, 12)
//       val = val.replace(/(.{4})/g, '$1 ').trim()
//       setForm(prev => ({ ...prev, aadhaar: val }))
//     } else if (name === 'pan') {
//       setForm(prev => ({ ...prev, pan: value.toUpperCase() }))
//     } else {
//       setForm(prev => ({ ...prev, [name]: value }))
//     }
//   }

//   // Minimum DOB date for 18 years old
//   const getMaxDob = () => {
//     const today = new Date()
//     today.setFullYear(today.getFullYear() - 18)
//     return today.toISOString().split('T')[0]
//   }

//   // Basic validation of fields
//   const validate = () => {
//     let newErrors = {}
//     if (!form.first_name.trim()) newErrors.first_name = 'First name required'
//     if (!form.last_name.trim()) newErrors.last_name = 'Last name required'
//     if (!form.email.trim()) newErrors.email = 'Email required'
//     if (!form.phone.trim()) newErrors.phone = 'Phone number required'
//     if (!form.password) newErrors.password = 'Password required'
//     if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
//     if (!form.aadhaar.trim()) newErrors.aadhaar = 'Aadhaar required'
//     if (!form.pan.trim()) newErrors.pan = 'PAN required'
//     if (!form.aadhaar_file) newErrors.aadhaar_file = 'Aadhaar file required'
//     if (!form.pan_file) newErrors.pan_file = 'PAN file required'
//     if (!form.photo_file) newErrors.photo_file = 'Photo file required'
//     if (!form.dob) newErrors.dob = 'Date of birth required'
//     if (!form.gender) newErrors.gender = 'Gender required'
//     if (!form.designation) newErrors.designation = 'Designation required'
//     if (!form.agent_team) newErrors.agent_team = 'Agent team required'
//     if (!form.directors) newErrors.directors = 'Director required'

//     setErrors(newErrors)
//     return Object.keys(newErrors).length === 0
//   }

//   // Submit handler
//   const handleSubmit = async () => {
//     if (!validate()) return

//     try {
//       const formDataObj = new FormData()
//       Object.entries(form).forEach(([key, value]) => {
//         formDataObj.append(key, value)
//       })

//       const res = await fetch('http://127.0.0.1:5000/register/agent', {
//         method: 'POST',
//         body: formDataObj,
//       })

//       const result = await res.json()

//       if (res.ok) {
//         alert('Agent registered successfully!')
//         navigate('/')
//       } else {
//         alert(result.message || 'Registration failed.')
//       }
//     } catch (err) {
//       alert('Something went wrong. Please try again.')
//     }
//   }

//   return (
//     <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
//       <CContainer>
//         <CRow className="justify-content-center">
//           <CCol md={9} lg={7} xl={6}>
//             <CCard className="mx-4">
//               <CCardBody className="p-4">
//                 <CForm>
//                   <h1>Agent Registration</h1>
//                   <p className="text-body-secondary">Enter Agent details</p>

//                   {/* First Name */}
//                   <CInputGroup className="mb-3">
//                     <CInputGroupText><CIcon icon={cilUser} /></CInputGroupText>
//                     <CFormInput
//                       name="first_name"
//                       placeholder="First Name"
//                       value={form.first_name}
//                       onChange={handleChange}
//                       invalid={!!errors.first_name}
//                       required
//                     />
//                   </CInputGroup>

//                   {/* Last Name */}
//                   <CInputGroup className="mb-3">
//                     <CInputGroupText><CIcon icon={cilUser} /></CInputGroupText>
//                     <CFormInput
//                       name="last_name"
//                       placeholder="Last Name"
//                       value={form.last_name}
//                       onChange={handleChange}
//                       invalid={!!errors.last_name}
//                       required
//                     />
//                   </CInputGroup>

//                   {/* Email */}
//                   <CInputGroup className="mb-3">
//                     <CInputGroupText>@</CInputGroupText>
//                     <CFormInput
//                       name="email"
//                       type="email"
//                       placeholder="Email"
//                       value={form.email}
//                       onChange={handleChange}
//                       invalid={!!errors.email}
//                       required
//                     />
//                   </CInputGroup>

//                   {/* Phone */}
//                   <CInputGroup className="mb-3">
//                     <CInputGroupText><CIcon icon={cilPhone} /></CInputGroupText>
//                     <CFormInput
//                       name="phone"
//                       placeholder="Phone Number"
//                       value={form.phone}
//                       onChange={handleChange}
//                       invalid={!!errors.phone}
//                       required
//                     />
//                   </CInputGroup>

//                   {/* Password */}
//                   <CInputGroup className="mb-3">
//                     <CInputGroupText><CIcon icon={cilLockLocked} /></CInputGroupText>
//                     <CFormInput
//                       name="password"
//                       type="password"
//                       placeholder="Password"
//                       value={form.password}
//                       onChange={handleChange}
//                       invalid={!!errors.password}
//                       required
//                     />
//                   </CInputGroup>

//                   {/* Confirm Password */}
//                   <CInputGroup className="mb-3">
//                     <CInputGroupText><CIcon icon={cilLockLocked} /></CInputGroupText>
//                     <CFormInput
//                       name="confirmPassword"
//                       type="password"
//                       placeholder="Confirm Password"
//                       value={form.confirmPassword}
//                       onChange={handleChange}
//                       invalid={!!errors.confirmPassword}
//                       required
//                     />
//                   </CInputGroup>

//                   {/* DOB */}
//                   <CInputGroup className="mb-3">
//                     <CInputGroupText><CIcon icon={cilCalendar} /></CInputGroupText>
//                     <CFormInput
//                       name="dob"
//                       type="date"
//                       max={(() => {
//                         const today = new Date()
//                         today.setFullYear(today.getFullYear() - 18)
//                         return today.toISOString().split('T')[0]
//                       })()}
//                       value={form.dob}
//                       onChange={handleChange}
//                       invalid={!!errors.dob}
//                       required
//                     />
//                   </CInputGroup>

//                   {/* Gender */}
//                   <div className="mb-3">
//                     <label>Gender:</label>
//                     <div>
//                       {['Male', 'Female', 'Other'].map((g) => (
//                         <label key={g} style={{ marginRight: '15px' }}>
//                           <input
//                             type="radio"
//                             name="gender"
//                             value={g}
//                             checked={form.gender === g}
//                             onChange={handleGenderChange}
//                           />{' '}
//                           {g}
//                         </label>
//                       ))}
//                     </div>
//                     {errors.gender && (
//                       <div style={{ color: 'red' }}>{errors.gender}</div>
//                     )}
//                   </div>

//                   {/* Designation Dropdown */}
//                   <CDropdown className="d-flex mb-3">
//                     <CDropdownToggle color="primary">{designationName}</CDropdownToggle>
//                     <CDropdownMenu>
//                       {roles.map(role => (
//                         <CDropdownItem
//                           key={role.id}
//                           onClick={() => handleDesignationSelect(role)}
//                         >
//                           {role.name}
//                         </CDropdownItem>
//                       ))}
//                     </CDropdownMenu>
//                   </CDropdown>

//                   {/* Agent Team Dropdown */}
//                   {/* <CDropdown className="d-flex mb-3">
//                     <CDropdownToggle color="primary">{agentTeamName}</CDropdownToggle>
//                     <CDropdownMenu>
//                       {roles.map(role => (
//                         <CDropdownItem
//                           key={role.id}
//                           onClick={() => handleAgentTeamSelect(role)}
//                         >
//                           {role.name}
//                         </CDropdownItem>
//                       ))}
//                     </CDropdownMenu>
//                   </CDropdown> */}

//                   {/* Directors Dropdown */}
//                   {/* <CDropdown className="d-flex mb-4">
//                     <CDropdownToggle color="primary">{directorName}</CDropdownToggle>
//                     <CDropdownMenu>
//                       {roles.map(role => (
//                         <CDropdownItem
//                           key={role.id}
//                           onClick={() => handleDirectorSelect(role)}
//                         >
//                           {role.name}
//                         </CDropdownItem>
//                       ))}
//                     </CDropdownMenu>
//                   </CDropdown> */}

//                   {/* Aadhaar Number */}
//                   <CInputGroup className="mb-3">
//                     <CInputGroupText><FontAwesomeIcon icon={faIdCard} /></CInputGroupText>
//                     <CFormInput
//                       name="aadhaar"
//                       placeholder="Aadhaar Number"
//                       value={form.aadhaar}
//                       onChange={handleChange}
//                       invalid={!!errors.aadhaar}
//                       required
//                     />
//                   </CInputGroup>

//                   {/* PAN Number */}
//                   <CInputGroup className="mb-3">
//                     <CInputGroupText><FontAwesomeIcon icon={faIdCard} /></CInputGroupText>
//                     <CFormInput
//                       name="pan"
//                       placeholder="PAN Number"
//                       value={form.pan}
//                       onChange={handleChange}
//                       invalid={!!errors.pan}
//                       required
//                     />
//                   </CInputGroup>

//                   {/* Aadhaar File */}
//                   <div className="mb-3">
//                     <p>Aadhaar Card (PDF only)</p>
//                     <CFormInput
//                       type="file"
//                       name="aadhaar_file"
//                       accept="application/pdf"
//                       onChange={handleChange}
//                       required
//                     />
//                     {errors.aadhaar_file && (
//                       <div style={{ color: 'red' }}>{errors.aadhaar_file}</div>
//                     )}
//                   </div>

//                   {/* PAN File */}
//                   <div className="mb-3">
//                     <p>PAN Card (PDF only)</p>
//                     <CFormInput
//                       type="file"
//                       name="pan_file"
//                       accept="application/pdf"
//                       onChange={handleChange}
//                       required
//                     />
//                     {errors.pan_file && (
//                       <div style={{ color: 'red' }}>{errors.pan_file}</div>
//                     )}
//                   </div>

//                   {/* Photo File */}
//                   <div className="mb-3">
//                     <p>Photo (PDF only)</p>
//                     <CFormInput
//                       type="file"
//                       name="photo_file"
//                       accept="application/pdf"
//                       onChange={handleChange}
//                       required
//                     />
//                     {errors.photo_file && (
//                       <div style={{ color: 'red' }}>{errors.photo_file}</div>
//                     )}
//                   </div>

//                   {/* Submit button */}
//                   <div className="d-grid">
//                     <CButton color="info" onClick={handleSubmit}>
//                       Create Account
//                     </CButton>
//                   </div>
//                 </CForm>
//               </CCardBody>
//             </CCard>
//           </CCol>
//         </CRow>
//       </CContainer>
//     </div>
//   )
// }

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

  // designation states
  const [designations, setDesignations] = useState([])
  const [designationName, setDesignationName] = useState("Select Designation")
  const [loadingDesignations, setLoadingDesignations] = useState(true)
  const [designationError, setDesignationError] = useState("")

  const [form, setForm] = useState({
    firstName: '', lastName: '', fatherName: '', spouseName: '', age: '', dob: '', email: '', phone: '',
    occupation: '', experience: '', language: '', maritalStatus: '', education: '',
    designation: '', nomineeName: '', nomineeRelation: '', bankName: '', accountNumber: '', ifsc: '',
    permanentAddress: '', presentAddress: ''
  })
  const [errors, setErrors] = useState({})

  // restrict input & handle changes
  const handleChange = (e) => {
    let { name, value } = e.target

    // restrict alphabets only
    if (['firstName', 'lastName', 'fatherName', 'spouseName', 'nomineeName', 'nomineeRelation'].includes(name)) {
      value = value.replace(/[^A-Za-z ]/g, '')
    }

    // restrict numbers only
    if (['phone', 'experience', 'accountNumber'].includes(name)) {
      value = value.replace(/[^0-9]/g, '')
    }

    // restrict alphanumeric for occupation, language, addresses, bankName, IFSC
    if (['occupation', 'language', 'education', 'permanentAddress', 'presentAddress', 'bankName', 'ifsc'].includes(name)) {
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
      setForm(prev => ({ ...prev, age: age.toString() }))
    }
  }

  // fetch designations from backend
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
      default:
        return ''
    }
    return ''
  }

  // Validate current step
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

  const prevStep = () => {
    setStep(prev => prev - 1)
  }

  const handleSubmit = async () => {
    if (!validateStep()) return
    try {
      const res = await fetch('http://127.0.0.1:5000/register/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
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
                          <CCol>
                            <CInputGroup>
                              <CInputGroupText><CIcon icon={cilUser} /></CInputGroupText>
                              <CFormInput placeholder="First Name" name="firstName" value={form.firstName} maxLength={30} onChange={handleChange} />
                            </CInputGroup>
                            {errors.firstName && <small className="text-danger">{errors.firstName}</small>}
                          </CCol>
                        </CRow>

                        <CRow className="mb-3">
                          <CCol>
                            <CInputGroup>
                              <CInputGroupText><CIcon icon={cilUser} /></CInputGroupText>
                              <CFormInput placeholder="Last Name" name="lastName" value={form.lastName} maxLength={30} onChange={handleChange} />
                            </CInputGroup>
                            {errors.lastName && <small className="text-danger">{errors.lastName}</small>}
                          </CCol>
                        </CRow>

                        <CRow className="mb-3">
                          <CCol>
                            <CFormInput placeholder="Father Name" name="fatherName" value={form.fatherName} maxLength={30} onChange={handleChange} />
                          </CCol>
                        </CRow>

                        <CRow className="mb-3">
                          <CCol>
                            <CFormInput placeholder="Spouse Name" name="spouseName" value={form.spouseName} maxLength={30} onChange={handleChange} />
                          </CCol>
                        </CRow>

                        <CRow className="mb-3">
                          <CCol>
                            <CInputGroup>
                              <CInputGroupText><CIcon icon={cilCalendar} /></CInputGroupText>
                              <CFormInput type="date" name="dob" value={form.dob} onChange={handleChange} />
                            </CInputGroup>
                            {errors.dob && <small className="text-danger">{errors.dob}</small>}
                          </CCol>
                        </CRow>

                        <CRow className="mb-3">
                          <CCol>
                            <CFormInput placeholder="Age" name="age" value={form.age} readOnly />
                          </CCol>
                        </CRow>

                        <CRow className="mb-3">
                          <CCol>
                            <CFormInput placeholder="Email" name="email" value={form.email} maxLength={50} onChange={handleChange} />
                            {errors.email && <small className="text-danger">{errors.email}</small>}
                          </CCol>
                        </CRow>

                        <CRow className="mb-3">
                          <CCol>
                            <CFormInput placeholder="Phone" name="phone" value={form.phone} maxLength={10} onChange={handleChange} />
                            {errors.phone && <small className="text-danger">{errors.phone}</small>}
                          </CCol>
                        </CRow>

                        <CRow className="mb-3">
                          <CCol>
                            <CFormInput placeholder="Occupation" name="occupation" value={form.occupation} maxLength={30} onChange={handleChange} />
                          </CCol>
                        </CRow>

                        <CRow className="mb-3">
                          <CCol>
                            <CFormInput placeholder="Experience (Years)" name="experience" value={form.experience} maxLength={2} onChange={handleChange} />
                          </CCol>
                        </CRow>

                        <CRow className="mb-3">
                          <CCol>
                            <CFormInput placeholder="Language" name="language" value={form.language} maxLength={50} onChange={handleChange} />
                          </CCol>
                        </CRow>

                        <CRow className="mb-3">
                          <CCol>
                            <CFormSelect name="maritalStatus" value={form.maritalStatus} onChange={handleChange}>
                              <option value="">Select Marital Status</option>
                              <option value="Married">Married</option>
                              <option value="Unmarried">Unmarried</option>
                            </CFormSelect>
                            {errors.maritalStatus && <small className="text-danger">{errors.maritalStatus}</small>}
                          </CCol>
                        </CRow>

                        <CRow className="mb-3">
                          <CCol>
                            <CFormInput placeholder="Education" name="education" value={form.education} maxLength={50} onChange={handleChange} />
                          </CCol>
                        </CRow>

                        <div className="d-flex justify-content-end mt-3">
                          <CButton color="primary" onClick={nextStep}>Next</CButton>
                        </div>
                      </CCard>
                    )}

                    {/* STEP 2 */}
                    {step === 2 && (
                      <CCard className='mb-4 p-3 bg-white shadow-sm'>
                        <h5 className='text-info mb-3'>Designation & Nominee/Bank Details</h5>

                        {/* Designation Dropdown */}
                        <CInputGroup className='mb-3'>
                          <CDropdown className='flex-grow-1'>
                            <CInputGroupText><CIcon icon={cilUser} /></CInputGroupText>
                            <CDropdownToggle color='light' className='text-start w-100'>
                              {loadingDesignations ? <span><CSpinner size="sm" className="me-2" />Loading...</span> : designationName}
                            </CDropdownToggle>

                            <CDropdownMenu>
                              {loadingDesignations && <CDropdownItem disabled>Loading...</CDropdownItem>}
                              {!loadingDesignations && designationError && <CDropdownItem disabled>{designationError}</CDropdownItem>}
                              {!loadingDesignations && !designationError && designations.map((d, idx) => (
                                <CDropdownItem key={idx} onClick={() => handleDesignationSelect(d)}>{d.Role}</CDropdownItem>
                              ))}
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
                              <CFormInput placeholder='Bank Name' name='bankName' value={form.bankName} maxLength={30} onChange={handleChange} className='mb-2' />
                              {errors.bankName && <small className="text-danger">{errors.bankName}</small>}
                              <CRow>
                                <CCol md={6}>
                                  <CFormInput placeholder='Account Number' name='accountNumber' value={form.accountNumber} maxLength={20} onChange={handleChange} />
                                  {errors.accountNumber && <small className="text-danger">{errors.accountNumber}</small>}
                                </CCol>
                                <CCol md={6}>
                                  <CFormInput placeholder='IFSC' name='ifsc' value={form.ifsc} maxLength={11} onChange={handleChange} />
                                  {errors.ifsc && <small className="text-danger">{errors.ifsc}</small>}
                                </CCol>
                              </CRow>
                            </CCard>
                          </CCol>
                        </CRow>

                        <div className='d-flex justify-content-between mt-3'>
                          <CButton color='secondary' onClick={prevStep}>Back</CButton>
                          <CButton color='primary' onClick={nextStep}>Next</CButton>
                        </div>
                      </CCard>
                    )}

                    {/* STEP 3 */}
                    {step === 3 && (
                      <CCard className='mb-4 p-3 bg-white shadow-sm'>
                        <h5 className='text-info mb-3'>Address</h5>
                        <CRow className='mb-3'>
                          <CCol md={6}>
                            <CFormInput placeholder='Permanent Address' name='permanentAddress' value={form.permanentAddress} maxLength={100} onChange={handleChange} />
                            {errors.permanentAddress && <small className="text-danger">{errors.permanentAddress}</small>}
                          </CCol>
                          <CCol md={6}>
                            <CFormInput placeholder='Present Address' name='presentAddress' value={form.presentAddress} maxLength={100} onChange={handleChange} />
                            {errors.presentAddress && <small className="text-danger">{errors.presentAddress}</small>}
                          </CCol>
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
