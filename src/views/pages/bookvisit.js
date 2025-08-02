import React, { useState, useEffect } from 'react';

import {
    CContainer,
    CRow,
    CCol,
    CButton,
    CCardBody,
    CForm,
    CCard,
    CInputGroup,
    CInputGroupText,
    CFormInput,
    CDropdown,
    CDropdownToggle,
    CDropdownMenu,
    CDropdownItem,
} from '@coreui/react';

const bookvisit = () => {

    //formdata for booking visit
    const [form, setForm] = useState({
        lead: '',
    })

    //Dropdown for selecting leads
    const [lead, setlead] = useState('Lead')
    const [leadsList, setleadsList] = useState([])

    useEffect(() => {
        fetch('http://127.0.0.1:5000/test?key=Lead')
            .then(res => res.json())
            .then((data) => {
                if (data && Array.isArray(data.Lead)) {
                    setleadsList(data.Lead)
                }
            })
            .catch(() => setleadsList([]))
    }, [])

    const handleLead = (Value) => {
        setlead(Value)
        setForm((prev) => ({ ...prev, lead: Value }))
        console.log('Selected Lead:', Value)

    }


    return (
        <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
            <CContainer>
                <CRow className="justify-content-center">
                    <CCol md={9} lg={7} xl={6}>
                        <CCard className='p-4'>
                            <CCardBody className='mx-4'>
                                <CForm>
                                    <h1>Book a Visit</h1>
                                    <p className="text-body-secondary">Schedule your visit with us</p>
                                    <CDropdown className=" d-flex mb-2">
                                        <CDropdownToggle color="primary">{lead}</CDropdownToggle>
                                        <CDropdownMenu>
                                            {leadsList.map((item, index) => (
                                                <CDropdownItem key={index} onClick={() => handleLead(item.name)}>
                                                    {item.name}
                                                </CDropdownItem>
                                            ))}
                                        </CDropdownMenu>
                                    </CDropdown>
                                    <CButton color="primary" type="submit">Book Visit</CButton>
                                </CForm>
                            </CCardBody>
                        </CCard>
                    </CCol>
                </CRow>
            </CContainer>
        </div>
    )
}

export default bookvisit