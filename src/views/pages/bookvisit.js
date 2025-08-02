import react from 'react';

import {
    Ccontainer,
    CRow,
    CCol,
    CButton,
    CCardBody,
    CForm,
} from '@coreui/react';

const bookvisit = () => {
    return (
        <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
            <Ccontainer>
                <CRow className="justify-content-center">
                    <CCol md={9} lg={7} xl={6}>
                        <CCard className='p-4'>
                            <CCardBody className='mx-4'>
                                <CForm>
                                    <h1>Book a Visit</h1>
                                    <p className="text-body-secondary">Schedule your visit with us</p>
                                    <CInputGroup className='mb-3'>
                                        <CFormInput
                                            placeholder="Enter your name"
                                            autoComplete="name"
                                        />
                                    </CInputGroup>
                                    <CInputGroup className='mb-3'>
                                        <CFormInput
                                            type="email"
                                            placeholder="Enter your email"
                                            autoComplete="email"
                                        />
                                    </CInputGroup>
                                    <CInputGroup className='mb-3'>
                                        <CFormInput
                                            type="tel"
                                            placeholder="Enter your phone number"
                                            autoComplete="phone"
                                        />
                                        
                                    </CInputGroup>
                                    <CButton color="primary" type="submit">Book Visit</CButton>
                                </CForm>
                            </CCardBody>
                        </CCard>
                    </CCol>
                </CRow>
            </Ccontainer>
        </div>
    )
}

export default bookvisit