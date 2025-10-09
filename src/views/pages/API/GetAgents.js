import React, { useState, useMemo } from 'react'
import {
    // 1. Import CAvatar
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

// Helper functions
const formatLabel = (key) => {
    const result = key.replace(/([A-Z])/g, ' $1')
    return result.charAt(0).toUpperCase() + result.slice(1)
}

const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase()
}

export default function AgentTable() {
    const navigate = useNavigate()

    // --- Agent Data ---
    const [agents, setAgents] = useState([
        // 2. Add 'avatar' property to each agent object
        // NOTE: These paths assume you have images in your project's `public/avatars` directory.
        {
            id: 1,
            agentId: 'AG000001',
            firstName: 'Rahul',
            lastName: 'Sharma',
            avatar: 'src/assets/images/avatars/6.jpg', // Example path
            fatherName: 'Vijay Sharma',
            maritalStatus: 'Married',
            dob: '1990-05-10',
            gender: 'Male',
            email: 'rahul.sharma@example.com',
            phone: '9876543210',
            occupation: 'Sales',
            education: 'MBA',
            designation: 'Senior Agent',
            referenceAgent: 'Amit Verma',
            agentTeam: 'Alpha',
            workLocation: 'Delhi',
            bankName: 'HDFC Bank',
            branch: 'Connaught Place',
            accountNumber: '123456789012',
            ifscCode: 'HDFC0000123',
            nomineeName: 'Neha Sharma',
            nomineeRelation: 'Wife',
            nomineeMobile: '9123456780',
            permanentAddress: 'Delhi, India',
            presentAddress: 'Delhi, India',
        },
        {
            id: 2,
            agentId: 'AG000002',
            firstName: 'Vikram',
            lastName: 'Singh',
            avatar: 'src/assets/images/avatars/2.jpg',
            fatherName: 'Raj Singh',
            maritalStatus: 'Single',
            dob: '1995-02-20',
            gender: 'Male',
            email: 'vikram.singh@example.com',
            phone: '9123456789',
            occupation: 'Marketing',
            education: 'BBA',
            designation: 'Agent',
            referenceAgent: 'Rahul Sharma',
            agentTeam: 'Beta',
            workLocation: 'Mumbai',
            bankName: 'ICICI Bank',
            branch: 'Andheri',
            accountNumber: '987654321098',
            ifscCode: 'ICIC0000456',
            nomineeName: 'Rita Singh',
            nomineeRelation: 'Mother',
            nomineeMobile: '9876501234',
            permanentAddress: 'Jaipur, India',
            presentAddress: 'Mumbai, India',
        },
        {
            id: 3,
            agentId: 'AG000003',
            firstName: 'Amit',
            lastName: 'Verma',
            avatar: 'src/assets/images/avatars/3.jpg',
            fatherName: 'Sunil Verma',
            maritalStatus: 'Married',
            dob: '1988-08-15',
            gender: 'Male',
            email: 'amit.verma@example.com',
            phone: '9876501234',
            occupation: 'Sales',
            education: 'MBA',
            designation: 'Team Lead',
            referenceAgent: 'None',
            agentTeam: 'Alpha',
            workLocation: 'Delhi',
            bankName: 'SBI',
            branch: 'Connaught Place',
            accountNumber: '111122223333',
            ifscCode: 'SBIN0001234',
            nomineeName: 'Anita Verma',
            nomineeRelation: 'Wife',
            nomineeMobile: '9123456789',
            permanentAddress: 'Delhi, India',
            presentAddress: 'Delhi, India',
        },
        {
            id: 4,
            agentId: 'AG000004',
            firstName: 'Suresh',
            lastName: 'Reddy',
            avatar: 'src/assets/images/avatars/9.jpg',
            fatherName: 'Ramesh Reddy',
            maritalStatus: 'Single',
            dob: '1992-11-12',
            gender: 'Male',
            email: 'suresh.reddy@example.com',
            phone: '9123498765',
            occupation: 'Marketing',
            education: 'B.Tech',
            designation: 'Agent',
            referenceAgent: 'Amit Verma',
            agentTeam: 'Gamma',
            workLocation: 'Hyderabad',
            bankName: 'HDFC Bank',
            branch: 'Bandra',
            accountNumber: '222233334444',
            ifscCode: 'HDFC0000456',
            nomineeName: 'Sunita Reddy',
            nomineeRelation: 'Mother',
            nomineeMobile: '9876504321',
            permanentAddress: 'Hyderabad, India',
            presentAddress: 'Hyderabad, India',
        },
        {
            id: 5,
            agentId: 'AG000005',
            firstName: 'Anil',
            lastName: 'Kumar',
            avatar: 'src/assets/images/avatars/10..jpg',
            fatherName: 'Sanjay Kumar',
            maritalStatus: 'Married',
            dob: '1985-01-25',
            gender: 'Male',
            email: 'anil.kumar@example.com',
            phone: '9988776655',
            occupation: 'Finance',
            education: 'M.Com',
            designation: 'Senior Agent',
            referenceAgent: 'Amit Verma',
            agentTeam: 'Delta',
            workLocation: 'Bangalore',
            bankName: 'Axis Bank',
            branch: 'Koramangala',
            accountNumber: '555566667777',
            ifscCode: 'UTIB0000123',
            nomineeName: 'Sunitha Kumar',
            nomineeRelation: 'Wife',
            nomineeMobile: '9988776650',
            permanentAddress: 'Bangalore, India',
            presentAddress: 'Bangalore, India',
        },
    ])

    // --- State ---
    const [editModalVisible, setEditModalVisible] = useState(false)
    const [deleteModalVisible, setDeleteModalVisible] = useState(false)
    const [selectedAgent, setSelectedAgent] = useState(null)
    const [agentToDelete, setAgentToDelete] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [teamFilter, setTeamFilter] = useState('')
    const [sortConfig, setSortConfig] = useState({ key: 'firstName', direction: 'ascending' })
    const [currentPage, setCurrentPage] = useState(1)
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

    // --- Filtering + Sorting ---
    const processedAgents = useMemo(() => {
        let filtered = agents.filter((agent) => agent.gender === 'Male')

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

    const handleSave = () => {
        if (selectedAgent) {
            setAgents((prev) => prev.map((a) => (a.id === selectedAgent.id ? selectedAgent : a)))
            setEditModalVisible(false)
            setSelectedAgent(null)
        }
    }

    const handleDelete = (agent) => {
        setAgentToDelete(agent)
        setDeleteModalVisible(true)
    }

    const confirmDelete = () => {
        if (agentToDelete) {
            setAgents(agents.filter((a) => a.id !== agentToDelete.id))
            setDeleteModalVisible(false)
            setAgentToDelete(null)
        }
    }

    // --- Group by Team ---
    const groupedAgents = useMemo(() => {
        const groups = {}
        paginatedAgents.forEach((agent) => {
            const team = agent.agentTeam
            if (!groups[team]) groups[team] = []
            groups[team].push(agent)
        })
        return groups
    }, [paginatedAgents])

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
                                {Array.from(new Set(agents.map((a) => a.agentTeam))).map((team) => (
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
                                                    {/* 3. Replace the initials div with the CAvatar component */}
                                                    <CAvatar size="md" src={agent.avatar} className="me-3" />
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

            {/* Edit Modal (remains unchanged) */}
            {selectedAgent && (
                <CModal
                    visible={editModalVisible}
                    onClose={() => setEditModalVisible(false)}
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
                                                value={selectedAgent[key]}
                                                onChange={handleChange}
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
                                                disabled={key === 'agentId'}
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
                            onClick={() => setEditModalVisible(false)}
                        >
                            Cancel
                        </CButton>
                        <CButton color="primary" onClick={handleSave}>
                            Save Changes
                        </CButton>
                    </CModalFooter>
                </CModal>
            )}

            {/* Delete Modal (remains unchanged) */}
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