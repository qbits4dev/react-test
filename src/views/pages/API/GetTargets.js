import React, { useState, useEffect } from 'react'
import {
  CContainer, CRow, CCol, CCard, CCardHeader, CCardBody,
  CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell,
  CSpinner, CButton
} from '@coreui/react'

const GetTargets = () => {
  const [loading, setLoading] = useState(true)
  const [targets, setTargets] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchTargets() {
      setLoading(true)
      try {
        const res = await fetch(`${globalThis.apiBaseUrl}/targets`)
        if (!res.ok) throw new Error('Failed to fetch targets')
        const data = await res.json()
        setTargets(Array.isArray(data) ? data : [])
        setError('')
      } catch (err) {
        setError('Error fetching targets: ' + err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchTargets()
  }, [])

  return (
    <CContainer className="py-4">
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
                      <CTableRow key={t.id}>
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
                          <CButton color="info" size="sm" variant="outline">View</CButton>
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
    </CContainer>
  )
}

export default GetTargets
