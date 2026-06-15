import React, { useEffect, useMemo, useState } from 'react'
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

  const fetchClients = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${globalThis.apiBaseUrl}/users/`)
      const listData = await res.json()
      if (!listData?.success || !Array.isArray(listData.users)) {
        setClients([])
        return
      }

      const userDetails = await Promise.all(
        listData.users.map(async (uId) => {
          const userRes = await fetch(`${globalThis.apiBaseUrl}/users/${uId}`)
          return userRes.json()
        }),
      )

      const normalized = userDetails
        .filter((u) => u?.success && isClientRole(u.role))
        .map((u) => ({
          id: u.id,
          u_id: u.u_id,
          first_name: u.first_name || '',
          last_name: u.last_name || '',
          father_name: u.father_name || '',
          dob: u.dob || '',
          gender: u.gender || '',
          email: u.email || '',
          mobile: u.mobile || '',
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
          role: u.role || 'customer',
        }))

      setClients(normalized)
    } catch (error) {
      setMessage({ visible: true, color: 'danger', text: 'Failed to fetch clients.' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClients()
  }, [])

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
    setSelectedClient((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    if (!selectedClient) return
    setSaving(true)
    try {
      const res = await fetch(`${globalThis.apiBaseUrl}/users/${selectedClient.u_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedClient),
      })

      if (!res.ok) throw new Error('update failed')

      setMessage({ visible: true, color: 'success', text: 'Client updated successfully.' })
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
      const res = await fetch(`${globalThis.apiBaseUrl}/users/${selectedClient.u_id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('delete failed')
      setMessage({ visible: true, color: 'success', text: 'Client deleted successfully.' })
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
        <h4 className="mb-3 text-center">View Clients</h4>
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
          <div className="text-center py-5">Loading clients...</div>
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
                  <CTableDataCell colSpan={8} className="text-center text-muted">No clients found.</CTableDataCell>
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
          <CModalTitle>Client Details</CModalTitle>
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
          <CModalTitle>Edit Client</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedClient && (
            <CRow className="g-3">
              {editableKeys.map((key) => (
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
              ))}
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
          <CModalTitle>Delete Client</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Are you sure you want to delete this client?
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
