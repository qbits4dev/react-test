import React, { useState, useEffect } from 'react'
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
    CFormLabel,
} from '@coreui/react'

const BookVisit = () => {
    const [formData, setFormData] = useState({
        name: '',
        firstname: '',
        lastname: '',
        phone: '',
        plotNumber: '',
        interestedIn: 'Interested In',
        dateOfVisit: '',
        lead: 'Lead',
    })

    const [lead, setLead] = useState('Lead')
    const [leadsList, setLeadsList] = useState([])
    const [interestedIn, setInterestedIn] = useState('Interested In')
    const [interestedInList, setInterestedInList] = useState([])

    // GET data for dropdowns
    useEffect(() => {
        fetch('https://api.qbits4dev.com/visits/')
            .then((res) => res.json())
            .then((data) => {
                if (data && Array.isArray(data.Lead)) {
                    setLeadsList(data.Lead)
                }
            })
            .catch(() => {
                setLeadsList([])
            })

        fetch('http://127.0.0.1:5000/test?key=InterestedIn')
            .then((res) => res.json())
            .then((data) => {
                if (data && Array.isArray(data.InterestedIn)) {
                    setInterestedInList(data.InterestedIn)
                }
            })
            .catch(() => {
                setInterestedInList([])
            })
    }, [])

    const handleLead = (value) => {
        setLead(value)
        setFormData((prev) => ({ ...prev, lead: value }))
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleDropdown = (value) => {
        setInterestedIn(value)
        setFormData((prev) => ({
            ...prev,
            interestedIn: value,
        }))
    }

    // POST form data
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await fetch('http://127.0.0.1:5000/test', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })
            if (res.ok) {
                alert('Visit Booked Successfully')
            } else {
                alert('Booking failed. Please try again.')
            }
        } catch (error) {
            alert('Network Error. Please try again later.')
        }
    }

    const LeadForm = () => {
        return (
            <CForm onSubmit={handleSubmit} className="mt-3">
                {lead === 'New Lead' && (
                    <>
                        <CFormLabel>First Name</CFormLabel>
                        <CInputGroup className="mb-3">
                            <CFormInput
                                name="firstname"
                                placeholder="First Name"
                                value={formData.firstname}
                                onChange={handleChange}
                                required
                            />
                        </CInputGroup>

                        <CFormLabel>Last Name</CFormLabel>
                        <CInputGroup className="mb-3">
                            <CFormInput
                                name="lastname"
                                placeholder="Last Name"
                                value={formData.lastname}
                                onChange={handleChange}
                                required
                            />
                        </CInputGroup>
                    </>
                )}

                {lead === 'Existing Lead' && (
                    <>
                        <CFormLabel>Full Name</CFormLabel>
                        <CInputGroup className="mb-3">
                            <CFormInput
                                name="name"
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </CInputGroup>
                    </>
                )}

                <CFormLabel>Phone Number</CFormLabel>
                <CInputGroup className="mb-3">
                    <CFormInput
                        name="phone"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />
                </CInputGroup>

                <CFormLabel>Plot Number</CFormLabel>
                <CInputGroup className="mb-3">
                    <CFormInput
                        name="plotNumber"
                        placeholder="Plot Number"
                        value={formData.plotNumber}
                        onChange={handleChange}
                        required
                    />
                </CInputGroup>

                <CFormLabel>Interested In</CFormLabel>
                <CDropdown className="mb-3 w-100">
                    <CDropdownToggle color="secondary" className="w-100 text-start">
                        {interestedIn}
                    </CDropdownToggle>
                    <CDropdownMenu className="w-100">
                        {interestedInList.map((item, index) => (
                            <CDropdownItem
                                key={item.id || index}
                                onClick={() => handleDropdown(item.name)}
                            >
                                {item.name}
                            </CDropdownItem>
                        ))}
                    </CDropdownMenu>
                </CDropdown>

                <CFormLabel>Date of Visit</CFormLabel>
                <CInputGroup className="mb-4">
                    <CFormInput
                        name="dateOfVisit"
                        type="date"
                        placeholder="Date of visit"
                        required
                        value={formData.dateOfVisit}
                        onChange={handleChange}
                    />
                </CInputGroup>

                <div className="d-grid">
                    <CButton color="primary" type="submit">
                        Book Visit
                    </CButton>
                </div>
            </CForm>
        )
    }

    return (
        <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
            <CContainer>
                <CRow className="justify-content-center">
                    <CCol md={9} lg={7} xl={6}>
                        <CCard className="p-4 shadow-lg rounded-4">
                            <CCardBody>
                                <h2 className="mb-3 text-center text-primary">📅 Book a Visit</h2>
                                <p className="text-center text-muted mb-4">
                                    Schedule your visit with us easily
                                </p>

                                <CForm>
                                    <CFormLabel>Select Lead Type</CFormLabel>
                                    <CDropdown className="mb-3 w-100">
                                        <CDropdownToggle color="primary" className="w-100 text-start">
                                            {lead}
                                        </CDropdownToggle>
                                        <CDropdownMenu className="w-100">
                                            {leadsList.map((item, index) => (
                                                <CDropdownItem
                                                    key={index}
                                                    onClick={() => handleLead(item.name)}
                                                >
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

export default BookVisit
