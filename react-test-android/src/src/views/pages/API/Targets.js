import React, { useState } from 'react'
import {
    CContainer,
    CRow,
    CCol,
    CCard,
    CCardHeader,
    CCardBody,
    CForm,
    CFormLabel,
    CFormInput,
    CFormTextarea,
    CButton,
    CAlert,
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell,
} from '@coreui/react'

const Targets = () => {
    const [formData, setFormData] = useState({
        role_id: '',
        description: '',
        value: '',
    })

    const [targets, setTargets] = useState([
        { role_id: 1, description: 'Initial Target Example', value: 100 },
    ])

    const [message, setMessage] = useState('')

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!formData.role_id || !formData.description || !formData.value) {
            setMessage('⚠️ Please fill all fields')
            return
        }

        const newTarget = {
            role_id: parseInt(formData.role_id),
            description: formData.description,
            value: parseFloat(formData.value),
        }

        setTargets((prev) => [...prev, newTarget])
        setFormData({ role_id: '', description: '', value: '' })
        setMessage('✅ Target added successfully!')
        setTimeout(() => setMessage(''), 2500)
    }

    return (
        <CContainer className="py-4">
            <CRow className="justify-content-center">
                <CCol md={10}>
                    {/* POST TARGET SECTION */}
                    <CCard className="shadow-sm border-0 rounded-3 mb-4">
                        <CCardHeader className="bg-success text-white text-center fs-5">
                             Post Target
                        </CCardHeader>
                        <CCardBody>
                            <CForm onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <CFormLabel>Role ID</CFormLabel>
                                    <CFormInput
                                        type="number"
                                        name="role_id"
                                        placeholder="Enter Role ID"
                                        value={formData.role_id}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="mb-3">
                                    <CFormLabel>Description</CFormLabel>
                                    <CFormTextarea
                                        name="description"
                                        placeholder="Enter target description"
                                        value={formData.description}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="mb-3">
                                    <CFormLabel>Value</CFormLabel>
                                    <CFormInput
                                        type="number"
                                        name="value"
                                        placeholder="Enter value"
                                        value={formData.value}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="text-center">
                                    <CButton color="success" type="submit">
                                        Add Target
                                    </CButton>
                                </div>
                            </CForm>

                            {message && (
                                <CAlert color="info" className="mt-3 text-center">
                                    {message}
                                </CAlert>
                            )}
                        </CCardBody>
                    </CCard>

                    {/* GET TARGET SECTION */}
                    <CCard className="shadow-sm border-0 rounded-3">
                        <CCardHeader className="bg-primary text-white text-center fs-5">
                             Get Targets
                        </CCardHeader>
                        <CCardBody>
                            {targets.length === 0 ? (
                                <p className="text-center text-muted py-3">
                                    No targets available. Add one above!
                                </p>
                            ) : (
                                <CTable striped hover responsive>
                                    <CTableHead color="dark">
                                        <CTableRow>
                                            <CTableHeaderCell>#</CTableHeaderCell>
                                            <CTableHeaderCell>Role ID</CTableHeaderCell>
                                            <CTableHeaderCell>Description</CTableHeaderCell>
                                            <CTableHeaderCell>Value</CTableHeaderCell>
                                        </CTableRow>
                                    </CTableHead>
                                    <CTableBody>
                                        {targets.map((target, index) => (
                                            <CTableRow key={index}>
                                                <CTableDataCell>{index + 1}</CTableDataCell>
                                                <CTableDataCell>{target.role_id}</CTableDataCell>
                                                <CTableDataCell>{target.description}</CTableDataCell>
                                                <CTableDataCell>{target.value}</CTableDataCell>
                                            </CTableRow>
                                        ))}
                                    </CTableBody>
                                </CTable>
                            )}
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </CContainer>
    )
}

export default Targets
