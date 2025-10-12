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
  const [userCode, setUserCode] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setUserCode('')

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
      const res = await fetch('${apiBaseUrl}/register/client', {
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
                      placeholder="First Name"
                      value={formData.first_name}
                      onChange={handleChange}
                      required
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText><CIcon icon={cilUser} /></CInputGroupText>
                    <CFormInput
                      name="last_name"
                      placeholder="Last Name"
                      value={formData.last_name}
                      onChange={handleChange}
                      required
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput
                      name="email"
                      placeholder="Email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </CInputGroup>
                  <CInputGroup className='mb-3'>
                    <CInputGroupText><CIcon icon={cilPhone} /></CInputGroupText>
                    <CFormInput
                      name="phone"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </CInputGroup>
                  <CInputGroup className='mb-3'>
                    <CInputGroupText><CIcon icon={cilUser} /></CInputGroupText>
                    <CFormInput
                      name="reference_agent"
                      placeholder="Reference Agent"
                      value={formData.reference_agent}
                      onChange={handleChange}
                      required
                    />
                  </CInputGroup>
                  <CInputGroup className='mb-3'>
                    <CFormInput
                      name='interested_project'
                      placeholder='Interested Project'
                      value={formData.interested_project}
                      onChange={handleChange}
                      required
                    />
                  </CInputGroup>
                  <CInputGroup className='mb-3'>
                    <CFormInput
                      name='interested_plot'
                      placeholder='Interested Plot'
                      value={formData.interested_plot}
                      onChange={handleChange}
                      required
                    />
                  </CInputGroup>
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
