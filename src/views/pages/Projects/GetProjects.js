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
  const [selectedProject, setSelectedProject] = useState(null);
  const [plots, setPlots] = useState([]);
  const [plotsLoading, setPlotsLoading] = useState(false);

  useEffect(() => {
    async function fetchProjects() {
      setLoading(true);
      try {
        const res = await fetch('${apiBaseUrl}/projects/');
        if (!res.ok) throw new Error('Failed to fetch projects');
        const data = await res.json();
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

  const handleViewPlot = async (project) => {
    setSelectedProject(project);
    setPlots([]);
    setPlotsLoading(true);
    try {
      // Replace with actual plots API
      const res = await fetch(`${apiBaseUrl}/plots`);
      if (!res.ok) throw new Error('Failed to fetch plots');
      const data = await res.json();
      setPlots(Array.isArray(data) ? data : (data.plots || []));
    } catch (err) {
      alert('Error fetching plots: ' + err.message);
    } finally {
      setPlotsLoading(false);
    }
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
        <>
          <CCard
            style={{
              background: '#fff',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              marginBottom: '20px',
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

          {selectedProject && (
            <CCard
              style={{
                background: '#fff',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              }}
            >
              <CCardBody>
                <h5 className="mb-3">
                  Plots for Project: <strong>{selectedProject.name}</strong>
                </h5>
                {plotsLoading ? (
                  <div className="text-center py-3">
                    <CSpinner />
                  </div>
                ) : plots.length > 0 ? (
                  <CTable hover responsive align="middle">
                    <CTableHead color="light">
                      <CTableRow>
                        <CTableHeaderCell>Plot Number</CTableHeaderCell>
                        <CTableHeaderCell>Size</CTableHeaderCell>
                        <CTableHeaderCell>Status</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {plots.map((plot, idx) => (
                        <CTableRow key={idx}>
                          <CTableDataCell>{plot.number}</CTableDataCell>
                          <CTableDataCell>{plot.size}</CTableDataCell>
                          <CTableDataCell>
                            <CBadge color={plot.status.toLowerCase() === 'sold' ? 'danger' : 'success'}>
                              {plot.status}
                            </CBadge>
                          </CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                ) : (
                  <div className="text-center text-muted py-3">No plots found for this project.</div>
                )}
              </CCardBody>
            </CCard>
          )}
        </>
      )}
    </CContainer>
  );
}
