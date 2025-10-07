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
import UpcomingVisitsWidget from '../pages/register/VisitCalender'

const AgentDashboard = () => {
  // Sample widget data
  const agentWidgetsData = [
    {
      id: 'Book Site Visit',
      title: 'Book Site Visit',
      value: '40',
      color: 'danger',
      buttonLink: '/bookvisit',
      buttonText: 'Book Site visit',
    },
    {
      id: 'Site Visits',
      title: 'Site Visits',
      value: '20',
      changeIcon: 'cilArrowTop',
      color: 'warning',
      buttonLink: '/GetBookVisit',
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

  const [targets, setTargets] = useState([
    { role_id: 1, description: 'Initial Target Example', value: 15 },
  ])

  return (
    <CContainer className="py-4">
      {/* Widgets Section */}
      <WidgetsDropdown widgetsData={agentWidgetsData} className="mb-4" />

      {/* Targets Section */}
      <CRow className="justify-content-center mb-4">
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
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>S.no</CTableHeaderCell>
                      <CTableHeaderCell>Role ID</CTableHeaderCell>
                      <CTableHeaderCell>Description</CTableHeaderCell>
                      <CTableHeaderCell>Plots</CTableHeaderCell>
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

      {/* Upcoming Visits Widget Section */}
      <CRow className="justify-content-center">
        <CCol md={10}>
          <CCard className="shadow-sm border-0 rounded-3">
            <CCardHeader className="bg-info text-white text-center fs-5">
              Upcoming Client Visits
            </CCardHeader>
            <CCardBody>
              <UpcomingVisitsWidget />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default AgentDashboard
