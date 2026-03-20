import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4 d-flex flex-column flex-md-row align-items-center justify-content-between">
      <div className="text-center text-md-start">
        <a href="https://www.sriadityadevelopers.com/" target="_blank" rel="noopener noreferrer">
          Sri Aditya Developers
        </a>
        <span className="ms-1">&copy; 2026.</span>
      </div>
      <div className="text-center text-md-end mt-2 mt-md-0">
        <span className="me-1">Powered by</span>
        <a href="https://www.sriadityadevelopers.com/" target="_blank" rel="noopener noreferrer">
          Sri Aditya Developers
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
