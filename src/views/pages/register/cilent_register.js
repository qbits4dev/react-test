import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CButton, CCard, CCardBody, CCol, CContainer, CForm, CFormInput,
  CFormSelect, CInputGroup, CInputGroupText, CRow
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilUser, cilPhone } from '@coreui/icons'

const Client_Register = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',           // consistent field name
    reference_agent: '',
    interested_project: '',
    interested_plot: '',
  })
  const [error, setError] = useState(null)
  const [errors, setErrors] = useState({})
  const [userCode, setUserCode] = useState('')
  const navigate = useNavigate()

  const [projects, setProjects] = useState([])
  const [plots, setPlots] = useState([])
  const [agentsAndAdmins, setAgentsAndAdmins] = useState([])

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(`${globalThis.apiBaseUrl}/projects/`)
        if (res.ok) {
          const data = await res.json()
          const list = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : [])
          setProjects(list)
        }
      } catch (err) {
        console.error('Error fetching projects:', err)
      }
    }
    fetchProjects()
  }, [])

  useEffect(() => {
    const fetchPlots = async () => {
      if (!formData.interested_project) {
        setPlots([])
        return
      }
      try {
        const res = await fetch(`${globalThis.apiBaseUrl}/projects/plots?project_name=${encodeURIComponent(formData.interested_project)}`)
        if (res.ok) {
          const data = await res.json()
          const list = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : [])
          setPlots(list)
        }
      } catch (err) {
        console.error('Error fetching plots:', err)
      }
    }
    fetchPlots()
  }, [formData.interested_project])

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

  const validateField = (name, value) => {
    const v = typeof value === 'string' ? value.trim() : value
    switch (name) {
      case 'first_name':
        if (!v) return 'First Name is required'
        if (v.length < 2) return 'First Name must be at least 2 characters'
        if (!/^[A-Za-z ]+$/.test(v)) return 'First Name must contain only letters'
        break
      case 'last_name':
        if (!v) return ''
        if (!/^[A-Za-z ]+$/.test(v)) return 'Last Name must contain only letters'
        break
      case 'email':
        if (!v) return ''
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Enter a valid email address'
        break
      case 'phone':
        if (!v) return 'Phone number is required'
        if (!/^[6-9][0-9]{9}$/.test(v)) return 'Phone must be a valid 10-digit number starting with 6-9'
        break
      case 'reference_agent':
      case 'interested_project':
      case 'interested_plot':
        return ''
      default:
        return ''
    }
    return ''
  }

  const validateAll = () => {
    const newErrors = {}
    Object.keys(formData).forEach(f => {
      const err = validateField(f, formData[f])
      if (err) newErrors[f] = err
    })
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    let sanitizedValue = value
    if (name === 'phone') sanitizedValue = value.replace(/[^0-9]/g, '').slice(0, 10)
    else if (['first_name', 'last_name'].includes(name)) sanitizedValue = value.replace(/[^A-Za-z ]/g, '')
    else if (name === 'email') sanitizedValue = value.replace(/[^A-Za-z0-9.@_\-+]/g, '')

    setFormData(prev => {
      const nextData = { ...prev, [name]: sanitizedValue }
      if (name === 'interested_project') {
        nextData.interested_plot = ''
      }
      return nextData
    })
    const err = validateField(name, sanitizedValue)
    setErrors(prev => ({ ...prev, [name]: err }))
  }

  const renderError = (field) => errors[field] && (
    <small className="text-danger d-block mt-1">{errors[field]}</small>
  )

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setUserCode('')

    if (!validateAll()) {
      return
    }

    const params = new URLSearchParams()
    params.append('first_name', formData.first_name)
    params.append('last_name', formData.last_name)
    params.append('email', formData.email)
    params.append('phone', formData.phone)
    params.append('reference_agent', formData.reference_agent)
    params.append('interested_project', formData.interested_project)
    params.append('interested_plot', formData.interested_plot)

    // Corrected console log to show the payload string
    console.log('Form data sent:', params.toString())

    try {
      const res = await fetch(`${globalThis.apiBaseUrl}/register/client`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
      })
      const result = await res.json()
      if (res.ok && result.u_id) {
        setUserCode(result.u_id)
        alert(`Registration Successful! Your User Code: ${result.u_id}`)
        navigate('/login')
      } else {
        setError(result.message || res.statusText)
      }
    } catch (error) {
      setError('Network Error. Please try again later.')
    }
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm onSubmit={handleSubmit}>
                  <h1>Lead Registration</h1>
                  <p className="text-body-secondary">Register a new lead</p>
                  <CInputGroup className="mb-3">
                    <CInputGroupText><CIcon icon={cilUser} /></CInputGroupText>
                    <CFormInput
                      name="first_name"
                      placeholder="First Name *"
                      value={formData.first_name}
                      onChange={handleChange}
                      invalid={!!errors.first_name}
                      required
                    />
                  </CInputGroup>
                  {renderError('first_name')}

                  <CInputGroup className="mb-3">
                    <CInputGroupText><CIcon icon={cilUser} /></CInputGroupText>
                    <CFormInput
                      name="last_name"
                      placeholder="Last Name"
                      value={formData.last_name}
                      onChange={handleChange}
                      invalid={!!errors.last_name}
                    />
                  </CInputGroup>
                  {renderError('last_name')}

                  <CInputGroup className="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput
                      name="email"
                      placeholder="Email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      invalid={!!errors.email}
                    />
                  </CInputGroup>
                  {renderError('email')}

                  <CInputGroup className='mb-3'>
                    <CInputGroupText><CIcon icon={cilPhone} /></CInputGroupText>
                    <CFormInput
                      name="phone"
                      placeholder="Phone Number *"
                      value={formData.phone}
                      onChange={handleChange}
                      invalid={!!errors.phone}
                      required
                    />
                  </CInputGroup>
                  {renderError('phone')}

                  <CInputGroup className='mb-3'>
                    <CInputGroupText><CIcon icon={cilUser} /></CInputGroupText>
                    <CFormSelect
                      name="reference_agent"
                      value={formData.reference_agent}
                      onChange={handleChange}
                      invalid={!!errors.reference_agent}
                    >
                      <option value="">Select Reference Agent / Admin</option>
                      {agentsAndAdmins.map((item) => (
                        <option key={item.u_id} value={item.u_id}>
                          {item.name} ({item.u_id})
                        </option>
                      ))}
                    </CFormSelect>
                  </CInputGroup>
                  {renderError('reference_agent')}

                  <CInputGroup className='mb-3'>
                    <CFormSelect
                      name='interested_project'
                      value={formData.interested_project}
                      onChange={handleChange}
                      invalid={!!errors.interested_project}
                    >
                      <option value="">Select Interested Project</option>
                      {projects.map((proj) => (
                        <option key={proj.id || proj.name} value={proj.name}>
                          {proj.name}
                        </option>
                      ))}
                    </CFormSelect>
                  </CInputGroup>
                  {renderError('interested_project')}

                  <CInputGroup className='mb-3'>
                    <CFormSelect
                      name='interested_plot'
                      value={formData.interested_plot}
                      onChange={handleChange}
                      invalid={!!errors.interested_plot}
                      disabled={!formData.interested_project}
                    >
                      <option value="">Select Interested Plot</option>
                      {plots.map((plot) => (
                        <option key={plot.plot_number} value={plot.plot_number}>
                          Plot {plot.plot_number} ({plot.status || 'available'})
                        </option>
                      ))}
                    </CFormSelect>
                  </CInputGroup>
                  {renderError('interested_plot')}
                  {error && <div style={{ color: "red" }}>{error}</div>}
                  {userCode && (
                    <div style={{ color: "green", fontWeight: "bold", marginTop: "1em" }}>
                      Your User Code: {userCode}
                    </div>
                  )}
                  <div className="d-grid">
                    <CButton color="success" type='submit'>Submit Lead</CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Client_Register
