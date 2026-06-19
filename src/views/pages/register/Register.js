import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CDropdown,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser, cilPhone } from '@coreui/icons'
import { useNavigate } from 'react-router-dom'
import { sanitizeName, sanitizeNumeric, sanitizeText, validateEmail, validateIndianMobile } from '../../../utils/validation'

const Register = () => {
  const navigate = useNavigate()

  //GET
  const [InterstedIn, setInterstedIn] = useState('IntrestedIn')
  const [InterstedInList, setInterstedInList] = useState([])

  useEffect(() => {
    fetch(`${globalThis.apiBaseUrl}/test?key=InterstedIn`)
      .then((res) => res.json())
      .then((data) => {
        console.log('InterstedIn Data:', data)
        if (data && Array.isArray(data.InterstedIn)) {
          setInterstedInList(data.InterstedIn)
        }
      })
      .catch(() => {
        console.error('Failed to fetch InterstedIn')
        alert('Failed to Fetch InterstedIn. Please try again.')
        setInterstedInList([])
      })
  }, [])

  //POST
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    interestedIn: InterstedIn,
    dateOfVisit: '',
  })
  const [errors, setErrors] = useState({})

  const validateField = (name, value) => {
    const v = String(value || '').trim()
    if (name === 'name') {
      if (!v) return 'Name is required'
      if (v.length < 2) return 'Name must be at least 2 characters'
      return ''
    }
    if (name === 'email') {
      if (!v) return 'Email is required'
      if (!validateEmail(v)) return 'Enter a valid email address'
      return ''
    }
    if (name === 'phone') {
      if (!v) return 'Phone is required'
      if (!validateIndianMobile(v)) return 'Enter a valid 10-digit mobile number'
      return ''
    }
    if (name === 'dateOfVisit') {
      if (!v) return 'Date of visit is required'
      return ''
    }
    return ''
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    let next = value
    if (name === 'name') next = sanitizeName(value, 60)
    else if (name === 'email') next = value.replace(/[^A-Za-z0-9.@_\-+]/g, '').slice(0, 100)
    else if (name === 'phone') next = sanitizeNumeric(value, 10)
    else if (name === 'dateOfVisit') next = value
    else next = sanitizeText(value, 120)
    setFormData((prev) => ({
      ...prev,
      [name]: next,
    }))
    setErrors((prev) => ({ ...prev, [name]: validateField(name, next) }))
  }

  const handleDropdown = (value) => {
    setInterstedIn(value)
    setFormData((prev) => ({
      ...prev,
      interestedIn: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = {
      name: validateField('name', formData.name),
      email: validateField('email', formData.email),
      phone: validateField('phone', formData.phone),
      dateOfVisit: validateField('dateOfVisit', formData.dateOfVisit),
    }
    setErrors(newErrors)
    if (Object.values(newErrors).some(Boolean)) return

    try {
      const res = await fetch(`${globalThis.apiBaseUrl}/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        alert('Registration Successful')
        navigate('/login')
      }
      else {
        alert('Registration Failed. Please try again.')
      }
    } catch (error) {
      alert('Network Error. Please try again later.')
    }
  }
  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm onSubmit={handleSubmit}>
                  <h1>Register</h1>
                  <p className="text-body-secondary">Customer Registration</p>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      name="name"
                      placeholder="Name"
                      autoComplete="Name"
                      value={formData.name}
                      onChange={handleChange}
                      invalid={!!errors.name}
                    />
                    {errors.name && <div className="text-danger small mt-1">{errors.name}</div>}
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput
                      name="email"
                      placeholder="Email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleChange}
                      invalid={!!errors.email}
                    />
                    {errors.email && <div className="text-danger small mt-1">{errors.email}</div>}
                  </CInputGroup>
                  <CInputGroup className='mb-3'>
                    <CInputGroupText>
                      <CIcon icon={cilPhone} />
                    </CInputGroupText>
                    <CFormInput
                      name="phone"
                      placeholder="Phone Number"
                      autoComplete="Phone Number"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      invalid={!!errors.phone}
                    />
                    {errors.phone && <div className="text-danger small mt-1">{errors.phone}</div>}
                  </CInputGroup>
                  <CDropdown className=" d-flex mb-2">
                    <CDropdownToggle color="primary">{InterstedIn}</CDropdownToggle>
                    <CDropdownMenu>
                      {InterstedInList.map((item, index) => (
                        <CDropdownItem
                          key={item.id || index}
                          onClick={() => handleDropdown(item.name)}>
                          {item.name}
                        </CDropdownItem>
                      ))}
                    </CDropdownMenu>
                  </CDropdown>
                  <CInputGroup className='mb-4'>
                    <CFormInput
                      name='dateOfVisit'
                      type='date'
                      placeholder='Date of visit'
                      required
                      value={formData.dateOfVisit}
                      onChange={handleChange}
                      invalid={!!errors.dateOfVisit}
                    />
                    {errors.dateOfVisit && <div className="text-danger small mt-1">{errors.dateOfVisit}</div>}
                  </CInputGroup>
                  <div className="d-grid">
                    <CButton color="success" type="submit">Submit Registration</CButton>
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

export default Register
