import React, { useState, useEffect } from 'react'
import {
  CAlert,
  CBadge,
  CButton,
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
} from '@coreui/react'

const PLOT_STATUS_OPTIONS = ['available', 'sold', 'reserved', 'on hold']

const getProjectBadgeColor = (status = '') => {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'success'
    case 'ongoing':
      return 'info'
    case 'delayed':
      return 'warning'
    default:
      return 'secondary'
  }
}

const getPlotBadgeColor = (status = '') => (status.toLowerCase() === 'sold' ? 'danger' : 'success')

const normalizePlot = (plot) => ({
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

  const urls = [
    `${globalThis.apiBaseUrl}/projects/plots/${encodeURIComponent(plot.plot_number)}`,
    `${globalThis.apiBaseUrl}/projects/plots`,
  ]

  for (const url of urls) {
    for (const method of ['PUT', 'PATCH']) {
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

const deletePlotOnServer = async (plot) => {
  const url = `${globalThis.apiBaseUrl}/projects/plots/${encodeURIComponent(plot.plot_number)}`
  const res = await fetch(url, { method: 'DELETE' })
  return res.ok
}

export default function ProjectsList() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [selectedProject, setSelectedProject] = useState(null)
  const [plots, setPlots] = useState([])
  const [plotsLoading, setPlotsLoading] = useState(false)

  const [message, setMessage] = useState({ visible: false, color: 'success', text: '' })

  const [editPlotModalVisible, setEditPlotModalVisible] = useState(false)
  const [deletePlotModalVisible, setDeletePlotModalVisible] = useState(false)
  const [selectedPlot, setSelectedPlot] = useState(null)
  const [savingPlot, setSavingPlot] = useState(false)

  const fetchProjects = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${globalThis.apiBaseUrl}/projects/`)
      if (!res.ok) throw new Error('Failed to fetch projects')
      const data = await res.json()
      setProjects(Array.isArray(data.data) ? data.data : [])
      setError('')
    } catch (err) {
      setError('Error fetching projects: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const loadPlotsForProject = async (project) => {
    setSelectedProject(project)
    setPlots([])
    setPlotsLoading(true)
    try {
      const res = await fetch(`${globalThis.apiBaseUrl}/projects/plots?project_name=${encodeURIComponent(project.name)}`)
      if (!res.ok) throw new Error('Failed to fetch plots')
      const data = await res.json()
      setPlots(Array.isArray(data) ? data : [])
    } catch (err) {
      setMessage({ visible: true, color: 'danger', text: 'Error fetching plots: ' + err.message })
    } finally {
      setPlotsLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const handleEditPlotOpen = (plot) => {
    setSelectedPlot(normalizePlot(plot))
    setEditPlotModalVisible(true)
  }

  const handleEditPlotChange = (e) => {
    const { name, value } = e.target
    setSelectedPlot((prev) => ({ ...prev, [name]: value }))
  }

  const handleSavePlot = async () => {
    if (!selectedPlot) return
    if (!selectedPlot.project_name || !selectedPlot.plot_number || !selectedPlot.size || !selectedPlot.price || !selectedPlot.status) {
      setMessage({ visible: true, color: 'danger', text: 'Please fill all plot fields before saving.' })
      return
    }

    setSavingPlot(true)
    try {
      const success = await updatePlotOnServer(selectedPlot)
      setPlots((prev) => prev.map((p) => (p.plot_number === selectedPlot.plot_number ? { ...p, ...selectedPlot } : p)))
      setMessage({
        visible: true,
        color: success ? 'success' : 'warning',
        text: success ? 'Plot updated successfully.' : 'Plot updated locally. Server update endpoint is unavailable.',
      })
      setEditPlotModalVisible(false)

      if (selectedProject) {
        await loadPlotsForProject(selectedProject)
      }
    } catch {
      setMessage({ visible: true, color: 'danger', text: 'Failed to save plot changes.' })
    } finally {
      setSavingPlot(false)
      setSelectedPlot(null)
    }
  }

  const handleDeletePlotOpen = (plot) => {
    setSelectedPlot(normalizePlot(plot))
    setDeletePlotModalVisible(true)
  }

  const handleDeletePlot = async () => {
    if (!selectedPlot) return

    try {
      const deleted = await deletePlotOnServer(selectedPlot)
      setPlots((prev) => prev.filter((p) => p.plot_number !== selectedPlot.plot_number))
      setMessage({
        visible: true,
        color: deleted ? 'success' : 'warning',
        text: deleted ? 'Plot deleted successfully.' : 'Plot deleted locally. Server delete endpoint is unavailable.',
      })
      setDeletePlotModalVisible(false)
    } catch {
      setMessage({ visible: true, color: 'danger', text: 'Failed to delete plot.' })
    } finally {
      setSelectedPlot(null)
    }
  }

  return (
    <CContainer className="my-4">
      {message.visible && (
        <CAlert color={message.color} dismissible onClose={() => setMessage((prev) => ({ ...prev, visible: false }))}>
          {message.text}
        </CAlert>
      )}

      {loading ? (
        <div className="text-center py-5">
          <CSpinner color="primary" />
        </div>
      ) : error ? (
        <div className="text-danger text-center py-5">{error}</div>
      ) : (
        <>
          <CCard className="mb-4" style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <CCardBody>
              <h4 className="mb-3" style={{ color: '#495057' }}>Projects List</h4>
              <CTable hover responsive align="middle">
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell>Name</CTableHeaderCell>
                    <CTableHeaderCell>Description</CTableHeaderCell>
                    <CTableHeaderCell>Location</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                    <CTableHeaderCell>Developer</CTableHeaderCell>
                    <CTableHeaderCell>Action</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {projects.length > 0 ? (
                    projects.map((project) => (
                      <CTableRow key={project.id}>
                        <CTableDataCell>{project.name}</CTableDataCell>
                        <CTableDataCell>{project.description}</CTableDataCell>
                        <CTableDataCell>{project.location}</CTableDataCell>
                        <CTableDataCell>
                          <CBadge color={getProjectBadgeColor(project.status)}>{project.status}</CBadge>
                        </CTableDataCell>
                        <CTableDataCell>{project.developer}</CTableDataCell>
                        <CTableDataCell>
                          <CButton color="primary" size="sm" variant="outline" shape="rounded-pill" onClick={() => loadPlotsForProject(project)}>
                            View Plots
                          </CButton>
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan="6" className="text-center text-muted">No projects found.</CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>

          {selectedProject && (
            <CCard style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
              <CCardBody>
                <h5 className="mb-3">Plots for Project: <strong>{selectedProject.name}</strong></h5>
                {plotsLoading ? (
                  <div className="text-center py-3"><CSpinner color="primary" /></div>
                ) : plots.length > 0 ? (
                  <CTable hover responsive align="middle">
                    <CTableHead color="light">
                      <CTableRow>
                        <CTableHeaderCell>Plot Number</CTableHeaderCell>
                        <CTableHeaderCell>Project Name</CTableHeaderCell>
                        <CTableHeaderCell>Size</CTableHeaderCell>
                        <CTableHeaderCell>Price</CTableHeaderCell>
                        <CTableHeaderCell>Status</CTableHeaderCell>
                        <CTableHeaderCell>Actions</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {plots.map((plot) => (
                        <CTableRow key={plot.plot_number}>
                          <CTableDataCell>{plot.plot_number}</CTableDataCell>
                          <CTableDataCell>{plot.project_name}</CTableDataCell>
                          <CTableDataCell>{plot.size}</CTableDataCell>
                          <CTableDataCell>
                            {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(plot.price)}
                          </CTableDataCell>
                          <CTableDataCell>
                            <CBadge color={getPlotBadgeColor(plot.status)}>{plot.status}</CBadge>
                          </CTableDataCell>
                          <CTableDataCell>
                            <div className="d-flex gap-2">
                              <CButton color="info" size="sm" variant="outline" onClick={() => handleEditPlotOpen(plot)}>
                                Edit
                              </CButton>
                              <CButton color="danger" size="sm" variant="outline" onClick={() => handleDeletePlotOpen(plot)}>
                                Delete
                              </CButton>
                            </div>
                          </CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                ) : (
                  <div className="text-center text-muted py-3">No plots found for this project.</div>
                )}
              </CCardBody>
            </CCard>
          )}
        </>
      )}

      <CModal visible={editPlotModalVisible} onClose={() => setEditPlotModalVisible(false)} backdrop="static">
        <CModalHeader>
          <CModalTitle>Edit Plot</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedPlot && (
            <CRow className="g-3">
              <CCol md={6}>
                <CFormInput label="Project Name" name="project_name" value={selectedPlot.project_name} onChange={handleEditPlotChange} />
              </CCol>
              <CCol md={6}>
                <CFormInput label="Plot Number" name="plot_number" value={selectedPlot.plot_number} onChange={handleEditPlotChange} />
              </CCol>
              <CCol md={6}>
                <CFormInput label="Size" type="number" name="size" value={selectedPlot.size} onChange={handleEditPlotChange} />
              </CCol>
              <CCol md={6}>
                <CFormInput label="Price" type="number" name="price" value={selectedPlot.price} onChange={handleEditPlotChange} />
              </CCol>
              <CCol md={12}>
                <CFormSelect label="Status" name="status" value={selectedPlot.status} onChange={handleEditPlotChange}>
                  <option value="">Select Status</option>
                  {PLOT_STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" variant="ghost" onClick={() => setEditPlotModalVisible(false)}>Cancel</CButton>
          <CButton color="primary" onClick={handleSavePlot} disabled={savingPlot}>{savingPlot ? 'Saving...' : 'Save'}</CButton>
        </CModalFooter>
      </CModal>

      <CModal visible={deletePlotModalVisible} onClose={() => setDeletePlotModalVisible(false)}>
        <CModalHeader><CModalTitle>Delete Plot</CModalTitle></CModalHeader>
        <CModalBody>Are you sure you want to delete plot <strong>{selectedPlot?.plot_number}</strong>?</CModalBody>
        <CModalFooter>
          <CButton color="secondary" variant="ghost" onClick={() => setDeletePlotModalVisible(false)}>Cancel</CButton>
          <CButton color="danger" onClick={handleDeletePlot}>Delete</CButton>
        </CModalFooter>
      </CModal>
    </CContainer>
  )
}
