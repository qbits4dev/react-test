import React, { useState, useEffect } from 'react';
import {
    CContainer,
    CCard,
    CCardBody,
    CCardHeader,
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell,
    CSpinner,
    CButton,
    CButtonGroup,
} from '@coreui/react';

// The API endpoint to fetch targets from
const API_URL = 'https://api.qbits4dev.com/targets/';

export default function TargetsList() {
    const [targets, setTargets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch data when the component is first rendered
    useEffect(() => {
        async function fetchTargets() {
            setLoading(true);
            try {
                const response = await fetch(API_URL);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                // Assuming the API returns an array of targets
                setTargets(Array.isArray(data) ? data : []);
            } catch (err) {
                setError('Failed to fetch targets. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchTargets();
    }, []);

    // Placeholder functions for actions
    const handleEdit = (target) => {
        alert(`Editing Target ID: ${target.id}`);
        // Future logic for editing would go here
    };

    const handleDelete = (target) => {
        alert(`Deleting Target ID: ${target.id}`);
        // Future logic for deletion would go here
    };

    // Helper function to render the main content
    const renderContent = () => {
        if (loading) {
            return (
                <div className="text-center py-5">
                    <CSpinner />
                    <p className="mt-2">Loading Targets...</p>
                </div>
            );
        }

        if (error) {
            return <div className="text-danger text-center py-5">{error}</div>;
        }

        if (targets.length === 0) {
            return (
                <div className="text-center py-5">
                    <p>No targets found. Add a new target to see it here.</p>
                </div>
            );
        }

        return (
            <CTable hover responsive align="middle">
                <CTableHead color="light">
                    <CTableRow>
                        <CTableHeaderCell style={{ fontWeight: 'bold' }}>ID</CTableHeaderCell>
                        <CTableHeaderCell style={{ fontWeight: 'bold' }}>Role ID</CTableHeaderCell>
                        <CTableHeaderCell style={{ fontWeight: 'bold' }}>Description</CTableHeaderCell>
                        <CTableHeaderCell style={{ fontWeight: 'bold' }}>Value</CTableHeaderCell>
                        <CTableHeaderCell className="text-center" style={{ fontWeight: 'bold' }}>
                            Actions
                        </CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {targets.map((target) => (
                        <CTableRow key={target.id}>
                            <CTableDataCell>
                                <strong>{target.id}</strong>
                            </CTableDataCell>
                            <CTableDataCell>{target.role_id}</CTableDataCell>
                            <CTableDataCell>{target.description}</CTableDataCell>
                            <CTableDataCell>{target.value}</CTableDataCell>
                            <CTableDataCell className="text-center">
                                <CButtonGroup>
                                    <CButton color="info" variant="outline" size="sm" onClick={() => handleEdit(target)}>
                                        Edit
                                    </CButton>
                                    <CButton
                                        color="danger"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDelete(target)}
                                    >
                                        Delete
                                    </CButton>
                                </CButtonGroup>
                            </CTableDataCell>
                        </CTableRow>
                    ))}
                </CTableBody>
            </CTable>
        );
    };

    return (
        <CContainer className="my-4">
            <CCard className="shadow-sm">
                <CCardHeader>
                    <h4 className="mb-0">View Targets</h4>
                </CCardHeader>
                <CCardBody>{renderContent()}</CCardBody>
            </CCard>
        </CContainer>
    );
}