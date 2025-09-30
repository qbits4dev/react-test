import React, { useState } from 'react';
import {
  CCard,
  CCardBody,
  CForm,
  CFormInput,
  CRow,
  CCol,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CButton,
} from '@coreui/react';

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

  const handleStatusSelect = (status) => {
    setForm((prev) => ({ ...prev, status }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form, setForm);
  };

  return (
    <CCard
      style={{
        background: '#fff',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        transition: 'transform 0.3s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-3px)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
    >
      <CCardBody>
        <div
          style={{
            borderBottom: '2px solid #0d6efd',
            paddingBottom: '10px',
            marginBottom: '20px',
          }}
        >
          <h2 style={{ fontWeight: 600, color: '#333' }}>Add New Project</h2>
        </div>

        <CForm onSubmit={handleSubmit}>
          {/* Project Name + Developer */}
          <CRow className="mb-3">
            <CCol md={6} className="mb-3">
              <CFormInput
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Project Name"
                required
              />
            </CCol>
            <CCol md={6} className="mb-3">
              <CFormInput
                name="developer"
                value={form.developer}
                onChange={handleChange}
                placeholder="Developer"
                required
              />
            </CCol>
          </CRow>

          {/* Location + Area */}
          <CRow className="mb-3">
            <CCol md={6} className="mb-3">
              <CFormInput
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Location"
                required
              />
            </CCol>
            <CCol md={6} className="mb-3">
              <CFormInput
                name="total_area"
                value={form.total_area}
                onChange={handleChange}
                placeholder="Total Area (sq. ft)"
                required
              />
            </CCol>
          </CRow>

          {/* Start Date + End Date */}
          <CRow className="mb-3">
            <CCol md={6} className="mb-3">
              <label style={{ fontWeight: 500, marginBottom: '5px', display: 'block' }}>
                Start Date
              </label>
              <CFormInput
                name="start_date"
                type="date"
                value={form.start_date}
                onChange={handleChange}
                required
              />
            </CCol>
            <CCol md={6} className="mb-3">
              <label style={{ fontWeight: 500, marginBottom: '5px', display: 'block' }}>
                End Date
              </label>
              <CFormInput
                name="end_date"
                type="date"
                value={form.end_date}
                onChange={handleChange}
                required
              />
            </CCol>
          </CRow>

          {/* Status Dropdown */}
          <CRow className="mb-4">
            <CCol md={12}>
              <CDropdown className="w-100">
                <CDropdownToggle color="secondary" className="w-100">
                  {form.status || 'Select Status'}
                </CDropdownToggle>
                <CDropdownMenu className="w-100">
                  <CDropdownItem onClick={() => handleStatusSelect('Ongoing')}>
                    Ongoing
                  </CDropdownItem>
                  <CDropdownItem onClick={() => handleStatusSelect('Completed')}>
                    Completed
                  </CDropdownItem>
                </CDropdownMenu>
              </CDropdown>
            </CCol>
          </CRow>

          {/* Submit Button */}
          <CRow>
            <CCol className="d-grid">
              <CButton color="success" type="submit" style={{ borderRadius: '25px', padding: '12px 0', fontWeight: 600 }}>
                Submit
              </CButton>
            </CCol>
          </CRow>
        </CForm>
      </CCardBody>
    </CCard>
  );
}
