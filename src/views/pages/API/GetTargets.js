import React, { useState, useEffect } from 'react'
import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CFormInput,
  CFormTextarea,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CProgress,
  CRow,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'

const editableKeys = [
  'designation',
  'description',
  'value',
  'sale_type',
  'stage',
  'timeframe',
  'target_units',
  'insurance_cover',
  'medical_cover',
  'tour',
  'rewards',
  'salary_monthly',
  'commission_notes',
  'salary_eligibility_notes',
  'other_notes',
]

const keyLabel = (key) =>
  key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())

const normalizeTarget = (target) => {
  const normalized = { ...target }
  editableKeys.forEach((k) => {
    if (normalized[k] === undefined || normalized[k] === null) normalized[k] = ''
  })
  return normalized
}

const updateTargetOnServer = async (target) => {
  const payload = editableKeys.reduce((acc, key) => {
    if (key === 'value') {
      acc[key] = target[key] !== '' && target[key] !== null ? Number(target[key]) : 0
    } else {
      acc[key] = target[key] ?? ''
    }
    return acc
  }, {})

  const id = target.id || target.target_id || target.uid || ''
  const urls = [
    `${globalThis.apiBaseUrl}/targets/${id}`,
    `${globalThis.apiBaseUrl}/api/targets/${id}`,
    `${globalThis.apiBaseUrl}/targets`,
    `${globalThis.apiBaseUrl}/api/targets`,
  ]

  for (const url of urls) {
    for (const method of ['PUT', 'PATCH']) {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(id ? payload : { ...payload, id }),
      })
      if (res.ok) return true
    }
  }
  return false
}

