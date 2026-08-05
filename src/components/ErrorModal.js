import React from 'react'
import PropTypes from 'prop-types'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilXCircle } from '@coreui/icons'
import { extractErrorMessage } from '../utils/errorUtils'

/**
 * Designated Error Modal Dialog component for displaying API and submission errors.
 * Form data remains intact on failure so the user can correct inputs and resubmit.
 */
export const ErrorModal = ({ visible, title, errorMessage, onClose }) => {
  const displayMsg = extractErrorMessage(errorMessage, 'An unexpected error occurred. Please try again.')

  return (
    <CModal
      visible={visible}
      onClose={onClose}
      backdrop="static"
      alignment="center"
      className="shadow-lg"
    >
      <CModalHeader className="bg-danger text-white border-0 py-3">
        <CModalTitle className="d-flex align-items-center gap-2 fs-5 fw-bold">
          <CIcon icon={cilXCircle} size="xl" />
          <span>{title || 'Submission Error'}</span>
        </CModalTitle>
      </CModalHeader>
      <CModalBody className="p-4 bg-light">
        <div className="p-3 bg-white rounded-3 border border-danger-subtle shadow-sm">
          <div className="text-muted small mb-1 fw-bold text-uppercase tracking-wide">
            Server Response / Error Details
          </div>
          <p className="text-danger fw-medium mb-0 fs-6" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {displayMsg}
          </p>
        </div>
        <p className="text-secondary small mt-3 mb-0">
          Your input details have been preserved. Please review the error, make any necessary corrections, and try submitting again.
        </p>
      </CModalBody>
      <CModalFooter className="bg-light border-0 pt-0 pb-3 pe-4">
        <CButton color="danger" className="px-4 fw-semibold shadow-sm text-white" onClick={onClose}>
          Close & Fix
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

ErrorModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  title: PropTypes.string,
  errorMessage: PropTypes.any,
  onClose: PropTypes.func.isRequired,
}

export default ErrorModal
