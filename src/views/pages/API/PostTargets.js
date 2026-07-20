import React, { useState, useEffect } from 'react'
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
  CFormSelect,
  CFormTextarea,
  CRow,
  CSpinner,
  CFormFeedback,
} from '@coreui/react'
import { sanitizeNumeric, sanitizeText } from '../../../utils/validation'
import ErrorModal from '../../../components/ErrorModal'
import { extractErrorMessage, getResponseErrorMessage } from '../../../utils/errorUtils'

const TARGET_TYPES = {
  TEAM: 'Team Target',
  INDIVIDUAL: 'Individual Target',
}

const PostTargets = () => {
  const [designations, setDesignations] = useState([])
  const [loadingDesignations, setLoadingDesignations] = useState(true)
  const [designationError, setDesignationError] = useState('')

  const [teams, setTeams] = useState([])
  const [loadingTeams, setLoadingTeams] = useState(false)
  const [teamError, setTeamError] = useState('')

  const [agents, setAgents] = useState([])
  const [loadingAgents, setLoadingAgents] = useState(false)
  const [agentError, setAgentError] = useState('')

  const [formData, setFormData] = useState({
    designation: '',
    description: '',
    value: '',
    sale_type: '',
    stage: '',
    timeframe: '',
    target_units: '',
    insurance_cover: '',
    medical_cover: '',
    tour: '',
    rewards: '',
    salary_monthly: '',
    commission_notes: '',
    salary_eligibility_notes: '',
    other_notes: '',
    targetType: '',
    team_name: '',
    agent_id: '',
  })

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [errors, setErrors] = useState({})

  const validateField = (name, value) => {
    const v = String(value || '').trim()
    if (['stage', 'designation', 'targetType', 'description'].includes(name) && !v) return 'This field is required'
    if (name === 'value' && (!v || Number(v) <= 0)) return 'Value must be greater than 0'
    if (name === 'timeframe' && (!v || Number(v) <= 0 || Number(v) > 120)) return 'Timeframe must be between 1 and 120'
    if (name === 'target_units' && (!v || Number(v) <= 0)) return 'Target Units must be greater than 0'
    if (name === 'salary_monthly' && v && Number(v) < 0) return 'Salary cannot be negative'
    return ''
  }

  useEffect(() => {
    fetch(`${globalThis.apiBaseUrl}/register/?key=designation`, { headers: { accept: 'application/json' } })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'ok' && Array.isArray(data.designation)) {
          setDesignations(data.designation)
          setDesignationError('')
        } else {
          setDesignationError('No designations found')
        }
      })
      .catch(() => setDesignationError('Failed to fetch designations'))
      .finally(() => setLoadingDesignations(false))
  }, [])

  useEffect(() => {
    const loadTeams = async () => {
      setLoadingTeams(true)
      try {
        let names = []

        const teamsResponse = await fetch(`${globalThis.apiBaseUrl}/teams`)
        if (teamsResponse.ok) {
          const teamsData = await teamsResponse.json()
          const teamItems = Array.isArray(teamsData) ? teamsData : teamsData?.data || []
          names = teamItems.map((t) => t.name || t.team_name || t.agent_team).filter(Boolean)
        }

        if (names.length === 0) {
          const usersResponse = await fetch(`${globalThis.apiBaseUrl}/users/`)
          if (usersResponse.ok) {
            const list = await usersResponse.json()
            if (list?.success && Array.isArray(list.users)) {
              const details = await Promise.all(
                list.users.map(async (uId) => {
                  const res = await fetch(`${globalThis.apiBaseUrl}/users/${uId}`)
                  return res.json()
                }),
              )
              names = details.map((u) => u.agent_team).filter(Boolean)
            }
          }
        }

        const uniqueNames = [...new Set(names)]
        setTeams(uniqueNames)
        if (uniqueNames.length === 0) setTeamError('No teams found')
      } catch {
        setTeamError('Failed to fetch teams')
      } finally {
        setLoadingTeams(false)
      }
    }

    const loadAgents = async () => {
      setLoadingAgents(true)
      try {
        const usersResponse = await fetch(`${globalThis.apiBaseUrl}/users/`)
        if (!usersResponse.ok) throw new Error('failed')

        const list = await usersResponse.json()
        if (!list?.success || !Array.isArray(list.users)) {
          setAgentError('No users found')
          setAgents([])
          return
        }

        const details = await Promise.all(
          list.users.map(async (uId) => {
            const res = await fetch(`${globalThis.apiBaseUrl}/users/${uId}`)
            return res.json()
          }),
        )

        const agentRows = details
          .filter((u) => String(u.role || '').toLowerCase() === 'agent' && u.u_id)
          .map((u) => ({
            u_id: u.u_id,
            fullName: `${u.first_name || ''} ${u.last_name || ''}`.trim(),
          }))

        setAgents(agentRows)
        if (agentRows.length === 0) setAgentError('No agents found')
      } catch {
        setAgentError('Failed to fetch users')
      } finally {
        setLoadingAgents(false)
      }
    }

    loadTeams()
    loadAgents()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    let nextValue = value
    if (['timeframe', 'target_units', 'salary_monthly', 'value'].includes(name)) nextValue = sanitizeNumeric(value, 8)
    if (['rewards', 'commission_notes', 'salary_eligibility_notes', 'other_notes', 'tour', 'insurance_cover', 'medical_cover', 'stage', 'description'].includes(name)) {
      nextValue = sanitizeText(value, 250)
    }
    setFormData((prev) => ({ ...prev, [name]: nextValue }))
    setErrors((prev) => ({ ...prev, [name]: validateField(name, nextValue) }))
  }

  const handleTargetTypeChange = (e) => {
    const targetType = e.target.value
    setFormData((prev) => ({
      ...prev,
      targetType,
      team_name: '',
      agent_id: '',
    }))
  }

  const [errorModalVisible, setErrorModalVisible] = useState(false)
  const [errorModalMsg, setErrorModalMsg] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')

    const nextErrors = {
      targetType: validateField('targetType', formData.targetType),
      designation: validateField('designation', formData.designation),
      description: validateField('description', formData.description),
      value: validateField('value', formData.value),
      stage: validateField('stage', formData.stage),
      timeframe: validateField('timeframe', formData.timeframe),
      target_units: validateField('target_units', formData.target_units),
      salary_monthly: validateField('salary_monthly', formData.salary_monthly),
    }
    setErrors(nextErrors)
    if (Object.values(nextErrors).some(Boolean)) {
      setErrorModalMsg('Please fix validation errors before submitting.')
      setErrorModalVisible(true)
      return
    }

    if (!formData.targetType || !formData.designation) {
      setErrorModalMsg('Please select Target Type and Designation before submitting.')
      setErrorModalVisible(true)
      return
    }

    if (formData.targetType === TARGET_TYPES.TEAM && !formData.team_name) {
      setErrorModalMsg('Please select a team for Team Target.')
      setErrorModalVisible(true)
      return
    }

    if (formData.targetType === TARGET_TYPES.INDIVIDUAL && !formData.agent_id) {
      setErrorModalMsg('Please select an agent for Individual Target.')
      setErrorModalVisible(true)
      return
    }

    const payload = {
      designation: formData.designation,
      description: formData.description,
      value: Number(formData.value),
      stage: formData.stage,
      timeframe: Number(formData.timeframe),
      target_units: Number(formData.target_units),
      insurance_cover: formData.insurance_cover,
      medical_cover: formData.medical_cover,
      tour: formData.tour,
      rewards: formData.rewards,
      salary_monthly: formData.salary_monthly ? Number(formData.salary_monthly) : null,
      commission_notes: formData.commission_notes,
      salary_eligibility_notes: formData.salary_eligibility_notes,
      other_notes: formData.other_notes,
    }

    try {
      const res = await fetch(`${globalThis.apiBaseUrl}/targets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        setMessage('Target posted successfully!')
        setFormData({
          designation: '',
          description: '',
          value: '',
          sale_type: '',
          stage: '',
          timeframe: '',
          target_units: '',
          insurance_cover: '',
          medical_cover: '',
          tour: '',
          rewards: '',
          salary_monthly: '',
          commission_notes: '',
          salary_eligibility_notes: '',
          other_notes: '',
          targetType: '',
          team_name: '',
          agent_id: '',
        })
      } else {
        const errMsg = await getResponseErrorMessage(res, 'Failed to post target.')
        setErrorModalMsg(errMsg)
        setErrorModalVisible(true)
      }
    } catch (err) {
      setErrorModalMsg(extractErrorMessage(err, 'Submission failed. Please try again.'))
      setErrorModalVisible(true)
    }
  }

  return (
    <CContainer fluid className="bg-light py-5 d-flex align-items-center min-vh-100">
      <CRow className="justify-content-center w-100">
        <CCol md={9} lg={7} xl={6}>
          <CCard className="shadow-lg border-0 rounded-4">
            <CCardHeader className="bg-gradient text-primary text-center p-4 rounded-top-4">
              <h4 className="mb-0">Post New Target</h4>
            </CCardHeader>
            <CCardBody className="p-4 p-md-5">
              <CForm onSubmit={handleSubmit}>
                <div className="mb-4">
                  <CFormLabel className="fw-semibold text-muted">Target Type</CFormLabel>
                  <CFormSelect name="targetType" value={formData.targetType} onChange={handleTargetTypeChange} invalid={!!errors.targetType} required>
                    <option value="">Select Target Type</option>
                    <option value={TARGET_TYPES.TEAM}>{TARGET_TYPES.TEAM}</option>
                    <option value={TARGET_TYPES.INDIVIDUAL}>{TARGET_TYPES.INDIVIDUAL}</option>
                  </CFormSelect>
                  {errors.targetType && <CFormFeedback className="d-block">{errors.targetType}</CFormFeedback>}
                </div>

                {formData.targetType === TARGET_TYPES.TEAM && (
                  <div className="mb-4">
                    <CFormLabel className="fw-semibold text-muted">Available Teams</CFormLabel>
                    <CFormSelect name="team_name" value={formData.team_name} onChange={handleChange} disabled={loadingTeams} required>
                      <option value="">{loadingTeams ? 'Loading teams...' : 'Select Team'}</option>
                      {teams.map((team) => (
                        <option key={team} value={team}>{team}</option>
                      ))}
                    </CFormSelect>
                    {teamError && <small className="text-danger">{teamError}</small>}
                  </div>
                )}

                {formData.targetType === TARGET_TYPES.INDIVIDUAL && (
                  <div className="mb-4">
                    <CFormLabel className="fw-semibold text-muted">Agent ID</CFormLabel>
                    <CFormSelect name="agent_id" value={formData.agent_id} onChange={handleChange} disabled={loadingAgents} required>
                      <option value="">{loadingAgents ? 'Loading agents...' : 'Select Agent'}</option>
                      {agents.map((agent) => (
                        <option key={agent.u_id} value={agent.u_id}>
                          {agent.u_id} - {agent.fullName}
                        </option>
                      ))}
                    </CFormSelect>
                    {agentError && <small className="text-danger">{agentError}</small>}
                  </div>
                )}

                <div className="mb-4">
                  <CFormLabel className="fw-semibold text-muted">Designation</CFormLabel>
                  <CFormSelect name="designation" value={formData.designation} onChange={handleChange} disabled={loadingDesignations} invalid={!!errors.designation} required>
                    <option value="">{loadingDesignations ? 'Loading...' : 'Select Designation'}</option>
                    {!loadingDesignations &&
                      !designationError &&
                      designations.map((d) => (
                        <option key={d.id || d.name} value={d.id || d.name}>
                          {d.name}
                        </option>
                      ))}
                  </CFormSelect>
                  {errors.designation && <CFormFeedback className="d-block">{errors.designation}</CFormFeedback>}
                  {designationError && <small className="text-danger">{designationError}</small>}
                </div>

                <CRow>
                  <CCol sm={6} className="mb-3">
                    <CFormLabel className="fw-semibold text-muted">Target Value *</CFormLabel>
                    <CFormInput name="value" type="number" value={formData.value} onChange={handleChange} invalid={!!errors.value} required />
                    {errors.value && <CFormFeedback className="d-block">{errors.value}</CFormFeedback>}
                  </CCol>
                  <CCol sm={6} className="mb-3">
                    <CFormLabel className="fw-semibold text-muted">Target Description *</CFormLabel>
                    <CFormInput name="description" value={formData.description} onChange={handleChange} invalid={!!errors.description} required />
                    {errors.description && <CFormFeedback className="d-block">{errors.description}</CFormFeedback>}
                  </CCol>
                </CRow>

                <CRow>
                  <CCol sm={6} className="mb-3">
                    <CFormLabel className="fw-semibold text-muted">Stage</CFormLabel>
                    <CFormInput name="stage" value={formData.stage} onChange={handleChange} invalid={!!errors.stage} required />
                    {errors.stage && <CFormFeedback className="d-block">{errors.stage}</CFormFeedback>}
                  </CCol>
                  <CCol sm={6} className="mb-3">
                    <CFormLabel className="fw-semibold text-muted">Timeframe (Month)</CFormLabel>
                    <CFormInput name="timeframe" type="number" value={formData.timeframe} onChange={handleChange} invalid={!!errors.timeframe} required />
                    {errors.timeframe && <CFormFeedback className="d-block">{errors.timeframe}</CFormFeedback>}
                  </CCol>
                </CRow>

                <CRow>
                  <CCol sm={6} className="mb-3">
                    <CFormLabel className="fw-semibold text-muted">Target Units</CFormLabel>
                    <CFormInput name="target_units" type="number" value={formData.target_units} onChange={handleChange} invalid={!!errors.target_units} required />
                    {errors.target_units && <CFormFeedback className="d-block">{errors.target_units}</CFormFeedback>}
                  </CCol>
                  <CCol sm={6} className="mb-3">
                    <CFormLabel className="fw-semibold text-muted">Insurance Cover</CFormLabel>
                    <CFormInput name="insurance_cover" value={formData.insurance_cover} onChange={handleChange} required />
                  </CCol>
                </CRow>

                <CRow>
                  <CCol sm={6} className="mb-3">
                    <CFormLabel className="fw-semibold text-muted">Medical Cover</CFormLabel>
                    <CFormInput name="medical_cover" value={formData.medical_cover} onChange={handleChange} required />
                  </CCol>
                  <CCol sm={6} className="mb-3">
                    <CFormLabel className="fw-semibold text-muted">Tour</CFormLabel>
                    <CFormInput name="tour" value={formData.tour} onChange={handleChange} />
                  </CCol>
                </CRow>

                <div className="mb-3">
                  <CFormLabel className="fw-semibold text-muted">Rewards</CFormLabel>
                  <CFormTextarea name="rewards" value={formData.rewards} onChange={handleChange} />
                </div>

                <div className="d-grid mt-4">
                  <CButton color="primary" type="submit" size="lg" className="fw-semibold">
                    Submit Target
                  </CButton>
                </div>
              </CForm>

              {message && <CAlert color="success" variant="solid" className="mt-4 text-center">{message}</CAlert>}
              {error && <CAlert color="danger" variant="solid" className="mt-4 text-center">{error}</CAlert>}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Designated Error Modal */}
      <ErrorModal
        visible={errorModalVisible}
        title="Target Submission Failed"
        errorMessage={errorModalMsg}
        onClose={() => setErrorModalVisible(false)}
      />
    </CContainer>
  )
}

export default PostTargets
