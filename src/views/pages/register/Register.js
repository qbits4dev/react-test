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

const Register = () => {
  const navigate = useNavigate()

  //GET
  const [InterstedIn, setInterstedIn] = useState('IntrestedIn')
  const [InterstedInList, setInterstedInList] = useState([])

  useEffect(() => {
    fetch('http://127.0.0.1:5000/test?key=InterstedIn')
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

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
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

    try {
      const res = await fetch('http://127.0.0.1:5000/test', {
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
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput
                      name="email"
                      placeholder="Email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
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
                    />
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
                    />
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
