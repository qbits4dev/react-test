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

  const [Directors, setDirectors] = useState('Directors')
  const [DirectorsList, setDirectorsList] = useState([])
  const [designation, setDesignation] = useState('Designation')
  const [designationList, setDesignationList] = useState([])
  const [team, setTeam] = useState('Agent Team')
  const [reference, setReference] = useState('Reference of Director')
  const [form, setForm] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    aadhar: '',
    pan: '',
    aadharFile: null,
    panFile: null,
    dob: '',
    directors: Directors,
  })
  const [errors, setErrors] = useState({})
  const [agent, setAgent] = useState('Select Agent')
  const [agentList, setAgentList] = useState([])

  useEffect(() => {
    fetch('http://127.0.0.1:5000/test?key=Designation')
      .then((res) => res.json())
      .then((data) => {
        console.log('Designation data:', data)
        if (data && Array.isArray(data.Designation)) {
          setDesignationList(data.Designation)
        }
      })
      .catch((err) => {
        console.error('Designation fetch error:', err)
        alert('Failed to fetch designations. Please try again later.')
        setDesignationList([])
      })

    fetch('http://127.0.0.1:5000/test?key=agents')
      .then((res) => res.json())
      .then((data) => {
        console.log('Agents data:', data)
        if (data && Array.isArray(data.agents)) {
          setAgentList(data.agents)
        }
      })
      .catch((err) => {
        console.error('Agents fetch error:', err)
        alert('Failed to fetch agents. Please try again later.')
        setAgentList([])
      })

    fetch('http://127.0.0.1:5000/test?key=directors')
      .then((res) => res.json())
      .then((data) => {
        console.log('directors data:', data) // 🧪 Add this to debug
        if (data && Array.isArray(data.directors)) {
          setDirectorsList(data.directors)
        } else {
          console.warn('Directors key missing or not an array')
        }
      })
      .catch((error) => {
        console.error('Error fetching directors:', error)
        alert('Failed to fetch directors. Please try again later.')
      })
  }, [])

  const handleDropdown = (value) => {
    setDirectors(value)
    setFormData((prev) => ({
      ...prev,
      directors: value,
    }))
  }

  const handleChange = (e) => {
    const { name, value, files } = e.target

    if (name === 'aadhar') {
      let val = value.replace(/\D/g, '').substring(0, 12)
      val = val.replace(/(.{4})/g, '$1 ').trim()
      setForm({ ...form, aadhar: val })
    } else if (name === 'pan') {
      setForm({ ...form, pan: value.toUpperCase() })
    } else if (name === 'aadharFile' || name === 'panFile') {
      setForm({ ...form, [name]: files[0] })
    } else {
      setForm({ ...form, [name]: value })
    }
  }

  // Calculate max date for DOB (today - 18 years)
  const getMaxDob = () => {
    const today = new Date()
    today.setFullYear(today.getFullYear() - 18)
    return today.toISOString().split('T')[0]
  }

  const validate = () => {
    const newErrors = {}
    const nameRegex = /^[A-Za-z]+$/
    const phoneRegex = /^[0-9]{10}$/
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const aadharRegex = /^(\d{4} \d{4} \d{4})$/
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
    const passwordRegex = /^.{8,24}$/

    if (!nameRegex.test(form.firstname)) newErrors.firstname = 'Only letters allowed in Firstname'
    if (!nameRegex.test(form.lastname)) newErrors.lastname = 'Only letters allowed in Lastname'
    if (!emailRegex.test(form.email)) newErrors.email = 'Invalid Email' //TODO: Add proper email validation
    if (!phoneRegex.test(form.phone)) newErrors.phone = 'Phone must be 10 digits' //TODO : Add proper phone validation
    if (!aadharRegex.test(form.aadhar)) newErrors.aadhar = 'Aadhar must be 12 digits with spaces'
    if (!panRegex.test(form.pan)) newErrors.pan = 'PAN format invalid'
    if (!passwordRegex.test(form.password))
      newErrors.password = 'Password must be between 8 and 24 characters'
    if (!passwordRegex.test(form.confirmPassword))
      newErrors.confirmPassword = 'Password must be between 8 and 24 characters'
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
    if (!form.aadharFile) newErrors.aadharFile = 'Aadhar file required'
    if (!form.panFile) newErrors.panFile = 'PAN file required'
    if (!form.dob) newErrors.dob = 'Date of Birth is required'
    else {
      const dobDate = new Date(form.dob)
      const today = new Date()
      today.setFullYear(today.getFullYear() - 18)
      if (dobDate > today) {
        newErrors.dob = 'You must be at least 18 years old'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validate()) {
      if (window.confirm('Account Created Successfully! Click OK to go to homepage.')) {
        navigate('/')
      }
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

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      name="firstname"
                      placeholder="Firstname"
                      value={form.firstname}
                      onChange={handleChange}
                      required
                      invalid={!!errors.firstname}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      name="lastname"
                      placeholder="Lastname"
                      value={form.lastname}
                      onChange={handleChange}
                      required
                      invalid={!!errors.lastname}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput
                      name="email"
                      type="email"
                      placeholder="Email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      invalid={!!errors.email}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilPhone} />
                    </CInputGroupText>
                    <CFormInput
                      name="phone"
                      placeholder="Phone Number"
                      value={form.phone}
                      onChange={(e) => {
                        const cleaned = e.target.value.replace(/\D/g, '').slice(0, 10)
                        setForm({ ...form, phone: cleaned })
                      }}
                      required
                      invalid={!!errors.phone}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      name="password"
                      type="password"
                      placeholder="Password"
                      value={form.password}
                      onChange={handleChange}
                      required
                      invalid={!!errors.password}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm Password"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      required
                      invalid={!!errors.confirmPassword}
                    />
                  </CInputGroup>

                  <CDropdown className="d-flex mb-2">
                    <CDropdownToggle color="primary">{designation}</CDropdownToggle>
                    <CDropdownMenu>
                      {designationList.map((item, index) => (
                        <CDropdownItem
                          key={item.id || index}
                          onClick={() => setDesignation(item.name)}
                        >
                          {item.name}
                        </CDropdownItem>
                      ))}
                    </CDropdownMenu>
                  </CDropdown>

                  <CDropdown className="d-flex mb-2">
                    <CDropdownToggle color="primary">{team}</CDropdownToggle>
                    <CDropdownMenu>
                      {agentList.map((item) => (
                        <CDropdownItem key={item.id} onClick={() => setTeam(item.name)}>
                          {item.name}
                        </CDropdownItem>
                      ))}
                    </CDropdownMenu>
                  </CDropdown>

                  <CDropdown className="d-flex mb-4">
                    <CDropdownToggle color="primary">{Directors}</CDropdownToggle>
                    <CDropdownMenu>
                      {DirectorsList.map((item, index) => (
                        <CDropdownItem
                          key={item.id || index}
                          onClick={() => handleDropdown(item.name)}
                        >
                          {item.name}
                        </CDropdownItem>
                      ))}
                    </CDropdownMenu>
                  </CDropdown>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <FontAwesomeIcon icon={faIdCard} />
                    </CInputGroupText>
                    <CFormInput
                      name="aadhar"
                      placeholder="Aadhar Number"
                      value={form.aadhar}
                      onChange={handleChange}
                      required
                      invalid={!!errors.aadhar}
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <FontAwesomeIcon icon={faIdCard} />
                    </CInputGroupText>
                    <CFormInput
                      name="pan"
                      placeholder="PAN Number"
                      value={form.pan}
                      onChange={handleChange}
                      required
                      invalid={!!errors.pan}
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilCalendar} />
                    </CInputGroupText>
                    <CFormInput
                      name="dob"
                      type="date"
                      placeholder="Date of Birth"
                      value={form.dob}
                      onChange={handleChange}
                      required
                      invalid={!!errors.dob}
                      max={getMaxDob()}
                    />
                  </CInputGroup>

                  <div className="mb-3">
                    <p>Aadhar Card PDF</p>
                    <CFormInput
                      type="file"
                      name="aadharFile"
                      onChange={handleChange}
                      required
                      invalid={!!errors.aadharFile}
                    />
                  </div>
                  <div className="mb-3">
                    <p>PAN Card PDF</p>
                    <CFormInput
                      type="file"
                      name="panFile"
                      onChange={handleChange}
                      required
                      invalid={!!errors.panFile}
                    />
                  </div>

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
