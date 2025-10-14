import React from 'react'
import {
    CHeader,
    CContainer,
    CHeaderBrand,
    CHeaderText,
} from '@coreui/react'
import Logo from '../../assets/images/siradithya.jpg'

const LoginHeader = () => {
    const headerStyle = {
        background: '#0d6efd',
        color: '#fff',
        height: '70px',
        padding: '0.5rem 1rem',
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
    }

    const logoStyle = {
        width: '45px',
        height: '45px',
        borderRadius: '50%',
        objectFit: 'cover',
        overflow: 'hidden',
        border: '2px solid #fff',
    }

    const titleStyle = {
        margin: 0,
        fontSize: '1.25rem',
        fontWeight: '600',
        whiteSpace: 'nowrap',
    }

    return (
        <CHeader position="sticky" style={headerStyle} className="mb-3">
            <CContainer
                fluid
                className="d-flex justify-content-between align-items-center flex-wrap"
                style={{ padding: '0 10px' }}
            >
                {/* Logo on the left */}
                <CHeaderBrand className="d-flex align-items-center">
                    <img src={Logo} alt="Logo" style={logoStyle} />
                </CHeaderBrand>

                {/* Company Title on the right */}
                <CHeaderText className="d-flex align-items-center text-light">
                    <h3 style={titleStyle} className="mb-0 text-center">
                        Sri Aditya Developers
                    </h3>
                </CHeaderText>
            </CContainer>

            {/* Responsive Adjustments */}
            <style jsx>{`
        @media (max-width: 768px) {
          h3 {
            font-size: 1rem;
          }
          img {
            width: 40px !important;
            height: 40px !important;
          }
          header {
            height: 60px !important;
          }
        }

        @media (max-width: 480px) {
          h3 {
            font-size: 0.9rem;
          }
          img {
            width: 35px !important;
            height: 35px !important;
          }
        }
      `}</style>
        </CHeader>
    )
}

export default LoginHeader
