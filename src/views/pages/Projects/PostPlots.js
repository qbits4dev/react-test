import React, { useState } from 'react';
import {
    CCard,
    CCardBody,
    CForm,
    CFormInput,
    CFormSelect,
    CRow,
    CCol,
    CButton,
} from '@coreui/react';

// Updated options for plot status
const plotStatusOptions = ['Available', 'Sold', 'Reserved', 'On Hold'];

export default function PlotForm() {
    // 1. Updated state to match the new JSON structure
    const [form, setForm] = useState({
        project_id: '',
        plot_number: '',
        size: '',
        price: '',
        status: '',
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // 2. Payload created based on the new form state and JSON requirements
        const payload = {
            project_id: Number(form.project_id),
            plot_number: form.plot_number,
            size: Number(form.size),
            price: Number(form.price),
            status: form.status.toLowerCase(),
        };

        console.log('Submitting payload:', payload);

        try {
            // 3. API endpoint updated to a more suitable one for plots
            const response = await fetch('https://api.qbits4dev.com/plots/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // add auth headers here if needed
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                throw new Error(errorText || 'Failed to submit');
            }

            alert('Plot submitted successfully!');
            // 4. Reset form with the new fields
            setForm({
                project_id: '',
                plot_number: '',
                size: '',
                price: '',
                status: '',
            });
        } catch (error) {
            alert(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
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
                    {/* 5. UI Text updated for clarity */}
                    <h2 style={{ fontWeight: 700, color: '#2c3e50' }}>Add a New Plot</h2>
                    <p className="text-medium-emphasis">Fill in the plot details below.</p>
                </div>

                <CForm onSubmit={handleSubmit}>
                    {/* 6. Form fields updated to match the new state */}

                    {/* Project ID + Plot Number */}
                    <CRow className="g-3 mb-3">
                        <CCol md={6}>
                            <CFormInput
                                floating
                                label="Project ID"
                                name="project_id"
                                type="number"
                                value={form.project_id}
                                onChange={handleChange}
                                placeholder="Project ID"
                                required
                            />
                        </CCol>
                        <CCol md={6}>
                            <CFormInput
                                floating
                                label="Plot Number"
                                name="plot_number"
                                value={form.plot_number}
                                onChange={handleChange}
                                placeholder="Plot Number"
                                required
                            />
                        </CCol>
                    </CRow>

                    {/* Size + Price */}
                    <CRow className="g-3 mb-3">
                        <CCol md={6}>
                            <CFormInput
                                floating
                                label="Size (sq. ft)"
                                name="size"
                                type="number"
                                value={form.size}
                                onChange={handleChange}
                                placeholder="Size (sq. ft)"
                                required
                            />
                        </CCol>
                        <CCol md={6}>
                            <CFormInput
                                floating
                                label="Price"
                                name="price"
                                type="number"
                                value={form.price}
                                onChange={handleChange}
                                placeholder="Price"
                                required
                            />
                        </CCol>
                    </CRow>

                    {/* Status Select */}
                    <CRow className="g-3 mb-4">
                        <CCol>
                            <CFormSelect
                                floating
                                label="Plot Status"
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select a status</option>
                                {plotStatusOptions.map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </CFormSelect>
                        </CCol>
                    </CRow>

                    {/* Submit Button */}
                    <div className="d-grid mt-4">
                        <CButton color="primary" type="submit" size="lg" style={{ fontWeight: 600 }} disabled={loading}>
                            {loading ? 'Submitting...' : 'Add Plot'}
                        </CButton>
                    </div>
                </CForm>
            </CCardBody>
        </CCard>
    );
}