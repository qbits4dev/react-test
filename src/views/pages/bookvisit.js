import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormFeedback,
  CButton,
  CRow,
  CCol,
  CInputGroup,
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import { sanitizeName, sanitizeNumeric, sanitizeText, validateIndianMobile } from '../../utils/validation'

export default function LeadForm() {
  const navigate = useNavigate()

  // Get agent ID from localStorage using possible keys
  const agentIdFromStorage =
    localStorage.getItem('user_id') || localStorage.getItem('u_id') || ''

  const [leadType, setLeadType] = useState('')
  const [formData, setFormData] = useState({
    customerId: '',
    agentId: agentIdFromStorage,
    phone: '',
    firstName: '',
    lastName: '',
    interestedIn: '',
    plot: '',
    dateOfVisit: '',
    timeOfVisit: '',
    purpose: '',
    feedback: '',
  })
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [loading, setLoading] = useState(false)

  const [projects, setProjects] = useState([])
  const [plots, setPlots] = useState([])
  const [projectsLoading, setProjectsLoading] = useState(false)
  const [plotsLoading, setPlotsLoading] = useState(false)
  const [agentsAndAdmins, setAgentsAndAdmins] = useState([])
  const minVisitDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  useEffect(() => {
    const fetchAgentsAndAdmins = async () => {
      try {
        const resAgents = await fetch(`${globalThis.apiBaseUrl}/users/`)
        let agentUserIds = []
        if (resAgents.ok) {
          const agentData = await resAgents.json()
          if (agentData?.success && Array.isArray(agentData.users)) {
            agentUserIds = agentData.users
          } else if (Array.isArray(agentData)) {
            agentUserIds = agentData
          }
        }

        let adminData = null
        try {
          const resAdmins = await fetch(`${globalThis.apiBaseUrl}/users/admin`)
          if (resAdmins.ok) {
            adminData = await resAdmins.json()
          } else {
            const resAdminsBackup = await fetch(`${globalThis.apiBaseUrl}/users/admin/`)
            if (resAdminsBackup.ok) {
              adminData = await resAdminsBackup.json()
            }
          }
        } catch (e) {
          console.error('Failed to fetch admin list without trailing slash, trying backup:', e)
          try {
            const resAdminsBackup = await fetch(`${globalThis.apiBaseUrl}/users/admin/`)
            if (resAdminsBackup.ok) {
              adminData = await resAdminsBackup.json()
            }
          } catch (errBackup) {
            console.error('Backup admin fetch failed:', errBackup)
          }
        }

        let adminUserIds = []
        let directAdminDetails = []
        if (adminData) {
          const rawAdmins = adminData?.users || adminData?.admins || adminData || []
          if (Array.isArray(rawAdmins)) {
            rawAdmins.forEach(item => {
              if (typeof item === 'string' || typeof item === 'number') {
                adminUserIds.push(String(item))
              } else if (item && typeof item === 'object') {
                directAdminDetails.push(item)
              }
            })
          }
        }

        const idsToFetch = Array.from(new Set([...agentUserIds, ...adminUserIds]))
        
        const fetchedDetails = await Promise.all(
          idsToFetch.map(async (uId) => {
            try {
              const userRes = await fetch(`${globalThis.apiBaseUrl}/users/${uId}`)
              if (userRes.ok) {
                return await userRes.json()
              }
            } catch (e) {
              console.error(e)
            }
            return null
          })
        )

        const allDetails = [...fetchedDetails, ...directAdminDetails]

        const filtered = allDetails.filter(
          (u) => u && (u.success || u.u_id || u.id) && (String(u.role || '').toLowerCase() === 'agent' || String(u.role || '').toLowerCase() === 'admin')
        ).map((u) => ({
          u_id: u.u_id || u.id,
          name: `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.u_id
        }))

        const uniqueFiltered = []
        const seen = new Set()
        for (const item of filtered) {
          if (item.u_id && !seen.has(item.u_id)) {
            seen.add(item.u_id)
            uniqueFiltered.push(item)
          }
        }

        setAgentsAndAdmins(uniqueFiltered)
      } catch (err) {
        console.error('Error fetching agents/admins:', err)
      }
    }
    fetchAgentsAndAdmins()
  }, [])

  useEffect(() => {
    const fetchProjects = async () => {
      setProjectsLoading(true)
      try {
        const res = await fetch(`${globalThis.apiBaseUrl}/projects/`)
        if (res.ok) {
          const data = await res.json()
          setProjects(Array.isArray(data.data) ? data.data : [])
        }
      } catch (err) {
        console.error('Failed to fetch projects:', err)
      } finally {
        setProjectsLoading(false)
      }
    }
    fetchProjects()
  }, [])

  const handleProjectChange = async (e) => {
    const projectName = e.target.value
    setFormData((prev) => ({ ...prev, interestedIn: projectName, plot: '' }))
    setPlots([])

    if (!projectName) return

    setPlotsLoading(true)
    try {
      const res = await fetch(`${globalThis.apiBaseUrl}/projects/plots?project_name=${encodeURIComponent(projectName)}`)
      if (res.ok) {
        const data = await res.json()
        setPlots(Array.isArray(data) ? data : [])
      }
    } catch (err) {
      console.error('Failed to fetch plots:', err)
    } finally {
      setPlotsLoading(false)
    }
  }

  const chosenProject = projects.find((p) => p.name === formData.interestedIn)
  const projectId = chosenProject ? chosenProject.id : null
  const plotId = formData.plot !== undefined && formData.plot !== '' ? formData.plot : null

  const fetchCustomerDetails = async (customerId) => {
    if (!customerId || customerId.length !== 8) return
    const normalizedId = customerId.trim().toLowerCase()
    try {
      const res = await fetch(`${globalThis.apiBaseUrl}/users/${normalizedId}`)
      if (!res.ok) {
        console.error('Failed to fetch user details')
        setErrors((prev) => ({ ...prev, customerId: 'Customer not found' }))
        return
      }
      const data = await res.json()
      console.log('Fetched customer details:', data)

      setErrors((prev) => {
        const { customerId, ...rest } = prev
        return rest
      })

      const firstName = data.first_name || ''
      const lastName = data.last_name || ''
      const phone = data.mobile || data.phone || ''
      const agentId = data.reference_agent || data.agent_id || formData.agentId
      const interestedIn = data.interested_project || ''

      setFormData((prev) => ({
        ...prev,
        customerId: normalizedId,
        firstName,
        lastName,
        phone,
        agentId,
        interestedIn,
        plot: '',
      }))

      if (interestedIn) {
        setPlotsLoading(true)
        try {
          const plotsRes = await fetch(
            `${globalThis.apiBaseUrl}/projects/plots?project_name=${encodeURIComponent(interestedIn)}`
          )
          if (plotsRes.ok) {
            const plotsData = await plotsRes.json()
            const plotsList = Array.isArray(plotsData) ? plotsData : []
            setPlots(plotsList)

            if (data.interested_plot) {
              const matchedPlot = plotsList.find(
                (p) => String(p.plot_number) === String(data.interested_plot)
              )
              if (matchedPlot) {
                setFormData((prev) => ({ ...prev, plot: String(matchedPlot.id) }))
              }
            }
          }
        } catch (plotErr) {
          console.error('Failed to fetch plots for auto-population:', plotErr)
        } finally {
          setPlotsLoading(false)
        }
      }
    } catch (err) {
      console.error('Error fetching customer details:', err)
    }
  }

  // -------------------- VALIDATION --------------------
  const validate = () => {
    let errs = {}

    if (!leadType) {
      errs.leadType = 'Please select client type'
    }

    if (leadType === 'Existing') {
      if (!/^[A-Za-z]{2}[0-9]{6}$/.test(formData.customerId)) {
        errs.customerId = 'Customer ID must be 2 letters followed by 6 digits'
      }
    }

    if (!formData.agentId) {
      errs.agentId = 'Please select an agent / admin'
    }

    if (!validateIndianMobile(formData.phone)) {
      errs.phone = 'Phone must be a valid 10-digit mobile number starting with 6-9'
    }

    if (leadType === 'New') {
      if (!/^[A-Za-z ]+$/.test(formData.firstName.trim())) {
        errs.firstName = 'First name must contain only alphabets'
      }
      if (!/^[A-Za-z ]+$/.test(formData.lastName.trim())) {
        errs.lastName = 'Last name must contain only alphabets'
      }
    }

    if (!formData.interestedIn) {
      errs.interestedIn = 'Please select a project'
    } else if (!formData.plot) {
      errs.plot = 'Please select a plot'
    }

    if (formData.dateOfVisit) {
      const selected = new Date(formData.dateOfVisit)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const diff = (selected - today) / (1000 * 60 * 60 * 24)
      if (diff < 2) {
        errs.dateOfVisit = 'Date must be at least 2 days from today'
      }
    } else {
      errs.dateOfVisit = 'Date of visit required'
    }

    if (!formData.timeOfVisit) {
      errs.timeOfVisit = 'Time of visit required'
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  // -------------------- HANDLERS --------------------
  const handleChange = (e) => {
    const { name, value } = e.target
    let nextValue = value
    if (name === 'customerId') {
      nextValue = value.replace(/[^A-Za-z0-9]/g, '').slice(0, 8)
      if (nextValue.length === 8) {
        fetchCustomerDetails(nextValue)
      }
    }
    else if (name === 'phone') nextValue = sanitizeNumeric(value, 10)
    else if (name === 'firstName' || name === 'lastName') nextValue = sanitizeName(value, 50)
    else if (name === 'purpose') nextValue = sanitizeText(value, 100)
    else if (name === 'feedback') nextValue = sanitizeText(value, 300)

    setFormData({ ...formData, [name]: nextValue })
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    setTouched({ ...touched, [name]: true })
    validate()
    if (name === 'customerId' && value.length === 8) {
      fetchCustomerDetails(value)
    }
  }

  // -------------------- SUBMIT --------------------
  const handleSubmit = async (e) => {
    e.preventDefault()
    setTouched({
      leadType: true,
      customerId: true,
      agentId: true,
      phone: true,
      firstName: true,
      lastName: true,
      interestedIn: true,
      plot: true,
      dateOfVisit: true,
      timeOfVisit: true,
    })
    if (!validate()) return

    setLoading(true)

    let finalCustomerId = formData.customerId || ''

    if (leadType === 'New') {
      try {
        const params = new URLSearchParams()
        params.append('first_name', formData.firstName)
        params.append('last_name', formData.lastName)
        params.append('email', '')
        params.append('phone', formData.phone)
        params.append('reference_agent', formData.agentId)
        params.append('interested_project', formData.interestedIn || '')

        const selectedPlotObj = plots.find((p) => String(p.id) === String(formData.plot))
        const plotNumber = selectedPlotObj ? selectedPlotObj.plot_number : ''
        params.append('interested_plot', plotNumber)

        const clientRegisterUrl = `${globalThis.apiBaseUrl}/register/client`
        console.log('Registering new lead first:', clientRegisterUrl, params.toString())

        const leadRes = await fetch(clientRegisterUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: params.toString(),
        })

        const leadResult = await leadRes.json()

        let leadId = leadResult.u_id || leadResult.user_id || leadResult.id
        if (!leadId && leadResult.message) {
          const match = leadResult.message.match(/ID\s+(\S+)/i)
          if (match) {
            leadId = match[1]
          }
        }

        if (!leadRes.ok || !leadId) {
          const errorMsg = leadResult.message || leadRes.statusText || 'Failed to register client.'
          throw new Error(errorMsg)
        }

        finalCustomerId = leadId
        console.log('Lead Registered successfully. Client ID:', finalCustomerId)
      } catch (err) {
        alert('Client creation failed: ' + err.message)
        setLoading(false)
        return
      }
    }

    const chosenPlot = plots.find((p) => String(p.id) === String(formData.plot))
    const plotNumber = chosenPlot ? parseInt(chosenPlot.plot_number, 10) : null

    const apiBody = {
      customer_id: finalCustomerId,
      plot_number: plotNumber,
      agent_id: formData.agentId,
      visit_date: formData.dateOfVisit,
      visit_time: formData.timeOfVisit,
      purpose: formData.purpose || 'Site Visit',
      feedback: formData.feedback || '',
      status: 'scheduled',
      project_name: formData.interestedIn,
    }

    try {
      const postUrl = `${globalThis.apiBaseUrl}/visits/`
      console.log('Add Visit — payload being sent to POST:', postUrl, apiBody)

      const res = await fetch(postUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(apiBody),
      })

      if (!res.ok) {
        const errorText = await res.text()
        const message = errorText.includes('<html>')
          ? `Server returned ${res.status} (${res.statusText}). Check API method or URL.`
          : errorText
        throw new Error(message)
      }

      alert('Form Submitted Successfully ✅')
      navigate('/GetBookVisit')
    } catch (err) {
      alert('Submission failed: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  // -------------------- UI --------------------
  return (
    <CRow className="justify-content-center mt-4">
      <CCol md={10} lg={6}>
        <CCard className="shadow-lg border-0 rounded-4">
          <CCardHeader className="text-primary text-center fw-bold fs-1">
            Book Site Visit
          </CCardHeader>
          <CCardBody>
            <CForm onSubmit={handleSubmit}>
              {/* Lead Type */}
              <CFormLabel>Client Type</CFormLabel>
              <CFormSelect
                name="leadType"
                value={leadType}
                onChange={(e) => setLeadType(e.target.value)}
                onBlur={handleBlur}
                invalid={touched.leadType && !leadType}
              >
                <option value="">Select Client Type</option>
                <option value="New">New Client</option>
                <option value="Existing">Existing Client</option>
              </CFormSelect>
              <CFormFeedback invalid>Please select client type</CFormFeedback>
              <br />

              {leadType === 'Existing' && (
                <>
                  <CFormLabel>Customer ID</CFormLabel>
                  <CInputGroup className="mb-1">
                    <CFormInput
                      name="customerId"
                      value={formData.customerId}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Ex: cl000012"
                      invalid={touched.customerId && !!errors.customerId}
                    />
                    <CButton
                      type="button"
                      color="primary"
                      variant="outline"
                      onClick={() => fetchCustomerDetails(formData.customerId)}
                      disabled={formData.customerId.length !== 8}
                    >
                      Fetch Details
                    </CButton>
                  </CInputGroup>
                  {touched.customerId && errors.customerId && (
                    <div className="text-danger small mb-3">{errors.customerId}</div>
                  )}
                  <br />
                </>
              )}

              {leadType === 'New' && (
                <>
                  <CFormLabel>First Name</CFormLabel>
                  <CFormInput
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter first name"
                    invalid={touched.firstName && !!errors.firstName}
                  />
                  <CFormFeedback invalid>{errors.firstName}</CFormFeedback>
                  <br />

                  <CFormLabel>Last Name</CFormLabel>
                  <CFormInput
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter last name"
                    invalid={touched.lastName && !!errors.lastName}
                  />
                  <CFormFeedback invalid>{errors.lastName}</CFormFeedback>
                  <br />
                </>
              )}

              {/* Agent ID */}
              <CFormLabel>Agent / Admin</CFormLabel>
              <CFormSelect
                name="agentId"
                value={formData.agentId}
                onChange={handleChange}
                onBlur={handleBlur}
                invalid={touched.agentId && !!errors.agentId}
              >
                <option value="">Select Agent / Admin</option>
                {agentsAndAdmins.map((agent) => (
                  <option key={agent.u_id} value={agent.u_id}>
                    {agent.name} ({agent.u_id})
                  </option>
                ))}
              </CFormSelect>
              <CFormFeedback invalid>{errors.agentId}</CFormFeedback>
              <br />

              {/* Phone */}
              <CFormLabel>Phone Number</CFormLabel>
              <CFormInput
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="10-digit phone number"
                invalid={touched.phone && !!errors.phone}
              />
              <CFormFeedback invalid>{errors.phone}</CFormFeedback>
              <br />

              {/* Interested In */}
              <CFormLabel>Interested In</CFormLabel>
               <CFormSelect
                name="interestedIn"
                value={formData.interestedIn}
                onChange={handleProjectChange}
                onBlur={handleBlur}
                invalid={touched.interestedIn && !!errors.interestedIn}
                disabled={projectsLoading}
              >
                <option value="">{projectsLoading ? 'Loading projects...' : 'Select Project'}</option>
                {projects.map((proj) => (
                  <option key={proj.id} value={proj.name}>
                    {proj.name}
                  </option>
                ))}
              </CFormSelect>
              <CFormFeedback invalid>{errors.interestedIn}</CFormFeedback>
              <br />

               {/* Plot */}
              {formData.interestedIn && (
                <>
                  <CFormLabel>Plot Number & Facing</CFormLabel>
                  <CFormSelect
                    name="plot"
                    value={formData.plot}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    invalid={touched.plot && !!errors.plot}
                    disabled={plotsLoading}
                  >
                    <option value="">{plotsLoading ? 'Loading plots...' : 'Select Plot'}</option>
                    {plots.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.plot_number} {p.status ? `(${p.status})` : ''}
                      </option>
                    ))}
                  </CFormSelect>
                  <CFormFeedback invalid>{errors.plot}</CFormFeedback>
                  <br />
                </>
              )}

              {/* Date of Visit */}
              <CFormLabel>Date of Visit</CFormLabel>
              <CFormInput
                type="date"
                name="dateOfVisit"
                value={formData.dateOfVisit}
                onChange={handleChange}
                onBlur={handleBlur}
                invalid={touched.dateOfVisit && !!errors.dateOfVisit}
                min={minVisitDate}
              />
              <CFormFeedback invalid>{errors.dateOfVisit}</CFormFeedback>
              <br />

              {/* Time of Visit */}
              <CFormLabel>Time of Visit</CFormLabel>
              <CFormInput
                type="time"
                name="timeOfVisit"
                value={formData.timeOfVisit}
                onChange={handleChange}
                onBlur={handleBlur}
                invalid={touched.timeOfVisit && !!errors.timeOfVisit}
              />
              <CFormFeedback invalid>{errors.timeOfVisit}</CFormFeedback>
              <br />

              {/* Purpose */}
              <CFormLabel>Purpose</CFormLabel>
              <CFormInput
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                placeholder="Purpose of visit"
              />
              <br />

              {/* Feedback */}
              <CFormLabel>Feedback</CFormLabel>
              <CFormInput
                name="feedback"
                value={formData.feedback}
                onChange={handleChange}
                placeholder="Feedback (optional)"
              />
              <br />

              <CButton color="primary" type="submit" className="mt-3" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit'}
              </CButton>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}
