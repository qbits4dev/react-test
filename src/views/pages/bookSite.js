import { React } from 'react'
import { useNavigate } from 'react-router-dom'

import { CRow, CContainer, CCard, CForm, CCol, CCardBody, CFormInput, CInputGroup } from '@coreui/react'

const BookSite = () => {
    return (
        <div className='bg-body-tertiary min-vh-100 d-flex flex-row align-items-center'>
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