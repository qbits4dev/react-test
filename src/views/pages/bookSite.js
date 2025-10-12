import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// CoreUI components for building the form
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CContainer,
    CForm,
    CFormInput,
    CInputGroup,
    CInputGroupText,
    CRow,
    CDropdown,
    CDropdownToggle,
    CDropdownMenu,
    CDropdownItem,
} from '@coreui/react';

// CoreUI icons for a professional touch
import CIcon from '@coreui/icons-react';
import { cilUser, cilBuilding, cilMoney, cilHome } from '@coreui/icons';

const BookSite = () => {
    // State to hold form data
    const [formData, setFormData] = useState({
        customerId: '',
        agentId: '',
        property: 'Select Property', // Default text for dropdown
        amountPaid: '',
    });

    // A hook for navigation, can be used after form submission
    const navigate = useNavigate();

    // Handles changes in text input fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handles selection from the dropdown menu
    const handlePropertySelect = (property) => {
        setFormData({ ...formData, property: property });
    };

    // Handles the form submission
    const handleSubmit = (e) => {
        e.preventDefault(); // Prevents the default browser refresh on submit
        // You can add your form submission logic here, e.g., an API call
        console.log('Form Submitted:', formData);
        // Example: navigate to a success page after submission
        // navigate('/booking-success');
    };

    return (
        <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
            <CContainer>
                <CRow className="justify-content-center">
                    <CCol md={8} lg={7} xl={6}>
                        <CCard className="mx-4 shadow-sm">
                            {/* Card Header for a professional title section */}
                            <CCardHeader className="p-4  text-primary">
                                <h1 className="mb-0">Site Booking</h1>
                                <p className="mb-0">Enter the details below to book your site.</p>
                            </CCardHeader>

                            <CCardBody className="p-4">
                                <CForm onSubmit={handleSubmit}>

                                    {/* Customer ID Input */}
                                    <CInputGroup className="mb-3">
                                        <CInputGroupText>
                                            <CIcon icon={cilUser} />
                                        </CInputGroupText>
                                        <CFormInput
                                            name="customerId"
                                            placeholder="Customer ID"
                                            autoComplete="off"
                                            value={formData.customerId}
                                            onChange={handleChange}
                                            required
                                        />
                                    </CInputGroup>

                                    {/* Agent ID Input */}
                                    <CInputGroup className="mb-4">
                                        <CInputGroupText>
                                            <CIcon icon={cilBuilding} />
                                        </CInputGroupText>
                                        <CFormInput
                                            name="agentId"
                                            placeholder="Agent ID"
                                            autoComplete="off"
                                            value={formData.agentId}
                                            onChange={handleChange}
                                            required
                                        />
                                    </CInputGroup>

                                    {/* Property Details Dropdown */}
                                    <h5 className="text-medium-emphasis">Property Details</h5>
                                    <CDropdown className="w-100 mb-4">
                                        <CDropdownToggle color="secondary" variant="outline" className="w-100 d-flex justify-content-between align-items-center">
                                            <CIcon icon={cilHome} className="me-2" />
                                            {formData.property}
                                        </CDropdownToggle>
                                        <CDropdownMenu className="w-100">
                                            <CDropdownItem onClick={() => handlePropertySelect('Villa Heights - Plot A1')}>Villa Heights - Plot A1</CDropdownItem>
                                            <CDropdownItem onClick={() => handlePropertySelect('Green Meadows - Site B5')}>Green Meadows - Site B5</CDropdownItem>
                                            <CDropdownItem onClick={() => handlePropertySelect('Ocean View - Plot C2')}>Ocean View - Plot C2</CDropdownItem>
                                        </CDropdownMenu>
                                    </CDropdown>

                                    {/* Amount Paid Input */}
                                    <h5 className="text-medium-emphasis">Payment Information</h5>
                                    <CInputGroup className="mb-4">
                                        <CInputGroupText>
                                            <CIcon icon={cilMoney} />
                                        </CInputGroupText>
                                        <CFormInput
                                            name="amountPaid"
                                            type="number"
                                            placeholder="Amount Paid"
                                            autoComplete="off"
                                            value={formData.amountPaid}
                                            onChange={handleChange}
                                            required
                                        />
                                    </CInputGroup>

                                    {/* Submit Button */}
                                    <div className="d-grid">
                                        <CButton color="primary" type="submit" size="lg">
                                            Book Now
                                        </CButton>
                                    </div>
                                </CForm>
                            </CCardBody>
                        </CCard>
                    </CCol>
                </CRow>
            </CContainer>
        </div>
    );
};

export default BookSite;