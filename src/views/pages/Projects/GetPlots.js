import React, { useState, useEffect } from 'react'
import {
  CAlert,
  CBadge,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CFormInput,
  CFormSelect,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CFormFeedback,
} from '@coreui/react'

const PLOT_STATUS_OPTIONS = ['available', 'sold', 'reserved', 'on hold']

const getStatusBadge = (status = '') => {
  const s = status.toLowerCase()
  switch (s) {
    case 'available':
      return 'success'
    case 'sold':
      return 'danger'
    case 'reserved':
      return 'warning'
    case 'on hold':
      return 'secondary'
    default:
      return 'info'
  }
}

const normalizePlot = (plot) => ({
  id: plot.id || '',
  project_name: plot.project_name || '',
  plot_number: plot.plot_number || '',
  size: plot.size || '',
  price: plot.price || '',
  status: String(plot.status || '').toLowerCase(),
})

const updatePlotOnServer = async (plot) => {
  const payload = {
    project_name: plot.project_name,
    plot_number: plot.plot_number,
    size: Number(plot.size),
    price: Number(plot.price),
    status: String(plot.status || '').toLowerCase(),
  }

  const plotId = plot.id || plot.plot_number
  const urls = [
    `${globalThis.apiBaseUrl}/projects/${encodeURIComponent(plot.project_name)}/plots/${encodeURIComponent(plot.plot_number)}`,
    `${globalThis.apiBaseUrl}/projects/plots/${encodeURIComponent(plotId)}`,
    `${globalThis.apiBaseUrl}/projects/plots/${encodeURIComponent(plot.plot_number)}`,
    `${globalThis.apiBaseUrl}/projects/plots`,
  ]

  for (const url of urls) {
    for (const method of ['PUT', 'PATCH']) {
      console.log('Edit Plot — payload being sent to PUT/PATCH:', url, method, payload)
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) return true
    }
  }

  return false
}

