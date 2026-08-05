import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    CCard,
    CCardBody,
    CCardHeader,
    CForm,
    CFormInput,
    CFormSelect,
    CButton,
    CFormFeedback,
    CInputGroup,
    CInputGroupText,
    CContainer,
} from '@coreui/react';
import { sanitizeName, sanitizeNumeric, validateEmail, validateIndianMobile, validateStrongPassword } from '../../../utils/validation';
import ErrorModal from '../../../components/ErrorModal';
import { extractErrorMessage, getResponseErrorMessage } from '../../../utils/errorUtils';

export default function Register() {
    const navigate = useNavigate();

    const roles = [
        'customer',
        'agent',
        'manager',
        'marketing executive',
        'marketing manager',
        'asst general manager',
        'deputy general manager',
        'general manager',
        'sr general manager',
        'deputy marketing director',
    ];

    const fields = [
        { name: 'first_name', label: 'First Name', type: 'text' },
        { name: 'last_name', label: 'Last Name', type: 'text' },
        { name: 'email', label: 'Email', type: 'email' },
        { name: 'mobile', label: 'Mobile', type: 'text' },
        { name: 'password', label: 'Password', type: 'password' },
        { name: 'role', label: 'Role', type: 'select', options: roles },
    ];

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        mobile: '',
        password: '',
        role: 'customer',
    });

    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    const validateField = (name, value) => {
        const v = typeof value === 'string' ? value.trim() : value;
        switch (name) {
            case 'first_name':
                if (!v) return 'First name is required';
                if (v.length < 2) return 'First name must be at least 2 characters';
                break;
            case 'last_name':
                if (!v) return 'Last name is required';
                if (v.length < 1) return 'Last name must be at least 1 character';
                break;
            case 'email':
                if (!v) return 'Email is required';
                if (!validateEmail(v)) return 'Invalid email format';
                break;
            case 'mobile':
                if (!v) return 'Mobile is required';
                if (!validateIndianMobile(v)) return 'Invalid 10-digit mobile number';
                break;
            case 'password':
                if (!v) return 'Password is required';
                return validateStrongPassword(v);
                break;
            default:
                return '';
        }
        return '';
    };

    const validate = () => {
        const errs = {};
        const fieldsToValidate = ['first_name', 'last_name', 'email', 'mobile', 'password'];
        fieldsToValidate.forEach((field) => {
            const err = validateField(field, formData[field]);
            if (err) errs[field] = err;
        });
        return errs;
    };

    const handleChange = (e) => {
        const { name } = e.target;
        let value = e.target.value;
        if (name === 'email') {
            value = value.replace(/[^A-Za-z0-9.@_\-+]/g, '');
        } else if (name === 'mobile') {
            value = sanitizeNumeric(value, 10);
        } else if (['first_name', 'last_name'].includes(name)) {
            value = sanitizeName(value, 50);
        } else if (name === 'password') {
            value = value.replace(/\s/g, '').slice(0, 32);
        }
        setFormData({ ...formData, [name]: value });
        const err = validateField(name, value);
        setErrors({ ...errors, [name]: err });
    };

    const [errorModalVisible, setErrorModalVisible] = useState(false);
    const [errorModalMsg, setErrorModalMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const res = await fetch(`${globalThis.apiBaseUrl || ''}/api/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                navigate('/verify-otp', { state: { email: formData.email } });
            } else {
                const errMsg = await getResponseErrorMessage(res, 'Registration failed.');
                setErrorModalMsg(errMsg);
                setErrorModalVisible(true);
            }
        } catch (err) {
            setErrorModalMsg(extractErrorMessage(err, 'Network error. Please try again.'));
            setErrorModalVisible(true);
        }
    };

    return (
        <div className="bg-white min-vh-100 py-5">
            <CContainer>
                <CCard className="shadow-sm rounded-4 p-4 mx-auto" style={{ maxWidth: '500px' }}>
                    <CCardHeader className="text-center text-primary mb-4">
                        <h3 className="mb-0">Register</h3>
                    </CCardHeader>
                    <CCardBody>
                        <CForm onSubmit={handleSubmit}>
                            {fields.map((field) => (
                                <div className="mb-3" key={field.name}>
                                    {field.type === 'select' ? (
                                        <>
                                            <label className="form-label small fw-semibold text-muted mb-1">{field.label} <span className="text-danger">*</span></label>
                                            <CFormSelect
                                                name={field.name}
                                                value={formData[field.name]}
                                                onChange={handleChange}
                                                style={{ borderRadius: '6px', padding: '10px' }}
                                            >
                                                {field.options.map((opt) => (
                                                    <option key={opt} value={opt}>
                                                        {opt.charAt(0).toUpperCase() + opt.slice(1)}
                                                    </option>
                                                ))}
                                            </CFormSelect>
                                        </>
                                    ) : field.name === 'password' ? (
                                        <CInputGroup>
                                            <CFormInput
                                                type={showPassword ? 'text' : 'password'}
                                                name={field.name}
                                                placeholder={`${field.label} *`}
                                                value={formData[field.name]}
                                                onChange={handleChange}
                                                invalid={!!errors[field.name]}
                                                style={{ borderRadius: '6px', padding: '10px' }}
                                            />
                                            <CInputGroupText onClick={() => setShowPassword((s) => !s)} style={{ cursor: 'pointer' }}>
                                                {showPassword ? 'Hide' : 'Show'}
                                            </CInputGroupText>
                                        </CInputGroup>
                                    ) : (
                                        <CFormInput
                                            type={field.type}
                                            name={field.name}
                                            placeholder={`${field.label} *`}
                                            value={formData[field.name]}
                                            onChange={handleChange}
                                            invalid={!!errors[field.name]}
                                            style={{ borderRadius: '6px', padding: '10px' }}
                                        />
                                    )}
                                    {errors[field.name] && (
                                        <CFormFeedback invalid>{errors[field.name]}</CFormFeedback>
                                    )}
                                </div>
                            ))}

                            <div className="d-grid mt-4">
                                <CButton color="info" size="lg" type="submit">
                                    Register
                                </CButton>
                            </div>
                        </CForm>
                    </CCardBody>
                </CCard>

                {/* Designated Error Modal */}
                <ErrorModal
                    visible={errorModalVisible}
                    title="Registration Failed"
                    errorMessage={errorModalMsg}
                    onClose={() => setErrorModalVisible(false)}
                />
            </CContainer>
        </div>
    );
}
