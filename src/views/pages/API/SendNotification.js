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

  // Helper to extract all unique string tokens from response data
  const extractAllTokens = (data) => {
    if (!data) return []
    const tokens = new Set()

    const addToken = (token) => {
      if (typeof token === 'string' && token.trim()) {
        tokens.add(token.trim())
      }
    }

    const processItem = (item) => {
      if (!item) return
      addToken(item.fcm_token)
      addToken(item.token)
      if (typeof item === 'string') {
        addToken(item)
      }
    }

    if (Array.isArray(data)) {
      data.forEach(processItem)
    } else {
      // Check direct properties
      processItem(data)
      // Check standard keys that might hold arrays
      const arrayKeys = ['data', 'tokens', 'results', 'fcm_tokens']
      for (const key of arrayKeys) {
        if (Array.isArray(data[key])) {
          data[key].forEach(processItem)
        }
      }
      // Check data property if it's an object
      if (data.data) {
        processItem(data.data)
      }
    }

    return Array.from(tokens)
  }

  // Helper to find the specific token object matching the fcm_token
  const findTokenObject = (data, targetToken) => {
    if (!data) return null

    const checkItem = (item) => {
      if (!item) return false
      return item.fcm_token === targetToken || item.token === targetToken
    }

    if (Array.isArray(data)) {
      return data.find(checkItem) || null
    }

    const arrayKeys = ['data', 'tokens', 'results', 'fcm_tokens']
    for (const key of arrayKeys) {
      if (Array.isArray(data[key])) {
        const found = data[key].find(checkItem)
        if (found) return found
      }
    }

    if (checkItem(data)) return data
    if (data.data && checkItem(data.data)) return data.data

    return null
  }

  // Helper to safely get a trimmed string
  const getSafeString = (value) => {
    return typeof value === 'string' ? value.trim() : ''
  }

  // Real-time validator
  const validateField = (name, value) => {
    const v = getSafeString(value)
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

    const fcmTokenInput = getSafeString(formData.fcm_token)
    const uId = getSafeString(formData.u_id)
    const topic = getSafeString(formData.topic)

    let tokensToUse = fcmTokenInput
      ? fcmTokenInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
      : []
    let apiOutputToUse = firebaseApiOutput

    // Automatically fetch Firebase token(s) if u_id is entered
    if (uId) {
      setFetchingToken(true)
      try {
        const getUrl = `${globalThis.apiBaseUrl}/firebase?u_id=${encodeURIComponent(uId)}`
        console.log('Automatically fetching Firebase tokens for submission:', getUrl)
        const getRes = await fetch(getUrl)

        if (!getRes.ok) {
          throw new Error(`Failed to fetch Firebase token: status ${getRes.status}`)
        }

        const data = await getRes.json()
        console.log('Firebase token GET response during submit:', data)
        apiOutputToUse = data
        setFirebaseApiOutput(data)

        const extractedTokens = extractAllTokens(data)

        if (extractedTokens && extractedTokens.length > 0) {
          tokensToUse = extractedTokens
          setFormData((prev) => ({ ...prev, fcm_token: extractedTokens.join(', ') }))
        } else {
          throw new Error(`No device token was found for user ID ${uId}.`)
        }
      } catch (error) {
        console.error('Error fetching token during submission:', error)
        setMessage({
          visible: true,
          color: 'danger',
          text: `Failed to retrieve device token for user ID ${uId}: ${error.message}`,
        })
        setSending(false)
        setFetchingToken(false)
        return
      } finally {
        setFetchingToken(false)
      }
    } else if (tokensToUse.length === 0 && !topic) {
      setMessage({
        visible: true,
        color: 'danger',
        text: 'Please provide either a User ID, specific Device Token (FCM Token), or Broadcast Topic.',
      })
      setSending(false)
      return
    }

    // Determine target list to loop through
    const targets = tokensToUse.length > 0 ? tokensToUse : [null]
    let successCount = 0

    try {
      for (const token of targets) {
        const tokenObj = findTokenObject(apiOutputToUse, token)
        const payload = {
          title: getSafeString(formData.title),
          body: getSafeString(formData.body),
          image_url: getSafeString(formData.image_url) || null,
          u_id: uId || null,
          topic: topic || null,
          fcm_token: token || null,
          firebase_output: tokenObj || apiOutputToUse,
          ...(tokenObj || {}), // merge properties at the root level for this token
        }

        const url = `${globalThis.apiBaseUrl}/firebase/send`
        console.log('Latest payload being sent to POST:', payload)
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        if (!res.ok) {
          throw new Error(`Notification sending failed with status ${res.status}`)
        }

        const resData = await res.json()
        console.log('Notification sending response for token', token, ':', resData)
        successCount++
      }

      setMessage({
        visible: true,
        color: 'success',
        text: `Notification dispatched successfully to ${successCount} device(s)!`,
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
        text: `Failed to send notification: ${error.message} (Dispatched successfully to ${successCount} device(s) prior to error)`,
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
                  <small style={{ opacity: 0.8 }}>
                    Send system tray notifications to mobile app users
                  </small>
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
                  {errors.title && (
                    <small className="text-danger d-block mt-1">{errors.title}</small>
                  )}
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
                  {errors.image_url && (
                    <small className="text-danger d-block mt-1">{errors.image_url}</small>
                  )}
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
                  <CFormInput
                    id="u_id"
                    name="u_id"
                    placeholder="e.g. AGT001 or CLT002"
                    value={formData.u_id}
                    onChange={handleChange}
                  />
                  <small className="text-muted d-block mt-1">
                    Enter the User ID. The system will automatically retrieve the latest device token during submission.
                  </small>
                </div>

                {/* <div className="mb-3">
                  <CFormLabel htmlFor="fcm_token" className="fw-semibold text-muted">
                    Specific Device Token (FCM Token)
                  </CFormLabel>
                  <CFormInput
                    id="fcm_token"
                    name="fcm_token"
                    placeholder="Auto-filled on Send, or enter manually"
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
                </div> */}

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
          {/* {firebaseApiOutput && (
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
          )} */}
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default SendNotification
