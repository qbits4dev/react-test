import React, { useState, useEffect, useCallback } from 'react';
import {
    CContainer,
    CCard,
    CCardBody,
    CCardHeader,
    CForm,
    CFormInput,
    CFormTextarea,
    CButton,
    CRow,
    CCol,
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell,
    CSpinner,
    CButtonGroup,
} from '@coreui/react';

// The base URL for the API
const API_URL = 'https://api.qbits4dev.com/settings/';

export default function SettingsPage() {
    // State for the list of settings
    const [settings, setSettings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // State for the form
    const [form, setForm] = useState({
        role_id: '',
        description: '',
        value: '',
    });
    const [submitting, setSubmitting] = useState(false);

    // Function to fetch settings from the API
    const fetchSettings = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(API_URL);
            if (!res.ok) throw new Error('Failed to fetch data');
            const data = await res.json();
            setSettings(Array.isArray(data) ? data : []);
            setError('');
        } catch (err) {
            setError('Error fetching settings: ' + err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch data when the component mounts
    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    // Handler for form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // Handler for form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const payload = {
            role_id: Number(form.role_id),
            description: form.description,
            value: Number(form.value),
        };

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error('Failed to submit the form');

            alert('Setting added successfully!');
            setForm({ role_id: '', description: '', value: '' }); // Reset form
            fetchSettings(); // Refresh the list
        } catch (err) {
            alert(`Error: ${err.message}`);
        } finally {
            setSubmitting(false);
        }
    };

    // Placeholder action handlers
    const handleEdit = (setting) => alert(`Editing Setting ID: ${setting.id}`);
    const handleDelete = (setting) => alert(`Deleting Setting ID: ${setting.id}`);

    return (
        <CContainer className="my-4">
            {/* --- FORM CARD --- */}
            <CCard className="mb-4 shadow-sm">
                <CCardHeader>
                    <h5 className="mb-0">Add New Setting</h5>
                </CCardHeader>
                <CCardBody>
                    <CForm onSubmit={handleSubmit}>
                        <CRow className="g-3">
                            <CCol md={6}>
                                <CFormInput
                                    label="Role ID"
                                    name="role_id"
                                    type="number"
                                    placeholder="e.g., 1"
                                    value={form.role_id}
                                    onChange={handleChange}
                                    required
                                />
                            </CCol>
                            <CCol md={6}>
                                <CFormInput
                                    label="Value"
                                    name="value"
                                    type="number"
                                    placeholder="e.g., 100"
                                    value={form.value}
                                    onChange={handleChange}
                                    required
                                />
                            </CCol>
                            <CCol xs={12}>
                                <CFormTextarea
                                    label="Description"
                                    name="description"
                                    rows={3}
                                    placeholder="Enter a short description of the setting"
                                    value={form.description}
                                    onChange={handleChange}
                                    required
                                />
                            </CCol>
                            <CCol xs={12} className="text-end">
                                <CButton color="primary" type="submit" disabled={submitting}>
                                    {submitting ? <CSpinner size="sm" /> : 'Save Setting'}
                                </CButton>
                            </CCol>
                        </CRow>
                    </CForm>
                </CCardBody>
            </CCard>

            {/* --- TABLE CARD --- */}
            <CCard className="shadow-sm">
                <CCardHeader>
                    <h5 className="mb-0">Existing Settings</h5>
                </CCardHeader>
                <CCardBody>
                    {loading ? (
                        <div className="text-center"><CSpinner /></div>
                    ) : error ? (
                        <div className="text-danger text-center">{error}</div>
                    ) : (
                        <CTable hover responsive align="middle">
                            <CTableHead color="light">
                                <CTableRow>
                                    <CTableHeaderCell>ID</CTableHeaderCell>
                                    <CTableHeaderCell>Role ID</CTableHeaderCell>
                                    <CTableHeaderCell>Description</CTableHeaderCell>
                                    <CTableHeaderCell>Value</CTableHeaderCell>
                                    <CTableHeaderCell className="text-center">Actions</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {settings.length > 0 ? (
                                    settings.map((setting) => (
                                        <CTableRow key={setting.id}>
                                            <CTableDataCell><strong>{setting.id}</strong></CTableDataCell>
                                            <CTableDataCell>{setting.role_id}</CTableDataCell>
                                            <CTableDataCell>{setting.description}</CTableDataCell>
                                            <CTableDataCell>{setting.value}</CTableDataCell>
                                            <CTableDataCell className="text-center">
                                                <CButtonGroup>
                                                    <CButton color="info" variant="outline" size="sm" onClick={() => handleEdit(setting)}>Edit</CButton>
                                                    <CButton color="danger" variant="outline" size="sm" onClick={() => handleDelete(setting)}>Delete</CButton>
                                                </CButtonGroup>
                                            </CTableDataCell>
                                        </CTableRow>
                                    ))
                                ) : (
                                    <CTableRow>
                                        <CTableDataCell colSpan="5" className="text-center">
                                            No settings found.
                                        </CTableDataCell>
                                    </CTableRow>
                                )}
                            </CTableBody>
                        </CTable>
                    )}
                </CCardBody>
            </CCard>
        </CContainer>
    );
}