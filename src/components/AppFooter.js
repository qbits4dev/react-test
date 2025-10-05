import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div>
        <a href="https://www.sriadityadevelopers.com/" target="_blank" rel="noopener noreferrer">
          {/* CoreUI */}
          AdityaDevelopers
        </a>
        <span className="ms-1">&copy; 2025 QBITS4DEV.</span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Powered by</span>
        <a href="https://qbits4dev.com/" target="_blank" rel="noopener noreferrer">
          QBITS4DEVELOPERS PVT LTD; 
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
