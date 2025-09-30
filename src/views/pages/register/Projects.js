import React, { useState, useEffect } from 'react';
import {
  CContainer,
  CRow,
  CCol,
  CForm,
  CFormInput,
  CCard,
  CCardBody,
  CDropdown,
  CButton,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
} from '@coreui/react';

export default function Projects() {
  return (
    <CContainer>
      {/* Existing Projects Section */}
      <CRow className="justify-content-center mt-4">
        <CCol md={10}>
          <CCard>
            <CCardBody>
              <h1 className='mb-3'>Projects</h1>
              <CCard class Name='mb-3'></CCard>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
}
