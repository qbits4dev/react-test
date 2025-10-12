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

// Options for plot status dropdown
const plotStatusOptions = ['Available', 'Sold', 'Reserved', 'On Hold'];

export default function PlotForm() {
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

    const payload = {
      project_id: Number(form.project_id),
      plot_number: form.plot_number,
      size: Number(form.size),
      price: Number(form.price),
      status: form.status.toLowerCase(),
    };

    console.log('Submitting payload:', payload);

    try {
      const response = await fetch('${apiBaseUrl}/projects/plots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add auth headers here if needed
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(errorText || 'Failed to submit');
      }

      alert('Plot submitted successfully!');
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
        boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
        border: 'none',
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)';
      }}
    >
      <CCardBody className="p-4 p-md-5">
        <div className="text-center mb-4">
          <h2 style={{ fontWeight: 700, color: '#2c3e50' }}>Add a New Plot</h2>
          <p className="text-medium-emphasis">Fill in the plot details below.</p>
        </div>

        <CForm onSubmit={handleSubmit}>
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
                <option value="">Select Status</option>
                {plotStatusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </CFormSelect>
            </CCol>
          </CRow>

          <div className="d-grid">
            <CButton size="lg" color="primary" type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Add Plot'}
            </CButton>
          </div>
        </CForm>
      </CCardBody>
    </CCard>
  );
}
