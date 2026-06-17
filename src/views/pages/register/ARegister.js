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
    CContainer,
} from '@coreui/react';

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

    const validateField = (name, value) => {
        const v = typeof value === 'string' ? value.trim() : value;
        switch (name) {
            case 'first_name':
                if (!v) return 'First name is required';
                break;
            case 'last_name':
                if (!v) return 'Last name is required';
                break;
            case 'email':
                if (!v) return 'Email is required';
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Invalid email format';
                break;
            case 'mobile':
                if (!v) return 'Mobile is required';
                if (!/^[0-9]{10}$/.test(v)) return 'Invalid 10-digit mobile number';
                break;
            case 'password':
                if (!v) return 'Password is required';
                if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/.test(v))
                    return 'Password must be 8+ chars, include uppercase, lowercase & number';
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
            value = value.replace(/[^0-9]/g, '').slice(0, 10);
        } else if (['first_name', 'last_name'].includes(name)) {
            value = value.replace(/[^A-Za-z ]/g, '');
        }
        setFormData({ ...formData, [name]: value });
        const err = validateField(name, value);
        setErrors({ ...errors, [name]: err });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        })
            .then((res) => res.json())
            .then(() => {
                navigate('/verify-otp', { state: { email: formData.email } });
            });
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
            </CContainer>
        </div>
    );
}
