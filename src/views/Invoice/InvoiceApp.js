import React from 'react'
import Header from './Invoicecompanents/HeaderInvoice'
import Body from './Invoicecompanents/BodyInvoice'
import Footer from './Invoicecompanents/FooterInvoice'
import { CContainer } from '@coreui/react'

function App() {
  return (
    <CContainer fluid className="d-flex flex-column min-vh-100">
      <Header />
      <div className="flex-grow-1">
        <Body />
      </div>
      <Footer />
    </CContainer>
  )
}

export default App
