import React from 'react'
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'
import '../invoice.css'

export default function InvoiceBody() {
  return (
    <div className="invoice-body">
      <CContainer>
        <CCard>
          <CCardBody>
            <CRow className="mb-3">
              <CCol><h6>Invoice No: SAD-INV-1007</h6></CCol>
              <CCol className="text-end">
                <p className="mb-0">Invoice Date: 17-Aug-2025</p>
                <p className="mb-0">Due Date: 24-Aug-2025</p>
              </CCol>
            </CRow>

            <CRow className="mb-4">
              <CCol md={6}>
                <h6>Bill To</h6>
                <p>
                  Mr./Ms. Client Name <br />
                  Client Address Line 1 <br />
                  City, State, PIN <br />
                  Phone: +91-XXXXXXXXXX <br />
                  Email: client@example.com
                </p>
              </CCol>
              <CCol md={6}>
                <h6>Property Details</h6>
                <p>
                  Project: <b>Aditya Meadows</b> <br />
                  Property Type: <b>Villa</b> <br />
                  Unit No: <b>V-12</b> • Plot No: <b>45</b> <br />
                  Super Built-up Area: <b>2,400 sq.ft</b> <br />
                  Location: <b>Kokapet, Hyderabad</b>
                </p>
              </CCol>
            </CRow>

            <CTable bordered>
              <CTableHead color="light">
                <CTableRow>
                  <CTableHeaderCell>Description</CTableHeaderCell>
                  <CTableHeaderCell className="text-end">Qty/Area</CTableHeaderCell>
                  <CTableHeaderCell className="text-end">Rate</CTableHeaderCell>
                  <CTableHeaderCell className="text-end">Amount (₹)</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                <CTableRow>
                  <CTableDataCell>Base Price (Property Value)</CTableDataCell>
                  <CTableDataCell className="text-end">2400 sq.ft</CTableDataCell>
                  <CTableDataCell className="text-end">₹ 5,000</CTableDataCell>
                  <CTableDataCell className="text-end">₹ 1,20,00,000</CTableDataCell>
                </CTableRow>
                <CTableRow color="primary" className="text-white fw-bold">
                  <CTableDataCell colSpan={3}>Total</CTableDataCell>
                  <CTableDataCell className="text-end">₹ 1,20,00,000</CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CContainer>
    </div>
  )
}
