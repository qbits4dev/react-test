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
} from '@coreui/react'

const PostTargets = () => {
    const [formData, setFormData] = useState({
        role_id: '',
        description: '',
        value: '',
    })
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setMessage('')
        setError('')

        fetch('http://localhost:5000/api/targets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        })
            .then((res) => {
                if (!res.ok) throw new Error('Failed to post target')
                return res.json()
            })
            .then(() => setMessage('✅ Target posted successfully!'))
            .catch((err) => setError(`❌ ${err.message}`))
    }

    return (
        <CContainer className="py-4">
            <CRow className="justify-content-center">
                <CCol md={8}>
                    <CCard className="shadow-sm border-0 rounded-3">
                        <CCardHeader className=" text-primary text-center fs-5">
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
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <CFormLabel>Description</CFormLabel>
                                    <CFormTextarea
                                        name="description"
                                        placeholder="Enter target description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        required
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
                                        required
                                    />
                                </div>
                                <div className="text-center">
                                    <CButton color="success" type="submit">
                                        Submit Target
                                    </CButton>
                                </div>
                            </CForm>

                            {message && <CAlert color="success" className="mt-3 text-center">{message}</CAlert>}
                            {error && <CAlert color="danger" className="mt-3 text-center">{error}</CAlert>}
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </CContainer>
    )
}

export default PostTargets
