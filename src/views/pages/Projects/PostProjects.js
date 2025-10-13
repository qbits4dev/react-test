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

const statusOptions = ['Ongoing', 'Completed', 'Planned', 'On Hold'];

export default function ProjectForm() {
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

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...form,
      status: form.status.toLowerCase(),
      total_area: Number(form.total_area),
    };

    console.log('Submitting payload:', payload);

    try {
      const response = await fetch('${apiBaseUrl}/projects/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to submit');
      }

      alert('Project submitted successfully!');
      setForm({
        name: '',
        description: '',
        location: '',
        start_date: '',
        end_date: '',
        status: '',
        total_area: '',
        developer: '',
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
        borderRadius: '16px',
        boxShadow: '0 15px 50px rgba(0,0,0,0.08)',
        border: 'none',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 15px 50px rgba(0,0,0,0.08)';
      }}
    >
      <CCardBody className="p-4 p-md-5">
        <div className="text-center mb-5">
          <h1
            className="fw-bold"
            style={{
              background: 'linear-gradient(90deg, #990bffff, #8857f3ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Create a New Project
          </h1>
          <p
            className="text-medium-emphasis"
            style={{
              background: 'linear-gradient(90deg,#990bffff, #8857f3ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 500,
            }}
          >
            Fill in the details below to get started.
          </p>
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
                className="border-primary"
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
                className="border-primary"
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
                className="border-primary"
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
                className="border-primary"
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
                className="border-primary"
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
                className="border-primary"
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
                className="border-primary"
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
                className="border-primary"
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
            <CButton
              color="primary"
              type="submit"
              size="lg"
              style={{ fontWeight: 600 }}
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Add Project'}
            </CButton>
          </div>
        </CForm>
      </CCardBody>
    </CCard>
  );
}
