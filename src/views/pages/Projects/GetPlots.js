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
  CButtonGroup,
} from '@coreui/react';

// Helper method to get badge color based on status
const getStatusBadge = (status) => {
  const s = status ? status.toLowerCase() : '';
  switch (s) {
    case 'available': return 'success';
    case 'sold': return 'danger';
    case 'reserved': return 'warning';
    case 'on hold': return 'secondary';
    default: return 'info';
  }
};

export default function PlotsList() {
  const [plots, setPlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchPlots() {
      setLoading(true);
      try {
        const res = await fetch('https://api.qbits4dev.com/projects/plots');
        if (!res.ok) throw new Error('Failed to fetch plots');
        const data = await res.json();
        setPlots(Array.isArray(data) ? data : data.plots || []);
        setError('');
      } catch (err) {
        setError('Error fetching plots: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPlots();
  }, []);

  const handleEdit = (plot) => {
    alert(`Edit Plot: ${plot.plot_number}`);
    // Implement editing logic here
  };

  const handleDelete = (plot) => {
    alert(`Delete Plot: ${plot.plot_number}`);
    // Implement deletion confirmation here
  };

  return (
    <CContainer className="my-4">
      {loading ? (
        <div className="text-center py-5"><CSpinner /></div>
      ) : error ? (
        <div className="text-danger text-center py-5">{error}</div>
      ) : (
        <CCard style={{ background: '#fff', borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
          <CCardBody>
            <CTable hover responsive align="middle">
              <CTableHead color="light">
                <CTableRow>
                  <CTableHeaderCell style={{ fontWeight: 600 }}>Plot Number</CTableHeaderCell>
                  <CTableHeaderCell style={{ fontWeight: 600 }}>Project ID</CTableHeaderCell>
                  <CTableHeaderCell style={{ fontWeight: 600 }}>Size (sq. ft)</CTableHeaderCell>
                  <CTableHeaderCell style={{ fontWeight: 600 }}>Price</CTableHeaderCell>
                  <CTableHeaderCell style={{ fontWeight: 600 }}>Status</CTableHeaderCell>
                  <CTableHeaderCell style={{ fontWeight: 600, textAlign: 'center' }}>Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {plots.length ? plots.map((plot, i) => (
                  <CTableRow key={plot.id || i} style={{ transition: '0.2s' }}>
                    <CTableDataCell><strong>{plot.plot_number}</strong></CTableDataCell>
                    <CTableDataCell>{plot.project_id}</CTableDataCell>
                    <CTableDataCell>{plot.size}</CTableDataCell>
                    <CTableDataCell>
                      {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(plot.price)}
                    </CTableDataCell>
                    <CTableDataCell>
                      <CBadge color={getStatusBadge(plot.status)} shape="rounded-pill">
                        {plot.status}
                      </CBadge>
                    </CTableDataCell>
                    <CTableDataCell className="text-center">
                      <CButtonGroup>
                        <CButton color="info" size="sm" variant="outline" onClick={() => handleEdit(plot)}>Edit</CButton>
                        <CButton color="danger" size="sm" variant="outline" onClick={() => handleDelete(plot)}>Delete</CButton>
                      </CButtonGroup>
                    </CTableDataCell>
                  </CTableRow>
                )) : (
                  <CTableRow>
                    <CTableDataCell colSpan="6" className="text-center">No plots found.</CTableDataCell>
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
