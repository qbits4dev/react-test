import React, { useState } from "react";
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

const Invoice = () => {
  const [billTo, setBillTo] = useState({ name: "", address: "" });
  const [properties, setProperties] = useState([
    { description: "", amount: "" },
  ]);
  const [paidAmount, setPaidAmount] = useState("");

  // ===== Handlers =====
  const handleBillToChange = (e) => {
    const { name, value } = e.target;
    setBillTo({ ...billTo, [name]: value });
  };

  const handlePropertyChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...properties];
    updated[index][name] = value;
    setProperties(updated);
  };

  const addProperty = () => {
    setProperties([...properties, { description: "", amount: "" }]);
  };

  const removeProperty = (index) => {
    const updated = properties.filter((_, i) => i !== index);
    setProperties(updated);
  };

  const total = properties.reduce(
    (sum, item) => sum + (Number(item.amount) || 0),
    0
  );
  const paid = Number(paidAmount) || 0;
  const due = total - paid;

  const formatCurrency = (val) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(val);

  // ===== Render =====
  return (
    <>
      {/* Print-only CSS */}
      <style>
        {`
          @media print {
            .shadow-lg, .shadow, .border-0 {
              box-shadow: none !important;
              border: none !important;
            }
            body {
              background: #fff !important;
            }
            button, input, textarea {
              display: none !important; /* hide form and buttons */
            }
          }
        `}
      </style>

      <CRow className="justify-content-center">
        <CCol xs={12} md={10} lg={8}>
          <CCard className="shadow-lg border-0">
            <CCardHeader className="bg-primary text-white text-center py-4">
              <div className="d-flex align-items-center justify-content-center">
                {/* Company Logo */}
                <img
                  src="src\assets\images\siradithya.jpg"   // <-- replace with your logo path (e.g., public/logo.png)
                  alt="Company Logo"
                  style={{
                    height: "90px",     // adjust size
                    width: "auto",      // maintain aspect ratio
                    objectFit: "contain",
                    marginRight: "30px"
                  }}
                />
                {/* Company Name */}
                <div>
                  <h2 className="mb-0">Sri Aditya Developers</h2>
                  <small className="d-block fw-semibold">
                    • Real Estate • Villas • Plots
                  </small>
                  <small className="d-block">Invoice Generator</small>
                </div>
              </div>
            </CCardHeader>

            <CCardBody>
              {/* ===== FORM SECTION ===== */}
              <CForm className="mb-4">
                <h5 className="fw-bold mb-3">Bill To</h5>
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

                <h5 className="mt-4 fw-bold mb-3">Property Details</h5>
                {properties.map((item, index) => (
                  <CRow key={index} className="mb-2">
                    <CCol md={6}>
                      <CFormInput
                        type="text"
                        name="description"
                        placeholder="Description"
                        value={item.description}
                        onChange={(e) => handlePropertyChange(index, e)}
                      />
                    </CCol>
                    <CCol md={4}>
                      <CFormInput
                        type="number"
                        name="amount"
                        placeholder="Amount"
                        value={item.amount}
                        onChange={(e) => handlePropertyChange(index, e)}
                      />
                    </CCol>
                    <CCol md={2}>
                      {properties.length > 1 && (
                        <CButton
                          color="danger"
                          variant="outline"
                          onClick={() => removeProperty(index)}
                        >
                          X
                        </CButton>
                      )}
                    </CCol>
                  </CRow>
                ))}
                <CButton color="secondary" onClick={addProperty}>
                  + Add Item
                </CButton>

                <h5 className="mt-4 fw-bold mb-3">Payment</h5>
                <CFormInput
                  type="number"
                  name="paidAmount"
                  placeholder="Paid Amount"
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(e.target.value)}
                />
              </CForm>

              {/* ===== INVOICE PREVIEW ===== */}
              <CRow className="mb-4">
                <CCol>
                  <h6 className="fw-bold">Billed To:</h6>
                  <p>
                    {billTo.name || "—"} <br />
                    {billTo.address || "—"}
                  </p>
                </CCol>
                <CCol className="text-end">
                  <h6 className="fw-bold">Invoice #{Date.now().toString().slice(-6)}</h6>
                  <p>Date: {new Date().toLocaleDateString()}</p>
                </CCol>
              </CRow>

              <CTable bordered responsive>
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell>#</CTableHeaderCell>
                    <CTableHeaderCell>Description</CTableHeaderCell>
                    <CTableHeaderCell className="text-end">
                      Amount
                    </CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {properties.map((item, i) => (
                    <CTableRow key={i}>
                      <CTableHeaderCell>{i + 1}</CTableHeaderCell>
                      <CTableDataCell>{item.description || "—"}</CTableDataCell>
                      <CTableDataCell className="text-end">
                        {formatCurrency(Number(item.amount) || 0)}
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                  <CTableRow>
                    <CTableDataCell
                      colSpan={2}
                      className="text-end fw-bold"
                    >
                      Total
                    </CTableDataCell>
                    <CTableDataCell className="fw-bold text-end">
                      {formatCurrency(total)}
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell
                      colSpan={2}
                      className="text-end fw-bold"
                    >
                      Paid
                    </CTableDataCell>
                    <CTableDataCell className="fw-bold text-end">
                      {formatCurrency(paid)}
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell
                      colSpan={2}
                      className="text-end fw-bold"
                    >
                      Due
                    </CTableDataCell>
                    <CTableDataCell className="fw-bold text-danger text-end">
                      {formatCurrency(due)}
                    </CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>

              <CRow className="mt-4">
                <CCol className="text-center">
                  <p className="text-muted">Thank you for your business!</p>
                  <CButton color="primary" onClick={() => window.print()}>
                    Print Invoice
                  </CButton>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  );
};

export default Invoice;
