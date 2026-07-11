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
  CFormFeedback,
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
      console.log('Edit Plot (Projects view) — payload being sent to PUT/PATCH:', url, method, payload)
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
  const url = `${globalThis.apiBaseUrl}/projects/${encodeURIComponent(plot.project_name)}/plots/${encodeURIComponent(plot.plot_number)}`
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
  const [plotErrors, setPlotErrors] = useState({})

  const [editProjectModalVisible, setEditProjectModalVisible] = useState(false)
  const [selectedProjectForEdit, setSelectedProjectForEdit] = useState(null)
  const [savingProject, setSavingProject] = useState(false)

  const [deleteProjectModalVisible, setDeleteProjectModalVisible] = useState(false)
  const [selectedProjectForDelete, setSelectedProjectForDelete] = useState(null)

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
    setPlotErrors({})
    setEditPlotModalVisible(true)
  }

  const handleEditPlotChange = (e) => {
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

  const handleEditProjectOpen = (project) => {
    setSelectedProjectForEdit({ ...project })
    setEditProjectModalVisible(true)
  }

  const handleEditProjectChange = (e) => {
    const { name, value } = e.target
    setSelectedProjectForEdit((prev) => ({ ...prev, [name]: value }))
  }

  const handleSaveProject = async () => {
    if (!selectedProjectForEdit) return
    const { id, name, location, developer, status, total_area, start_date, end_date, description } = selectedProjectForEdit
    if (!name || !location || !developer || !status || !description) {
      setMessage({ visible: true, color: 'danger', text: 'Please fill name, location, developer, status, and description before saving.' })
      return
    }

    setSavingProject(true)
    try {
      const payload = {
        name,
        location,
        developer,
        status,
        total_area: Number(total_area),
        start_date: start_date || null,
        end_date: end_date || null,
        description: description || ''
      }

      const res = await fetch(`${globalThis.apiBaseUrl}/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        setMessage({ visible: true, color: 'success', text: 'Project updated successfully.' })
        setEditProjectModalVisible(false)
        fetchProjects()
      } else {
        const errorData = await res.json().catch(() => null)
        const errMsg = errorData?.message || 'Failed to save project changes.'
        setMessage({ visible: true, color: 'danger', text: errMsg })
      }
    } catch (err) {
      setMessage({ visible: true, color: 'danger', text: 'Failed to save project changes: ' + err.message })
    } finally {
      setSavingProject(false)
      setSelectedProjectForEdit(null)
    }
  }

  const handleSavePlot = async () => {
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

  const handleDeleteProjectOpen = (project) => {
    setSelectedProjectForDelete(project)
    setDeleteProjectModalVisible(true)
  }

  const handleDeleteProject = async () => {
    if (!selectedProjectForDelete) return

    try {
      const res = await fetch(`${globalThis.apiBaseUrl}/projects/${selectedProjectForDelete.id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== selectedProjectForDelete.id))
        setMessage({
          visible: true,
          color: 'success',
          text: 'Project deleted successfully.',
        })
        if (selectedProject && selectedProject.id === selectedProjectForDelete.id) {
          setSelectedProject(null)
          setPlots([])
        }
      } else {
        const errorData = await res.json().catch(() => null)
        const errMsg = errorData?.message || 'Failed to delete project.'
        setMessage({ visible: true, color: 'danger', text: errMsg })
      }
    } catch (err) {
      setMessage({ visible: true, color: 'danger', text: 'Failed to delete project: ' + err.message })
    } finally {
      setDeleteProjectModalVisible(false)
      setSelectedProjectForDelete(null)
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
                          <div className="d-flex gap-2">
                            <CButton color="primary" size="sm" variant="outline" shape="rounded-pill" onClick={() => loadPlotsForProject(project)}>
                              View Plots
                            </CButton>
                            <CButton color="info" size="sm" variant="outline" shape="rounded-pill" onClick={() => handleEditProjectOpen(project)}>
                              Edit Project
                            </CButton>
                            <CButton color="danger" size="sm" variant="outline" shape="rounded-pill" onClick={() => handleDeleteProjectOpen(project)}>
                              Delete Project
                            </CButton>
                          </div>
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

      <CModal visible={editProjectModalVisible} onClose={() => setEditProjectModalVisible(false)} size="lg" backdrop="static">
        <CModalHeader>
          <CModalTitle>Edit Project</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedProjectForEdit && (
            <CRow className="g-3">
              <CCol md={6}>
                <CFormInput label="Project Name" name="name" value={selectedProjectForEdit.name} onChange={handleEditProjectChange} />
              </CCol>
              <CCol md={6}>
                <CFormInput label="Developer" name="developer" value={selectedProjectForEdit.developer} onChange={handleEditProjectChange} />
              </CCol>
              <CCol md={6}>
                <CFormInput label="Location" name="location" value={selectedProjectForEdit.location} onChange={handleEditProjectChange} />
              </CCol>
              <CCol md={6}>
                <CFormInput label="Total Area" type="number" name="total_area" value={selectedProjectForEdit.total_area} onChange={handleEditProjectChange} />
              </CCol>
              <CCol md={6}>
                <CFormInput label="Start Date" type="date" name="start_date" value={selectedProjectForEdit.start_date || ''} onChange={handleEditProjectChange} />
              </CCol>
              <CCol md={6}>
                <CFormInput label="End Date" type="date" name="end_date" value={selectedProjectForEdit.end_date || ''} onChange={handleEditProjectChange} />
              </CCol>
              <CCol md={12}>
                <CFormSelect label="Status" name="status" value={selectedProjectForEdit.status} onChange={handleEditProjectChange}>
                  <option value="">Select Status</option>
                  <option value="ongoing">ongoing</option>
                  <option value="completed">completed</option>
                  <option value="delayed">delayed</option>
                </CFormSelect>
              </CCol>
              <CCol md={12}>
                <CFormInput label="Description" name="description" value={selectedProjectForEdit.description} onChange={handleEditProjectChange} />
              </CCol>
            </CRow>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" variant="ghost" onClick={() => setEditProjectModalVisible(false)}>Cancel</CButton>
          <CButton color="primary" onClick={handleSaveProject} disabled={savingProject}>{savingProject ? 'Saving...' : 'Save'}</CButton>
        </CModalFooter>
      </CModal>

      <CModal visible={editPlotModalVisible} onClose={() => setEditPlotModalVisible(false)} backdrop="static">
        <CModalHeader>
          <CModalTitle>Edit Plot</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedPlot && (
            <CRow className="g-3">
              <CCol md={6}>
                <CFormInput label="Project Name" name="project_name" value={selectedPlot.project_name} onChange={handleEditPlotChange} invalid={!!plotErrors.project_name} />
                {plotErrors.project_name && <CFormFeedback className="d-block">{plotErrors.project_name}</CFormFeedback>}
              </CCol>
              <CCol md={6}>
                <CFormInput label="Plot Number" name="plot_number" value={selectedPlot.plot_number} onChange={handleEditPlotChange} invalid={!!plotErrors.plot_number} />
                {plotErrors.plot_number && <CFormFeedback className="d-block">{plotErrors.plot_number}</CFormFeedback>}
              </CCol>
              <CCol md={6}>
                <CFormInput label="Size" type="number" name="size" value={selectedPlot.size} onChange={handleEditPlotChange} invalid={!!plotErrors.size} />
                {plotErrors.size && <CFormFeedback className="d-block">{plotErrors.size}</CFormFeedback>}
              </CCol>
              <CCol md={6}>
                <CFormInput label="Price" type="number" name="price" value={selectedPlot.price} onChange={handleEditPlotChange} invalid={!!plotErrors.price} />
                {plotErrors.price && <CFormFeedback className="d-block">{plotErrors.price}</CFormFeedback>}
              </CCol>
              <CCol md={12}>
                <CFormSelect label="Status" name="status" value={selectedPlot.status} onChange={handleEditPlotChange} invalid={!!plotErrors.status}>
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

      <CModal visible={deleteProjectModalVisible} onClose={() => setDeleteProjectModalVisible(false)}>
        <CModalHeader><CModalTitle>Delete Project</CModalTitle></CModalHeader>
        <CModalBody>Are you sure you want to delete project <strong>{selectedProjectForDelete?.name}</strong>?</CModalBody>
        <CModalFooter>
          <CButton color="secondary" variant="ghost" onClick={() => setDeleteProjectModalVisible(false)}>Cancel</CButton>
          <CButton color="danger" onClick={handleDeleteProject}>Delete</CButton>
        </CModalFooter>
      </CModal>
    </CContainer>
  )
}