export default function PlotsList() {
  const [plots, setPlots] = useState([])
  const [filteredPlots, setFilteredPlots] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [projectFilter, setProjectFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const [editModalVisible, setEditModalVisible] = useState(false)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [selectedPlot, setSelectedPlot] = useState(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ visible: false, color: 'success', text: '' })
  const [plotErrors, setPlotErrors] = useState({})

  const applyFilters = (projFilter, query, allPlots = plots) => {
    let filtered = allPlots
    if (projFilter) {
      filtered = filtered.filter((p) => p.project_name === projFilter)
    }
    if (query) {
      const lowerQuery = query.toLowerCase().trim()
      filtered = filtered.filter((p) => 
        String(p.plot_number || '').toLowerCase().includes(lowerQuery) ||
        String(p.project_name || '').toLowerCase().includes(lowerQuery) ||
        String(p.size || '').toLowerCase().includes(lowerQuery) ||
        String(p.price || '').toLowerCase().includes(lowerQuery) ||
        String(p.status || '').toLowerCase().includes(lowerQuery)
      )
    }
    setFilteredPlots(filtered)
  }

  const fetchPlots = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${globalThis.apiBaseUrl}/projects/plots`)
      if (!res.ok) throw new Error('Failed to fetch plots')

      const data = await res.json()
      const list = Array.isArray(data) ? data : data.plots || []
      setPlots(list)
      applyFilters(projectFilter, searchQuery, list)
      setError('')
    } catch (err) {
      setError('Error fetching plots: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPlots()
  }, [])

  const handleProjectFilterChange = (value) => {
    setProjectFilter(value)
    applyFilters(value, searchQuery)
  }

  const handleSearchChange = (value) => {
    setSearchQuery(value)
    applyFilters(projectFilter, value)
  }

  const handleEdit = (plot) => {
    setSelectedPlot(normalizePlot(plot))
    setPlotErrors({})
    setEditModalVisible(true)
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target
    let nextValue = value
    if (name === 'project_name') {
      nextValue = value.replace(/[^A-Za-z0-9 \-]/g, '')
    } else if (name === 'plot_number') {
      nextValue = value.replace(/[^A-Za-z0-9\-]/g, '')
    } else if (name === 'size' || name === 'price') {
      nextValue = value.replace(/[^0-9]/g, '')
    }
    setSelectedPlot((prev) => ({ ...prev, [name]: nextValue }))
    setPlotErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleSave = async () => {
    if (!selectedPlot) return

    const errs = {}
    if (!selectedPlot.project_name?.trim()) {
      errs.project_name = 'Project Name is required'
    } else if (/[^A-Za-z0-9 \-]/.test(selectedPlot.project_name)) {
      errs.project_name = 'Project Name must contain only letters, numbers, spaces, and hyphens'
    }

    if (!selectedPlot.plot_number?.trim()) {
      errs.plot_number = 'Plot Number is required'
    } else if (/[^A-Za-z0-9\-]/.test(selectedPlot.plot_number)) {
      errs.plot_number = 'Plot Number must contain only letters, numbers, and hyphens'
    }

    if (!selectedPlot.size || Number(selectedPlot.size) <= 0 || /[^0-9]/.test(selectedPlot.size)) {
      errs.size = 'Size must be a valid positive integer'
    }

    if (selectedPlot.price === undefined || selectedPlot.price === '' || Number(selectedPlot.price) <= 0 || /[^0-9]/.test(selectedPlot.price)) {
      errs.price = 'Price must be a valid positive integer'
    }

    if (!selectedPlot.status) {
      errs.status = 'Plot Status is required'
    }

    if (Object.keys(errs).length > 0) {
      setPlotErrors(errs)
      return
    }

    setSaving(true)
    try {
      const success = await updatePlotOnServer(selectedPlot)
      setPlots((prev) => prev.map((p) => (p.plot_number === selectedPlot.plot_number ? { ...p, ...selectedPlot } : p)))
      setFilteredPlots((prev) => prev.map((p) => (p.plot_number === selectedPlot.plot_number ? { ...p, ...selectedPlot } : p)))
      setMessage({
        visible: true,
        color: success ? 'success' : 'warning',
        text: success ? 'Plot updated successfully.' : 'Saved locally. Server update endpoint is unavailable.',
      })
      setEditModalVisible(false)
      await fetchPlots()
    } catch {
      setMessage({ visible: true, color: 'danger', text: 'Failed to save plot changes.' })
    } finally {
      setSaving(false)
      setSelectedPlot(null)
    }
  }

  const handleDeleteOpen = (plot) => {
    setSelectedPlot(normalizePlot(plot))
    setDeleteModalVisible(true)
  }

  const handleDelete = async () => {
    if (!selectedPlot) return

    try {
      const res = await fetch(`${globalThis.apiBaseUrl}/projects/${encodeURIComponent(selectedPlot.project_name)}/plots/${encodeURIComponent(selectedPlot.plot_number)}`, {
        method: 'DELETE',
      })

      setPlots((prev) => prev.filter((p) => p.plot_number !== selectedPlot.plot_number))
      setFilteredPlots((prev) => prev.filter((p) => p.plot_number !== selectedPlot.plot_number))
      setMessage({
        visible: true,
        color: res.ok ? 'success' : 'warning',
        text: res.ok ? 'Plot deleted successfully.' : 'Plot deleted locally. Server delete endpoint is unavailable.',
      })
      setDeleteModalVisible(false)
    } catch {
      setMessage({ visible: true, color: 'danger', text: 'Failed to delete plot.' })
    } finally {
      setSelectedPlot(null)
    }
  }

  const projectNames = [...new Set(plots.map((p) => p.project_name))]

  return (
    <div style={{ minHeight: '100vh', padding: '30px 0' }}>
      <CContainer>
        {message.visible && (
          <CAlert color={message.color} dismissible onClose={() => setMessage((prev) => ({ ...prev, visible: false }))}>
            {message.text}
          </CAlert>
        )}

        {loading ? (
          <div className="text-center py-5">
            <CSpinner size="lg" />
          </div>
        ) : error ? (
          <div className="text-danger text-center py-5">{error}</div>
        ) : (
          <CCard className="border-0" style={{ borderRadius: '16px', boxShadow: '0px 10px 25px rgba(0,0,0,0.12)' }}>
            <CCardBody>
              <h2 className="mb-4 fw-bold" style={{ background: 'linear-gradient(90deg, #6a11cb, #2575fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textShadow: '1px 1px 2px rgba(0,0,0,0.2)', letterSpacing: '0.5px' }}>
                Plots Overview
              </h2>

              <CRow className="mb-4 g-3 align-items-center">
                <CCol md={4}>
                  <CFormInput
                    type="text"
                    placeholder="Search plots..."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                  />
                </CCol>
                <CCol md={4} className="ms-auto">
                  <CFormSelect value={projectFilter} onChange={(e) => handleProjectFilterChange(e.target.value)}>
                    <option value="">Filter by Project Name</option>
                    {projectNames.map((name) => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </CFormSelect>
                </CCol>
              </CRow>

              <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                <CTable hover responsive align="middle" className="text-center" style={{ minWidth: '850px', background: '#fff', borderRadius: '12px', overflow: 'hidden' }}>
                  <CTableHead color="light" style={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: '#f8f9fa' }}>
                    <CTableRow>
                      <CTableHeaderCell className="fw-semibold">Plot Number</CTableHeaderCell>
                      <CTableHeaderCell className="fw-semibold">Project Name</CTableHeaderCell>
                      <CTableHeaderCell className="fw-semibold">Size (sq. ft)</CTableHeaderCell>
                      <CTableHeaderCell className="fw-semibold">Price</CTableHeaderCell>
                      <CTableHeaderCell className="fw-semibold">Status</CTableHeaderCell>
                      <CTableHeaderCell className="fw-semibold" style={{ textAlign: 'center' }}>Actions</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>

                  <CTableBody>
                    {filteredPlots.length > 0 ? (
                      filteredPlots.map((plot, i) => (
                        <CTableRow key={i} style={{ transition: '0.2s', cursor: 'pointer' }}>
                          <CTableDataCell><strong>{plot.plot_number}</strong></CTableDataCell>
                          <CTableDataCell>{plot.project_name}</CTableDataCell>
                          <CTableDataCell>{plot.size}</CTableDataCell>
                          <CTableDataCell>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(plot.price)}</CTableDataCell>
                          <CTableDataCell>
                            <CBadge color={getStatusBadge(plot.status)} shape="rounded-pill" className="px-3 py-2">
                              {plot.status || 'Unknown'}
                            </CBadge>
                          </CTableDataCell>
                          <CTableDataCell className="text-center">
                              <CButtonGroup>
                                <CButton color="info" size="sm" variant="outline" onClick={() => handleEdit(plot)}>
                                  Edit
                                </CButton>
                                <CButton color="danger" size="sm" variant="outline" onClick={() => handleDeleteOpen(plot)}>
                                  Delete
                                </CButton>
                              </CButtonGroup>
                          </CTableDataCell>
                        </CTableRow>
                      ))
                    ) : (
                      <CTableRow>
                        <CTableDataCell colSpan={6} className="text-center py-4 text-muted">No plots found for the selected project.</CTableDataCell>
                      </CTableRow>
                    )}
                  </CTableBody>
                </CTable>
              </div>
            </CCardBody>
          </CCard>
        )}
      </CContainer>

      <CModal visible={editModalVisible} onClose={() => setEditModalVisible(false)} backdrop="static">
        <CModalHeader>
          <CModalTitle>Edit Plot</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedPlot && (
            <CRow className="g-3">
              <CCol md={6}>
                <CFormInput label="Project Name" name="project_name" value={selectedPlot.project_name} onChange={handleEditChange} invalid={!!plotErrors.project_name} />
                {plotErrors.project_name && <CFormFeedback className="d-block">{plotErrors.project_name}</CFormFeedback>}
              </CCol>
              <CCol md={6}>
                <CFormInput label="Plot Number" name="plot_number" value={selectedPlot.plot_number} onChange={handleEditChange} invalid={!!plotErrors.plot_number} />
                {plotErrors.plot_number && <CFormFeedback className="d-block">{plotErrors.plot_number}</CFormFeedback>}
              </CCol>
              <CCol md={6}>
                <CFormInput type="number" label="Size" name="size" value={selectedPlot.size} onChange={handleEditChange} invalid={!!plotErrors.size} />
                {plotErrors.size && <CFormFeedback className="d-block">{plotErrors.size}</CFormFeedback>}
              </CCol>
              <CCol md={6}>
                <CFormInput type="number" label="Price" name="price" value={selectedPlot.price} onChange={handleEditChange} invalid={!!plotErrors.price} />
                {plotErrors.price && <CFormFeedback className="d-block">{plotErrors.price}</CFormFeedback>}
              </CCol>
              <CCol md={12}>
                <CFormSelect label="Status" name="status" value={selectedPlot.status} onChange={handleEditChange} invalid={!!plotErrors.status}>
                  <option value="">Select Status</option>
                  {PLOT_STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </CFormSelect>
                {plotErrors.status && <CFormFeedback className="d-block">{plotErrors.status}</CFormFeedback>}
              </CCol>
            </CRow>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" variant="ghost" onClick={() => setEditModalVisible(false)}>Cancel</CButton>
          <CButton color="primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</CButton>
        </CModalFooter>
      </CModal>

      <CModal visible={deleteModalVisible} onClose={() => setDeleteModalVisible(false)}>
        <CModalHeader><CModalTitle>Delete Plot</CModalTitle></CModalHeader>
        <CModalBody>Are you sure you want to delete plot <strong>{selectedPlot?.plot_number}</strong>?</CModalBody>
        <CModalFooter>
          <CButton color="secondary" variant="ghost" onClick={() => setDeleteModalVisible(false)}>Cancel</CButton>
          <CButton color="danger" onClick={handleDelete}>Delete</CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}
