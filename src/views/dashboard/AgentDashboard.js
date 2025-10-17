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
  CTableDataCell
} from '@coreui/react'
import WidgetsDropdown from '../widgets/WidgetsCardsAd'
import UpcomingVisitsWidget from '../pages/register/VisitCalender'

const AgentDashboard = () => {
  // Sample widget data
  const agentWidgetsData = [
    {
      id: 'Book Site Visit',
      title: 'Schedule a Site Visit',
      value: '40',
      color: 'danger',
      buttonLink: '/bookvisit',
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
    <CContainer fluid className="py-4 px-3">
      {/* ===== Widgets Section ===== */}
      <CRow className="g-4">
        <CCol xs={12}>
          <WidgetsDropdown widgetsData={agentWidgetsData} />
        </CCol>
      </CRow>

      {/* ===== Upcoming Visits Section ===== */}
      <CRow className="mt-4">
        {/* Left Side – Upcoming Visits */}
        <CCol md={6}>
          <CCard className="shadow-sm border-0 rounded-3 h-100">
            <CCardHeader className="bg-info text-white text-center fs-5 fw-semibold py-3">
              Upcoming Client Visits
            </CCardHeader>
            <CCardBody className="p-3">
              <UpcomingVisitsWidget />
            </CCardBody>
          </CCard>
        </CCol>

        {/* Right Side (Keep empty for now or use later) */}
        <CCol md={6}></CCol>
      </CRow>



      {/* ===== Targets Table Section (Future Use) ===== */}

      {/* <CRow className="mt-4">
          <CCol xs={12}>
            <CCard className="shadow-sm border-0 rounded-3">
              <CCardHeader className="bg-light fw-semibold">
                Current Targets
              </CCardHeader>
              <CCardBody>
                <CTable responsive hover align="middle">
                  <CTableHead className="table-info text-center">
                    <CTableRow>
                      <CTableHeaderCell>Role ID</CTableHeaderCell>
                      <CTableHeaderCell>Description</CTableHeaderCell>
                      <CTableHeaderCell>Value</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {targets.map((target, index) => (
                      <CTableRow key={index} className="text-center">
                        <CTableDataCell>{target.role_id}</CTableDataCell>
                        <CTableDataCell>{target.description}</CTableDataCell>
                        <CTableDataCell>{target.value}</CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow> */}

    </CContainer>
  )
}

export default AgentDashboard
