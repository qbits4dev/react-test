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

  const handleStatusSelect = (status) => {
    setForm((prev) => ({ ...prev, status }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const payload = {
      name: form.name,
      description: form.description,
      location: form.location,
      start_date: form.start_date,
      end_date: form.end_date,
      status: form.status.toLowerCase(),
      total_area: Number(form.total_area),
      developer: form.developer,
    };

    try {
      console.log(payload)
      const response = await fetch('https://api.qbit4dev.com/projects/', {
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
                type="number"
                value={form.total_area}
                onChange={handleChange}
                placeholder="Total Area (sq. ft)"
                required
              />
            </CCol>
          </CRow>

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

          <CRow className="mb-4">
            <CCol>
              <CDropdown>
                <CDropdownToggle color="secondary" className="w-100" style={{ textTransform: 'capitalize' }}>
                  {form.status || 'Select Status'}
                </CDropdownToggle>
                <CDropdownMenu className="w-100">
                  <CDropdownItem onClick={() => handleStatusSelect('ongoing')}>
                    Ongoing
                  </CDropdownItem>
                  <CDropdownItem onClick={() => handleStatusSelect('completed')}>
                    Completed
                  </CDropdownItem>
                </CDropdownMenu>
              </CDropdown>
            </CCol>
          </CRow>

          <CRow>
            <CCol>
              <CButton type="submit" color="success" disabled={loading} className="w-100 py-2">
                {loading ? 'Submitting...' : 'Submit'}
              </CButton>
            </CCol>
          </CRow>
        </CForm>
      </CCardBody>
    </CCard>
  );
}
