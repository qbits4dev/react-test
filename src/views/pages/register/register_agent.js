import React, { useState } from 'react'
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
} from '@coreui/react'

const Register_agent = () => {
  // State for dropdowns
  const [designation, setDesignation] = useState('Designation')
  const [team, setTeam] = useState('Agent Team')
  const [reference, setReference] = useState('Reference of Director')

  // Submit handler
  const handleSubmit = () => {
    alert('Account Created Successfully!')
    // You can add form validation or API calls here
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

                  {/* Inputs */}
                  <CInputGroup className="mb-3">
                    <CFormInput placeholder='Firstname' autoComplete='Firstname' />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CFormInput placeholder='Lastname' autoComplete='Lastname' />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CFormInput placeholder='Email' autoComplete='Email' />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CFormInput placeholder='Phone Number' autoComplete='Phone Number' />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CFormInput placeholder='Password' type="password" autoComplete='Password' />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CFormInput placeholder='Confirm Password' type="password" autoComplete='Confirm Password' />
                  </CInputGroup>

                  {/* Designation Dropdown */}
                  <CDropdown className="d-flex mb-2">
                    <CDropdownToggle color="primary">
                      {designation}
                    </CDropdownToggle>
                    <CDropdownMenu>
                      {['Team lead', 'Director', 'Agent', 'Junior'].map((item, index) => (
                        <CDropdownItem key={index} onClick={() => setDesignation(item)}>
                          {item}
                        </CDropdownItem>
                      ))}
                    </CDropdownMenu>
                  </CDropdown>

                  {/* Agent Team Dropdown */}
                  <CDropdown className="d-flex mb-2">
                    <CDropdownToggle color="primary">
                      {team}
                    </CDropdownToggle>
                    <CDropdownMenu>
                      {['Team 1', 'Team 2', 'Team 3', 'Team 4'].map((item, index) => (
                        <CDropdownItem key={index} onClick={() => setTeam(item)}>
                          {item}
                        </CDropdownItem>
                      ))}
                    </CDropdownMenu>
                  </CDropdown>

                  {/* Reference Dropdown */}
                  <CDropdown className="d-flex mb-4">
                    <CDropdownToggle color="primary">
                      {reference}
                    </CDropdownToggle>
                    <CDropdownMenu>
                      {['Director 1', 'Director 2', 'Director 3', 'Director 4'].map((item, index) => (
                        <CDropdownItem key={index} onClick={() => setReference(item)}>
                          {item}
                        </CDropdownItem>
                      ))}
                    </CDropdownMenu>
                  </CDropdown>

                  {/* Submit Button */}
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
