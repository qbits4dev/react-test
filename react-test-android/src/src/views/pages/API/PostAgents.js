import React, { useState } from 'react';
import {
    CContainer,
    CCard,
    CCardBody,
    CCardHeader,
    CForm,
    CFormInput,
    CButton,
    CRow,
    CCol,
    CSpinner,
} from '@coreui/react';

// API endpoint for posting new contacts
const API_URL = '${apiBaseUrl}/contacts/';

export default function ContactEntryForm() {
    const [form, setForm] = useState({
        name: '',
        email: '',
    });
    const [submitting, setSubmitting] = useState(false);

    // Handles changes to any form input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));
    };

    // Handles the form submission process
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const payload = {
            name: form.name,
            email: form.email,
        };

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            await response.json();
            alert('Contact added successfully!');
            setForm({ name: '', email: '' }); // Clear the form
        } catch (error) {
            console.error('Submission failed:', error);
            alert('Failed to add contact. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <CContainer className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <CRow className="w-100">
                <CCol md={8} lg={6} xl={5} className="mx-auto">
                    <CCard
                        className="shadow-lg"
                        style={{
                            borderRadius: '16px',
                            border: 'none',
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        }}
                    >
                        <CCardHeader
                            className="text-white text-center py-4"
                            style={{
                                backgroundColor: '#321fdb',
                                borderTopLeftRadius: '16px',
                                borderTopRightRadius: '16px',
                            }}
                        >
                            <h2 className="mb-0">Enter Contact Details</h2>
                            <p className="mb-0 text-white-50">Fill out the form below to add a new contact.</p>
                        </CCardHeader>
                        <CCardBody className="p-4 p-md-5">
                            <CForm onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <CFormInput
                                        type="text"
                                        name="name"
                                        floatingLabel="Full Name"
                                        placeholder="John Doe"
                                        value={form.name}
                                        onChange={handleChange}
                                        required
                                        size="lg"
                                    />
                                </div>
                                <div className="mb-4">
                                    <CFormInput
                                        type="email"
                                        name="email"
                                        floatingLabel="Email Address"
                                        placeholder="name@example.com"
                                        value={form.email}
                                        onChange={handleChange}
                                        required
                                        size="lg"
                                    />
                                </div>
                                <div className="d-grid mt-4">
                                    <CButton
                                        type="submit"
                                        color="primary"
                                        size="lg"
                                        disabled={submitting}
                                        style={{ fontWeight: 'bold' }}
                                    >
                                        {submitting ? <CSpinner size="sm" /> : 'Add Contact'}
                                    </CButton>
                                </div>
                            </CForm>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </CContainer>
    );
}