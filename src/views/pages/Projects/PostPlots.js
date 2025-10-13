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
const plotStatusOptions = ['available', 'sold', 'reserved', 'on hold'];

export default function PlotForm() {
  const [form, setForm] = useState({
    project_name: '',
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
      project_name: form.project_name,
      plot_number: form.plot_number,
      size: Number(form.size),
      price: Number(form.price),
      status: form.status.toLowerCase(),
    };

    console.log('Submitting payload:', payload);

    try {
      const response = await fetch(`${apiBaseUrl}/projects/plots`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
        project_name: '',
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
    <div className="d-flex justify-content-center align-items-center mt-5">
      <CCard
        className="shadow-lg"
        style={{
          width: '100%',
          maxWidth: '700px',
          borderRadius: '20px',
          overflow: 'hidden',
          border: 'none',
          background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-8px)';
          e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.12)';
        }}
      >
        <CCardBody className="p-5">
          <div className="text-center mb-5">
            <h1
              style={{
                fontWeight: 800,
                background: 'linear-gradient(90deg, #4e54c8, #8f94fb)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Add a New Plot
            </h1>
            <p
              style={{
                background: 'linear-gradient(90deg, #4e54c8, #8f94fb)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Complete the details to register a plot
            </p>
          </div>

          <CForm onSubmit={handleSubmit}>
            <CRow className="g-4 mb-4">
              <CCol md={6}>
                <CFormInput
                  floating
                  label="Project Name"
                  name="project_name"
                  value={form.project_name}
                  onChange={handleChange}
                  placeholder="Project Name"
                  required
                  style={{ borderRadius: '12px', border: '1px solid #ced4da' }}
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
                  style={{ borderRadius: '12px', border: '1px solid #ced4da' }}
                />
              </CCol>
            </CRow>

            <CRow className="g-4 mb-4">
              <CCol md={6}>
                <CFormInput
                  floating
                  label="Size (sq. ft)"
                  name="size"
                  type="number"
                  value={form.size}
                  onChange={handleChange}
                  placeholder="Size"
                  required
                  style={{ borderRadius: '12px', border: '1px solid #ced4da' }}
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
                  style={{ borderRadius: '12px', border: '1px solid #ced4da' }}
                />
              </CCol>
            </CRow>

            <CRow className="g-4 mb-5">
              <CCol>
                <CFormSelect
                  floating
                  label="Plot Status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  required
                  style={{ borderRadius: '12px', border: '1px solid #ced4da' }}
                >
                  <option value="">Select Status</option>
                  {plotStatusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>

            <div className="d-grid">
              <CButton
                size="lg"
                color="primary"
                type="submit"
                disabled={loading}
                style={{
                  borderRadius: '12px',
                  fontWeight: 600,
                  background: 'linear-gradient(90deg, #4e54c8, #8f94fb)',
                  border: 'none',
                }}
              >
                {loading ? 'Submitting...' : 'Add Plot'}
              </CButton>
            </div>
          </CForm>
        </CCardBody>
      </CCard>
    </div>
  );
}
