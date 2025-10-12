import React, { useState, useEffect } from 'react';
import {
  CContainer,
  CRow,
  CCol,
  CForm,
  CFormInput,
  CCard,
  CCardBody,
  CDropdown,
  CButton,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
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

  const [projects, setProjects] = useState([]);

  // Fetch existing projects
  const fetchProjects = async () => {
    try {
      const response = await fetch('${apiBaseUrl}/projects/');
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      } else {
        console.error('Failed to fetch projects');
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusSelect = (status) => {
    setForm((prev) => ({ ...prev, status }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('${apiBaseUrl}/projects/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to submit form');
      }

      alert('Project added successfully!');
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
      fetchProjects();
    } catch (error) {
      console.error('Submission error:', error.message);
      alert('Failed to submit the form. Please try again.');
    }
  };

  const handleViewPlot = (project) => {
    console.log('Viewing plots for:', project);
    // Implement modal or navigation here
  };

  return (
    <CContainer>
      {/* Existing Projects Section */}
      <CRow className="justify-content-center mt-4">
        <CCol md={10}>
          <h2 className="mb-4" style={{ fontWeight: 600, color: '#333' }}>
            Existing Projects
          </h2>
          <CCard
            style={{
              background: '#fff',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            }}
          >
            <CCardBody>
              <CTable hover responsive align="middle">
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell style={{ fontWeight: 600 }}>Name</CTableHeaderCell>
                    <CTableHeaderCell style={{ fontWeight: 600 }}>Description</CTableHeaderCell>
                    <CTableHeaderCell style={{ fontWeight: 600 }}>Location</CTableHeaderCell>
                    <CTableHeaderCell style={{ fontWeight: 600 }}>Status</CTableHeaderCell>
                    <CTableHeaderCell style={{ fontWeight: 600 }}>Developer</CTableHeaderCell>
                    <CTableHeaderCell style={{ fontWeight: 600 }}>Action</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {projects.length > 0 ? (
                    projects.map((project, index) => (
                      <CTableRow key={index} style={{ transition: '0.2s' }}>
                        <CTableDataCell>{project.name}</CTableDataCell>
                        <CTableDataCell>{project.description}</CTableDataCell>
                        <CTableDataCell>{project.location}</CTableDataCell>
                        <CTableDataCell>
                          <CBadge color={project.status === 'Completed' ? 'success' : 'warning'}>
                            {project.status}
                          </CBadge>
                        </CTableDataCell>
                        <CTableDataCell>{project.developer}</CTableDataCell>
                        <CTableDataCell>
                          <CButton
                            color="primary"
                            size="sm"
                            variant="outline"
                            style={{ borderRadius: '20px' }}
                            onClick={() => handleViewPlot(project)}
                          >
                            View Plots
                          </CButton>
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan="6" className="text-center">
                        No projects found.
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Add New Project Section */}
      <CRow className="justify-content-center mt-5">
        <CCol md={10}>
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
                      style={{
                        borderRadius: '10px',
                        padding: '12px',
                        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)',
                        transition: '0.2s',
                      }}
                      onFocus={(e) =>
                        (e.currentTarget.style.boxShadow = '0 0 8px rgba(13, 110, 253, 0.5)')
                      }
                      onBlur={(e) =>
                      (e.currentTarget.style.boxShadow =
                        'inset 0 1px 3px rgba(0,0,0,0.1)')
                      }
                      required
                    />
                  </CCol>
                  <CCol md={6} className="mb-3">
                    <CFormInput
                      name="developer"
                      value={form.developer}
                      onChange={handleChange}
                      placeholder="Developer"
                      style={{
                        borderRadius: '10px',
                        padding: '12px',
                        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)',
                        transition: '0.2s',
                      }}
                      onFocus={(e) =>
                        (e.currentTarget.style.boxShadow = '0 0 8px rgba(13, 110, 253, 0.5)')
                      }
                      onBlur={(e) =>
                      (e.currentTarget.style.boxShadow =
                        'inset 0 1px 3px rgba(0,0,0,0.1)')
                      }
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
                      style={{
                        borderRadius: '10px',
                        padding: '12px',
                        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)',
                      }}
                      onFocus={(e) =>
                        (e.currentTarget.style.boxShadow = '0 0 8px rgba(13, 110, 253, 0.5)')
                      }
                      onBlur={(e) =>
                      (e.currentTarget.style.boxShadow =
                        'inset 0 1px 3px rgba(0,0,0,0.1)')
                      }
                      required
                    />
                  </CCol>
                  <CCol md={6} className="mb-3">
                    <CFormInput
                      name="total_area"
                      value={form.total_area}
                      onChange={handleChange}
                      placeholder="Total Area (sq. ft)"
                      style={{
                        borderRadius: '10px',
                        padding: '12px',
                        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)',
                      }}
                      onFocus={(e) =>
                        (e.currentTarget.style.boxShadow = '0 0 8px rgba(13, 110, 253, 0.5)')
                      }
                      onBlur={(e) =>
                      (e.currentTarget.style.boxShadow =
                        'inset 0 1px 3px rgba(0,0,0,0.1)')
                      }
                      required
                    />
                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  <CCol md={6} className="mb-3">
                    <div>
                      <label style={{ fontWeight: 500, marginBottom: '5px', display: 'block' }}>
                        Start Date
                      </label>
                      <CFormInput
                        name="start_date"
                        type="date"
                        value={form.start_date}
                        onChange={handleChange}
                        style={{
                          borderRadius: '10px',
                          padding: '12px',
                          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)',
                        }}
                        onFocus={(e) =>
                          (e.currentTarget.style.boxShadow = '0 0 8px rgba(13, 110, 253, 0.5)')
                        }
                        onBlur={(e) =>
                          (e.currentTarget.style.boxShadow = 'inset 0 1px 3px rgba(0,0,0,0.1)')
                        }
                        required
                      />
                    </div>
                  </CCol>

                  <CCol md={6} className="mb-3">
                    <div>
                      <label style={{ fontWeight: 500, marginBottom: '5px', display: 'block' }}>
                        End Date
                      </label>
                      <CFormInput
                        name="end_date"
                        type="date"
                        value={form.end_date}
                        onChange={handleChange}
                        style={{
                          borderRadius: '10px',
                          padding: '12px',
                          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)',
                        }}
                        onFocus={(e) =>
                          (e.currentTarget.style.boxShadow = '0 0 8px rgba(13, 110, 253, 0.5)')
                        }
                        onBlur={(e) =>
                          (e.currentTarget.style.boxShadow = 'inset 0 1px 3px rgba(0,0,0,0.1)')
                        }
                        required
                      />
                    </div>
                  </CCol>
                </CRow>


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

                <CRow>
                  <CCol className="d-grid">
                    <CButton
                      color="success"
                      type="submit"
                      style={{
                        borderRadius: '25px',
                        padding: '12px 0',
                        fontWeight: 600,
                        transition: '0.3s',
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = '#198754')
                      }
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '')}
                    >
                      Submit
                    </CButton>
                  </CCol>
                </CRow>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
}
