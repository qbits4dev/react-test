import React, { useState, useRef } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CCol,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CButton,
  CForm,
  CFormInput,
  CFormTextarea,
} from "@coreui/react";
import { useReactToPrint } from "react-to-print";

const Invoice = () => {
  const [billTo, setBillTo] = useState({ name: "", address: "" });
  const [property, setProperty] = useState({ description: "", amount: "" });
  const [paidAmount, setPaidAmount] = useState("");

  const handleBillToChange = (e) => {
    const { name, value } = e.target;
    setBillTo({ ...billTo, [name]: value });
  };

  const handlePropertyChange = (e) => {
    const { name, value } = e.target;
    setProperty({ ...property, [name]: value });
  };

  const total = Number(property.amount) || 0;
  const paid = Number(paidAmount) || 0;
  const due = total - paid;

  
  const formRef = useRef(null);

  
  const handlePrint = useReactToPrint({
    content: () => formRef.current,
  });

  return (
    <CRow className="justify-content-center">
      <CCol xs={12} md={10} lg={8}>
        <CCard className="shadow-lg border-0">
          <CCardHeader className="bg-primary text-white text-center py-4">
            <h2 className="mb-0">Sri Aditya Developers</h2>
            <small>Invoice</small>
          </CCardHeader>
          <CCardBody>
            
            <CForm className="mb-4" ref={formRef}>
              <h5 className="mb-3 fw-bold">Bill To</h5>
              <CFormInput
                className="mb-2"
                type="text"
                name="name"
                placeholder="Customer Name"
                value={billTo.name}
                onChange={handleBillToChange}
              />
              <CFormTextarea
                rows={2}
                name="address"
                placeholder="Customer Address"
                value={billTo.address}
                onChange={handleBillToChange}
              />

              <h5 className="mt-4 mb-3 fw-bold">Property Details</h5>
              <CFormInput
                className="mb-2"
                type="text"
                name="description"
                placeholder="Property Description"
                value={property.description}
                onChange={handlePropertyChange}
              />
              <CFormInput
                className="mb-2"
                type="number"
                name="amount"
                placeholder="Total Amount"
                value={property.amount}
                onChange={handlePropertyChange}
              />

              <h5 className="mt-4 mb-3 fw-bold">Payment</h5>
              <CFormInput
                type="number"
                name="paidAmount"
                placeholder="Paid Amount"
                value={paidAmount}
                onChange={(e) => setPaidAmount(e.target.value)}
              />
            </CForm>

           
            <CRow className="mb-4">
              <CCol>
                <h6 className="fw-bold">Billed To:</h6>
                <p>
                  {billTo.name || "—"} <br />
                  {billTo.address || "—"}
                </p>
              </CCol>
              <CCol className="text-end">
                <h6 className="fw-bold">Invoice #1234</h6>
                <p>Date: {new Date().toLocaleDateString()}</p>
              </CCol>
            </CRow>

            <CTable bordered responsive>
              <CTableHead color="light">
                <CTableRow>
                  <CTableHeaderCell>#</CTableHeaderCell>
                  <CTableHeaderCell>Description</CTableHeaderCell>
                  <CTableHeaderCell>Amount</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                <CTableRow>
                  <CTableHeaderCell>1</CTableHeaderCell>
                  <CTableDataCell>{property.description || "—"}</CTableDataCell>
                  <CTableDataCell>₹{total}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableDataCell colSpan={2} className="text-end fw-bold">
                    Total
                  </CTableDataCell>
                  <CTableDataCell className="fw-bold">₹{total}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableDataCell colSpan={2} className="text-end fw-bold">
                    Paid
                  </CTableDataCell>
                  <CTableDataCell className="fw-bold">₹{paid}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableDataCell colSpan={2} className="text-end fw-bold">
                    Due
                  </CTableDataCell>
                  <CTableDataCell className="fw-bold text-danger">₹{due}</CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>

            <CRow className="mt-4">
              <CCol className="text-center">
                <p className="text-muted">Thank you for your business!</p>
                <CButton color="primary" onClick={handlePrint}>
                  Print Form Only
                </CButton>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default Invoice;
