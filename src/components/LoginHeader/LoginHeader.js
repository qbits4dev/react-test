import React from 'react'
import {
    CHeader,
    CContainer,
    CHeaderBrand,
    CHeaderText,
} from '@coreui/react'

const LoginHeader = () => {
    const headerStyle = {
        background: 'linear-gradient(90deg, #0d6efd 0%, #6610f2 100%)',
        color: '#fff',
        height: '90px',
        padding: '0.75rem 1.0rem',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
    }

    const logoStyle = {
        width: '60px',
        height: '60px',
        borderRadius: '50%', // perfect circle
        objectFit: 'cover',  // ensures the image covers the circle without distortion
        overflow: 'hidden',
        border: '2px solid #fff', // optional: adds a white border
    }

    return (
        <CHeader position="sticky" style={headerStyle} className="mb-4">
            <CContainer
                fluid
                className="d-flex justify-content-between align-items-center"
                style={{ padding: '0 10px' }}
            >
                {/* Logo on the left */}
                <CHeaderBrand className="d-flex align-items-center">
                    <img
                        src="src/assets/images/siradithya.jpg"
                        alt="Logo"
                        style={logoStyle}
                    />
                </CHeaderBrand>

                {/* Company Title on the right */}
                <CHeaderText className="d-flex align-items-center text-light">
                    <h3 style={{ margin: 0 }}>Sri Aditya Developers</h3>
                </CHeaderText>
            </CContainer>
        </CHeader>
    )
}

export default LoginHeader
