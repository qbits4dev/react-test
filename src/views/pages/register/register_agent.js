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
  const [agentList, setAgentList] = useState([])

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
    directors: '',
    designation: '',
    team: '',
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    fetch('http://127.0.0.1:5000/test?key=Designation')
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.Designation)) {
          setDesignationList(data.Designation)
        }
      })
      .catch(() => setDesignationList([]))

    fetch('http://127.0.0.1:5000/test?key=agents')
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.agents)) {
          setAgentList(data.agents)
        }
      })
      .catch(() => setAgentList([]))

    fetch('http://127.0.0.1:5000/test?key=directors')
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.directors)) {
          setDirectorsList(data.directors)
        }
      })
      .catch(() => setDirectorsList([]))
  }, [])

  const handleDropdown = (value) => {
    setDirectors(value)
    setForm((prev) => ({ ...prev, directors: value }))
  }

  const handleDesignationSelect = (value) => {
    setDesignation(value)
    setForm((prev) => ({ ...prev, designation: value }))
  }

  const handleTeamSelect = (value) => {
    setTeam(value)
    setForm((prev) => ({ ...prev, team: value }))
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
    if (!emailRegex.test(form.email)) newErrors.email = 'Invalid Email'
    if (!phoneRegex.test(form.phone)) newErrors.phone = 'Phone must be 10 digits'
    if (!aadharRegex.test(form.aadhar)) newErrors.aadhar = 'Aadhar must be 12 digits with spaces'
    if (!panRegex.test(form.pan)) newErrors.pan = 'PAN format invalid'
    if (!passwordRegex.test(form.password)) newErrors.password = 'Password must be 8–24 characters'
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
    if (!form.aadharFile) newErrors.aadharFile = 'Aadhar file required'
    if (!form.panFile) newErrors.panFile = 'PAN file required'
    if (!form.dob) newErrors.dob = 'Date of Birth is required'
    else {
      const dobDate = new Date(form.dob)
      const today = new Date()
      today.setFullYear(today.getFullYear() - 18)
      if (dobDate > today) newErrors.dob = 'Must be at least 18 years old'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return

    try {
      const formData = new FormData()
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value)
      })

      const res = await fetch('http://127.0.0.1:5000/test', {
        method: 'POST',
        body: formData,
      })

      const result = await res.json()

      if (res.ok) {
        alert('Agent registered successfully!')
        navigate('/')
      } else {
        alert(result.message || 'Registration failed.')
      }
    } catch (err) {
      console.error('Registration error:', err)
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

                  {/* Firstname, Lastname, Email, Phone, Password */}
                  <CInputGroup className="mb-3">
                    <CInputGroupText><CIcon icon={cilUser} /></CInputGroupText>
                    <CFormInput name="firstname" placeholder="Firstname" value={form.firstname} onChange={handleChange} />
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText><CIcon icon={cilUser} /></CInputGroupText>
                    <CFormInput name="lastname" placeholder="Lastname" value={form.lastname} onChange={handleChange} />
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} />
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText><CIcon icon={cilPhone} /></CInputGroupText>
                    <CFormInput name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} />
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText><CIcon icon={cilLockLocked} /></CInputGroupText>
                    <CFormInput name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText><CIcon icon={cilLockLocked} /></CInputGroupText>
                    <CFormInput name="confirmPassword" type="password" placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange} />
                  </CInputGroup>

                  {/* Dropdowns */}
                  <CDropdown className="d-flex mb-2">
                    <CDropdownToggle color="primary">{designation}</CDropdownToggle>
                    <CDropdownMenu>
                      {designationList.map((item, index) => (
                        <CDropdownItem key={index} onClick={() => handleDesignationSelect(item.name)}>
                          {item.name}
                        </CDropdownItem>
                      ))}
                    </CDropdownMenu>
                  </CDropdown>

                  <CDropdown className="d-flex mb-2">
                    <CDropdownToggle color="primary">{team}</CDropdownToggle>
                    <CDropdownMenu>
                      {agentList.map((item, index) => (
                        <CDropdownItem key={index} onClick={() => handleTeamSelect(item.name)}>
                          {item.name}
                        </CDropdownItem>
                      ))}
                    </CDropdownMenu>
                  </CDropdown>

                  <CDropdown className="d-flex mb-4">
                    <CDropdownToggle color="primary">{Directors}</CDropdownToggle>
                    <CDropdownMenu>
                      {DirectorsList.map((item, index) => (
                        <CDropdownItem key={index} onClick={() => handleDropdown(item.name)}>
                          {item.name}
                        </CDropdownItem>
                      ))}
                    </CDropdownMenu>
                  </CDropdown>

                  {/* Aadhar, PAN, DOB */}
                  <CInputGroup className="mb-3">
                    <CInputGroupText><FontAwesomeIcon icon={faIdCard} /></CInputGroupText>
                    <CFormInput name="aadhar" placeholder="Aadhar Number" value={form.aadhar} onChange={handleChange} />
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText><FontAwesomeIcon icon={faIdCard} /></CInputGroupText>
                    <CFormInput name="pan" placeholder="PAN Number" value={form.pan} onChange={handleChange} />
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText><CIcon icon={cilCalendar} /></CInputGroupText>
                    <CFormInput name="dob" type="date" value={form.dob} max={getMaxDob()} onChange={handleChange} />
                  </CInputGroup>

                  {/* Files */}
                  <div className="mb-3">
                    <p>Aadhar Card PDF</p>
                    <CFormInput type="file" name="aadharFile" onChange={handleChange} />
                  </div>

                  <div className="mb-3">
                    <p>PAN Card PDF</p>
                    <CFormInput type="file" name="panFile" onChange={handleChange} />
                  </div>

                  {/* Submit */}
                  <div className="d-grid">
                    <CButton color="info" onClick={handleSubmit}>Create Account</CButton>
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
