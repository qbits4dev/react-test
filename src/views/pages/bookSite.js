import { React } from 'react'
import { useNavigate } from 'react-router-dom'

import {
    CRow,
    CContainer,
    CCard,
    CForm,
    CCol,
    CCardBody,
    CFormInput,
    CInputGroup,
    CDropdown,
    CDropdownToggle,
    CDropdownMenu,
    CDropdownItem,
    CButton,

} from '@coreui/react'

const BookSite = () => {
    return (
        <div className='bg-body-tertiary min-vh-100 d-flex flex-row align-items-center constainer-fluid'>
            <CContainer>
                <CRow className='justify-content-center'>
                    <CCol md={9} lg={7} xl={6}>
                        <CCard className='mx-4'>
                            <CCardBody className='p-4'>
                                <CForm>
                                    <h1>Book Site </h1>
                                    <p>Book your Site</p>
                                        <CInputGroup className="mb-3">
                                            <CFormInput name="Customerid" placeholder='Customer Id' autoComplete='given-name' required />
                                        </CInputGroup>
                                        <CInputGroup className="mb-3">
                                            <CFormInput name="Agentid" placeholder='Agent Id' autoComplete='given-name' required />
                                        </CInputGroup>
                                    <h4>Property Details</h4>
                                    <CDropdown className='d-flex justify-content-center '>
                                        <CDropdownToggle color="info">Select Property</CDropdownToggle>
                                    </CDropdown>
                                    
                                    <h4>Amount paid</h4>
                                    <CInputGroup className="mt-2 mb-3">
                                        <CFormInput name="Amountpaid" placeholder='Amount paid' autoComplete='given-name' required />
                                    </CInputGroup>
                                    <div className='d-grid'>
                                        <CButton color="success" type='submit'>submit</CButton>
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

export default BookSite