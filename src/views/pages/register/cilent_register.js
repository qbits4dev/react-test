import { React } from 'react'
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

const Client_Register = () => {
    return (
        <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
            <CContainer>
                <CRow className="justify-content-center">
                    <CCol md={9} lg={7} xl={6}>
                        <CCard className="mx-4">
                            <CCardBody className="p-4">
                                <CForm>
                                    <h1>Register</h1>
                                    <p className="text-body-secondary">Customer Registration</p>
                                    <CInputGroup className="mb-3">
                                        <CInputGroupText>
                                            <CIcon icon={cilUser} />
                                        </CInputGroupText>
                                        <CFormInput placeholder="firstname" autoComplete="firstname" />
                                    </CInputGroup>
                                    <CInputGroup className="mb-3">
                                        <CInputGroupText>
                                            <CIcon icon={cilUser} />
                                        </CInputGroupText>
                                        <CFormInput placeholder="lastname" autoComplete="lastname" />
                                    </CInputGroup>
                                    <CInputGroup className="mb-3">
                                        <CInputGroupText>@</CInputGroupText>
                                        <CFormInput placeholder="Email" autoComplete="email" />
                                    </CInputGroup>
                                    <CInputGroup className='mb-3'>
                                        <CInputGroupText>
                                            <CIcon icon={cilPhone} />
                                        </CInputGroupText>
                                        <CFormInput placeholder="Phone Number" autoComplete="Phone Number" />
                                    </CInputGroup>
                                    <CInputGroup className="mb-3">
                                        <CInputGroupText>
                                            <CIcon icon={cilLockLocked} />
                                        </CInputGroupText>
                                        <CFormInput
                                            type="password"
                                            placeholder="Password"
                                            autoComplete="new-password"
                                        />
                                    </CInputGroup>
                                    <CInputGroup className="mb-4">
                                        <CInputGroupText>
                                            <CIcon icon={cilLockLocked} />
                                        </CInputGroupText>
                                        <CFormInput
                                            type="password"
                                            placeholder="Repeat password"
                                            autoComplete="new-password"
                                        />
                                    </CInputGroup>
                                    <CInputGroup className='mb-4'>
                                        <CFormInput
                                            name='Date of Birth'
                                            type='text'
                                            placeholder='Date of Birth'
                                            required
                                            onFocus={e => e.target.type = 'date'}
                                            onBlur={e => e.target.type = 'text'}
                                        />
                                    </CInputGroup>
                                    <div className="d-grid">
                                        <CButton color="success">Submit Registration</CButton>
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