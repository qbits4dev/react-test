import React from 'react'
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
  CInputGroupText,
  CRow,
  CDropdownToggle,
  CDropdownItem,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'

const Register_agent = () => {
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
                    <CFormInput placeholder='Password' autoComplete='Password' />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CFormInput placeholder='Confirm Password' autoComplete='Confirm Password' />
                  </CInputGroup>
                  <CDropdown className='d-flex gap-3 mb-2'>
                    <CDropdownToggle color="primary">
                      Desgination
                    </CDropdownToggle>
                    <CDropdownMenu >
                      <CDropdownItem>Team lead</CDropdownItem>
                      <CDropdownItem>director</CDropdownItem>
                      <CDropdownItem>Agent</CDropdownItem>
                      <CDropdownItem>junior</CDropdownItem>
                    </CDropdownMenu>
                  </CDropdown>        
                  <CDropdown className='d-flex gap-3 mb-2'>
                    <CDropdownToggle color="primary">
                      Agent Team
                    </CDropdownToggle>
                    <CDropdownMenu>
                      <CDropdownItem>Team 1</CDropdownItem>
                      <CDropdownItem>Team 2</CDropdownItem>
                      <CDropdownItem>Team 3</CDropdownItem>
                      <CDropdownItem>Team 4</CDropdownItem>
                    </CDropdownMenu>
                  </CDropdown>
                  <CDropdown className=' d-flex gap-3 mb-2'>
                    <CDropdownToggle color="primary">
                      Reference of Director
                    </CDropdownToggle>
                    <CDropdownMenu>
                      <CDropdownItem>director 1</CDropdownItem>
                      <CDropdownItem>director 2</CDropdownItem>
                      <CDropdownItem>director 3</CDropdownItem>
                      <CDropdownItem>director 4</CDropdownItem>
                    </CDropdownMenu>
                  </CDropdown>
                  
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
