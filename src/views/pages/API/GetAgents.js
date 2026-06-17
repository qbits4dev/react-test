import React, { useState, useMemo, useEffect } from 'react'
import {
  CAvatar,
  CAlert,
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

// Helper function to format labels
const formatLabel = (key) => {
  const result = key.replace(/([A-Z])/g, ' $1')
  return result.charAt(0).toUpperCase() + result.slice(1)
}

const GetAgents = () => {
  const navigate = useNavigate()

  // State declarations
  const [agents, setAgents] = useState([])
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState(null)
  const [agentToDelete, setAgentToDelete] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [teamFilter, setTeamFilter] = useState('')
  const [sortConfig, setSortConfig] = useState({ key: 'firstName', direction: 'ascending' })
  const [currentPage, setCurrentPage] = useState(1)
  const [designations, setDesignations] = useState([])
  const [loadingDesignations, setLoadingDesignations] = useState(true)
  const [designationError, setDesignationError] = useState('')
  const [savingAgent, setSavingAgent] = useState(false)
  const [message, setMessage] = useState({ visible: false, color: 'success', text: '' })
  const [editErrors, setEditErrors] = useState({})
  const itemsPerPage = 5

  const today = new Date()
  const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate()).toISOString().split('T')[0]
  const minDate = new Date(today.getFullYear() - 80, today.getMonth(), today.getDate()).toISOString().split('T')[0]

  // Fields groups for edit modal
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

  // Get user data from localStorage
  const userData = JSON.parse(localStorage.getItem('user') || '{}')
  const userRole = userData.role?.toLowerCase() || ''
  const userId = userData.u_id || ''
  console.log('User Role O:', userRole)
  console.log('User ID O:', userId)

  // Fetch agents conditionally based on role
  useEffect(() => {
    let isMounted = true; // To prevent setting state if component is unmounted
  
    const fetchAgentsForAdmin = async () => {
      try {
        const res = await fetch(`${globalThis.apiBaseUrl}/users/`);
        const data = await res.json();
        if (data.success && Array.isArray(data.users)) {
          const usersDetails = await Promise.all(
            data.users.map(async (uId) => {
              const userRes = await fetch(`${globalThis.apiBaseUrl}/users/${uId}`);
              return await userRes.json();
            }),
          );
          const filteredAgents = usersDetails
            .filter((u) => u.success)
            .map((u) => ({
              id: u.id,
              agentId: u.u_id || '',
              firstName: u.first_name || '',
              lastName: u.last_name || '',
              fatherName: u.father_name || '',
              maritalStatus: u.marital_status || '',
              dob: u.dob || '',
              gender: u.gender || '',
              email: u.email || '',
              phone: u.mobile || '',
              occupation: u.occupation || '',
              education: u.education || '',
              designation: u.designation || '',
              referenceAgent: u.reference_agent || '',
              agentTeam: u.agent_team || '',
              workLocation: u.work_location || '',
              bankName: u.bank_name || '',
              branch: u.branch || '',
              accountNumber: u.account_number || '',
              ifscCode: u.ifsc_code || '',
              nomineeName: u.nominiee || '',
              nomineeRelation: u.relationship || '',
              nomineeMobile: u.nominee_mobile || '',
              permanentAddress: u.address || '',
              presentAddress: u.address || '',
              avatar: null,
            }));
          if (isMounted) setAgents(filteredAgents);
        }
      } catch (error) {
        console.error('Error fetching agents for admin:', error);
      }
    };
  
    const fetchAgentTeam = async () => {

      try {
        const res = await fetch(`${globalThis.apiBaseUrl}/teams/tree/${userId}`);
        const rootData = await res.json(); // <-- This contains the full hierarchical JSON
        
        console.log('Root Data from API:', rootData); // DEBUG: See what you received
    
        // Helper recursive function to flatten the tree
        const flattenAgents = (node, agentsArr = [], parentId = null) => {
          if (!node) return agentsArr;
          
          // Add current node to the array
          agentsArr.push({
            id: Math.random().toString(36).slice(2),
            agentId: node.agent_team,
            firstName: node.first_name,
            lastName: node.last_name,
            fatherName: '',
            maritalStatus: '',
            dob: '',
            gender: '',
            email: '',
            phone: node.mobile || '',
            occupation: '',
            education: '',
            designation: node.designation,
            referenceAgent: node.reference_agent || parentId,
            agentTeam: node.agent_team,
            workLocation: node.work_location || '',
            bankName: '',
            branch: '',
            accountNumber: '',
            ifscCode: '',
            nomineeName: '',
            nomineeRelation: '',
            nomineeMobile: '',
            permanentAddress: '',
            presentAddress: '',
            avatar: null,
          });
    
          // Recursively process children
          if (Array.isArray(node.children) && node.children.length > 0) {
            node.children.forEach(child => flattenAgents(child, agentsArr, node.agent_team));
          }
          
          return agentsArr;
        };
    
        // START HERE: Pass rootData to the flattening function
        const formattedAgents = flattenAgents(rootData); // <-- rootData goes in here
        
        console.log('Flattened Agents:', formattedAgents); // DEBUG: See flattened result
        
        // UPDATE STATE: This triggers the table to re-render with the new data
        if (isMounted) setAgents(formattedAgents); // <-- This updates your UI
        
      } catch (error) {
        console.error('Error fetching agent tree:', error);
        if (isMounted) setAgents([]);
      }

      // try {
      //   const res = await fetch(`${globalThis.apiBaseUrl}/teams/${userId}`);
      //   const data = await res.json();
      //   console.log('Agent Team Data:', data);
      //   if (Array.isArray(data) && data.length > 0) {
      //     const formattedAgents = data.map((agent, index) => ({
      //       id: index, // Prefer actual agent id if available
      //       agentId: agent.u_id, // Use agent's actual id if available
      //       firstName: agent.first_name,
      //       lastName: agent.last_name,
      //       fatherName: 'no value',
      //       maritalStatus: 'no value',
      //       dob: '',
      //       gender: '',
      //       email: '',
      //       phone: agent.mobile || '',
      //       occupation: '',
      //       education: '',
      //       designation: agent.designation,
      //       referenceAgent: agent.reference_agent || '',
      //       agentTeam: agent.agent_team,
      //       workLocation: agent.work_location || '',
      //       bankName: '',
      //       branch: '',
      //       accountNumber: '',
      //       ifscCode: '',
      //       nomineeName: '',
      //       nomineeRelation: '',
      //       nomineeMobile: '',
      //       permanentAddress: '',
      //       presentAddress: '',
      //       avatar: null,
      //     }));
      //     console.log('Formatted Agents:', formattedAgents);
      //     if (isMounted) setAgents(formattedAgents);
      //   } else {
      //     if (isMounted) setAgents([]);
      //   }
      // } catch (error) {
      //   console.error('Error fetching agent team:', error);
      // }
    };
  
    if (userRole === 'admin') {
      fetchAgentsForAdmin();
    } else if (userRole === 'agent') {
      fetchAgentTeam();
    } else {
      setAgents([]);
    }
  
    // Cleanup function in case component unmounts during async calls
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    fetch(`${globalThis.apiBaseUrl}/register/?key=designation`, { headers: { accept: 'application/json' } })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.status === 'ok' && Array.isArray(data.designation)) {
          setDesignations(data.designation)
          setDesignationError('')
        } else {
          setDesignationError('No designations found')
        }
      })
      .catch(() => setDesignationError('Failed to fetch designations'))
      .finally(() => setLoadingDesignations(false))
  }, [])
  

  // Filtering, sorting logic
  const processedAgents = useMemo(() => {
    // let filtered = agents.filter((agent) => agent.gender === 'Male')
    let filtered = [...agents];

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

  const paginatedAgents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return processedAgents.slice(startIndex, startIndex + itemsPerPage)
  }, [processedAgents, currentPage])

  const pageCount = Math.ceil(processedAgents.length / itemsPerPage)

  // Group agents by team for display
  const groupedAgents = useMemo(() => {
    const groups = {}
    paginatedAgents.forEach((agent) => {
      const team = agent.agentTeam || 'No Team'
      if (!groups[team]) groups[team] = []
      groups[team].push(agent)
    })
    return groups
  }, [paginatedAgents])

  // Sorting UI handlers
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

  // Edit modal handlers
  const handleEdit = (agent) => {
    setSelectedAgent({ ...agent })
    setEditErrors({})
    setEditModalVisible(true)
  }

  // ── Field config: maxLength, input filter, validation per column name ──
  const FIELD_CONFIG = {
    firstName:       { max: 50,  filter: /[^A-Za-z ]/g,  label: 'First Name' },
    lastName:        { max: 50,  filter: /[^A-Za-z ]/g,  label: 'Last Name' },
    fatherName:      { max: 50,  filter: /[^A-Za-z ]/g,  label: "Father's Name" },
    dob:             { label: 'Date of Birth' },
    gender:          { label: 'Gender' },
    maritalStatus:   { label: 'Marital Status' },
    email:           { max: 100, filter: /[^A-Za-z0-9.@_\-+]/g, label: 'Email' },
    phone:           { max: 10,  filter: /[^0-9]/g,      label: 'Phone' },
    permanentAddress:{ max: 200, filter: /[^A-Za-z0-9 ,\-\/.#]/g, label: 'Permanent Address' },
    presentAddress:  { max: 200, filter: /[^A-Za-z0-9 ,\-\/.#]/g, label: 'Present Address' },
    agentId:         { label: 'Agent ID' },
    occupation:      { max: 80,  filter: /[^A-Za-z ,\-\/]/g,  label: 'Occupation' },
    education:       { max: 80,  filter: /[^A-Za-z0-9 ,\-\/]/g,  label: 'Education' },
    designation:     { label: 'Designation' },
    agentTeam:       { max: 30,  filter: /[^A-Za-z0-9 \-_]/g,    label: 'Agent Team' },
    workLocation:    { max: 80,  filter: /[^A-Za-z0-9 ,\-\/]/g,  label: 'Work Location' },
    bankName:        { max: 80,  filter: /[^A-Za-z0-9 ,\-\/]/g,  label: 'Bank Name' },
    branch:          { max: 80,  filter: /[^A-Za-z0-9 ,\-\/]/g,  label: 'Branch' },
    accountNumber:   { max: 18,  filter: /[^0-9]/g,      label: 'Account Number' },
    ifscCode:        { max: 11,  filter: /[^A-Z0-9]/g,   label: 'IFSC Code', upper: true },
    nomineeName:     { max: 60,  filter: /[^A-Za-z ]/g,  label: 'Nominee Name' },
    nomineeRelation: { max: 60,  filter: /[^A-Za-z ]/g,  label: 'Nominee Relation' },
    nomineeMobile:   { max: 10,  filter: /[^0-9]/g,      label: 'Nominee Mobile' },
  }

  // ── Per-field validation for edit modal ──
  const validateEditField = (name, value) => {
    const v = typeof value === 'string' ? value.trim() : (value || '')
    const cfg = FIELD_CONFIG[name] || {}
    const label = cfg.label || formatLabel(name)

    switch (name) {
      case 'firstName':
      case 'lastName':
      case 'fatherName':
        if (!v) return `${label} is required`
        if (v.length < 2) return `${label} must be at least 2 characters`
        if (v.length > 50) return `${label} must not exceed 50 characters`
        if (!/^[A-Za-z ]+$/.test(v)) return `${label} must contain only letters`
        break
      case 'email':
        if (!v) return 'Email is required'
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Enter a valid email (e.g. name@example.com)'
        if (v.length > 100) return 'Email must not exceed 100 characters'
        break
      case 'phone':
        if (!v) return 'Phone is required'
        if (!/^[6-9][0-9]{9}$/.test(v)) return 'Phone must be a valid 10-digit number starting with 6-9'
        break
      case 'dob': {
        if (!v) return 'Date of Birth is required'
        const bd = new Date(v)
        const td = new Date()
        let age = td.getFullYear() - bd.getFullYear()
        const m = td.getMonth() - bd.getMonth()
        if (m < 0 || (m === 0 && td.getDate() < bd.getDate())) age--
        if (age < 18 || age > 80) return 'Age must be between 18 and 80 years old'
        break
      }
      case 'gender':
        if (!v) return 'Gender is required'
        break
      case 'maritalStatus':
        if (!v) return 'Marital Status is required'
        break
      case 'occupation':
        if (v && v.length > 80) return 'Occupation must not exceed 80 characters'
        break
      case 'education':
        if (v && v.length > 80) return 'Education must not exceed 80 characters'
        break
      case 'designation':
        if (!v) return 'Designation is required'
        break
      case 'agentTeam':
        if (v && v.length > 30) return 'Agent Team must not exceed 30 characters'
        break
      case 'workLocation':
        if (v && v.length > 80) return 'Work Location must not exceed 80 characters'
        break
      case 'bankName':
        if (v && v.length < 2) return 'Bank Name must be at least 2 characters'
        if (v && v.length > 80) return 'Bank Name must not exceed 80 characters'
        break
      case 'branch':
        if (v && v.length > 80) return 'Branch must not exceed 80 characters'
        break
      case 'accountNumber':
        if (v && !/^[0-9]{9,18}$/.test(v)) return 'Account Number must be 9–18 digits'
        break
      case 'ifscCode':
        if (v && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(v)) return 'IFSC must be in format: ABCD0123456'
        break
      case 'nomineeName':
        if (v && v.length < 2) return 'Nominee Name must be at least 2 characters'
        if (v && v.length > 60) return 'Nominee Name must not exceed 60 characters'
        if (v && !/^[A-Za-z ]+$/.test(v)) return 'Nominee Name must contain only letters'
        break
      case 'nomineeRelation':
        if (v && v.length > 60) return 'Relation must not exceed 60 characters'
        if (v && !/^[A-Za-z ]+$/.test(v)) return 'Relation must contain only letters'
        break
      case 'nomineeMobile':
        if (v && !/^[6-9][0-9]{9}$/.test(v)) return 'Nominee Mobile must be a valid 10-digit number starting with 6-9'
        break
      case 'permanentAddress':
      case 'presentAddress':
        if (v && v.length > 200) return `${label} must not exceed 200 characters`
        break
      default:
        return ''
    }
    return ''
  }

  // Sanitized change handler for edit modal
  const handleChange = (e) => {
    const { name } = e.target
    let value = e.target.value
    const cfg = FIELD_CONFIG[name]

    if (cfg) {
      if (cfg.upper) value = value.toUpperCase()
      if (cfg.filter) value = value.replace(cfg.filter, '')
      if (cfg.max) value = value.slice(0, cfg.max)
    }

    setSelectedAgent({ ...selectedAgent, [name]: value })
    // Run real-time validation on change
    const err = validateEditField(name, value)
    setEditErrors(prev => ({ ...prev, [name]: err }))
  }

  // Validate on blur
  const handleEditBlur = (e) => {
    const { name, value } = e.target
    const err = validateEditField(name, value)
    if (err) setEditErrors(prev => ({ ...prev, [name]: err }))
  }

  const renderEditError = (field) => editErrors[field] && (
    <small className="text-danger d-block mt-1">{editErrors[field]}</small>
  )

  // Validate all edit fields before save
  const validateEditAll = () => {
    const allFields = [...personalFields, ...contactFields, ...professionalFields, ...bankFields, ...nomineeFields]
    const newErrors = {}
    allFields.forEach(f => {
      if (f === 'agentId') return // read-only
      const err = validateEditField(f, selectedAgent[f])
      if (err) newErrors[f] = err
    })
    setEditErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const buildAgentPayload = (agent) => ({
    first_name: agent.firstName || '',
    last_name: agent.lastName || '',
    father_name: agent.fatherName || '',
    dob: agent.dob || '',
    gender: agent.gender || '',
    marital_status: agent.maritalStatus || '',
    email: agent.email || '',
    mobile: agent.phone || '',
    occupation: agent.occupation || '',
    education: agent.education || '',
    designation: agent.designation || '',
    reference_agent: agent.referenceAgent || '',
    agent_team: agent.agentTeam || '',
    work_location: agent.workLocation || '',
    bank_name: agent.bankName || '',
    branch: agent.branch || '',
    account_number: agent.accountNumber || '',
    ifsc_code: agent.ifscCode || '',
    nominiee: agent.nomineeName || '',
    relationship: agent.nomineeRelation || '',
    nominee_mobile: agent.nomineeMobile || '',
    address: agent.permanentAddress || agent.presentAddress || '',
  })

  const handleSave = async () => {
    if (!selectedAgent) return

    console.log('handleSave initiated with selectedAgent:', selectedAgent)

    // Validate before saving
    const isValid = validateEditAll()
    console.log('validateEditAll result:', isValid, editErrors)
    if (!isValid) {
      setMessage({ visible: true, color: 'danger', text: 'Please fix the validation errors before saving.' })
      return
    }

    setSavingAgent(true)
    const payload = buildAgentPayload(selectedAgent)
    console.log('Saving agent payload:', payload)

    try {
      const uId = selectedAgent.agentId
      const url = `${globalThis.apiBaseUrl}/users/${uId}`
      console.log('Hitting PATCH API:', url)
      const res = await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      console.log('API Response status:', res.status)
      if (!res.ok) throw new Error('update failed')
      const updatedFromApi = await res.json().catch(() => null)
      console.log('API Response JSON:', updatedFromApi)

      setAgents((prev) => prev.map((a) => (a.id === selectedAgent.id ? selectedAgent : a)))
      setMessage({ visible: true, color: 'success', text: 'Agent updated successfully.' })
      setEditModalVisible(false)
      setSelectedAgent(updatedFromApi ? { ...selectedAgent } : null)
    } catch (error) {
      setMessage({ visible: true, color: 'danger', text: 'Failed to update agent. Please try again.' })
    } finally {
      setSavingAgent(false)
      setSelectedAgent(null)
    }
  }

  // Delete modal handlers
  const handleDelete = (agent) => {
    setAgentToDelete(agent)
    setDeleteModalVisible(true)
  }
  const confirmDelete = async () => {
    if (!agentToDelete) return
    console.log('confirmDelete initiated for agent:', agentToDelete)
    try {
      const url = `${globalThis.apiBaseUrl}/users/${agentToDelete.agentId}`
      console.log('Hitting DELETE API:', url)
      const res = await fetch(url, { method: 'DELETE' })
      console.log('DELETE API response status:', res.status)
      if (!res.ok) throw new Error('delete failed')
      setMessage({ visible: true, color: 'success', text: 'Agent deleted successfully.' })
    } catch (error) {
      console.error('Failed to delete agent:', error)
      setMessage({ visible: true, color: 'warning', text: 'Deleted locally. Server delete is unavailable.' })
    } finally {
      setAgents((prev) => prev.filter((a) => a.id !== agentToDelete.id))
      setDeleteModalVisible(false)
      setAgentToDelete(null)
    }
  }

  return (
    <>
      <CCard className="shadow border-0">
        {message.visible && (
          <CAlert
            color={message.color}
            dismissible
            className="m-3 mb-0"
            onClose={() => setMessage((prev) => ({ ...prev, visible: false }))}
          >
            {message.text}
          </CAlert>
        )}
        <CCardHeader style={gradientHeaderStyle} className="text-white p-3">
          <div className="text-center mb-4">
            <h3 className="fw-bold mb-0">Agent Management</h3>
          </div>

          <div
            className="d-flex flex-column flex-md-row align-items-stretch align-items-md-center justify-content-md-between w-100 gap-2 gap-md-0"
          >
            <div className="w-100 w-md-auto ps-md-3">
              <CInputGroup style={{ maxWidth: '450px' }} className="mx-auto mx-md-0">
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
            </div>

            <div className="w-100 w-md-auto px-md-2">
              <CInputGroup style={{ maxWidth: '400px' }} className="mx-auto">
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
            </div>

            <div className="w-100 w-md-auto pe-md-3 d-flex justify-content-md-end">
              <CButton
                color="light"
                variant="outline"
                onClick={() => navigate('/register_agent')}
                size="sm"
                className="px-3 py-2 w-100 w-md-auto mx-auto"
              >
                <CIcon icon={cilUserPlus} className="me-2" /> Add Agent
              </CButton>
            </div>
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
                            {userRole === 'admin' ? (
                              <>
                                <CDropdownItem onClick={() => handleEdit(agent)}>
                                  <CIcon icon={cilPencil} className="me-2" /> Edit
                                </CDropdownItem>
                                <CDropdownItem
                                  onClick={() => handleDelete(agent)}
                                  className="text-danger"
                                >
                                  <CIcon icon={cilTrash} className="me-2" /> Delete
                                </CDropdownItem>
                              </>
                            ) : (
                              <CDropdownItem disabled>No Actions Available</CDropdownItem>
                            )}
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

      {/* Edit Modal */}
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
                      {key === 'gender' ? (
                        <>
                          <CFormSelect
                            label={formatLabel(key)}
                            name={key}
                            value={selectedAgent[key]}
                            onChange={handleChange}
                            onBlur={handleEditBlur}
                            invalid={!!editErrors[key]}
                          >
                            <option value="">Select</option>
                            <option>Male</option>
                            <option>Female</option>
                          </CFormSelect>
                          {renderEditError(key)}
                        </>
                      ) : key === 'maritalStatus' ? (
                        <>
                          <CFormSelect
                            label={formatLabel(key)}
                            name={key}
                            value={selectedAgent[key]}
                            onChange={handleChange}
                            onBlur={handleEditBlur}
                            invalid={!!editErrors[key]}
                          >
                            <option value="">Select</option>
                            <option>Single</option>
                            <option>Married</option>
                          </CFormSelect>
                          {renderEditError(key)}
                        </>
                      ) : key === 'dob' ? (
                        <>
                          <CFormInput
                            type="date"
                            label={formatLabel(key)}
                            name={key}
                            value={selectedAgent[key]}
                            onChange={handleChange}
                            onBlur={handleEditBlur}
                            invalid={!!editErrors[key]}
                            min={minDate}
                            max={maxDate}
                          />
                          {renderEditError(key)}
                        </>
                      ) : (
                        <>
                          <CFormInput
                            label={formatLabel(key)}
                            name={key}
                            value={selectedAgent[key]}
                            onChange={handleChange}
                            onBlur={handleEditBlur}
                            maxLength={FIELD_CONFIG[key]?.max}
                            invalid={!!editErrors[key]}
                          />
                          {renderEditError(key)}
                        </>
                      )}
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
                        onBlur={handleEditBlur}
                        maxLength={FIELD_CONFIG[key]?.max}
                        type={key === 'email' ? 'email' : 'text'}
                        invalid={!!editErrors[key]}
                      />
                      {renderEditError(key)}
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
                      {key === 'designation' ? (
                        <>
                          <CFormSelect
                            label={formatLabel(key)}
                            name={key}
                            value={selectedAgent[key] || ''}
                            onChange={handleChange}
                            onBlur={handleEditBlur}
                            disabled={loadingDesignations}
                            invalid={!!editErrors[key]}
                          >
                            <option value="">Select Designation</option>
                            {!loadingDesignations &&
                              !designationError &&
                              designations.map((d, idx) => (
                                <option key={idx} value={d.id || d.name}>
                                  {d.name}
                                </option>
                              ))}
                          </CFormSelect>
                          {designationError && (
                            <small className="text-danger">{designationError}</small>
                          )}
                          {renderEditError(key)}
                        </>
                      ) : (
                        <>
                          <CFormInput
                            label={formatLabel(key)}
                            name={key}
                            value={selectedAgent[key]}
                            onChange={handleChange}
                            onBlur={handleEditBlur}
                            disabled={key === 'agentId'}
                            maxLength={FIELD_CONFIG[key]?.max}
                            invalid={!!editErrors[key]}
                          />
                          {renderEditError(key)}
                        </>
                      )}
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
                        onBlur={handleEditBlur}
                        maxLength={FIELD_CONFIG[key]?.max}
                        invalid={!!editErrors[key]}
                      />
                      {renderEditError(key)}
                    </CCol>
                  ))}
                  {nomineeFields.map((key) => (
                    <CCol md={6} key={key}>
                      <CFormInput
                        label={formatLabel(key)}
                        name={key}
                        value={selectedAgent[key]}
                        onChange={handleChange}
                        onBlur={handleEditBlur}
                        maxLength={FIELD_CONFIG[key]?.max}
                        invalid={!!editErrors[key]}
                      />
                      {renderEditError(key)}
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
              {savingAgent ? 'Saving...' : 'Save Changes'}
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

export default GetAgents
