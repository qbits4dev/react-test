import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CButton, CCard, CCardBody, CCol, CContainer, CForm, CFormInput,
  CInputGroup, CInputGroupText, CRow
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilUser, cilPhone } from '@coreui/icons'

const Client_Register = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',           // consistent field name
    reference_agent: '',
    interested_project: '',
    interested_plot: '',
  })
  const [error, setError] = useState(null)
  const [errors, setErrors] = useState({})
  const [userCode, setUserCode] = useState('')
  const navigate = useNavigate()

  const validateField = (name, value) => {
    const v = typeof value === 'string' ? value.trim() : value
    switch (name) {
      case 'first_name':
        if (!v) return 'First Name is required'
        if (v.length < 2) return 'First Name must be at least 2 characters'
        if (!/^[A-Za-z ]+$/.test(v)) return 'First Name must contain only letters'
        break
      case 'last_name':
        if (!v) return 'Last Name is required'
        if (v.length < 1) return 'Last Name must be at least 1 character'
        if (!/^[A-Za-z ]+$/.test(v)) return 'Last Name must contain only letters'
        break
      case 'email':
        if (!v) return 'Email is required'
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Enter a valid email address'
        break
      case 'phone':
        if (!v) return 'Phone number is required'
        if (!/^[6-9][0-9]{9}$/.test(v)) return 'Phone must be a valid 10-digit number starting with 6-9'
        break
      case 'reference_agent':
        if (!v) return 'Reference Agent Code is required'
        break
      case 'interested_project':
        if (!v) return 'Interested Project is required'
        break
      case 'interested_plot':
        if (!v) return 'Interested Plot is required'
        break
      default:
        return ''
    }
    return ''
  }

  const validateAll = () => {
    const newErrors = {}
    Object.keys(formData).forEach(f => {
      const err = validateField(f, formData[f])
      if (err) newErrors[f] = err
    })
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    let sanitizedValue = value
    if (name === 'phone') sanitizedValue = value.replace(/[^0-9]/g, '').slice(0, 10)
    else if (['first_name', 'last_name'].includes(name)) sanitizedValue = value.replace(/[^A-Za-z ]/g, '')
    else if (name === 'email') sanitizedValue = value.replace(/[^A-Za-z0-9.@_\-+]/g, '')

    setFormData(prev => ({ ...prev, [name]: sanitizedValue }))
    const err = validateField(name, sanitizedValue)
    setErrors(prev => ({ ...prev, [name]: err }))
  }

  const renderError = (field) => errors[field] && (
    <small className="text-danger d-block mt-1">{errors[field]}</small>
  )

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setUserCode('')

    if (!validateAll()) {
      return
    }

    const params = new URLSearchParams()
    params.append('first_name', formData.first_name)
    params.append('last_name', formData.last_name)
    params.append('email', formData.email)
    params.append('phone', formData.phone)
    params.append('reference_agent', formData.reference_agent)
    params.append('interested_project', formData.interested_project)
    params.append('interested_plot', formData.interested_plot)

    // Corrected console log to show the payload string
    console.log('Form data sent:', params.toString())

    try {
      const res = await fetch(`${globalThis.apiBaseUrl}/register/client`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
      })
      const result = await res.json()
      if (res.ok && result.u_id) {
        setUserCode(result.u_id)
        alert(`Registration Successful! Your User Code: ${result.u_id}`)
        navigate('/login')
      } else {
        setError(result.message || res.statusText)
      }
    } catch (error) {
      setError('Network Error. Please try again later.')
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
                    <CInputGroupText><CIcon icon={cilUser} /></CInputGroupText>
                    <CFormInput
                      name="first_name"
                      placeholder="First Name *"
                      value={formData.first_name}
                      onChange={handleChange}
                      invalid={!!errors.first_name}
                      required
                    />
                  </CInputGroup>
                  {renderError('first_name')}

                  <CInputGroup className="mb-3">
                    <CInputGroupText><CIcon icon={cilUser} /></CInputGroupText>
                    <CFormInput
                      name="last_name"
                      placeholder="Last Name *"
                      value={formData.last_name}
                      onChange={handleChange}
                      invalid={!!errors.last_name}
                      required
                    />
                  </CInputGroup>
                  {renderError('last_name')}

                  <CInputGroup className="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput
                      name="email"
                      placeholder="Email *"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      invalid={!!errors.email}
                      required
                    />
                  </CInputGroup>
                  {renderError('email')}

                  <CInputGroup className='mb-3'>
                    <CInputGroupText><CIcon icon={cilPhone} /></CInputGroupText>
                    <CFormInput
                      name="phone"
                      placeholder="Phone Number *"
                      value={formData.phone}
                      onChange={handleChange}
                      invalid={!!errors.phone}
                      required
                    />
                  </CInputGroup>
                  {renderError('phone')}

                  <CInputGroup className='mb-3'>
                    <CInputGroupText><CIcon icon={cilUser} /></CInputGroupText>
                    <CFormInput
                      name="reference_agent"
                      placeholder="Reference Agent *"
                      value={formData.reference_agent}
                      onChange={handleChange}
                      invalid={!!errors.reference_agent}
                      required
                    />
                  </CInputGroup>
                  {renderError('reference_agent')}

                  <CInputGroup className='mb-3'>
                    <CFormInput
                      name='interested_project'
                      placeholder='Interested Project *'
                      value={formData.interested_project}
                      onChange={handleChange}
                      invalid={!!errors.interested_project}
                      required
                    />
                  </CInputGroup>
                  {renderError('interested_project')}

                  <CInputGroup className='mb-3'>
                    <CFormInput
                      name='interested_plot'
                      placeholder='Interested Plot *'
                      value={formData.interested_plot}
                      onChange={handleChange}
                      invalid={!!errors.interested_plot}
                      required
                    />
                  </CInputGroup>
                  {renderError('interested_plot')}
                  {error && <div style={{ color: "red" }}>{error}</div>}
                  {userCode && (
                    <div style={{ color: "green", fontWeight: "bold", marginTop: "1em" }}>
                      Your User Code: {userCode}
                    </div>
                  )}
                  <div className="d-grid">
                    <CButton color="success" type='submit'>Submit Registration</CButton>
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

export default Client_Register
