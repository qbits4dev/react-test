import React, { useState } from 'react'
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'
import WidgetsDropdown from '../widgets/WidgetsCardsAd'

const AgentDashboard = () => {
  // Sample widget data
  const agentWidgetsData = [
    {
      id: 'Book Site',
      title: 'Book Site',
      value: '40',
      color: 'danger',
      buttonLink: '/booksite',
      buttonText: 'Book Site',
    },
    {
      id: 'Reports',
      title: 'Reports',
      value: '50',
      changeIcon: 'cilArrowTop',
      color: 'success',
      buttonLink: '/Reports',
    },
    {
      id: 'targets',
      title: 'Targets',
      value: '50',
      changeIcon: 'cilArrowTop',
      color: 'info',
      buttonLink: '/GetTargets',
    },
  ]

  // Targets state (same as in Targets component)
  const [targets, setTargets] = useState([
    { role_id: 1, description: 'Initial Target Example', value: 100 },
  ])

  return (
    <CContainer className="py-4">
      {/* Widgets Section */}
      <WidgetsDropdown widgetsData={agentWidgetsData} className="mb-4" />

      {/* Targets Table Section */}
      <CRow className="justify-content-center">
        <CCol md={12}>
          <CCard className="shadow-sm border-0 rounded-3">
            <CCardHeader className="bg-primary text-white text-center fs-5">
              Targets
            </CCardHeader>
            <CCardBody>
              {targets.length === 0 ? (
                <p className="text-center text-muted py-3">
                  No targets available.
                </p>
              ) : (
                <CTable striped hover responsive>
                  <CTableHead color="dark">
                    <CTableRow>
                      <CTableHeaderCell>#</CTableHeaderCell>
                      <CTableHeaderCell>Role ID</CTableHeaderCell>
                      <CTableHeaderCell>Description</CTableHeaderCell>
                      <CTableHeaderCell>Value</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {targets.map((target, index) => (
                      <CTableRow key={index}>
                        <CTableDataCell>{index + 1}</CTableDataCell>
                        <CTableDataCell>{target.role_id}</CTableDataCell>
                        <CTableDataCell>{target.description}</CTableDataCell>
                        <CTableDataCell>{target.value}</CTableDataCell>
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

export default AgentDashboard
