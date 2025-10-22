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

// const apiBaseUrl = globalThis.apiBaseUrl;

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
        const res = await fetch(`${globalThis.apiBaseUrl}/projects/`);
        if (!res.ok) throw new Error('Failed to fetch projects');
        const data = await res.json();
        // console.log("coming")
        // console.log(data)
        setProjects(Array.isArray(data.data) ? data.data : []);
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
      const res = await fetch(`${globalThis.apiBaseUrl}/projects/plots?project_name=${project.name}`);
      if (!res.ok) throw new Error('Failed to fetch plots');
      const data = await res.json();
      setPlots(Array.isArray(data) ? data : []);
    } catch (err) {
      alert('Error fetching plots: ' + err.message);
    } finally {
      setPlotsLoading(false);
    }
  };

  const getProjectBadgeColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'ongoing':
        return 'info';
      case 'delayed':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  const getPlotBadgeColor = (status) => (status.toLowerCase() === 'sold' ? 'danger' : 'success');

  return (
    <CContainer className="my-4">
      {loading ? (
        <div className="text-center py-5">
          <CSpinner color="primary" />
        </div>
      ) : error ? (
        <div className="text-danger text-center py-5">{error}</div>
      ) : (
        <>
          {/* Projects Table */}
          <CCard className="mb-4" style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <CCardBody>
              <h4 className="mb-3" style={{ color: '#495057' }}>Projects List</h4>
              <CTable hover responsive align="middle">
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell>Name</CTableHeaderCell>
                    <CTableHeaderCell>Description</CTableHeaderCell>
                    <CTableHeaderCell>Location</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                    <CTableHeaderCell>Developer</CTableHeaderCell>
                    <CTableHeaderCell>Action</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {projects.length > 0 ? (
                    projects.map((project) => (
                      <CTableRow key={project.id}>
                        <CTableDataCell>{project.name}</CTableDataCell>
                        <CTableDataCell>{project.description}</CTableDataCell>
                        <CTableDataCell>{project.location}</CTableDataCell>
                        <CTableDataCell>
                          <CBadge color={getProjectBadgeColor(project.status)}>
                            {project.status}
                          </CBadge>
                        </CTableDataCell>
                        <CTableDataCell>{project.developer}</CTableDataCell>
                        <CTableDataCell>
                          <CButton
                            color="primary"
                            size="sm"
                            variant="outline"
                            shape="rounded-pill"
                            onClick={() => handleViewPlot(project)}
                          >
                            View Plots
                          </CButton>
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan="6" className="text-center text-muted">
                        No projects found.
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>

          {/* Plots Table */}
          {selectedProject && (
            <CCard style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
              <CCardBody>
                <h5 className="mb-3">
                  Plots for Project: <strong>{selectedProject.name}</strong>
                </h5>
                {plotsLoading ? (
                  <div className="text-center py-3">
                    <CSpinner color="primary" />
                  </div>
                ) : plots.length > 0 ? (
                  <CTable hover responsive align="middle">
                    <CTableHead color="light">
                      <CTableRow>
                        <CTableHeaderCell>Plot Number</CTableHeaderCell>
                        <CTableHeaderCell>Size</CTableHeaderCell>
                        <CTableHeaderCell>Price</CTableHeaderCell>
                        <CTableHeaderCell>Status</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {plots.map((plot) => (
                        <CTableRow key={plot.plot_number}>
                          <CTableDataCell>{plot.plot_number}</CTableDataCell>
                          <CTableDataCell>{plot.size}</CTableDataCell>
                          <CTableDataCell> {new Intl.NumberFormat('en-IN', {
                              style: 'currency',
                              currency: 'INR',
                            }).format(plot.price)}</CTableDataCell>
                          <CTableDataCell>
                            <CBadge color={getPlotBadgeColor(plot.status)}>{plot.status}</CBadge>
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