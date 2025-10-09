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

    const validate = () => {
        const errs = {};
        if (!formData.first_name.trim()) errs.first_name = 'First name is required';
        if (!formData.last_name.trim()) errs.last_name = 'Last name is required';

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email) errs.email = 'Email is required';
        else if (!emailRegex.test(formData.email)) errs.email = 'Invalid email format';

        const mobileRegex = /^[0-9]{10}$/;
        if (!formData.mobile) errs.mobile = 'Mobile is required';
        else if (!mobileRegex.test(formData.mobile)) errs.mobile = 'Invalid 10-digit mobile number';

        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;
        if (!formData.password) errs.password = 'Password is required';
        else if (!passwordRegex.test(formData.password))
            errs.password = 'Password must be 8+ chars, include uppercase, lowercase & number';

        return errs;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
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
                                    ) : (
                                        <CFormInput
                                            type={field.type}
                                            name={field.name}
                                            placeholder={field.label}
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
