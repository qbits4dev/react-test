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
    const [formData, setFormData] = useState({
        name: '',
        firstname: '',
        lastname: '',
        phone: '',
        plotNumber: '',
        interestedIn: 'IntrestedIn',
        dateOfVisit: '',
        lead: 'lead',
    })

    //Dropdown for selecting leads
    const [lead, setlead] = useState('Lead')
    const [leadsList, setleadsList] = useState([])
    const [InterstedIn, setInterstedIn] = useState('IntrestedIn')
    const [InterstedInList, setInterstedInList] = useState([])

    //GET leads and interested in data
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
        setFormData((prev) => ({ ...prev, lead: Value }))
    }

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

    //POST form data
    const handlesubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await fetch('http://127.00.0.1:5000/test', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })
            if (res.ok) {
                alert('Visit Booked Successfully')
            } else {
                console.error('Booking failed:', res.statusText)
                alert(res.statusText)
            }
        } catch (error) {
            alert('Network Error. Please try again later.')
        }
    }
    const LeadForm = () => {
        switch (lead) {
            case 'New Lead':
                return (
                    <CForm on onSubmit={handlesubmit}>
                        <CInputGroup className="mb-3">
                            <CFormInput name="firstname" placeholder="Firstname" value={formData.firstname} onChange={handleChange} />
                        </CInputGroup>
                        <CInputGroup className="mb-3">
                            <CFormInput name="lastname" placeholder="lastname" value={formData.lastname} onChange={handleChange} />
                        </CInputGroup>
                        <CInputGroup className="mb-3">
                            <CFormInput name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} />
                        </CInputGroup>
                        <CInputGroup className="mb-3">
                            <CFormInput name="plot number" placeholder="plot number" value={formData.plotNumber} onChange={handleChange} />
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
                                value={formData.dateOfVisit}
                                onChange={handleChange}
                            />
                        </CInputGroup>
                        <div className="d-grid mb-4" >
                            <CButton color="primary" onClick={handlesubmit}>Book Visit</CButton>
                        </div>
                    </CForm>
                )
            case 'Existing Lead':
                return (
                    <CForm onSubmit={handlesubmit}>
                        <CInputGroup className="mb-3">
                            <CFormInput name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
                        </CInputGroup>
                        <CInputGroup className="mb-3">
                            <CFormInput name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} />
                        </CInputGroup>
                        <CInputGroup className="mb-3">
                            <CFormInput name="plot number" placeholder="plot number" value={formData.dateOfVisit} onChange={handleChange} />
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
                                value={formData.dateOfVisit}
                                onChange={handleChange}
                            />
                        </CInputGroup>
                        <div className="d-grid mb-4" >
                            <CButton color="primary" onClick={handlesubmit}>Book Visit</CButton>
                        </div>
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
                                </CForm>
                                {LeadForm()}
                            </CCardBody>
                        </CCard>
                    </CCol>
                </CRow>
            </CContainer>
        </div>
    )
}

export default bookvisit