import React, { useState } from 'react';
import {
    CCard,
    CCardBody,
    CForm,
    CFormInput,
    CFormTextarea,
    CFormSelect,
    CRow,
    CCol,
    CButton,
} from '@coreui/react';

// For a cleaner look, define status options here
const statusOptions = ['Ongoing', 'Completed', 'Planned', 'On Hold'];

export default function ProjectForm({ onSubmit }) {
    const [form, setForm] = useState({
        name: '',
        description: '',
        location: '',
        start_date: '',
        end_date: '',
        status: '',
        total_area: '',
        developer: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simple validation: ensure a status is selected
        if (!form.status) {
            alert('Please select a project status.');
            return;
        }
        onSubmit(form, setForm);
    };

    return (
        <CCard
            className="mb-4"
            style={{
                background: '#ffffff',
                borderRadius: '16px',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
                border: 'none',
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 12px 35px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.12)';
            }}
        >
            <CCardBody className="p-4 p-md-5">
                <div className="text-center mb-4">
                    <h2 style={{ fontWeight: 700, color: '#2c3e50' }}>Create a New Project </h2>
                    <p className="text-medium-emphasis">Fill in the details below to get started.</p>
                </div>

                <CForm onSubmit={handleSubmit}>
                    {/* Project Name + Developer */}
                    <CRow className="g-3 mb-3">
                        <CCol md={6}>
                            <CFormInput
                                floating
                                label="Project Name"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Project Name"
                                required
                            />
                        </CCol>
                        <CCol md={6}>
                            <CFormInput
                                floating
                                label="Developer"
                                name="developer"
                                value={form.developer}
                                onChange={handleChange}
                                placeholder="Developer"
                                required
                            />
                        </CCol>
                    </CRow>

                    {/* Location + Area */}
                    <CRow className="g-3 mb-3">
                        <CCol md={6}>
                            <CFormInput
                                floating
                                label="Location"
                                name="location"
                                value={form.location}
                                onChange={handleChange}
                                placeholder="Location"
                                required
                            />
                        </CCol>
                        <CCol md={6}>
                            <CFormInput
                                floating
                                label="Total Area (sq. ft)"
                                name="total_area"
                                type="number"
                                value={form.total_area}
                                onChange={handleChange}
                                placeholder="Total Area (sq. ft)"
                                required
                            />
                        </CCol>
                    </CRow>

                    {/* Description */}
                    <CRow className="g-3 mb-3">
                        <CCol>
                            <CFormTextarea
                                floating
                                label="Project Description"
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Project Description"
                                rows={3}
                                required
                            />
                        </CCol>
                    </CRow>

                    {/* Start Date + End Date */}
                    <CRow className="g-3 mb-3">
                        <CCol md={6}>
                            <CFormInput
                                floating
                                label="Start Date"
                                name="start_date"
                                type="date"
                                value={form.start_date}
                                onChange={handleChange}
                                required
                            />
                        </CCol>
                        <CCol md={6}>
                            <CFormInput
                                floating
                                label="End Date"
                                name="end_date"
                                type="date"
                                value={form.end_date}
                                onChange={handleChange}
                                required
                            />
                        </CCol>
                    </CRow>

                    {/* Status Select */}
                    <CRow className="g-3 mb-4">
                        <CCol>
                            <CFormSelect
                                floating
                                label="Project Status"
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select a status</option>
                                {statusOptions.map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </CFormSelect>
                        </CCol>
                    </CRow>

                    {/* Submit Button */}
                    <div className="d-grid mt-4">
                        <CButton color="primary" type="submit" size="lg" style={{ fontWeight: 600 }}>
                            Add Project
                        </CButton>
                    </div>
                </CForm>
            </CCardBody>
        </CCard>
    );
}