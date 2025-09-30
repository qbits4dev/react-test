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

// Helper function to determine badge color based on plot status
const getStatusBadge = (status) => {
    const lowerCaseStatus = status ? status.toLowerCase() : '';
    switch (lowerCaseStatus) {
        case 'available':
            return 'success';
        case 'sold':
            return 'danger';
        case 'reserved':
            return 'warning';
        case 'on hold':
            return 'secondary';
        default:
            return 'info';
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
                // 1. Fetching from the plots API endpoint
                const res = await fetch('https://api.qbits4dev.com/plots/');
                if (!res.ok) throw new Error('Failed to fetch plots');
                const data = await res.json();
                // Adjust if API returns data differently
                setPlots(Array.isArray(data) ? data : (data.plots || []));
                setError('');
            } catch (err) {
                setError('Error fetching plots: ' + err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchPlots();
    }, []);

    // 2. Action handlers for individual plots
    const handleEdit = (plot) => {
        alert(`Editing plot number: ${plot.plot_number}`);
        // Add your edit logic here (e.g., open a modal)
    };

    const handleDelete = (plot) => {
        alert(`Deleting plot number: ${plot.plot_number}`);
        // Add your delete logic here (e.g., show confirmation dialog)
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
                                    {/* 3. Updated table headers for plot data */}
                                    <CTableHeaderCell style={{ fontWeight: 600 }}>Plot Number</CTableHeaderCell>
                                    <CTableHeaderCell style={{ fontWeight: 600 }}>Project ID</CTableHeaderCell>
                                    <CTableHeaderCell style={{ fontWeight: 600 }}>Size (sq. ft)</CTableHeaderCell>
                                    <CTableHeaderCell style={{ fontWeight: 600 }}>Price</CTableHeaderCell>
                                    <CTableHeaderCell style={{ fontWeight: 600 }}>Status</CTableHeaderCell>
                                    <CTableHeaderCell style={{ fontWeight: 600, textAlign: 'center' }}>Actions</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {plots.length > 0 ? (
                                    // 4. Mapping over the 'plots' array
                                    plots.map((plot, index) => (
                                        <CTableRow key={plot.id || index} style={{ transition: '0.2s' }}>
                                            <CTableDataCell>
                                                <strong>{plot.plot_number}</strong>
                                            </CTableDataCell>
                                            <CTableDataCell>{plot.project_id}</CTableDataCell>
                                            <CTableDataCell>{plot.size}</CTableDataCell>
                                            <CTableDataCell>
                                                {/* Formatting price for better readability */}
                                                {new Intl.NumberFormat('en-IN', {
                                                    style: 'currency',
                                                    currency: 'INR',
                                                }).format(plot.price)}
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                <CBadge color={getStatusBadge(plot.status)} shape="rounded-pill">
                                                    {plot.status}
                                                </CBadge>
                                            </CTableDataCell>
                                            <CTableDataCell className="text-center">
                                                {/* 5. Action buttons for edit and delete */}
                                                <CButtonGroup role="group">
                                                    <CButton
                                                        color="info"
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleEdit(plot)}
                                                    >
                                                        Edit
                                                    </CButton>
                                                    <CButton
                                                        color="danger"
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleDelete(plot)}
                                                    >
                                                        Delete
                                                    </CButton>
                                                </CButtonGroup>
                                            </CTableDataCell>
                                        </CTableRow>
                                    ))
                                ) : (
                                    <CTableRow>
                                        <CTableDataCell colSpan="6" className="text-center">
                                            No plots found.
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