const GetTargets = () => {
  const [loading, setLoading] = useState(true)
  const [targets, setTargets] = useState([])
  const [error, setError] = useState('')
  const [message, setMessage] = useState({ visible: false, color: 'success', text: '' })

  const [viewModalVisible, setViewModalVisible] = useState(false)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [selectedTarget, setSelectedTarget] = useState(null)
  const [saving, setSaving] = useState(false)

  const fetchTargets = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${globalThis.apiBaseUrl}/targets`)
      if (!res.ok) throw new Error('Failed to fetch targets')
      const data = await res.json()
      const list = Array.isArray(data) ? data : data?.data || []
      setTargets(Array.isArray(list) ? list : [])
      setError('')
    } catch (err) {
      setError('Error fetching targets: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTargets()
  }, [])

  const openView = (target) => {
    setSelectedTarget(normalizeTarget(target))
    setViewModalVisible(true)
  }

  const openEdit = (target) => {
    setSelectedTarget(normalizeTarget(target))
    setEditModalVisible(true)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setSelectedTarget((prev) => ({ ...prev, [name]: value }))
  }

  const getProgress = (target) => {
    const total = Number(target.target_units || 0)
    const completed = Number(target.achieved_units || target.completed_units || 0)
    const pending = Math.max(total - completed, 0)
    const percentage = total > 0 ? Math.min(Math.round((completed / total) * 100), 100) : 0
    return { total, completed, pending, percentage }
  }

  const handleSave = async () => {
    if (!selectedTarget) return

    const required = ['designation', 'description', 'value', 'stage', 'target_units']
    for (const key of required) {
      if (!String(selectedTarget[key] || '').trim()) {
        setMessage({ visible: true, color: 'danger', text: `${keyLabel(key)} is required.` })
        return
      }
    }

    setSaving(true)
    try {
      const success = await updateTargetOnServer(selectedTarget)
      setTargets((prev) =>
        prev.map((item) => ((item.id || item.target_id) === (selectedTarget.id || selectedTarget.target_id) ? { ...item, ...selectedTarget } : item)),
      )
      setMessage({
        visible: true,
        color: success ? 'success' : 'warning',
        text: success ? 'Target updated successfully.' : 'Target updated locally. Server update endpoint is unavailable.',
      })
      setEditModalVisible(false)
      await fetchTargets()
    } catch {
      setMessage({ visible: true, color: 'danger', text: 'Failed to update target.' })
    } finally {
      setSaving(false)
      setSelectedTarget(null)
    }
  }

  return (
    <CContainer className="py-4">
      {message.visible && (
        <CAlert color={message.color} dismissible onClose={() => setMessage((prev) => ({ ...prev, visible: false }))}>
          {message.text}
        </CAlert>
      )}

      <CRow className="justify-content-center">
        <CCol md={12}>
          <CCard className="shadow-lg border-0 rounded-4">
            <CCardHeader className="bg-gradient-primary text-primary rounded-top-4">
              <h4 className="m-2 text-center fw-bold">Targets Overview</h4>
            </CCardHeader>
            <CCardBody>
              {loading ? (
                <div className="text-center py-5">
                  <CSpinner color="primary" />
                  <p className="mt-3">Loading targets...</p>
                </div>
              ) : error ? (
                <div className="text-danger text-center py-3">{error}</div>
              ) : (
                <CTable hover responsive align="middle">
                  <CTableHead color="light">
                    <CTableRow>
                      <CTableHeaderCell>#</CTableHeaderCell>
                      <CTableHeaderCell>Designation</CTableHeaderCell>
                      <CTableHeaderCell>Stage</CTableHeaderCell>
                      <CTableHeaderCell>Sale Type</CTableHeaderCell>
                      <CTableHeaderCell>Target Units</CTableHeaderCell>
                      <CTableHeaderCell>Insurance Cover</CTableHeaderCell>
                      <CTableHeaderCell>Medical Cover</CTableHeaderCell>
                      <CTableHeaderCell>Tour</CTableHeaderCell>
                      <CTableHeaderCell>Rewards</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Actions</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {targets.map((t, index) => (
                      <CTableRow key={t.id || t.target_id || index}>
                        <CTableDataCell>{index + 1}</CTableDataCell>
                        <CTableDataCell>{t.designation}</CTableDataCell>
                        <CTableDataCell>{t.stage}</CTableDataCell>
                        <CTableDataCell>{t.sale_type}</CTableDataCell>
                        <CTableDataCell>{t.target_units}</CTableDataCell>
                        <CTableDataCell>{t.insurance_cover}</CTableDataCell>
                        <CTableDataCell>{t.medical_cover}</CTableDataCell>
                        <CTableDataCell>{t.tour}</CTableDataCell>
                        <CTableDataCell>{t.rewards}</CTableDataCell>
                        <CTableDataCell className="text-center">
                          <div className="d-flex gap-2 justify-content-center">
                            <CButton color="info" size="sm" variant="outline" onClick={() => openView(t)}>
                              View
                            </CButton>
                            <CButton color="warning" size="sm" variant="outline" onClick={() => openEdit(t)}>
                              Edit
                            </CButton>
                          </div>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CModal visible={viewModalVisible} onClose={() => setViewModalVisible(false)} size="lg">
        <CModalHeader>
          <CModalTitle>Target Details & Progress</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedTarget && (
            <>
              <CRow className="g-3 mb-4">
                {editableKeys.map((key) => (
                  <CCol md={6} key={key}>
                    <CFormInput label={keyLabel(key)} value={selectedTarget[key] ?? ''} readOnly />
                  </CCol>
                ))}
              </CRow>

              <h6 className="mb-3">Progress</h6>
              {(() => {
                const { completed, pending, percentage, total } = getProgress(selectedTarget)
                return (
                  <>
                    <p className="mb-1">Completed: <strong>{completed}</strong></p>
                    <p className="mb-1">Pending: <strong>{pending}</strong></p>
                    <p className="mb-2">Percentage Achieved: <strong>{percentage}%</strong> (of {total})</p>
                    <CProgress height={18} value={percentage} color={percentage >= 80 ? 'success' : percentage >= 40 ? 'warning' : 'danger'} />
                  </>
                )
              })()}
            </>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" variant="ghost" onClick={() => setViewModalVisible(false)}>
            Close
          </CButton>
          <CButton
            color="primary"
            onClick={() => {
              setViewModalVisible(false)
              setEditModalVisible(true)
            }}
          >
            Edit
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal visible={editModalVisible} onClose={() => setEditModalVisible(false)} size="lg" backdrop="static">
        <CModalHeader>
          <CModalTitle>Edit Target</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedTarget && (
            <CRow className="g-3">
              {editableKeys.map((key) => (
                <CCol md={6} key={key}>
                  {key.includes('notes') || key === 'rewards' ? (
                    <CFormTextarea name={key} label={keyLabel(key)} value={selectedTarget[key] ?? ''} onChange={handleChange} rows={2} />
                  ) : (
                    <CFormInput
                      name={key}
                      label={keyLabel(key)}
                      value={selectedTarget[key] ?? ''}
                      onChange={handleChange}
                      type={['timeframe', 'target_units', 'salary_monthly'].includes(key) ? 'number' : 'text'}
                    />
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
    </CContainer>
  )
}

export default GetTargets
