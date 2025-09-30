import React from 'react';
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
} from '@coreui/react';

export default function ProjectsTable({ projects, onViewPlot }) {
  return (
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
                      onClick={() => onViewPlot(project)}
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
  );
}
