import React, { useState } from 'react'
import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CRow,
  CSpinner,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilBell, cilCloudDownload, cilSend } from '@coreui/icons'

const SendNotification = () => {
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    image_url: '',
    u_id: '',
    topic: '',
    fcm_token: '',
  })

  const [errors, setErrors] = useState({})
  const [fetchingToken, setFetchingToken] = useState(false)
  const [sending, setSending] = useState(false)
  const [firebaseApiOutput, setFirebaseApiOutput] = useState(null)
  const [message, setMessage] = useState({ visible: false, color: 'success', text: '' })

  const gradientHeaderStyle = {
    background: 'linear-gradient(45deg, #1e3c72, #2a5298)',
    color: 'white',
  }

  // Real-time validator
  const validateField = (name, value) => {
    const v = value.trim()
    switch (name) {
      case 'title':
        if (!v) return 'Title is required.'
        if (v.length < 3) return 'Title must be at least 3 characters.'
        if (v.length > 100) return 'Title must not exceed 100 characters.'
        break
      case 'body':
        if (!v) return 'Body is required.'
        if (v.length < 5) return 'Body must be at least 5 characters.'
        if (v.length > 500) return 'Body must not exceed 500 characters.'
        break
      case 'image_url':
        if (v && !/^https:\/\/.+/i.test(v)) {
          return 'Image URL must be a valid HTTPS URL (start with https://).'
        }
        break
      default:
        return ''
    }
    return ''
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Validate in real-time
    const err = validateField(name, value)
    setErrors((prev) => ({ ...prev, [name]: err }))
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    const err = validateField(name, value)
    setErrors((prev) => ({ ...prev, [name]: err }))
  }

  const validateAll = () => {
    const newErrors = {}
    Object.keys(formData).forEach((key) => {
      const err = validateField(key, formData[key])
      if (err) newErrors[key] = err
    })
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Fetch Firebase token for the user
  const fetchFirebaseToken = async () => {
    if (!formData.u_id.trim()) {
      setMessage({
        visible: true,
        color: 'warning',
        text: 'Please enter a User ID (u_id) first.',
      })
      return
    }

    setFetchingToken(true)
    setFirebaseApiOutput(null)
    setMessage({ visible: false, color: 'success', text: '' })

    try {
      const uId = formData.u_id.trim()
      const url = `${globalThis.apiBaseUrl}/firebase?u_id=${encodeURIComponent(uId)}`
      console.log('Fetching Firebase token from:', url)
      const res = await fetch(url)
      
      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`)
      }

      const data = await res.json()
      console.log('Firebase token GET response:', data)
      setFirebaseApiOutput(data)

      // Try to extract fcm_token from data object
      const token = data.fcm_token || data.token || (Array.isArray(data.tokens) ? data.tokens[0] : data.tokens) || data.data || ''

      if (token) {
        setFormData((prev) => ({ ...prev, fcm_token: token }))
        setMessage({
          visible: true,
          color: 'success',
          text: `Device token retrieved successfully for user ID ${uId}.`,
        })
      } else {
        setMessage({
          visible: true,
          color: 'info',
          text: `Request succeeded, but no device token was found for user ID ${uId}.`,
        })
      }
    } catch (error) {
      console.error('Error fetching Firebase token:', error)
      setMessage({
        visible: true,
        color: 'danger',
        text: `Failed to fetch Firebase token: ${error.message}`,
      })
    } finally {
      setFetchingToken(false)
    }
  }

  // Submit notifications
  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage({ visible: false, color: 'success', text: '' })

    if (!validateAll()) {
      setMessage({
        visible: true,
        color: 'danger',
        text: 'Please fix validation errors before sending.',
      })
      return
    }

    setSending(true)

    // Assemble the complete payload containing both form fields and the retrieved firebase API response
    const payload = {
      title: formData.title.trim(),
      body: formData.body.trim(),
      image_url: formData.image_url.trim() || null,
      u_id: formData.u_id.trim() || null,
      topic: formData.topic.trim() || null,
      fcm_token: formData.fcm_token.trim() || null,
      firebase_output: firebaseApiOutput,
      ...firebaseApiOutput, // merge properties at the root level as requested
    }

    try {
      const url = `${globalThis.apiBaseUrl}/firebase/send`
      console.log('Sending notification POST payload:', payload)
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        throw new Error(`Notification sending failed with status ${res.status}`)
      }

      const resData = await res.json()
      console.log('Notification sending response:', resData)

      setMessage({
        visible: true,
        color: 'success',
        text: 'Notification dispatched successfully to mobile app users!',
      })

      // Reset form on success
      setFormData({
        title: '',
        body: '',
        image_url: '',
        u_id: '',
        topic: '',
        fcm_token: '',
      })
      setFirebaseApiOutput(null)
    } catch (error) {
      console.error('Error sending notification:', error)
      setMessage({
        visible: true,
        color: 'danger',
        text: `Failed to send notification: ${error.message}`,
      })
    } finally {
      setSending(false)
    }
  }

  return (
    <CContainer className="py-4">
      {message.visible && (
        <CAlert
          color={message.color}
          dismissible
          onClose={() => setMessage((prev) => ({ ...prev, visible: false }))}
          className="mb-4 shadow-sm"
        >
          {message.text}
        </CAlert>
      )}

      <CRow className="justify-content-center">
        <CCol lg={8} md={10}>
          <CCard className="shadow-lg border-0 rounded-4 overflow-hidden mb-4">
            <CCardHeader style={gradientHeaderStyle} className="p-4 border-0">
              <div className="d-flex align-items-center gap-3">
                <div
                  className="rounded-circle p-2 d-inline-flex bg-white text-primary"
                  style={{ opacity: 0.95 }}
                >
                  <CIcon icon={cilBell} size="lg" style={{ color: '#1e3c72' }} />
                </div>
                <div>
                  <h4 className="fw-bold mb-0">Push Notifications Control</h4>
                  <small style={{ opacity: 0.8 }}>Send system tray notifications to mobile app users</small>
                </div>
              </div>
            </CCardHeader>

            <CCardBody className="p-4 p-md-5">
              <CForm onSubmit={handleSubmit} noValidate>
                {/* Section 1: Notification Contents */}
                <h5 className="text-primary fw-semibold border-bottom pb-2 mb-4">
                  1. Message Contents
                </h5>

                <div className="mb-3">
                  <CFormLabel htmlFor="title" className="fw-semibold text-muted">
                    Notification Title <span className="text-danger">*</span>
                  </CFormLabel>
                  <CFormInput
                    id="title"
                    name="title"
                    placeholder="Enter notification headline"
                    value={formData.title}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    invalid={!!errors.title}
                  />
                  {errors.title && <small className="text-danger d-block mt-1">{errors.title}</small>}
                </div>

                <div className="mb-3">
                  <CFormLabel htmlFor="body" className="fw-semibold text-muted">
                    Notification Body <span className="text-danger">*</span>
                  </CFormLabel>
                  <CFormTextarea
                    id="body"
                    name="body"
                    rows={4}
                    placeholder="Enter notification details..."
                    value={formData.body}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    invalid={!!errors.body}
                  />
                  {errors.body && <small className="text-danger d-block mt-1">{errors.body}</small>}
                </div>

                <div className="mb-4">
                  <CFormLabel htmlFor="image_url" className="fw-semibold text-muted">
                    Image URL (HTTPS)
                  </CFormLabel>
                  <CFormInput
                    id="image_url"
                    name="image_url"
                    placeholder="https://example.com/image.png"
                    value={formData.image_url}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    invalid={!!errors.image_url}
                  />
                  {errors.image_url && <small className="text-danger d-block mt-1">{errors.image_url}</small>}
                  {formData.image_url && !errors.image_url && (
                    <div className="mt-3 p-2 border rounded-3 bg-light text-center">
                      <div className="small text-muted mb-2">Image Preview</div>
                      <img
                        src={formData.image_url}
                        alt="Tray preview"
                        style={{ maxHeight: '120px', maxWidth: '100%', objectFit: 'contain' }}
                        onError={(e) => {
                          e.target.style.display = 'none'
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Section 2: Delivery Targets */}
                <h5 className="text-primary fw-semibold border-bottom pb-2 mb-4">
                  2. Audience & Delivery Targets
                </h5>

                <div className="mb-4 p-3 rounded-3 bg-light border">
                  <CFormLabel htmlFor="u_id" className="fw-semibold text-muted">
                    Target User ID (u_id)
                  </CFormLabel>
                  <CRow className="g-2">
                    <CCol>
                      <CFormInput
                        id="u_id"
                        name="u_id"
                        placeholder="e.g. AGT001 or CLT002"
                        value={formData.u_id}
                        onChange={handleChange}
                      />
                    </CCol>
                    <CCol xs="auto">
                      <CButton
                        color="dark"
                        onClick={fetchFirebaseToken}
                        disabled={fetchingToken}
                        className="d-flex align-items-center gap-2"
                      >
                        {fetchingToken ? (
                          <>
                            <CSpinner size="sm" /> Fetching...
                          </>
                        ) : (
                          <>
                            <CIcon icon={cilCloudDownload} /> Fetch Tokens
                          </>
                        )}
                      </CButton>
                    </CCol>
                  </CRow>
                  <small className="text-muted d-block mt-1">
                    Enter the User ID to retrieve device tokens from the Firebase token store.
                  </small>
                </div>

                <div className="mb-3">
                  <CFormLabel htmlFor="fcm_token" className="fw-semibold text-muted">
                    Specific Device Token (FCM Token)
                  </CFormLabel>
                  <CFormInput
                    id="fcm_token"
                    name="fcm_token"
                    placeholder="Auto-filled from Fetch, or enter manually"
                    value={formData.fcm_token}
                    onChange={handleChange}
                  />
                  <small className="text-muted">
                    Direct token for delivering to a single device.
                  </small>
                </div>

                <div className="mb-4">
                  <CFormLabel htmlFor="topic" className="fw-semibold text-muted">
                    Broadcast Topic
                  </CFormLabel>
                  <CFormInput
                    id="topic"
                    name="topic"
                    placeholder="e.g. all_user or promotions"
                    value={formData.topic}
                    onChange={handleChange}
                  />
                  <small className="text-muted">
                    Send to all app instances subscribed to a specific FCM channel.
                  </small>
                </div>

                {/* Submit Action */}
                <div className="d-grid mt-4">
                  <CButton
                    type="submit"
                    color="primary"
                    size="lg"
                    disabled={sending}
                    className="fw-bold d-flex align-items-center justify-content-center gap-2 border-0"
                    style={{ background: 'linear-gradient(45deg, #1e3c72, #2a5298)' }}
                  >
                    {sending ? (
                      <>
                        <CSpinner size="sm" /> Sending Notification...
                      </>
                    ) : (
                      <>
                        <CIcon icon={cilSend} /> Send Push Notification
                      </>
                    )}
                  </CButton>
                </div>
              </CForm>
            </CCardBody>
          </CCard>

          {/* Firebase API Response Log Drawer */}
          {firebaseApiOutput && (
            <CCard className="shadow border-0 rounded-4 overflow-hidden mb-4 bg-dark text-light">
              <CCardHeader className="p-3 border-0 bg-secondary text-white d-flex justify-content-between align-items-center">
                <span className="fw-bold small font-monospace">Firebase Store Output</span>
                <span className="badge bg-success">Fetched</span>
              </CCardHeader>
              <CCardBody className="p-3">
                <pre className="mb-0 text-success small" style={{ maxHeight: '180px', overflowY: 'auto' }}>
                  {JSON.stringify(firebaseApiOutput, null, 2)}
                </pre>
              </CCardBody>
            </CCard>
          )}
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default SendNotification
