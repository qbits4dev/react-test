import React, { useState } from 'react';
import {
  CContainer, CRow, CCol, CForm, CFormInput, CCard, CCardBody, CInputGroup,
  CDropdown, CButton, CDropdownToggle, CDropdownMenu, CDropdownItem
} from '@coreui/react';

export default function Projects() {
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

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Handle dropdown selection
  const handleStatusSelect = (status) => {
    setForm(prev => ({ ...prev, status }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://api.qbits4dev.com/projects/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to submit form');
      }

      // Redirect on success
      window.location.href = 'https://www.google.com';
    } catch (error) {
      console.error('Submission error:', error.message);
      alert('Failed to submit the form. Please try again.');
    }
  };

  return (
    <CContainer>
      <CRow className="justify-content-center">
        <CCol md={9} lg={7} xl={6}>
          <CCard className="mx-4">
            <CCardBody className="p-4">
              <CForm onSubmit={handleSubmit}>
                <h1>Projects</h1>

                <CInputGroup className="mt-3 mb-3">
                  <CFormInput
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Project name"
                    required
                  />
                </CInputGroup>

                <CInputGroup className="mb-3">
                  <CFormInput
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Description"
                    required
                  />
                </CInputGroup>

                <CInputGroup className="mb-3">
                  <CFormInput
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="Location"
                    required
                  />
                </CInputGroup>

                <CInputGroup className="mb-3">
                  <CFormInput
                    name="start_date"
                    value={form.start_date}
                    onChange={handleChange}
                    placeholder="Start Date"
                    type="date"
                    required
                  />
                </CInputGroup>

                <CInputGroup className="mb-3">
                  <CFormInput
                    name="end_date"
                    value={form.end_date}
                    onChange={handleChange}
                    placeholder="End Date"
                    type="date"
                    required
                  />
                </CInputGroup>

                <CDropdown className="mb-3 d-flex justify-content-center">
                  <CDropdownToggle color="info">
                    {form.status || 'Select Status'}
                  </CDropdownToggle>
                  <CDropdownMenu className="w-100">
                    <CDropdownItem onClick={() => handleStatusSelect('Ongoing')}>Ongoing</CDropdownItem>
                    <CDropdownItem onClick={() => handleStatusSelect('Completed')}>Completed</CDropdownItem>
                  </CDropdownMenu>
                </CDropdown>

                <CInputGroup className="mb-3">
                  <CFormInput
                    name="total_area"
                    value={form.total_area}
                    onChange={handleChange}
                    placeholder="Total Area"
                    required
                  />
                </CInputGroup>

                <CInputGroup className="mb-3">
                  <CFormInput
                    name="developer"
                    value={form.developer}
                    onChange={handleChange}
                    placeholder="Developer"
                    required
                  />
                </CInputGroup>

                <div className="d-grid">
                  <CButton color="success" type="submit">
                    Submit
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
