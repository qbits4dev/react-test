import React, { useState, useEffect } from "react";
import {
    CCard,
    CCardBody,
    CCardHeader,
    CRow,
    CCol,
    CFormInput,
    CFormTextarea,
    CButton,
} from "@coreui/react";

export default function InvoiceLayout() {
    const [billTo, setBillTo] = useState({
        name: "",
        address: "",
    });
    const [property, setProperty] = useState({
        details: "",
    });
    const [dates, setDates] = useState({
        invoiceDate: "",
        dueDate: "",
    });

    useEffect(() => {
        const today = new Date();
        const due = new Date();
        due.setDate(today.getDate() + 7);

        setDates({
            invoiceDate: today.toLocaleDateString(),
            dueDate: due.toLocaleDateString(),
        });
    }, []);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div style={{ maxWidth: "800px", margin: "auto", padding: "20px" }}>
            {/* Invoice Header */}
            <CRow className="mb-4">
                <CCol>
                    <h2>Sri Aditya Developers</h2>
                    <p>Real Estate • Villas • Plots</p>
                </CCol>
                <CCol className="text-end">
                    <img
                        src="/src/assets/images/siradithya.jpg"
                        alt="Company Logo"
                        style={{ width: "100px" }}
                    />
                </CCol>
            </CRow>

            {/* Dates */}
            <CRow className="mb-3">
                <CCol>
                    <strong>Invoice Date:</strong> {dates.invoiceDate}
                </CCol>
                <CCol className="text-end">
                    <strong>Due Date:</strong> {dates.dueDate}
                </CCol>
            </CRow>

            {/* Bill To */}
            <CCard className="mb-4">
                <CCardHeader>Bill To</CCardHeader>
                <CCardBody>
                    <CFormInput
                        className="mb-2"
                        placeholder="Client Name"
                        value={billTo.name}
                        onChange={(e) => setBillTo({ ...billTo, name: e.target.value })}
                    />
                    <CFormTextarea
                        rows={3}
                        placeholder="Client Address"
                        value={billTo.address}
                        onChange={(e) => setBillTo({ ...billTo, address: e.target.value })}
                    />
                </CCardBody>
            </CCard>

            {/* Property Details */}
            <CCard className="mb-4">
                <CCardHeader>Property Details</CCardHeader>
                <CCardBody>
                    <CFormTextarea
                        rows={4}
                        placeholder="Enter property details here..."
                        value={property.details}
                        onChange={(e) =>
                            setProperty({ ...property, details: e.target.value })
                        }
                    />
                </CCardBody>
            </CCard>

            {/* Print Button */}
            <div className="text-center">
                <CButton color="primary" onClick={handlePrint}>
                    Print Invoice
                </CButton>
            </div>
        </div>
    );
}
