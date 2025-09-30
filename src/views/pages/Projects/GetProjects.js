import React, { useState, useEffect } from 'react';
import {
  CCard,
  CCardBody,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
  CButton,
  CContainer,
  CSpinner,
} from '@coreui/react';

export default function ProjectsList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchProjects() {
      setLoading(true);
      try {
        const res = await fetch('https://api.qbits4dev.com/projects/');
        if (!res.ok) throw new Error('Failed to fetch projects');
        const data = await res.json();
        // Adjust if API returns data differently
        setProjects(Array.isArray(data) ? data : (data.projects || []));
        setError('');
      } catch (err) {
        setError('Error fetching projects: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  const handleViewPlot = (project) => {
    alert(`View plots for project: ${project.name}`);
    // Add your view plot logic here
  };

  return (
    <CContainer className="my-4">
      {loading ? (
        <div className="text-center py-5">
          <CSpinner />
        </div>
      ) : error ? (
        <div className="text-danger text-center py-5">{error}</div>
      ) : (
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
                        <CBadge color={project.status.toLowerCase() === 'completed' ? 'success' : 'warning'}>
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
      )}
    </CContainer>
  );
}
