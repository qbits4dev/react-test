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
    const [InterstedIn, setInterstedIn] = useState('IntrestedIn')
    const [InterstedInList, setInterstedInList] = useState([])

    useEffect(() => {
        fetch('http://127.0.0.1:5000/test?key=Lead')
            .then(res => res.json())
            .then((data) => {
                if (data && Array.isArray(data.Lead)) {
                    setleadsList(data.Lead)
                }
            })
            .catch(() => {
                alert('Failed to Fetch Lead. Please try again.')
                setleadsList([])
            })

        fetch('http://127.0.0.1:5000/test?key=InterstedIn')
            .then((res) => res.json())
            .then((data) => {
                if (data && Array.isArray(data.InterstedIn)) {
                    setInterstedInList(data.InterstedIn)
                }
            })
            .catch(() => {
                alert('Failed to Fetch InterstedIn. Please try again.')
                setInterstedInList([])
            })

    }, [])

    const handleLead = (Value) => {
        setlead(Value)
        setForm((prev) => ({ ...prev, lead: Value }))
    }
    const handleDropdown = (value) => {
        setInterstedIn(value)
        setFormData((prev) => ({
            ...prev,
            interestedIn: value,
        }))
    }

    const LeadForm = () => {
        switch (lead) {
            case 'New Lead':
                return (
                    <CForm>
                        <CInputGroup className="mb-3">
                            <CFormInput name="firstname" placeholder="Firstname" />
                        </CInputGroup>
                        <CInputGroup className="mb-3">
                            <CFormInput name="lastname" placeholder="lastname" />
                        </CInputGroup>
                        <CInputGroup className="mb-3">
                            <CFormInput name="phone" placeholder="Phone Number" />
                        </CInputGroup>
                        <CDropdown className='d-flex mb-2'>
                            <CDropdownToggle color='primary'>{InterstedIn}</CDropdownToggle>
                            <CDropdownMenu>
                                {InterstedInList.map((item, index) => (
                                    <CDropdownItem key={item.id || index}
                                        onClick={() => handleDropdown(item.name)}>
                                        {item.name}
                                    </CDropdownItem>
                                ))}

                            </CDropdownMenu>
                        </CDropdown>
                        <p className='ml-2'>Date of Visit</p>
                        <CInputGroup className='mb-4'>
                            <CFormInput
                                name='dateOfVisit'
                                type='date'
                                placeholder='Date of visit'
                                required
                            />
                        </CInputGroup>
                    </CForm>
                )
            case 'Existing Lead':
                return (
                    <CForm>
                        <CInputGroup className="mb-3">
                            <CFormInput name="firstname" placeholder="Firstname" />
                        </CInputGroup>
                        <CInputGroup className="mb-3">
                            <CFormInput name="lastname" placeholder="lastname" />
                        </CInputGroup>
                        <CInputGroup className="mb-3">
                            <CFormInput name="phone" placeholder="Phone Number" />
                        </CInputGroup>
                        <CDropdown className='d-flex mb-2'>
                            <CDropdownToggle color='primary'>{InterstedIn}</CDropdownToggle>
                            <CDropdownMenu>
                                {InterstedInList.map((item, index) => (
                                    <CDropdownItem key={item.id || index}
                                        onClick={() => handleDropdown(item.name)}>
                                        {item.name}
                                    </CDropdownItem>
                                ))}

                            </CDropdownMenu>
                        </CDropdown>
                        <p className='ml-2'>Date of Visit</p>
                        <CInputGroup className='mb-4'>
                            <CFormInput
                                name='dateOfVisit'
                                type='date'
                                placeholder='Date of visit'
                                required
                            />
                        </CInputGroup>
                    </CForm>

                )
            default:
                return null
        }
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
                                    {LeadForm()}
                                    <div className="d-grid mb-4" >
                                        <CButton color="primary" type="submit">Book Visit</CButton>
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

export default bookvisit