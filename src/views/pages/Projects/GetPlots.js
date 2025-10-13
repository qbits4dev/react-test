import React, { useState, useEffect } from 'react'
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
  CButtonGroup,
  CFormSelect,
  CRow,
  CCol,
} from '@coreui/react'

// ✅ Badge color helper
const getStatusBadge = (status) => {
  const s = status ? status.toLowerCase() : ''
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

export default function PlotsList() {
  const [plots, setPlots] = useState([])
  const [filteredPlots, setFilteredPlots] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [projectFilter, setProjectFilter] = useState('')

  useEffect(() => {
    async function fetchPlots() {
      setLoading(true)
      try {
        const res = await fetch(`${globalThis.apiBaseUrl}/projects/plots`)
        if (!res.ok) throw new Error('Failed to fetch plots')

        const data = await res.json()
        const list = Array.isArray(data) ? data : data.plots || []
        setPlots(list)
        setFilteredPlots(list)
        setError('')
      } catch (err) {
        setError('Error fetching plots: ' + err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchPlots()
  }, [])

  // ✅ Handle Project Filter
  const handleProjectFilterChange = (value) => {
    setProjectFilter(value)
    if (!value) {
      setFilteredPlots(plots)
    } else {
      setFilteredPlots(plots.filter((p) => p.project_name === value))
    }
  }

  const handleEdit = (plot) => {
    alert(`Edit Plot: ${plot.plot_number}`)
  }

  const handleDelete = (plot) => {
    alert(`Delete Plot: ${plot.plot_number}`)
  }

  // ✅ Get unique project names for filter
  const projectNames = [...new Set(plots.map((p) => p.project_name))]

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '30px 0',
      }}
    >
      <CContainer>
        {loading ? (
          <div className="text-center py-5">
            <CSpinner size="lg" />
          </div>
        ) : error ? (
          <div className="text-danger text-center py-5">{error}</div>
        ) : (
          <CCard
            className="border-0"
            style={{
              borderRadius: '16px',
              boxShadow: '0px 10px 25px rgba(0,0,0,0.12)',
            }}
          >
            <CCardBody>
              <h2
                className="mb-4 fw-bold"
                style={{
                  background: 'linear-gradient(90deg, #6a11cb, #2575fc)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
                  letterSpacing: '0.5px',
                }}
              >
                Plots Overview
              </h2>

              {/* ✅ Filter Section aligned to right */}
              <CRow className="mb-4 d-flex justify-content-end">
                <CCol md={4}>
                  <CFormSelect
                    value={projectFilter}
                    onChange={(e) => handleProjectFilterChange(e.target.value)}
                  >
                    <option value="">Filter by Project Name</option>
                    {projectNames.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>
              </CRow>

              {/* ✅ Table Wrapper with Scroll + Sticky Header */}
              <div
                style={{
                  maxHeight: '500px',
                  overflowY: 'auto',
                }}
              >
                <CTable
                  hover
                  responsive
                  align="middle"
                  className="text-center"
                  style={{
                    minWidth: '850px',
                    background: '#fff',
                    borderRadius: '12px',
                    overflow: 'hidden',
                  }}
                >
                  <CTableHead
                    color="light"
                    style={{
                      position: 'sticky',
                      top: 0,
                      zIndex: 10,
                      backgroundColor: '#f8f9fa',
                    }}
                  >
                    <CTableRow>
                      <CTableHeaderCell className="fw-semibold">Plot Number</CTableHeaderCell>
                      <CTableHeaderCell className="fw-semibold">Project Name</CTableHeaderCell>
                      <CTableHeaderCell className="fw-semibold">Size (sq. ft)</CTableHeaderCell>
                      <CTableHeaderCell className="fw-semibold">Price</CTableHeaderCell>
                      <CTableHeaderCell className="fw-semibold">Status</CTableHeaderCell>
                      <CTableHeaderCell className="fw-semibold" style={{ textAlign: 'center' }}>
                        Actions
                      </CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>

                  <CTableBody>
                    {filteredPlots.length > 0 ? (
                      filteredPlots.map((plot, i) => (
                        <CTableRow
                          key={i}
                          style={{ transition: '0.2s', cursor: 'pointer' }}
                        >
                          <CTableDataCell>
                            <strong>{plot.plot_number}</strong>
                          </CTableDataCell>
                          <CTableDataCell>{plot.project_name}</CTableDataCell>
                          <CTableDataCell>{plot.size}</CTableDataCell>
                          <CTableDataCell>
                            {new Intl.NumberFormat('en-IN', {
                              style: 'currency',
                              currency: 'INR',
                            }).format(plot.price)}
                          </CTableDataCell>
                          <CTableDataCell>
                            <CBadge
                              color={getStatusBadge(plot.status)}
                              shape="rounded-pill"
                              className="px-3 py-2"
                            >
                              {plot.status || 'Unknown'}
                            </CBadge>
                          </CTableDataCell>
                          <CTableDataCell className="text-center">
                            <CButtonGroup>
                              <CButton
                                color="info"
                                size="sm"
                                variant="outline"
                                onClick={() => handleEdit(plot)}
                              >
                                Edit
                              </CButton>
                              <CButton
                                color="danger"
                                size="sm"
                                variant="outline"
                                onClick={() => handleDelete(plot)}
                              >
                                Delete
                              </CButton>
                            </CButtonGroup>
                          </CTableDataCell>
                        </CTableRow>
                      ))
                    ) : (
                      <CTableRow>
                        <CTableDataCell colSpan={6} className="text-center py-4 text-muted">
                          No plots found for the selected project.
                        </CTableDataCell>
                      </CTableRow>
                    )}
                  </CTableBody>
                </CTable>
              </div>
            </CCardBody>
          </CCard>
        )}
      </CContainer>
    </div>
  )
}
