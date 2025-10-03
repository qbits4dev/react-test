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

export default function AgentData() {
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchAgents() {
            setLoading(true);
            try {
                // NOTE: Replace this URL with your actual API endpoint for fetching agents
                const res = await fetch('https://api.qbits4dev.com/agents');
                if (!res.ok) throw new Error('Failed to fetch agents');

                const data = await res.json();

                // This robustly handles different API response structures
                setAgents(Array.isArray(data) ? data : (data.agents || []));
                setError('');

            } catch (err) {
                setError('Error fetching agent data: ' + err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchAgents();
    }, []); // Empty dependency array ensures this runs only once

    const handleViewDetails = (agent) => {
        // You can replace this alert with navigation to a detailed agent view page
        alert(`Viewing details for agent: ${agent.first_name} ${agent.last_name}`);
    };

    const getStatusColor = (status) => {
        const statusLower = status ? status.toLowerCase() : '';
        if (statusLower === 'active') return 'success';
        if (statusLower === 'inactive') return 'danger';
        if (statusLower === 'pending') return 'warning';
        return 'secondary'; // Default color
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
                                    <CTableHeaderCell style={{ fontWeight: 600 }}>Email</CTableHeaderCell>
                                    <CTableHeaderCell style={{ fontWeight: 600 }}>Phone</CTableHeaderCell>
                                    <CTableHeaderCell style={{ fontWeight: 600 }}>Designation</CTableHeaderCell>
                                    <CTableHeaderCell style={{ fontWeight: 600 }}>Status</CTableHeaderCell>
                                    <CTableHeaderCell style={{ fontWeight: 600 }}>Action</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {agents.length > 0 ? (
                                    agents.map((agent, index) => (
                                        <CTableRow key={agent.id || index} style={{ transition: '0.2s' }}>
                                            <CTableDataCell>{`${agent.first_name} ${agent.last_name}`}</CTableDataCell>
                                            <CTableDataCell>{agent.email}</CTableDataCell>
                                            <CTableDataCell>{agent.mobile}</CTableDataCell>
                                            <CTableDataCell>{agent.designation}</CTableDataCell>
                                            <CTableDataCell>
                                                <CBadge color={getStatusColor(agent.status)}>
                                                    {agent.status || 'N/A'}
                                                </CBadge>
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                <CButton
                                                    color="primary"
                                                    size="sm"
                                                    variant="outline"
                                                    style={{ borderRadius: '20px' }}
                                                    onClick={() => handleViewDetails(agent)}
                                                >
                                                    View Details
                                                </CButton>
                                            </CTableDataCell>
                                        </CTableRow>
                                    ))
                                ) : (
                                    <CTableRow>
                                        <CTableDataCell colSpan="6" className="text-center">
                                            No agents found.
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