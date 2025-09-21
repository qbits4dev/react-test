import React from 'react'
import { CContainer, CCard, CCardBody } from '@coreui/react'

export default function Body() {
  return (
    <CContainer className="my-4">
      <CCard>
        <CCardBody>
          <h5>This is the Body Section</h5>
          <p>You can place forms, tables, or dashboard widgets here.</p>
        </CCardBody>
      </CCard>
    </CContainer>
  )
}
