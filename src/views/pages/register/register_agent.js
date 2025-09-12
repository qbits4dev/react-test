import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CDropdown,
  CDropdownMenu,
  CForm,
  CFormInput,
  CInputGroup,
  CDropdownToggle,
  CDropdownItem,
  CRow,
  CInputGroupText,
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import { faIdCard } from '@fortawesome/free-solid-svg-icons'
import { cilLockLocked, cilUser, cilPhone, cilCalendar } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Register_agent = () => {
  const navigate = useNavigate()

  // Roles fetched from single API call
  const [roles, setRoles] = useState([])

  // Dropdown display states
  const [designationName, setDesignationName] = useState('Select Designation')
  const [agentTeamName, setAgentTeamName] = useState('Select Agent Team')
  const [directorName, setDirectorName] = useState('Select Director')

  // Gender selection
  const [gender, setGender] = useState('')

  // Form State with exact API field names
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    aadhaar: '',
    pan: '',
    aadhaar_file: null,
    pan_file: null,
    photo_file: null,
    dob: '',
    designation: '',
    agent_team: '',
    directors: '',
    reference_agent: '',
    gender: ''
  })

  // Validation errors
  const [errors, setErrors] = useState({})

  // Fetch roles once
  useEffect(() => {
    fetch('https://api.qbits4dev.com/register/?key=role')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'ok' && Array.isArray(data.roles)) {
          setRoles(data.roles)
        } else {
          setRoles([])
        }
      })
      .catch(() => setRoles([]))
  }, [])

  // Handle dropdown select - sets display name and form id
  const handleDesignationSelect = (role) => {
    setDesignationName(role.name)
    setForm(prev => ({ ...prev, designation: role.id }))
  }
  const handleAgentTeamSelect = (role) => {
    setAgentTeamName(role.name)
    setForm(prev => ({ ...prev, agent_team: role.id }))
  }
  const handleDirectorSelect = (role) => {
    setDirectorName(role.name)
    setForm(prev => ({ ...prev, directors: role.id }))
  }

  // Gender change handler
  const handleGenderChange = (e) => {
    setGender(e.target.value)
    setForm(prev => ({ ...prev, gender: e.target.value }))
  }

  // Input & file change handler with PDF file check
  const handleChange = (e) => {
    const { name, value, files } = e.target
    if (['aadhaar_file', 'pan_file', 'photo_file'].includes(name)) {
      if (files.length > 0) {
        const file = files[0]
        if (file.type !== 'application/pdf') {
          alert('Please upload a PDF file.')
          e.target.value = ''
          return
        }
        setForm(prev => ({ ...prev, [name]: file }))
      }
    } else if (name === 'aadhaar') {
      let val = value.replace(/\D/g, '').substring(0, 12)
      val = val.replace(/(.{4})/g, '$1 ').trim()
      setForm(prev => ({ ...prev, aadhaar: val }))
    } else if (name === 'pan') {
      setForm(prev => ({ ...prev, pan: value.toUpperCase() }))
    } else {
      setForm(prev => ({ ...prev, [name]: value }))
    }
  }

  // Minimum DOB date for 18 years old
  const getMaxDob = () => {
    const today = new Date()
    today.setFullYear(today.getFullYear() - 18)
    return today.toISOString().split('T')[0]
  }

  // Basic validation of fields
  const validate = () => {
    let newErrors = {}
    if (!form.first_name.trim()) newErrors.first_name = 'First name required'
    if (!form.last_name.trim()) newErrors.last_name = 'Last name required'
    if (!form.email.trim()) newErrors.email = 'Email required'
    if (!form.phone.trim()) newErrors.phone = 'Phone number required'
    if (!form.password) newErrors.password = 'Password required'
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
    if (!form.aadhaar.trim()) newErrors.aadhaar = 'Aadhaar required'
    if (!form.pan.trim()) newErrors.pan = 'PAN required'
    if (!form.aadhaar_file) newErrors.aadhaar_file = 'Aadhaar file required'
    if (!form.pan_file) newErrors.pan_file = 'PAN file required'
    if (!form.photo_file) newErrors.photo_file = 'Photo file required'
    if (!form.dob) newErrors.dob = 'Date of birth required'
    if (!form.gender) newErrors.gender = 'Gender required'
    if (!form.designation) newErrors.designation = 'Designation required'
    if (!form.agent_team) newErrors.agent_team = 'Agent team required'
    if (!form.directors) newErrors.directors = 'Director required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Submit handler
  const handleSubmit = async () => {
    if (!validate()) return

    try {
      const formDataObj = new FormData()
      Object.entries(form).forEach(([key, value]) => {
        formDataObj.append(key, value)
      })

      const res = await fetch('http://127.0.0.1:5000/register/agent', {
        method: 'POST',
        body: formDataObj,
      })

      const result = await res.json()

      if (res.ok) {
        alert('Agent registered successfully!')
        navigate('/')
      } else {
        alert(result.message || 'Registration failed.')
      }
    } catch (err) {
      alert('Something went wrong. Please try again.')
    }
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm>
                  <h1>Agent Registration</h1>
                  <p className="text-body-secondary">Enter Agent details</p>

                  {/* First Name */}
                  <CInputGroup className="mb-3">
                    <CInputGroupText><CIcon icon={cilUser} /></CInputGroupText>
                    <CFormInput
                      name="first_name"
                      placeholder="First Name"
                      value={form.first_name}
                      onChange={handleChange}
                      invalid={!!errors.first_name}
                      required
                    />
                  </CInputGroup>

                  {/* Last Name */}
                  <CInputGroup className="mb-3">
                    <CInputGroupText><CIcon icon={cilUser} /></CInputGroupText>
                    <CFormInput
                      name="last_name"
                      placeholder="Last Name"
                      value={form.last_name}
                      onChange={handleChange}
                      invalid={!!errors.last_name}
                      required
                    />
                  </CInputGroup>

                  {/* Email */}
                  <CInputGroup className="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput
                      name="email"
                      type="email"
                      placeholder="Email"
                      value={form.email}
                      onChange={handleChange}
                      invalid={!!errors.email}
                      required
                    />
                  </CInputGroup>

                  {/* Phone */}
                  <CInputGroup className="mb-3">
                    <CInputGroupText><CIcon icon={cilPhone} /></CInputGroupText>
                    <CFormInput
                      name="phone"
                      placeholder="Phone Number"
                      value={form.phone}
                      onChange={handleChange}
                      invalid={!!errors.phone}
                      required
                    />
                  </CInputGroup>

                  {/* Password */}
                  <CInputGroup className="mb-3">
                    <CInputGroupText><CIcon icon={cilLockLocked} /></CInputGroupText>
                    <CFormInput
                      name="password"
                      type="password"
                      placeholder="Password"
                      value={form.password}
                      onChange={handleChange}
                      invalid={!!errors.password}
                      required
                    />
                  </CInputGroup>

                  {/* Confirm Password */}
                  <CInputGroup className="mb-3">
                    <CInputGroupText><CIcon icon={cilLockLocked} /></CInputGroupText>
                    <CFormInput
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm Password"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      invalid={!!errors.confirmPassword}
                      required
                    />
                  </CInputGroup>

                  {/* DOB */}
                  <CInputGroup className="mb-3">
                    <CInputGroupText><CIcon icon={cilCalendar} /></CInputGroupText>
                    <CFormInput
                      name="dob"
                      type="date"
                      max={(() => {
                        const today = new Date()
                        today.setFullYear(today.getFullYear() - 18)
                        return today.toISOString().split('T')[0]
                      })()}
                      value={form.dob}
                      onChange={handleChange}
                      invalid={!!errors.dob}
                      required
                    />
                  </CInputGroup>

                  {/* Gender */}
                  <div className="mb-3">
                    <label>Gender:</label>
                    <div>
                      {['Male', 'Female', 'Other'].map((g) => (
                        <label key={g} style={{ marginRight: '15px' }}>
                          <input
                            type="radio"
                            name="gender"
                            value={g}
                            checked={form.gender === g}
                            onChange={handleGenderChange}
                          />{' '}
                          {g}
                        </label>
                      ))}
                    </div>
                    {errors.gender && (
                      <div style={{ color: 'red' }}>{errors.gender}</div>
                    )}
                  </div>

                  {/* Designation Dropdown */}
                  <CDropdown className="d-flex mb-3">
                    <CDropdownToggle color="primary">{designationName}</CDropdownToggle>
                    <CDropdownMenu>
                      {roles.map(role => (
                        <CDropdownItem
                          key={role.id}
                          onClick={() => handleDesignationSelect(role)}
                        >
                          {role.name}
                        </CDropdownItem>
                      ))}
                    </CDropdownMenu>
                  </CDropdown>

                  {/* Agent Team Dropdown */}
                  {/* <CDropdown className="d-flex mb-3">
                    <CDropdownToggle color="primary">{agentTeamName}</CDropdownToggle>
                    <CDropdownMenu>
                      {roles.map(role => (
                        <CDropdownItem
                          key={role.id}
                          onClick={() => handleAgentTeamSelect(role)}
                        >
                          {role.name}
                        </CDropdownItem>
                      ))}
                    </CDropdownMenu>
                  </CDropdown> */}

                  {/* Directors Dropdown */}
                  {/* <CDropdown className="d-flex mb-4">
                    <CDropdownToggle color="primary">{directorName}</CDropdownToggle>
                    <CDropdownMenu>
                      {roles.map(role => (
                        <CDropdownItem
                          key={role.id}
                          onClick={() => handleDirectorSelect(role)}
                        >
                          {role.name}
                        </CDropdownItem>
                      ))}
                    </CDropdownMenu>
                  </CDropdown> */}

                  {/* Aadhaar Number */}
                  <CInputGroup className="mb-3">
                    <CInputGroupText><FontAwesomeIcon icon={faIdCard} /></CInputGroupText>
                    <CFormInput
                      name="aadhaar"
                      placeholder="Aadhaar Number"
                      value={form.aadhaar}
                      onChange={handleChange}
                      invalid={!!errors.aadhaar}
                      required
                    />
                  </CInputGroup>

                  {/* PAN Number */}
                  <CInputGroup className="mb-3">
                    <CInputGroupText><FontAwesomeIcon icon={faIdCard} /></CInputGroupText>
                    <CFormInput
                      name="pan"
                      placeholder="PAN Number"
                      value={form.pan}
                      onChange={handleChange}
                      invalid={!!errors.pan}
                      required
                    />
                  </CInputGroup>

                  {/* Aadhaar File */}
                  <div className="mb-3">
                    <p>Aadhaar Card (PDF only)</p>
                    <CFormInput
                      type="file"
                      name="aadhaar_file"
                      accept="application/pdf"
                      onChange={handleChange}
                      required
                    />
                    {errors.aadhaar_file && (
                      <div style={{ color: 'red' }}>{errors.aadhaar_file}</div>
                    )}
                  </div>

                  {/* PAN File */}
                  <div className="mb-3">
                    <p>PAN Card (PDF only)</p>
                    <CFormInput
                      type="file"
                      name="pan_file"
                      accept="application/pdf"
                      onChange={handleChange}
                      required
                    />
                    {errors.pan_file && (
                      <div style={{ color: 'red' }}>{errors.pan_file}</div>
                    )}
                  </div>

                  {/* Photo File */}
                  <div className="mb-3">
                    <p>Photo (PDF only)</p>
                    <CFormInput
                      type="file"
                      name="photo_file"
                      accept="application/pdf"
                      onChange={handleChange}
                      required
                    />
                    {errors.photo_file && (
                      <div style={{ color: 'red' }}>{errors.photo_file}</div>
                    )}
                  </div>

                  {/* Submit button */}
                  <div className="d-grid">
                    <CButton color="info" onClick={handleSubmit}>
                      Create Account
                    </CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register_agent
