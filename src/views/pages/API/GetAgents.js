import React, { useState, useMemo, useEffect } from 'react'
import {
    CAvatar,
    CCard,
    CCardHeader,
    CCardBody,
    CCardFooter,
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell,
    CButton,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CFormInput,
    CRow,
    CCol,
    CInputGroup,
    CInputGroupText,
    CFormSelect,
    CDropdown,
    CDropdownToggle,
    CDropdownMenu,
    CDropdownItem,
    CPagination,
    CPaginationItem,
    CSpinner,
    CAlert,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
    cilPencil,
    cilUserPlus,
    cilTrash,
    cilOptions,
    cilSearch,
    cilSortAlphaDown,
    cilSortAlphaUp,
} from '@coreui/icons'
import { useNavigate } from 'react-router-dom'

// Helper function
const formatLabel = (key) => {
    const result = key.replace(/([A-Z])/g, ' $1')
    return result.charAt(0).toUpperCase() + result.slice(1)
}

export default function AgentTable() {
    const navigate = useNavigate()

    // --- Agent Data ---
    const [agents, setAgents] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // --- State ---
    const [editModalVisible, setEditModalVisible] = useState(false)
    const [deleteModalVisible, setDeleteModalVisible] = useState(false)
    const [selectedAgent, setSelectedAgent] = useState(null)
    const [agentToDelete, setAgentToDelete] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [teamFilter, setTeamFilter] = useState('')
    const [sortConfig, setSortConfig] = useState({ key: 'firstName', direction: 'ascending' })
    const [currentPage, setCurrentPage] = useState(1)
    const [isSaving, setIsSaving] = useState(false)
    const itemsPerPage = 5

    const personalFields = ['firstName', 'lastName', 'fatherName', 'dob', 'gender', 'maritalStatus']
    const contactFields = ['email', 'phone', 'permanentAddress', 'presentAddress']
    const professionalFields = [
        'agentId',
        'occupation',
        'education',
        'designation',
        'agentTeam',
        'workLocation',
    ]
    const bankFields = ['bankName', 'branch', 'accountNumber', 'ifscCode']
    const nomineeFields = ['nomineeName', 'nomineeRelation', 'nomineeMobile']

    const gradientHeaderStyle = {
        background: 'linear-gradient(45deg, #2c3e50, #3498db)',
        color: 'white',
    }

    // --- Fetch Agents from API ---
    useEffect(() => {
        const fetchAgents = async () => {
            try {
                setLoading(true)
                setError(null)

                // Step 1: Fetch all user IDs
                const usersResponse = await fetch(`${globalThis.apiBaseUrl}/users/`)
                if (!usersResponse.ok) {
                    throw new Error('Failed to fetch user list')
                }
                const usersData = await usersResponse.json()
                console.log('All users:', usersData)

                // Step 2: Filter only agent IDs (starting with 'ag')
                const agentIds = usersData
                    .filter(user => user.u_id && user.u_id.toLowerCase().startsWith('ag'))
                    .map(user => user.u_id)

                console.log('Agent IDs:', agentIds)

                if (agentIds.length === 0) {
                    console.log('No agents found')
                    setAgents([])
                    setLoading(false)
                    return
                }

                // Step 3: Fetch detailed data for each agent using Promise.allSettled
                const agentPromises = agentIds.map(async (agentId) => {
                    try {
                        const response = await fetch(`${globalThis.apiBaseUrl}/users/${agentId}`)
                        if (!response.ok) {
                            console.error(`Failed to fetch agent ${agentId}: ${response.status}`)
                            return null
                        }
                        const data = await response.json()
                        console.log(`Successfully fetched agent ${agentId}`)
                        return data
                    } catch (error) {
                        console.error(`Error fetching agent ${agentId}:`, error)
                        return null
                    }
                })

                // Wait for all agent data fetches (successful or failed)
                const agentsResults = await Promise.allSettled(agentPromises)
                
                console.log('All fetch results:', agentsResults)

                // Step 4: Extract successful results and filter out failed/null ones
                const successfulAgents = agentsResults
                    .filter(result => result.status === 'fulfilled' && result.value !== null)
                    .map(result => result.value)

                console.log('Successfully fetched agents:', successfulAgents)

                // Log failed fetches
                const failedCount = agentsResults.filter(
                    result => result.status === 'rejected' || 
                    (result.status === 'fulfilled' && result.value === null)
                ).length
                
                if (failedCount > 0) {
                    console.warn(`Failed to fetch ${failedCount} out of ${agentIds.length} agent(s)`)
                }

                // Step 5: Transform data to match component structure
                const transformedAgents = successfulAgents.map((agent, index) => ({
                    id: index + 1,
                    agentId: agent.u_id || '',
                    firstName: agent.first_name || '',
                    lastName: agent.last_name || '',
                    avatar: '', // No avatar from API, use default
                    fatherName: agent.father_name || '',
                    maritalStatus: agent.marital_status ? 
                        agent.marital_status.charAt(0).toUpperCase() + agent.marital_status.slice(1) : '',
                    dob: agent.dob || '',
                    gender: agent.gender ? 
                        agent.gender.charAt(0).toUpperCase() + agent.gender.slice(1) : '',
                    email: agent.email || '',
                    phone: agent.mobile || '',
                    occupation: agent.occupation || '',
                    education: agent.education || '',
                    designation: agent.designation || '',
                    referenceAgent: agent.reference_agent || '',
                    agentTeam: agent.agent_team || '',
                    workLocation: agent.work_location || '',
                    bankName: agent.bank_name || '',
                    branch: agent.branch || '',
                    accountNumber: agent.account_number || '',
                    ifscCode: agent.ifsc_code || '',
                    nomineeName: agent.nominiee || '',
                    nomineeRelation: agent.relationship || '',
                    nomineeMobile: agent.nominee_mobile || '',
                    permanentAddress: agent.address || '',
                    presentAddress: agent.address || '',
                    workExperience: agent.work_experience || '',
                    income: agent.income || '',
                }))

                console.log('Transformed agents:', transformedAgents)
                console.log(`Total agents loaded: ${transformedAgents.length} out of ${agentIds.length}`)
                
                setAgents(transformedAgents)
            } catch (err) {
                console.error('Error fetching agents:', err)
                setError(err.message || 'Failed to load agents')
            } finally {
                setLoading(false)
            }
        }

        fetchAgents()
    }, [])

    // --- Filtering + Sorting ---
    const processedAgents = useMemo(() => {
        let filtered = [...agents]

        if (searchTerm) {
            filtered = filtered.filter(
                (agent) =>
                    `${agent.firstName} ${agent.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    agent.agentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    agent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    agent.designation.toLowerCase().includes(searchTerm.toLowerCase()),
            )
        }

        if (teamFilter) {
            filtered = filtered.filter((agent) => agent.agentTeam === teamFilter)
        }

        if (sortConfig.key) {
            filtered.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key])
                    return sortConfig.direction === 'ascending' ? -1 : 1
                if (a[sortConfig.key] > b[sortConfig.key])
                    return sortConfig.direction === 'ascending' ? 1 : -1
                return 0
            })
        }

        return filtered
    }, [agents, searchTerm, teamFilter, sortConfig])

    // --- Pagination ---
    const paginatedAgents = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage
        return processedAgents.slice(startIndex, startIndex + itemsPerPage)
    }, [processedAgents, currentPage])

    const pageCount = Math.ceil(processedAgents.length / itemsPerPage)

    // --- Handlers ---
    const requestSort = (key) => {
        let direction = 'ascending'
        if (sortConfig.key === key && sortConfig.direction === 'ascending') direction = 'descending'
        setSortConfig({ key, direction })
    }

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return null
        return sortConfig.direction === 'ascending' ? (
            <CIcon icon={cilSortAlphaDown} />
        ) : (
            <CIcon icon={cilSortAlphaUp} />
        )
    }

    const handleEdit = (agent) => {
        setSelectedAgent({ ...agent })
        setEditModalVisible(true)
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setSelectedAgent({ ...selectedAgent, [name]: value })
    }

    const handleSave = async () => {
        if (!selectedAgent) return;

        try {
            setIsSaving(true);

            // Transform data back to API format (camelCase to snake_case)
            const updateData = {
                first_name: selectedAgent.firstName,
                last_name: selectedAgent.lastName,
                email: selectedAgent.email.toLowerCase(),
                mobile: selectedAgent.phone,
                dob: selectedAgent.dob,
                gender: selectedAgent.gender.toLowerCase(),
                father_name: selectedAgent.fatherName,
                marital_status: selectedAgent.maritalStatus.toLowerCase(),
                education: selectedAgent.education,
                occupation: selectedAgent.occupation,
                work_experience: selectedAgent.workExperience,
                designation: selectedAgent.designation,
                reference_agent: selectedAgent.referenceAgent,
                agent_team: selectedAgent.agentTeam,
                work_location: selectedAgent.workLocation,
                bank_name: selectedAgent.bankName,
                branch: selectedAgent.branch,
                account_number: selectedAgent.accountNumber,
                ifsc_code: selectedAgent.ifscCode,
                nominiee: selectedAgent.nomineeName,
                relationship: selectedAgent.nomineeRelation,
                nominee_mobile: selectedAgent.nomineeMobile,
                address: selectedAgent.presentAddress,
                income: selectedAgent.income ? parseInt(selectedAgent.income) : null,
            };

            console.log('Updating agent:', selectedAgent.agentId);
            console.log('Update data:', updateData);

            // Make PATCH request
            const response = await fetch(`${globalThis.apiBaseUrl}/users/${selectedAgent.agentId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Update failed:', errorData);
                throw new Error(errorData.message || errorData.detail || `Failed to update agent: ${response.status}`);
            }

            const result = await response.json();
            console.log('Update successful:', result);

            // Update local state
            setAgents((prev) => prev.map((a) => (a.id === selectedAgent.id ? selectedAgent : a)));
            
            setEditModalVisible(false);
            setSelectedAgent(null);

            // Show success message
            alert('Agent updated successfully!');
        } catch (error) {
            console.error('Error updating agent:', error);
            alert(`Failed to update agent: ${error.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = (agent) => {
        setAgentToDelete(agent)
        setDeleteModalVisible(true)
    }

    const confirmDelete = async () => {
        if (agentToDelete) {
            try {
                // Make DELETE request
                const response = await fetch(`${globalThis.apiBaseUrl}/users/${agentToDelete.agentId}`, {
                    method: 'DELETE'
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `Failed to delete agent: ${response.status}`);
                }

                console.log('Agent deleted successfully:', agentToDelete.agentId);

                // Update local state
                setAgents(agents.filter((a) => a.id !== agentToDelete.id));
                setDeleteModalVisible(false);
                setAgentToDelete(null);

                alert('Agent deleted successfully!');
            } catch (error) {
                console.error('Error deleting agent:', error);
                alert(`Failed to delete agent: ${error.message}`);
            }
        }
    }

    // --- Group by Team ---
    const groupedAgents = useMemo(() => {
        const groups = {}
        paginatedAgents.forEach((agent) => {
            const team = agent.agentTeam || 'Unassigned'
            if (!groups[team]) groups[team] = []
            groups[team].push(agent)
        })
        return groups
    }, [paginatedAgents])

    // --- Loading and Error States ---
    if (loading) {
        return (
            <CCard className="shadow border-0">
                <CCardBody className="text-center py-5">
                    <CSpinner color="primary" />
                    <p className="mt-3 text-muted">Loading agents...</p>
                </CCardBody>
            </CCard>
        )
    }

    if (error) {
        return (
            <CCard className="shadow border-0">
                <CCardBody>
                    <CAlert color="danger">
                        <h4>Error Loading Agents</h4>
                        <p>{error}</p>
                        <CButton color="primary" onClick={() => window.location.reload()}>
                            Retry
                        </CButton>
                    </CAlert>
                </CCardBody>
            </CCard>
        )
    }

    return (
        <>
            <CCard className="shadow border-0">
                <CCardHeader
                    className="d-flex flex-column flex-md-row justify-content-between align-items-center p-3"
                    style={gradientHeaderStyle}
                >
                    <h3 className="mb-2 mb-md-0 fw-bold">Agent Management</h3>
                    <div className="d-flex flex-column flex-md-row w-100 w-md-auto mt-2 mt-md-0">
                        {/* Search */}
                        <CInputGroup className="mb-2 mb-md-0 me-md-2">
                            <CInputGroupText>
                                <CIcon icon={cilSearch} />
                            </CInputGroupText>
                            <CFormInput
                                placeholder="Search agents..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value)
                                    setCurrentPage(1)
                                }}
                            />
                        </CInputGroup>

                        {/* Team Filter */}
                        <CInputGroup className="mb-2 mb-md-0 me-md-2">
                            <CInputGroupText>Team</CInputGroupText>
                            <CFormSelect
                                value={teamFilter}
                                onChange={(e) => {
                                    setTeamFilter(e.target.value)
                                    setCurrentPage(1)
                                }}
                            >
                                <option value="">All Teams</option>
                                {Array.from(new Set(agents.map((a) => a.agentTeam).filter(Boolean))).map((team) => (
                                    <option key={team} value={team}>
                                        {team}
                                    </option>
                                ))}
                            </CFormSelect>
                        </CInputGroup>

                        {/* Add Agent */}
                        <CButton
                            color="light"
                            variant="outline"
                            onClick={() => navigate('/register_agent')}
                            className="w-100 w-md-auto"
                        >
                            <CIcon icon={cilUserPlus} className="me-2" /> Add Agent
                        </CButton>
                    </div>
                </CCardHeader>

                <CCardBody style={{ overflowX: 'auto' }}>
                    {agents.length === 0 ? (
                        <div className="text-center py-5">
                            <p className="text-muted">No agents found. Click "Add Agent" to register a new agent.</p>
                        </div>
                    ) : (
                        <CTable hover responsive align="middle" className="mb-0">
                            <CTableHead color="light">
                                <CTableRow>
                                    <CTableHeaderCell
                                        scope="col"
                                        onClick={() => requestSort('firstName')}
                                        className="cursor-pointer"
                                    >
                                        Agent {getSortIcon('firstName')}
                                    </CTableHeaderCell>
                                    <CTableHeaderCell
                                        scope="col"
                                        onClick={() => requestSort('agentId')}
                                        className="cursor-pointer"
                                    >
                                        Agent ID {getSortIcon('agentId')}
                                    </CTableHeaderCell>
                                    <CTableHeaderCell
                                        scope="col"
                                        onClick={() => requestSort('designation')}
                                        className="cursor-pointer"
                                    >
                                        Designation {getSortIcon('designation')}
                                    </CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Contact</CTableHeaderCell>
                                    <CTableHeaderCell
                                        scope="col"
                                        onClick={() => requestSort('workLocation')}
                                        className="cursor-pointer"
                                    >
                                        Location {getSortIcon('workLocation')}
                                    </CTableHeaderCell>
                                    <CTableHeaderCell
                                        scope="col"
                                        onClick={() => requestSort('agentTeam')}
                                        className="cursor-pointer"
                                    >
                                        Team {getSortIcon('agentTeam')}
                                    </CTableHeaderCell>
                                    <CTableHeaderCell scope="col" className="text-center">
                                        Actions
                                    </CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>

                            <CTableBody>
                                {Object.entries(groupedAgents).map(([team, members]) => (
                                    <React.Fragment key={team}>
                                        <CTableRow className="bg-light fw-bold">
                                            <CTableDataCell colSpan={7}>
                                                {team} — Total Members: {members.length}
                                            </CTableDataCell>
                                        </CTableRow>

                                        {members.map((agent) => (
                                            <CTableRow key={agent.id}>
                                                <CTableDataCell>
                                                    <div className="d-flex align-items-center">
                                                        <CAvatar 
                                                            size="md" 
                                                            color="primary" 
                                                            textColor="white"
                                                            className="me-3"
                                                        >
                                                            {agent.firstName.charAt(0)}{agent.lastName.charAt(0)}
                                                        </CAvatar>
                                                        <div>
                                                            <div className="fw-bold">{`${agent.firstName} ${agent.lastName}`}</div>
                                                            <div className="text-medium-emphasis small">{agent.email}</div>
                                                        </div>
                                                    </div>
                                                </CTableDataCell>
                                                <CTableDataCell>{agent.agentId}</CTableDataCell>
                                                <CTableDataCell>{agent.designation}</CTableDataCell>
                                                <CTableDataCell>{agent.phone}</CTableDataCell>
                                                <CTableDataCell>{agent.workLocation}</CTableDataCell>
                                                <CTableDataCell>{agent.agentTeam}</CTableDataCell>
                                                <CTableDataCell className="text-center">
                                                    <CDropdown variant="btn-group">
                                                        <CDropdownToggle color="transparent" className="p-0" caret={false}>
                                                            <CIcon icon={cilOptions} />
                                                        </CDropdownToggle>
                                                        <CDropdownMenu>
                                                            <CDropdownItem onClick={() => handleEdit(agent)}>
                                                                <CIcon icon={cilPencil} className="me-2" /> Edit
                                                            </CDropdownItem>
                                                            <CDropdownItem
                                                                onClick={() => handleDelete(agent)}
                                                                className="text-danger"
                                                            >
                                                                <CIcon icon={cilTrash} className="me-2" /> Delete
                                                            </CDropdownItem>
                                                        </CDropdownMenu>
                                                    </CDropdown>
                                                </CTableDataCell>
                                            </CTableRow>
                                        ))}
                                    </React.Fragment>
                                ))}
                            </CTableBody>
                        </CTable>
                    )}
                </CCardBody>

                {pageCount > 1 && (
                    <CCardFooter className="d-flex justify-content-end">
                        <CPagination aria-label="Page navigation">
                            <CPaginationItem
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(currentPage - 1)}
                            >
                                Previous
                            </CPaginationItem>
                            {[...Array(pageCount).keys()].map((number) => (
                                <CPaginationItem
                                    key={number + 1}
                                    active={currentPage === number + 1}
                                    onClick={() => setCurrentPage(number + 1)}
                                >
                                    {number + 1}
                                </CPaginationItem>
                            ))}
                            <CPaginationItem
                                disabled={currentPage === pageCount}
                                onClick={() => setCurrentPage(currentPage + 1)}
                            >
                                Next
                            </CPaginationItem>
                        </CPagination>
                    </CCardFooter>
                )}
            </CCard>

            {/* Edit Modal */}
            {selectedAgent && (
                <CModal
                    visible={editModalVisible}
                    onClose={() => {
                        if (!isSaving) {
                            setEditModalVisible(false)
                            setSelectedAgent(null)
                        }
                    }}
                    size="lg"
                    backdrop="static"
                >
                    <CModalHeader style={gradientHeaderStyle}>
                        <CModalTitle>
                            Edit Agent: {selectedAgent.firstName} {selectedAgent.lastName}
                        </CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        <CRow className="g-4">
                            <CCol xs={12}>
                                <h6 className="text-primary fw-semibold border-bottom pb-2 mb-3">
                                    Personal Details
                                </h6>
                                <CRow className="g-3">
                                    {personalFields.map((key) => (
                                        <CCol md={6} key={key}>
                                            <CFormInput
                                                label={formatLabel(key)}
                                                name={key}
                                                type={key === 'dob' ? 'date' : 'text'}
                                                value={selectedAgent[key]}
                                                onChange={handleChange}
                                                disabled={isSaving}
                                            />
                                        </CCol>
                                    ))}
                                </CRow>
                            </CCol>
                            <CCol xs={12}>
                                <h6 className="text-primary fw-semibold border-bottom pb-2 mb-3">
                                    Contact Details
                                </h6>
                                <CRow className="g-3">
                                    {contactFields.map((key) => (
                                        <CCol md={6} key={key}>
                                            <CFormInput
                                                label={formatLabel(key)}
                                                name={key}
                                                value={selectedAgent[key]}
                                                onChange={handleChange}
                                                disabled={isSaving}
                                            />
                                        </CCol>
                                    ))}
                                </CRow>
                            </CCol>
                            <CCol xs={12}>
                                <h6 className="text-primary fw-semibold border-bottom pb-2 mb-3">
                                    Professional Details
                                </h6>
                                <CRow className="g-3">
                                    {professionalFields.map((key) => (
                                        <CCol md={6} key={key}>
                                            <CFormInput
                                                label={formatLabel(key)}
                                                name={key}
                                                value={selectedAgent[key]}
                                                onChange={handleChange}
                                                disabled={key === 'agentId' || isSaving}
                                            />
                                        </CCol>
                                    ))}
                                </CRow>
                            </CCol>
                            <CCol xs={12}>
                                <h6 className="text-primary fw-semibold border-bottom pb-2 mb-3">
                                    Bank & Nominee Details
                                </h6>
                                <CRow className="g-3">
                                    {bankFields.map((key) => (
                                        <CCol md={6} key={key}>
                                            <CFormInput
                                                label={formatLabel(key)}
                                                name={key}
                                                value={selectedAgent[key]}
                                                onChange={handleChange}
                                                disabled={isSaving}
                                            />
                                        </CCol>
                                    ))}
                                    {nomineeFields.map((key) => (
                                        <CCol md={6} key={key}>
                                            <CFormInput
                                                label={formatLabel(key)}
                                                name={key}
                                                value={selectedAgent[key]}
                                                onChange={handleChange}
                                                disabled={isSaving}
                                            />
                                        </CCol>
                                    ))}
                                </CRow>
                            </CCol>
                        </CRow>
                    </CModalBody>
                    <CModalFooter>
                        <CButton
                            color="secondary"
                            variant="ghost"
                            onClick={() => {
                                setEditModalVisible(false)
                                setSelectedAgent(null)
                            }}
                            disabled={isSaving}
                        >
                            Cancel
                        </CButton>
                        <CButton 
                            color="primary" 
                            onClick={handleSave}
                            disabled={isSaving}
                        >
                            {isSaving ? (
                                <>
                                    <CSpinner size="sm" className="me-2" />
                                    Saving...
                                </>
                            ) : (
                                'Save Changes'
                            )}
                        </CButton>
                    </CModalFooter>
                </CModal>
            )}

            {/* Delete Modal */}
            <CModal visible={deleteModalVisible} onClose={() => setDeleteModalVisible(false)}>
                <CModalHeader>
                    <CModalTitle>Confirm Deletion</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    Are you sure you want to delete agent{' '}
                    <strong>
                        {agentToDelete ? `${agentToDelete.firstName} ${agentToDelete.lastName}` : ''}
                    </strong>
                    ? This action cannot be undone.
                </CModalBody>
                <CModalFooter>
                    <CButton
                        color="secondary"
                        variant="ghost"
                        onClick={() => setDeleteModalVisible(false)}
                    >
                        Cancel
                    </CButton>
                    <CButton color="danger" onClick={confirmDelete}>
                        Delete
                    </CButton>
                </CModalFooter>
            </CModal>
        </>
    )
}
