import React from 'react'
import { CHeader, CContainer, CHeaderBrand, CHeaderText } from '@coreui/react'


const LoginHeader = () => {
    const headerStyle = {
        background: 'primary', // CoreUI primary + success gradient
        color: 'primary', // Text color
        padding: '0.5rem 1rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    }

    const brandStyle = {
        display: 'flex',
        alignItems: 'center',
        fontWeight: '700',
        fontSize: '1.25rem',
    }

    const logoStyle = {
        height: '40px',
        marginRight: '0.5rem',
        borderRadius: '5px',
    }

    const headerTextStyle = {
        fontSize: '1.25rem',
        fontWeight: '500',
    }

    return (
        <CHeader position="sticky" style={headerStyle} className="mb-4">
            <CContainer fluid className="d-flex justify-content-between align-items-center">
                {/* Left: Logo */}
                <CHeaderBrand style={brandStyle}>
                    <img
                        src="src\assets\images\siradithya.jpg" // replace with your image URL
                        alt="Logo"
                        style={logoStyle}
                    />
                </CHeaderBrand>

                {/* Right: Heading Text */}
                <CHeaderText className='text-bold text-primary' style={headerTextStyle}>
                    <h3> Welcome to
                        <br />Sri Aditya Developers</h3>
                </CHeaderText>
            </CContainer>
        </CHeader>
    )
}

export default LoginHeader
