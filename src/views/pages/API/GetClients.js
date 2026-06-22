import React, { useEffect, useMemo, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CFormInput,
  CFormSelect,
  CInputGroup,
  CInputGroupText,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CPagination,
  CPaginationItem,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilOptions, cilPencil, cilSearch, cilSortAlphaDown, cilSortAlphaUp, cilTrash } from '@coreui/icons'
import { CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle } from '@coreui/react'

const itemsPerPage = 8

const fieldLabel = (key) =>
  key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())

const isClientRole = (value) => {
  const role = String(value || '').toLowerCase()
  return role === 'customer' || role === 'client'
}

const GetClients = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const viewType = searchParams.get('type') || 'leads'

  const [clients, setClients] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState({ key: 'first_name', direction: 'ascending' })
  const [currentPage, setCurrentPage] = useState(1)

  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState({ visible: false, color: 'success', text: '' })

  const [viewModalVisible, setViewModalVisible] = useState(false)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)

  const [selectedClient, setSelectedClient] = useState(null)
  const [saving, setSaving] = useState(false)

  const [designations, setDesignations] = useState([])
  const [designationError, setDesignationError] = useState('')
  const [projects, setProjects] = useState([])
  const [plots, setPlots] = useState([])
  const [agentsAndAdmins, setAgentsAndAdmins] = useState([])

  const fetchClients = async () => {
    setLoading(true)
    try {
      let rawUsersList = []
      const urlSegment = viewType === 'leads' ? 'clients' : 'customers'
      const res = await fetch(`${globalThis.apiBaseUrl}/users/${urlSegment}`)
      if (res.ok) {
        const listData = await res.json()
        
        let userDetails = []
        if (Array.isArray(listData)) {
          if (typeof listData[0] === 'string' || typeof listData[0] === 'number') {
            userDetails = await Promise.all(
              listData.map(async (uId) => {
                const userRes = await fetch(`${globalThis.apiBaseUrl}/users/${uId}`)
                return userRes.json()
              })
            )
          } else {
            userDetails = listData
          }
        } else if (listData && typeof listData === 'object') {
          const usersArray = listData.users || listData.clients || listData.customers || listData.data || []
          if (Array.isArray(usersArray)) {
            if (typeof usersArray[0] === 'string' || typeof usersArray[0] === 'number') {
              userDetails = await Promise.all(
                usersArray.map(async (uId) => {
                  const userRes = await fetch(`${globalThis.apiBaseUrl}/users/${uId}`)
                  return userRes.json()
                })
              )
            } else {
              userDetails = usersArray
            }
          }
        }
        rawUsersList = userDetails
      }

      const normalized = rawUsersList
        .filter((u) => u && (u.success || u.u_id) && isClientRole(u.role))
        .map((u) => ({
          id: u.id,
          u_id: u.u_id,
          first_name: u.first_name || '',
          last_name: u.last_name || '',
          father_name: u.father_name || '',
          dob: u.dob || '',
          gender: u.gender || '',
          email: u.email || '',
          mobile: u.mobile || u.phone || '',
          marital_status: u.marital_status || '',
          education: u.education || '',
          language: u.language || '',
          occupation: u.occupation || '',
          work_experience: u.work_experience || '',
          income: u.income || '',
          adhar: u.adhar || '',
          pan: u.pan || '',
          designation: u.designation || '',
          reference_agent: u.reference_agent || '',
          agent_team: u.agent_team || '',
          work_location: u.work_location || '',
          bank_name: u.bank_name || '',
          branch: u.branch || '',
          account_number: u.account_number || '',
          ifsc_code: u.ifsc_code || '',
          address: u.address || '',
          nominiee: u.nominiee || '',
          relationship: u.relationship || '',
          nominee_mobile: u.nominee_mobile || '',
          city: u.city || '',
          state: u.state || '',
          pincode: u.pincode || '',
          interested_project: u.interested_project || '',
          interested_plot: u.interested_plot || '',
          role: u.role || 'customer',
        }))

      setClients(normalized)
    } catch (error) {
      setMessage({ visible: true, color: 'danger', text: `Failed to fetch ${viewType === 'clients' ? 'clients' : 'leads'}.` })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClients()
  }, [viewType])

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
  }, [])

  useEffect(() => {
    if (!editModalVisible || viewType !== 'leads') return

    const fetchProjects = async () => {
      try {
        const res = await fetch(`${globalThis.apiBaseUrl}/projects/`)
        if (res.ok) {
          const data = await res.json()
          const list = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : [])
          setProjects(list)
        }
      } catch (err) {
        console.error('Error fetching projects:', err)
      }
    }

    const fetchAgentsAndAdmins = async () => {
      try {
        const resAgents = await fetch(`${globalThis.apiBaseUrl}/users/`)
        let agentUserIds = []
        if (resAgents.ok) {
          const agentData = await resAgents.json()
          if (agentData?.success && Array.isArray(agentData.users)) {
            agentUserIds = agentData.users
          } else if (Array.isArray(agentData)) {
            agentUserIds = agentData
          }
        }

        let adminData = null
        try {
          const resAdmins = await fetch(`${globalThis.apiBaseUrl}/users/admin`)
          if (resAdmins.ok) {
            adminData = await resAdmins.json()
          } else {
            const resAdminsBackup = await fetch(`${globalThis.apiBaseUrl}/users/admin/`)
            if (resAdminsBackup.ok) {
              adminData = await resAdminsBackup.json()
            }
          }
        } catch (e) {
          console.error('Failed to fetch admin list without trailing slash, trying backup:', e)
          try {
            const resAdminsBackup = await fetch(`${globalThis.apiBaseUrl}/users/admin/`)
            if (resAdminsBackup.ok) {
              adminData = await resAdminsBackup.json()
            }
          } catch (errBackup) {
            console.error('Backup admin fetch failed:', errBackup)
          }
        }

        let adminUserIds = []
        let directAdminDetails = []
        if (adminData) {
          const rawAdmins = adminData?.users || adminData?.admins || adminData || []
          if (Array.isArray(rawAdmins)) {
            rawAdmins.forEach(item => {
              if (typeof item === 'string' || typeof item === 'number') {
                adminUserIds.push(String(item))
              } else if (item && typeof item === 'object') {
                directAdminDetails.push(item)
              }
            })
          }
        }

        const idsToFetch = Array.from(new Set([...agentUserIds, ...adminUserIds]))
        
        const fetchedDetails = await Promise.all(
          idsToFetch.map(async (uId) => {
            try {
              const userRes = await fetch(`${globalThis.apiBaseUrl}/users/${uId}`)
              if (userRes.ok) {
                return await userRes.json()
              }
            } catch (e) {
              console.error(e)
            }
            return null
          })
        )

        const allDetails = [...fetchedDetails, ...directAdminDetails]

        const filtered = allDetails.filter(
          (u) => u && (u.success || u.u_id || u.id) && (String(u.role || '').toLowerCase() === 'agent' || String(u.role || '').toLowerCase() === 'admin')
        ).map((u) => ({
          u_id: u.u_id || u.id,
          name: `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.u_id
        }))

        const uniqueFiltered = []
        const seen = new Set()
        for (const item of filtered) {
          if (item.u_id && !seen.has(item.u_id)) {
            seen.add(item.u_id)
            uniqueFiltered.push(item)
          }
        }

        setAgentsAndAdmins(uniqueFiltered)
      } catch (err) {
        console.error('Error fetching agents/admins:', err)
      }
    }

    fetchProjects()
    fetchAgentsAndAdmins()
  }, [editModalVisible, viewType])

  useEffect(() => {
    if (!editModalVisible || viewType !== 'leads' || !selectedClient?.interested_project) {
      setPlots([])
      return
    }

    const fetchPlots = async () => {
      try {
        const res = await fetch(`${globalThis.apiBaseUrl}/projects/plots?project_name=${encodeURIComponent(selectedClient.interested_project)}`)
        if (res.ok) {
          const data = await res.json()
          const list = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : [])
          setPlots(list)
        }
      } catch (err) {
        console.error('Error fetching plots:', err)
      }
    }

    fetchPlots()
  }, [editModalVisible, viewType, selectedClient?.interested_project])

  const processedClients = useMemo(() => {
    let filtered = [...clients]

    if (searchTerm) {
      const keyword = searchTerm.toLowerCase()
      filtered = filtered.filter((c) =>
        [c.u_id, c.first_name, c.last_name, c.email, c.mobile, c.designation]
          .join(' ')
          .toLowerCase()
          .includes(keyword),
      )
    }

    filtered.sort((a, b) => {
      const av = String(a[sortConfig.key] || '').toLowerCase()
      const bv = String(b[sortConfig.key] || '').toLowerCase()
      if (av < bv) return sortConfig.direction === 'ascending' ? -1 : 1
      if (av > bv) return sortConfig.direction === 'ascending' ? 1 : -1
      return 0
    })

    return filtered
  }, [clients, searchTerm, sortConfig])

  const pagedClients = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return processedClients.slice(start, start + itemsPerPage)
  }, [processedClients, currentPage])

  const pageCount = Math.ceil(processedClients.length / itemsPerPage)

  const requestSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'ascending' ? 'descending' : 'ascending',
    }))
  }

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null
    return sortConfig.direction === 'ascending' ? <CIcon icon={cilSortAlphaDown} /> : <CIcon icon={cilSortAlphaUp} />
  }

  const handleEditOpen = (client) => {
    setSelectedClient({ ...client })
    setEditModalVisible(true)
  }

  const handleViewOpen = (client) => {
    setSelectedClient({ ...client })
    setViewModalVisible(true)
  }

  const handleDeleteOpen = (client) => {
    setSelectedClient({ ...client })
    setDeleteModalVisible(true)
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target
    let nextValue = value
    if (['address', 'address_line1', 'address_line2'].includes(name)) {
      nextValue = value.replace(/[^A-Za-z0-9 .,\-()/#]/g, '').slice(0, 150)
    } else if (['first_name', 'last_name', 'father_name', 'nominiee', 'relationship'].includes(name)) {
      nextValue = value.replace(/[^A-Za-z ]/g, '').slice(0, 60)
    } else if (name === 'email') {
      nextValue = value.replace(/[^A-Za-z0-9.@_\-+]/g, '').slice(0, 100)
    } else if (['mobile', 'nominee_mobile', 'adhar', 'pincode', 'account_number', 'income', 'phone'].includes(name)) {
      nextValue = value.replace(/[^0-9]/g, '')
    }
    
    setSelectedClient((prev) => {
      const updated = { ...prev, [name]: nextValue }
      if (name === 'interested_project') {
        updated.interested_plot = ''
      }
      if (name === 'mobile') {
        updated.phone = nextValue
      } else if (name === 'phone') {
        updated.mobile = nextValue
      }
      return updated
    })
  }

  const handleSave = async () => {
    if (!selectedClient) return
    console.log('handleSave initiated with selectedClient:', selectedClient)
    setSaving(true)
    try {
      const isLead = viewType === 'leads'
      const url = isLead
        ? `${globalThis.apiBaseUrl}/users/client/${selectedClient.u_id}`
        : `${globalThis.apiBaseUrl}/users/${selectedClient.u_id}`
      const method = isLead ? 'PUT' : 'PATCH'
      console.log(`Hitting ${method} API:`, url)
      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedClient),
      })

      console.log('API Response status:', res.status)
      if (!res.ok) throw new Error('update failed')

      setMessage({ visible: true, color: 'success', text: `${isLead ? 'Lead' : 'Client'} updated successfully.` })
      setEditModalVisible(false)
      await fetchClients()
    } catch {
      setClients((prev) => prev.map((c) => (c.id === selectedClient.id ? selectedClient : c)))
      setMessage({ visible: true, color: 'warning', text: 'Saved locally. Server update is unavailable.' })
      setEditModalVisible(false)
    } finally {
      setSaving(false)
      setSelectedClient(null)
    }
  }

  const handleDelete = async () => {
    if (!selectedClient) return
    try {
      const deleteUrl = viewType === 'leads'
        ? `${globalThis.apiBaseUrl}/users/client/${selectedClient.u_id}`
        : `${globalThis.apiBaseUrl}/users/${selectedClient.u_id}`
      const res = await fetch(deleteUrl, { method: 'DELETE' })
      if (!res.ok) throw new Error('delete failed')
      setMessage({ visible: true, color: 'success', text: `${viewType === 'leads' ? 'Lead' : 'Client'} deleted successfully.` })
      await fetchClients()
    } catch {
      setClients((prev) => prev.filter((c) => c.id !== selectedClient.id))
      setMessage({ visible: true, color: 'warning', text: 'Deleted locally. Server delete is unavailable.' })
    } finally {
      setDeleteModalVisible(false)
      setSelectedClient(null)
    }
  }

  const editableKeys = selectedClient
    ? Object.keys(selectedClient).filter((k) => !['id', 'u_id', 'role'].includes(k))
    : []

  return (
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

      <CCardHeader className="p-3" style={{ background: 'linear-gradient(45deg, #00416a, #2b5876)', color: '#fff' }}>
        <h4 className="mb-3 text-center">{viewType === 'clients' ? 'View Clients' : 'View Leads'}</h4>
        <CInputGroup style={{ maxWidth: 420, margin: '0 auto' }}>
          <CInputGroupText>
            <CIcon icon={cilSearch} />
          </CInputGroupText>
          <CFormInput
            placeholder="Search by name, UID, email, phone, designation"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
          />
        </CInputGroup>
      </CCardHeader>

      <CCardBody style={{ overflowX: 'auto' }}>
        {loading ? (
          <div className="text-center py-5">Loading {viewType === 'clients' ? 'clients' : 'leads'}...</div>
        ) : (
          <CTable responsive hover align="middle">
            <CTableHead color="light">
              <CTableRow>
                <CTableHeaderCell onClick={() => requestSort('first_name')}>
                  Name {getSortIcon('first_name')}
                </CTableHeaderCell>
                <CTableHeaderCell onClick={() => requestSort('u_id')}>
                  UID {getSortIcon('u_id')}
                </CTableHeaderCell>
                <CTableHeaderCell>Email</CTableHeaderCell>
                <CTableHeaderCell>Phone</CTableHeaderCell>
                <CTableHeaderCell onClick={() => requestSort('designation')}>
                  Designation {getSortIcon('designation')}
                </CTableHeaderCell>
                <CTableHeaderCell>City</CTableHeaderCell>
                <CTableHeaderCell>State</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {pagedClients.length === 0 ? (
                <CTableRow>
                  <CTableDataCell colSpan={8} className="text-center text-muted">No {viewType === 'clients' ? 'clients' : 'leads'} found.</CTableDataCell>
                </CTableRow>
              ) : (
                pagedClients.map((c) => (
                  <CTableRow key={c.id}>
                    <CTableDataCell>{`${c.first_name} ${c.last_name}`.trim()}</CTableDataCell>
                    <CTableDataCell>{c.u_id}</CTableDataCell>
                    <CTableDataCell>{c.email}</CTableDataCell>
                    <CTableDataCell>{c.mobile}</CTableDataCell>
                    <CTableDataCell>{c.designation}</CTableDataCell>
                    <CTableDataCell>{c.city}</CTableDataCell>
                    <CTableDataCell>{c.state}</CTableDataCell>
                    <CTableDataCell className="text-center">
                      <CDropdown variant="btn-group">
                        <CDropdownToggle color="transparent" className="p-0" caret={false}>
                          <CIcon icon={cilOptions} />
                        </CDropdownToggle>
                        <CDropdownMenu>
                          <CDropdownItem onClick={() => handleViewOpen(c)}>View</CDropdownItem>
                          <CDropdownItem onClick={() => handleEditOpen(c)}>
                            <CIcon icon={cilPencil} className="me-2" /> Edit
                          </CDropdownItem>
                          {viewType === 'leads' && (
                            <CDropdownItem onClick={() => navigate('/register_client', { state: { lead: c } })}>
                              Convert to Client
                            </CDropdownItem>
                          )}
                          <CDropdownItem className="text-danger" onClick={() => handleDeleteOpen(c)}>
                            <CIcon icon={cilTrash} className="me-2" /> Delete
                          </CDropdownItem>
                        </CDropdownMenu>
                      </CDropdown>
                    </CTableDataCell>
                  </CTableRow>
                ))
              )}
            </CTableBody>
          </CTable>
        )}
      </CCardBody>

      {pageCount > 1 && (
        <CCardFooter className="d-flex justify-content-end">
          <CPagination>
            <CPaginationItem disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>
              Previous
            </CPaginationItem>
            {[...Array(pageCount).keys()].map((n) => (
              <CPaginationItem key={n + 1} active={currentPage === n + 1} onClick={() => setCurrentPage(n + 1)}>
                {n + 1}
              </CPaginationItem>
            ))}
            <CPaginationItem disabled={currentPage === pageCount} onClick={() => setCurrentPage((p) => p + 1)}>
              Next
            </CPaginationItem>
          </CPagination>
        </CCardFooter>
      )}

      <CModal visible={viewModalVisible} onClose={() => setViewModalVisible(false)} size="lg">
        <CModalHeader>
          <CModalTitle>Lead Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedClient && (
            <CRow className="g-3">
              {Object.entries(selectedClient).map(([k, v]) => (
                <CCol md={6} key={k}>
                  <CFormInput label={fieldLabel(k)} value={v ?? ''} readOnly />
                </CCol>
              ))}
            </CRow>
          )}
        </CModalBody>
      </CModal>

      <CModal visible={editModalVisible} onClose={() => setEditModalVisible(false)} size="lg" backdrop="static">
        <CModalHeader>
          <CModalTitle>{viewType === 'leads' ? 'Edit Lead' : 'Edit Client'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedClient && (
            <CRow className="g-3">
              {viewType === 'leads' ? (
                <>
                  <CCol md={6}>
                    <CFormInput label="First Name *" name="first_name" value={selectedClient.first_name || ''} onChange={handleEditChange} required />
                  </CCol>
                  <CCol md={6}>
                    <CFormInput label="Last Name *" name="last_name" value={selectedClient.last_name || ''} onChange={handleEditChange} required />
                  </CCol>
                  <CCol md={6}>
                    <CFormInput label="Password" name="password" type="password" value={selectedClient.password || ''} onChange={handleEditChange} />
                  </CCol>
                  <CCol md={6}>
                    <CFormInput label="Email" name="email" type="email" value={selectedClient.email || ''} onChange={handleEditChange} />
                  </CCol>
                  <CCol md={6}>
                    <CFormInput label="Phone *" name="mobile" value={selectedClient.mobile || ''} onChange={handleEditChange} required />
                  </CCol>
                  <CCol md={6}>
                    <CFormSelect label="Reference Agent" name="reference_agent" value={selectedClient.reference_agent || ''} onChange={handleEditChange}>
                      <option value="">Select Reference Agent / Admin</option>
                      {agentsAndAdmins.map((item) => (
                        <option key={item.u_id} value={item.u_id}>
                          {item.name} ({item.u_id})
                        </option>
                      ))}
                    </CFormSelect>
                  </CCol>
                  <CCol md={6}>
                    <CFormSelect label="Interested Project" name="interested_project" value={selectedClient.interested_project || ''} onChange={handleEditChange}>
                      <option value="">Select Interested Project</option>
                      {projects.map((proj) => (
                        <option key={proj.id || proj.name} value={proj.name}>
                          {proj.name}
                        </option>
                      ))}
                    </CFormSelect>
                  </CCol>
                  <CCol md={6}>
                    <CFormSelect
                      label="Interested Plot"
                      name="interested_plot"
                      value={selectedClient.interested_plot || ''}
                      onChange={handleEditChange}
                      disabled={!selectedClient.interested_project}
                    >
                      <option value="">Select Interested Plot</option>
                      {plots.map((plot) => (
                        <option key={plot.plot_number} value={plot.plot_number}>
                          Plot {plot.plot_number} ({plot.status || 'available'})
                        </option>
                      ))}
                    </CFormSelect>
                  </CCol>
                </>
              ) : (
                editableKeys.map((key) => (
                  <CCol md={6} key={key}>
                    {key === 'designation' ? (
                      <>
                        <CFormSelect label={fieldLabel(key)} name={key} value={selectedClient[key] || ''} onChange={handleEditChange}>
                          <option value="">Select Designation</option>
                          {designations.map((d, idx) => (
                            <option key={idx} value={d.id || d.name}>
                              {d.name}
                            </option>
                          ))}
                        </CFormSelect>
                        {designationError && <small className="text-danger">{designationError}</small>}
                      </>
                    ) : (
                      <CFormInput label={fieldLabel(key)} name={key} value={selectedClient[key] || ''} onChange={handleEditChange} />
                    )}
                  </CCol>
                ))
              )}
            </CRow>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" variant="ghost" onClick={() => setEditModalVisible(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal visible={deleteModalVisible} onClose={() => setDeleteModalVisible(false)}>
        <CModalHeader>
          <CModalTitle>Delete Lead</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Are you sure you want to delete this lead?
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" variant="ghost" onClick={() => setDeleteModalVisible(false)}>
            Cancel
          </CButton>
          <CButton color="danger" onClick={handleDelete}>
            Delete
          </CButton>
        </CModalFooter>
      </CModal>
    </CCard>
  )
}

export default GetClients
