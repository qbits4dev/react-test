import React, { useEffect, useState } from 'react'
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
import { cilLockLocked, cilUser, cilPhone, cilCalendar } from '@coreui/icons'

const Client_Register = () => {

    const [Gender, setGender] = React.useState('Gender')
    const [GenderList, setGenderList] = useState([])

    useEffect(() => {
        fetch('http://127.0.0.1:5000/test?key=Gender')
            .then((res) => res.json())
            .then((data) => {
                if (data && Array.isArray(data.Gender)) {
                    setGenderList(data.Gender)
                }
            })
            .catch(() => {
                alert('Failed to Fetch Gender. Please try again.')
                setGenderList([])
            })
    }, [])

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
                                    <h1>Register</h1>
                                    <p className="text-body-secondary">Customer Registration</p>
                                    <CInputGroup className="mb-3">
                                        <CInputGroupText>
                                            <CIcon icon={cilUser} />
                                        </CInputGroupText>
                                        <CFormInput placeholder="firstname" autoComplete="firstname" required />
                                    </CInputGroup>
                                    <CInputGroup className="mb-3">
                                        <CInputGroupText>
                                            <CIcon icon={cilUser} />
                                        </CInputGroupText>
                                        <CFormInput placeholder="lastname" autoComplete="lastname" required />
                                    </CInputGroup>
                                    <CInputGroup className="mb-3">
                                        <CInputGroupText>@</CInputGroupText>
                                        <CFormInput placeholder="Email" autoComplete="email" required />
                                    </CInputGroup>
                                    <CInputGroup className='mb-3'>
                                        <CInputGroupText>
                                            <CIcon icon={cilPhone} />
                                        </CInputGroupText>
                                        <CFormInput placeholder="Phone Number" autoComplete="Phone Number" required />
                                    </CInputGroup>
                                    <CInputGroup className="mb-3">
                                        <CInputGroupText>
                                            <CIcon icon={cilLockLocked} />
                                        </CInputGroupText>
                                        <CFormInput
                                            type="password"
                                            placeholder="Password"
                                            autoComplete="new-password"
                                            required
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
                                            required
                                        />
                                    </CInputGroup>
                                    <CInputGroup className='mb-4'>
                                        <CInputGroupText>
                                            <CIcon icon={cilCalendar} />
                                        </CInputGroupText>
                                        <CFormInput
                                            name='Date of Birth'
                                            type='text'
                                            placeholder='Date of Birth'
                                            required
                                            onFocus={e => e.target.type = 'date'}
                                            onBlur={e => e.target.type = 'text'}
                                        />
                                    </CInputGroup>
                                    <CDropdown className="d-flex mb-4">
                                        <CDropdownToggle color="primary">{Gender}</CDropdownToggle>
                                        <CDropdownMenu>
                                            {GenderList.map((item, index) => (
                                                <CDropdownItem
                                                    key={item.id || index}
                                                    onClick={() => setGender(item.name)}>
                                                    {item.name}

                                                </CDropdownItem>
                                            ))}
                                        </CDropdownMenu>
                                    </CDropdown>
                                    <CInputGroup className="mb-3">
                                        <CFormInput
                                            name="aadhar"
                                            placeholder="Aadhar Number"
                                            required
                                        />
                                    </CInputGroup>
                                    <CInputGroup className="mb-3">
                                        <CFormInput
                                            name="pan"
                                            placeholder="PAN Number"
                                            required
                                        />
                                    </CInputGroup>
                                    <div className="mb-3">
                                        <p>Aadhar Card PDF</p>
                                        <CFormInput
                                            type="file"
                                            name="aadharFile"
                                            placeholder="Aadhar Card PDF"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <p>PAN Card PDF</p>
                                        <CFormInput
                                            type="file"
                                            name="panFile"
                                            placeholder="PAN Card PDF"
                                            required
                                        />
                                    </div>
                                    <div className="d-grid">
                                        <CButton color="info" onClick={handleSubmit}>Submit Registration</CButton>
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