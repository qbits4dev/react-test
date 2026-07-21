import React, { useState, useEffect, useRef } from "react";
import {
    CCard,
    CCardBody,
    CCardHeader,
    CRow,
    CCol,
    CButton,
    CBadge,
    CSpinner,
    CAlert,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CFormInput,
    CFormSelect,
    CFormLabel,
    CFormTextarea,
    CNav,
    CNavItem,
    CNavLink,
    CTabContent,
    CTabPane
} from "@coreui/react";
import CIcon from '@coreui/icons-react';
import {
    cilCloudDownload,
    cilEnvelopeOpen,
    cilPlus,
    cilFindInPage,
    cilInfo,
    cilWallet
} from '@coreui/icons';
import html2pdf from "html2pdf.js";
import logoImg from 'src/assets/brand/logo.jpeg';
import {
    listInvoices,
    createInvoice,
    getInvoiceHtml,
    sendInvoiceEmail,
    listPayments,
    createPayment,
    getClientProfile,
    generatePremiumInvoiceHtml
} from "../../services/invoiceService";

export default function InvoiceLayout() {
    // Current user context
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userRole = user?.role?.toLowerCase() || '';
    const userUid = user?.u_id || user?.user_id || '';
    const isAdminOrAgent = userRole === 'admin' || userRole === 'agent';

    // Tabs state
    const [activeTab, setActiveTab] = useState("invoices");

    // Loading/Error states
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [alertMessage, setAlertMessage] = useState({ visible: false, color: "success", text: "" });

    // Invoices list state
    const [invoices, setInvoices] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    // Payments list state
    const [payments, setPayments] = useState([]);

    // Invoice details modal (HTML Preview)
    const [previewModalVisible, setPreviewModalVisible] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [previewHtml, setPreviewHtml] = useState("");
    const [loadingPreview, setLoadingPreview] = useState(false);
    const [downloadingPdf, setDownloadingPdf] = useState(false);

    // Create Invoice Modal State
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [bookingsList, setBookingsList] = useState([]);
    const [loadingBookings, setLoadingBookings] = useState(false);

    // Create Invoice Form State
    const [invoiceForm, setInvoiceForm] = useState({
        booking_id: "",
        client_id: "",
        project_name: "",
        plot_number: "",
        area: "",
        rate: "",
        amenities_charges: "0.0",
        other_charges: "0.0",
        paid_amount: "0.0",
        invoice_date: new Date().toISOString().split('T')[0],
        due_date: "",
        manual_note: "",
        invoice_type: "standard",
        installment_number: ""
    });
    const [creatingInvoice, setCreatingInvoice] = useState(false);

    // Record Payment Modal State
    const [paymentModalVisible, setPaymentModalVisible] = useState(false);
    const [paymentForm, setPaymentForm] = useState({
        invoice_id: "",
        booking_id: "",
        client_id: "",
        amount_paid: "",
        payment_mode: "Bank Transfer",
        transaction_reference: "",
        notes: ""
    });
    const [recordingPayment, setRecordingPayment] = useState(false);

    // Load initial data
    useEffect(() => {
        loadData();
    }, [userUid, userRole]);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            // Load Invoices
            const filterParams = {};
            if (!isAdminOrAgent) {
                // If customer/client, show only their invoices
                filterParams.client_id = userUid;
            }
            const invList = await listInvoices(filterParams);
            setInvoices(invList);

            // Load Payments
            const payList = await listPayments(filterParams);
            setPayments(payList);
        } catch (err) {
            console.error("Error loading invoice data:", err);
            setError(err.message || "Failed to load invoices and payments data.");
        } finally {
            setLoading(false);
        }
    };

    // Filtered Invoices
    const filteredInvoices = invoices.filter(inv => {
        const query = searchTerm.toLowerCase().trim();
        if (!query) return true;
        return (
            inv.invoice_number?.toLowerCase().includes(query) ||
            inv.client_id?.toLowerCase().includes(query) ||
            inv.project_name?.toLowerCase().includes(query) ||
            String(inv.plot_number).includes(query) ||
            inv.status?.toLowerCase().includes(query)
        );
    });

    // Show Notification Alert Helper
    const triggerAlert = (text, color = "success") => {
        setAlertMessage({ visible: true, color, text });
        setTimeout(() => {
            setAlertMessage(prev => ({ ...prev, visible: false }));
        }, 5000);
    };

    // Handle invoice preview (Fetches client details and compiles custom premium HTML inside modal iframe)
    const handlePreviewInvoice = async (invoice) => {
        setSelectedInvoice(invoice);
        setPreviewModalVisible(true);
        setLoadingPreview(true);
        setPreviewHtml("");
        try {
            let profile = null;
            try {
                profile = await getClientProfile(invoice.client_id);
            } catch (errProfile) {
                console.error("Failed to load client profile details:", errProfile);
            }
            const html = generatePremiumInvoiceHtml(invoice, profile, logoImg);
            setPreviewHtml(html);
        } catch (err) {
            console.error("Error generating invoice preview:", err);
            setPreviewHtml(`<div style="padding: 20px; color: red;">Failed to load invoice preview: ${err.message}</div>`);
        } finally {
            setLoadingPreview(false);
        }
    };

    // Client-side PDF Generation and Download
    const handleDownloadPdf = async (invoice) => {
        setDownloadingPdf(true);
        try {
            let profile = null;
            try {
                profile = await getClientProfile(invoice.client_id);
            } catch (errProfile) {
                console.error("Failed to load client profile details:", errProfile);
            }
            const html = generatePremiumInvoiceHtml(invoice, profile, logoImg);

            // Configure html2pdf options
            const opt = {
                margin: [8, 8, 8, 8],
                filename: `${invoice.invoice_number || `INV-${invoice.id}`}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { 
                    scale: 2, 
                    useCORS: true, 
                    logging: false 
                },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
                pagebreak: { mode: ['avoid-all', 'css'] }
            };

            // Generate PDF directly from HTML string
            await html2pdf().set(opt).from(html).save();

            triggerAlert("PDF downloaded successfully!", "success");
        } catch (err) {
            console.error("PDF generation failed:", err);
            triggerAlert(`Failed to generate PDF: ${err.message}`, "danger");
        } finally {
            setDownloadingPdf(false);
        }
    };

    // Trigger Email sending
    const handleSendEmail = async (invoiceId) => {
        try {
            await sendInvoiceEmail(invoiceId);
            triggerAlert("Invoice email sent to client successfully!", "success");
        } catch (err) {
            console.error("Email send failed:", err);
            triggerAlert(`Failed to send email: ${err.message}`, "danger");
        }
    };

    // Open Create Invoice Modal and fetch all bookings to help fill details
    const handleOpenCreateInvoice = async () => {
        setCreateModalVisible(true);
        setLoadingBookings(true);
        try {
            const res = await fetch(`${globalThis.apiBaseUrl || "https://q.qbits4dev.com"}/bookings/`);
            if (res.ok) {
                const data = await res.json();
                setBookingsList(Array.isArray(data) ? data : (data.bookings || data.data || []));
            }
        } catch (err) {
            console.error("Failed to load bookings for dropdown:", err);
        } finally {
            setLoadingBookings(false);
        }
    };

    // Auto-populate invoice details based on booking selection
    const handleBookingSelect = (bookingId) => {
        if (!bookingId) {
            setInvoiceForm(prev => ({
                ...prev,
                booking_id: "",
                client_id: "",
                project_name: "",
                plot_number: "",
                area: "",
                rate: "",
                total_amount: "",
                due_date: ""
            }));
            return;
        }

        const selected = bookingsList.find(b => String(b.id) === String(bookingId));
        if (selected) {
            const total = selected.total_amount || selected.price || 0;
            const area = selected.area || 1200; // fallback default
            const calculatedRate = total > 0 ? (total / area) : 3500;

            // Generate standard invoice due date (e.g. 15 days from today)
            const due = new Date();
            due.setDate(due.getDate() + 15);

            setInvoiceForm(prev => ({
                ...prev,
                booking_id: String(selected.id),
                client_id: selected.customer_id || selected.client_id || "",
                project_name: selected.project_name || "",
                plot_number: String(selected.plot_number || selected.plot_id || ""),
                area: String(area),
                rate: String(calculatedRate.toFixed(2)),
                amenities_charges: String(selected.amenities_charges || 0),
                other_charges: String(selected.other_charges || 0),
                paid_amount: String(selected.advance_amount || 0),
                due_date: due.toISOString().split('T')[0]
            }));
        }
    };

    // Handle Create Invoice submit
    const handleCreateInvoiceSubmit = async (e) => {
        e.preventDefault();
        setCreatingInvoice(true);
        try {
            const payload = {
                ...invoiceForm,
                plot_number: parseInt(invoiceForm.plot_number, 10) || 0,
                area: parseFloat(invoiceForm.area) || 0,
                rate: parseFloat(invoiceForm.rate) || 0
            };
            const newInv = await createInvoice(payload);
            setInvoices(prev => [newInv, ...prev]);
            setCreateModalVisible(false);
            triggerAlert(`Invoice ${newInv.invoice_number} created successfully!`, "success");
            // Reload to sync calculations
            loadData();
        } catch (err) {
            console.error("Failed to create invoice:", err);
            triggerAlert(`Create invoice failed: ${err.message}`, "danger");
        } finally {
            setCreatingInvoice(false);
        }
    };

    // Open Record Payment Modal
    const handleOpenRecordPayment = (invoice) => {
        setPaymentForm({
            invoice_id: String(invoice.id),
            booking_id: String(invoice.booking_id || ""),
            client_id: invoice.client_id || "",
            amount_paid: String(invoice.balance_due || ""),
            payment_mode: "Bank Transfer",
            transaction_reference: "",
            notes: `Payment for Invoice #${invoice.invoice_number}`
        });
        setPaymentModalVisible(true);
    };

    // Handle Record Payment submit
    const handleRecordPaymentSubmit = async (e) => {
        e.preventDefault();
        setRecordingPayment(true);
        try {
            const payload = {
                ...paymentForm,
                amount_paid: parseFloat(paymentForm.amount_paid) || 0
            };
            const newPay = await createPayment(payload);
            setPayments(prev => [newPay, ...prev]);
            setPaymentModalVisible(false);
            triggerAlert(`Payment recorded successfully with Ref: ${newPay.payment_number}`, "success");
            // Reload to sync invoice paid status/balances
            loadData();
        } catch (err) {
            console.error("Failed to record payment:", err);
            triggerAlert(`Record payment failed: ${err.message}`, "danger");
        } finally {
            setRecordingPayment(false);
        }
    };

    // Format currency to Indian Rupees format
    const formatCurrency = (value) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }).format(value || 0);
    };

    // Date formatting helper
    const formatDate = (dateStr) => {
        if (!dateStr) return "—";
        try {
            return new Date(dateStr).toLocaleDateString("en-IN", {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch {
            return dateStr;
        }
    };

    // Status Badge Renderers
    const renderInvoiceStatus = (status) => {
        const s = String(status || '').toLowerCase();
        let color = "secondary";
        if (s === "paid") color = "success";
        else if (s === "partially_paid") color = "warning";
        else if (s === "unpaid") color = "danger";
        else if (s === "cancelled") color = "dark";

        return (
            <CBadge color={color} className="p-2 text-uppercase" style={{ letterSpacing: '0.5px' }}>
                {s.replace('_', ' ')}
            </CBadge>
        );
    };

    const renderPaymentStatus = (status) => {
        const s = String(status || '').toLowerCase();
        let color = "secondary";
        if (s === "completed" || s === "success") color = "success";
        else if (s === "pending") color = "warning";
        else if (s === "failed") color = "danger";

        return (
            <CBadge color={color} className="p-2 text-uppercase">
                {s}
            </CBadge>
        );
    };

    return (
        <div style={{ maxWidth: "1200px", margin: "auto" }} className="fade-in">
            {/* Page Header */}
            <CCard className="mb-4 shadow border-0 overflow-hidden" style={{ borderRadius: "16px" }}>
                <div 
                    style={{ 
                        background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)", 
                        padding: "35px 30px", 
                        color: "white" 
                    }}
                >
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                        <div>
                            <h2 className="mb-1 fw-bold">Invoices & Payments</h2>
                            <p className="mb-0 opacity-75">Generate, track, and download billing invoices and receipts</p>
                        </div>
                        {isAdminOrAgent && (
                            <CButton 
                                color="light" 
                                size="lg" 
                                className="fw-semibold text-primary d-flex align-items-center gap-2 shadow border-0"
                                onClick={handleOpenCreateInvoice}
                                style={{ borderRadius: "10px" }}
                            >
                                <CIcon icon={cilPlus} /> Create Invoice
                            </CButton>
                        )}
                    </div>
                </div>
            </CCard>

            {/* Alert Messages */}
            {alertMessage.visible && (
                <CAlert color={alertMessage.color} dismissible className="shadow-sm mb-4">
                    {alertMessage.text}
                </CAlert>
            )}

            {/* Nav Tabs for Invoices vs Payments list */}
            <CNav variant="tabs" className="mb-4 border-bottom-2">
                <CNavItem>
                    <CNavLink 
                        active={activeTab === "invoices"} 
                        onClick={() => setActiveTab("invoices")}
                        style={{ cursor: "pointer", fontWeight: "600", fontSize: "1.1rem" }}
                        className={activeTab === "invoices" ? "text-primary border-primary-active" : "text-secondary"}
                    >
                        <CIcon icon={cilInfo} className="me-2" /> Invoices
                    </CNavLink>
                </CNavItem>
                <CNavItem>
                    <CNavLink 
                        active={activeTab === "payments"} 
                        onClick={() => setActiveTab("payments")}
                        style={{ cursor: "pointer", fontWeight: "600", fontSize: "1.1rem" }}
                        className={activeTab === "payments" ? "text-primary border-primary-active" : "text-secondary"}
                    >
                        <CIcon icon={cilWallet} className="me-2" /> Payment Receipts
                    </CNavLink>
                </CNavItem>
            </CNav>

            {/* Content Tab Panes */}
            <CTabContent>
                {/* ── INVOICES TAB ── */}
                <CTabPane visible={activeTab === "invoices"}>
                    <CCard className="shadow-sm border-0 mb-4" style={{ borderRadius: "12px" }}>
                        <CCardHeader className="bg-white border-0 py-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
                            <h5 className="mb-0 fw-bold text-dark">Invoice Entries</h5>
                            <CFormInput
                                type="text"
                                placeholder="Search by number, customer, project, status..."
                                style={{ maxWidth: "320px", borderRadius: "8px" }}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </CCardHeader>
                        <CCardBody className="p-0">
                            {loading ? (
                                <div className="text-center py-5">
                                    <CSpinner color="primary" />
                                    <p className="mt-2 text-muted">Retrieving Invoices...</p>
                                </div>
                            ) : error ? (
                                <div className="p-4 text-danger text-center">
                                    <strong>Error: </strong> {error}
                                </div>
                            ) : filteredInvoices.length === 0 ? (
                                <div className="text-center py-5 text-muted">
                                    <span style={{ fontSize: "3rem" }}>📄</span>
                                    <h5 className="mt-3">No Invoices Found</h5>
                                    <p className="small mb-0">No billing entries match your search criteria or role filters.</p>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <CTable hover align="middle" className="mb-0 text-center text-nowrap">
                                        <CTableHead color="light">
                                            <CTableRow>
                                                <CTableHeaderCell>Invoice No.</CTableHeaderCell>
                                                <CTableHeaderCell>Client ID</CTableHeaderCell>
                                                <CTableHeaderCell>Project / Plot</CTableHeaderCell>
                                                <CTableHeaderCell>Total Amount</CTableHeaderCell>
                                                <CTableHeaderCell>Balance Due</CTableHeaderCell>
                                                <CTableHeaderCell>Invoice Date</CTableHeaderCell>
                                                <CTableHeaderCell>Status</CTableHeaderCell>
                                                <CTableHeaderCell>Actions</CTableHeaderCell>
                                            </CTableRow>
                                        </CTableHead>
                                        <CTableBody>
                                            {filteredInvoices.map((inv) => (
                                                <CTableRow key={inv.id}>
                                                    <CTableDataCell className="fw-bold text-primary">
                                                        {inv.invoice_number || `SAD-INV-${inv.id}`}
                                                    </CTableDataCell>
                                                    <CTableDataCell>{inv.client_id}</CTableDataCell>
                                                    <CTableDataCell>
                                                        <div className="fw-semibold text-dark">{inv.project_name}</div>
                                                        <small className="text-muted">Plot #{inv.plot_number}</small>
                                                    </CTableDataCell>
                                                    <CTableDataCell className="fw-semibold text-dark">
                                                        {formatCurrency(inv.total_amount)}
                                                    </CTableDataCell>
                                                    <CTableDataCell className={inv.balance_due > 0 ? "text-danger fw-bold" : "text-success fw-bold"}>
                                                        {formatCurrency(inv.balance_due)}
                                                    </CTableDataCell>
                                                    <CTableDataCell>{formatDate(inv.invoice_date)}</CTableDataCell>
                                                    <CTableDataCell>{renderInvoiceStatus(inv.status)}</CTableDataCell>
                                                    <CTableDataCell>
                                                        <div className="d-flex gap-2 justify-content-center">
                                                            <CButton 
                                                                color="info" 
                                                                size="sm" 
                                                                variant="outline" 
                                                                title="Preview Invoice"
                                                                onClick={() => handlePreviewInvoice(inv)}
                                                            >
                                                                <CIcon icon={cilFindInPage} /> Preview
                                                            </CButton>
                                                            <CButton 
                                                                color="primary" 
                                                                size="sm" 
                                                                variant="outline" 
                                                                title="Download PDF"
                                                                onClick={() => handleDownloadPdf(inv)}
                                                            >
                                                                <CIcon icon={cilCloudDownload} /> PDF
                                                            </CButton>
                                                            {isAdminOrAgent && inv.status !== "cancelled" && (
                                                                <>
                                                                    <CButton 
                                                                        color="success" 
                                                                        size="sm" 
                                                                        variant="outline" 
                                                                        title="Record Payment"
                                                                        disabled={inv.balance_due <= 0}
                                                                        onClick={() => handleOpenRecordPayment(inv)}
                                                                    >
                                                                        <CIcon icon={cilWallet} /> Pay
                                                                    </CButton>
                                                                    <CButton 
                                                                        color="secondary" 
                                                                        size="sm" 
                                                                        variant="outline" 
                                                                        title="Send Email to Client"
                                                                        onClick={() => handleSendEmail(inv.id)}
                                                                    >
                                                                        <CIcon icon={cilEnvelopeOpen} /> Email
                                                                    </CButton>
                                                                </>
                                                            )}
                                                        </div>
                                                    </CTableDataCell>
                                                </CTableRow>
                                            ))}
                                        </CTableBody>
                                    </CTable>
                                </div>
                            )}
                        </CCardBody>
                    </CCard>
                </CTabPane>

                {/* ── PAYMENTS TAB ── */}
                <CTabPane visible={activeTab === "payments"}>
                    <CCard className="shadow-sm border-0 mb-4" style={{ borderRadius: "12px" }}>
                        <CCardHeader className="bg-white border-0 py-3">
                            <h5 className="mb-0 fw-bold text-dark">Payment Transactions</h5>
                        </CCardHeader>
                        <CCardBody className="p-0">
                            {loading ? (
                                <div className="text-center py-5">
                                    <CSpinner color="primary" />
                                    <p className="mt-2 text-muted">Retrieving Payments...</p>
                                </div>
                            ) : error ? (
                                <div className="p-4 text-danger text-center">
                                    <strong>Error: </strong> {error}
                                </div>
                            ) : payments.length === 0 ? (
                                <div className="text-center py-5 text-muted">
                                    <span style={{ fontSize: "3rem" }}>💸</span>
                                    <h5 className="mt-3">No Receipts Registered</h5>
                                    <p className="small mb-0">Transactions will list here once invoices receive payments.</p>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <CTable hover align="middle" className="mb-0 text-center text-nowrap">
                                        <CTableHead color="light">
                                            <CTableRow>
                                                <CTableHeaderCell>Receipt Ref</CTableHeaderCell>
                                                <CTableHeaderCell>Invoice No.</CTableHeaderCell>
                                                <CTableHeaderCell>Customer ID</CTableHeaderCell>
                                                <CTableHeaderCell>Amount Received</CTableHeaderCell>
                                                <CTableHeaderCell>Payment Mode</CTableHeaderCell>
                                                <CTableHeaderCell>Transaction Reference</CTableHeaderCell>
                                                <CTableHeaderCell>Date Paid</CTableHeaderCell>
                                                <CTableHeaderCell>Status</CTableHeaderCell>
                                            </CTableRow>
                                        </CTableHead>
                                        <CTableBody>
                                            {payments.map((pay) => (
                                                <CTableRow key={pay.id}>
                                                    <CTableDataCell className="fw-bold text-success">
                                                        {pay.payment_number || `SAD-PAY-${pay.id}`}
                                                    </CTableDataCell>
                                                    <CTableDataCell className="fw-semibold">
                                                        {pay.invoice_number || `INV-${pay.invoice_id}`}
                                                    </CTableDataCell>
                                                    <CTableDataCell>{pay.client_id}</CTableDataCell>
                                                    <CTableDataCell className="text-success fw-bold">
                                                        {formatCurrency(pay.amount_paid)}
                                                    </CTableDataCell>
                                                    <CTableDataCell>{pay.payment_mode}</CTableDataCell>
                                                    <CTableDataCell className="text-muted small">
                                                        {pay.transaction_reference || "Direct / Cash"}
                                                    </CTableDataCell>
                                                    <CTableDataCell>{formatDate(pay.payment_date)}</CTableDataCell>
                                                    <CTableDataCell>{renderPaymentStatus(pay.status)}</CTableDataCell>
                                                </CTableRow>
                                            ))}
                                        </CTableBody>
                                    </CTable>
                                </div>
                            )}
                        </CCardBody>
                    </CCard>
                </CTabPane>
            </CTabContent>

            {/* ── PREVIEW INVOICE MODAL (Styled HTML display) ── */}
            <CModal 
                visible={previewModalVisible} 
                onClose={() => setPreviewModalVisible(false)} 
                size="lg" 
                backdrop="static"
                scrollable
            >
                <CModalHeader style={{ background: "#1e3a8a", color: "white" }}>
                    <CModalTitle>
                        Invoice Preview: {selectedInvoice?.invoice_number || `SAD-INV-${selectedInvoice?.id}`}
                    </CModalTitle>
                </CModalHeader>
                <CModalBody className="p-0 bg-light" style={{ minHeight: "500px", display: "flex", flexDirection: "column" }}>
                    {loadingPreview ? (
                        <div className="text-center my-auto py-5">
                            <CSpinner color="primary" />
                            <p className="mt-2 text-muted">Compiling HTML Template...</p>
                        </div>
                    ) : (
                        <iframe
                            srcDoc={previewHtml}
                            title="Invoice Preview Document"
                            style={{ 
                                width: "100%", 
                                height: "550px", 
                                border: "none",
                                backgroundColor: "white"
                            }}
                        />
                    )}
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" variant="ghost" onClick={() => setPreviewModalVisible(false)}>
                        Close
                    </CButton>
                    <CButton 
                        color="primary" 
                        onClick={() => handleDownloadPdf(selectedInvoice)}
                        disabled={downloadingPdf || loadingPreview}
                    >
                        {downloadingPdf ? (
                            <>
                                <CSpinner size="sm" className="me-2" /> Downloading...
                            </>
                        ) : (
                            <>
                                <CIcon icon={cilCloudDownload} className="me-2" /> Download PDF
                            </>
                        )}
                    </CButton>
                </CModalFooter>
            </CModal>

            {/* ── CREATE INVOICE MODAL ── */}
            <CModal 
                visible={createModalVisible} 
                onClose={() => setCreateModalVisible(false)} 
                size="lg" 
                backdrop="static"
            >
                <CModalHeader style={{ background: "#1e3a8a", color: "white" }}>
                    <CModalTitle>Generate New Billing Invoice</CModalTitle>
                </CModalHeader>
                <form onSubmit={handleCreateInvoiceSubmit}>
                    <CModalBody className="p-4">
                        {loadingBookings ? (
                            <div className="text-center py-5">
                                <CSpinner color="primary" />
                                <p className="mt-2 text-muted">Retrieving Active Bookings...</p>
                            </div>
                        ) : (
                            <CRow className="g-3">
                                {/* Booking Selection */}
                                <CCol md={6}>
                                    <CFormLabel htmlFor="booking_select">Associate with Booking *</CFormLabel>
                                    <CFormSelect 
                                        id="booking_select" 
                                        value={invoiceForm.booking_id} 
                                        onChange={(e) => handleBookingSelect(e.target.value)}
                                        required
                                    >
                                        <option value="">Select Booking ID</option>
                                        {bookingsList.map(b => (
                                            <option key={b.id} value={b.id}>
                                                Booking #{b.id} — Customer {b.customer_id} (Plot #{b.plot_number || b.plot_id})
                                            </option>
                                        ))}
                                    </CFormSelect>
                                </CCol>

                                {/* Customer ID */}
                                <CCol md={6}>
                                    <CFormLabel htmlFor="client_id">Customer / Client ID *</CFormLabel>
                                    <CFormInput 
                                        id="client_id" 
                                        type="text" 
                                        value={invoiceForm.client_id} 
                                        onChange={(e) => setInvoiceForm({ ...invoiceForm, client_id: e.target.value })}
                                        required 
                                        readOnly
                                        style={{ backgroundColor: "#f3f4f6" }}
                                    />
                                </CCol>

                                {/* Project Name */}
                                <CCol md={6}>
                                    <CFormLabel htmlFor="project_name">Project Venture Name *</CFormLabel>
                                    <CFormInput 
                                        id="project_name" 
                                        type="text" 
                                        value={invoiceForm.project_name} 
                                        onChange={(e) => setInvoiceForm({ ...invoiceForm, project_name: e.target.value })}
                                        required 
                                        readOnly
                                        style={{ backgroundColor: "#f3f4f6" }}
                                    />
                                </CCol>

                                {/* Plot Number */}
                                <CCol md={6}>
                                    <CFormLabel htmlFor="plot_number">Plot Number *</CFormLabel>
                                    <CFormInput 
                                        id="plot_number" 
                                        type="number" 
                                        value={invoiceForm.plot_number} 
                                        onChange={(e) => setInvoiceForm({ ...invoiceForm, plot_number: e.target.value })}
                                        required 
                                        readOnly
                                        style={{ backgroundColor: "#f3f4f6" }}
                                    />
                                </CCol>

                                {/* Plot Area */}
                                <CCol md={4}>
                                    <CFormLabel htmlFor="area">Plot Area (Sq. Yards / Ft) *</CFormLabel>
                                    <CFormInput 
                                        id="area" 
                                        type="number" 
                                        step="any"
                                        value={invoiceForm.area} 
                                        onChange={(e) => setInvoiceForm({ ...invoiceForm, area: e.target.value })}
                                        required 
                                    />
                                </CCol>

                                {/* Rate */}
                                <CCol md={4}>
                                    <CFormLabel htmlFor="rate">Rate per Unit *</CFormLabel>
                                    <CFormInput 
                                        id="rate" 
                                        type="number" 
                                        step="any"
                                        value={invoiceForm.rate} 
                                        onChange={(e) => setInvoiceForm({ ...invoiceForm, rate: e.target.value })}
                                        required 
                                    />
                                </CCol>

                                {/* Paid So Far */}
                                <CCol md={4}>
                                    <CFormLabel htmlFor="paid_amount">Advance Paid So Far *</CFormLabel>
                                    <CFormInput 
                                        id="paid_amount" 
                                        type="number" 
                                        step="any"
                                        value={invoiceForm.paid_amount} 
                                        onChange={(e) => setInvoiceForm({ ...invoiceForm, paid_amount: e.target.value })}
                                        required 
                                    />
                                </CCol>

                                {/* Amenities Charges */}
                                <CCol md={6}>
                                    <CFormLabel htmlFor="amenities_charges">Amenities Charges</CFormLabel>
                                    <CFormInput 
                                        id="amenities_charges" 
                                        type="number" 
                                        step="any"
                                        value={invoiceForm.amenities_charges} 
                                        onChange={(e) => setInvoiceForm({ ...invoiceForm, amenities_charges: e.target.value })}
                                    />
                                </CCol>

                                {/* Other Charges */}
                                <CCol md={6}>
                                    <CFormLabel htmlFor="other_charges">Other Charges</CFormLabel>
                                    <CFormInput 
                                        id="other_charges" 
                                        type="number" 
                                        step="any"
                                        value={invoiceForm.other_charges} 
                                        onChange={(e) => setInvoiceForm({ ...invoiceForm, other_charges: e.target.value })}
                                    />
                                </CCol>

                                {/* Invoice Date */}
                                <CCol md={6}>
                                    <CFormLabel htmlFor="invoice_date">Invoice Date *</CFormLabel>
                                    <CFormInput 
                                        id="invoice_date" 
                                        type="date" 
                                        value={invoiceForm.invoice_date} 
                                        onChange={(e) => setInvoiceForm({ ...invoiceForm, invoice_date: e.target.value })}
                                        required 
                                    />
                                </CCol>

                                {/* Due Date */}
                                <CCol md={6}>
                                    <CFormLabel htmlFor="due_date">Due Date *</CFormLabel>
                                    <CFormInput 
                                        id="due_date" 
                                        type="date" 
                                        value={invoiceForm.due_date} 
                                        onChange={(e) => setInvoiceForm({ ...invoiceForm, due_date: e.target.value })}
                                        required 
                                    />
                                </CCol>

                                {/* Invoice Type */}
                                <CCol md={6}>
                                    <CFormLabel htmlFor="invoice_type">Invoice Type</CFormLabel>
                                    <CFormSelect 
                                        id="invoice_type" 
                                        value={invoiceForm.invoice_type} 
                                        onChange={(e) => setInvoiceForm({ ...invoiceForm, invoice_type: e.target.value })}
                                    >
                                        <option value="standard">Standard</option>
                                        <option value="booking_amount">Booking Amount</option>
                                        <option value="installment">Installment / EMI</option>
                                        <option value="amenities">Amenities Fees</option>
                                    </CFormSelect>
                                </CCol>

                                {/* Installment Number */}
                                <CCol md={6}>
                                    <CFormLabel htmlFor="installment_number">Installment Number (Optional)</CFormLabel>
                                    <CFormInput 
                                        id="installment_number" 
                                        type="text" 
                                        placeholder="e.g. 1, 2, Final"
                                        value={invoiceForm.installment_number} 
                                        onChange={(e) => setInvoiceForm({ ...invoiceForm, installment_number: e.target.value })}
                                    />
                                </CCol>

                                {/* Manual Note */}
                                <CCol md={12}>
                                    <CFormLabel htmlFor="manual_note">Manual Notes / Remarks</CFormLabel>
                                    <CFormTextarea 
                                        id="manual_note" 
                                        rows={3} 
                                        placeholder="Enter manual remarks to print on the invoice..."
                                        value={invoiceForm.manual_note} 
                                        onChange={(e) => setInvoiceForm({ ...invoiceForm, manual_note: e.target.value })}
                                    />
                                </CCol>
                            </CRow>
                        )}
                    </CModalBody>
                    <CModalFooter>
                        <CButton color="secondary" variant="ghost" onClick={() => setCreateModalVisible(false)}>
                            Cancel
                        </CButton>
                        <CButton type="submit" color="primary" disabled={creatingInvoice || loadingBookings}>
                            {creatingInvoice ? <CSpinner size="sm" /> : "Generate Invoice"}
                        </CButton>
                    </CModalFooter>
                </form>
            </CModal>

            {/* ── RECORD PAYMENT MODAL ── */}
            <CModal 
                visible={paymentModalVisible} 
                onClose={() => setPaymentModalVisible(false)} 
                backdrop="static"
            >
                <CModalHeader style={{ background: "#2e7d32", color: "white" }}>
                    <CModalTitle>Record Payment Transaction</CModalTitle>
                </CModalHeader>
                <form onSubmit={handleRecordPaymentSubmit}>
                    <CModalBody className="p-4">
                        <CRow className="g-3">
                            {/* Invoice ID */}
                            <CCol md={12}>
                                <CFormLabel htmlFor="pay_invoice_id">Invoice Number Reference *</CFormLabel>
                                <CFormInput 
                                    id="pay_invoice_id" 
                                    type="text" 
                                    value={paymentForm.invoice_id} 
                                    readOnly 
                                    style={{ backgroundColor: "#f3f4f6" }}
                                />
                            </CCol>

                            {/* Client ID */}
                            <CCol md={12}>
                                <CFormLabel htmlFor="pay_client_id">Customer / Client ID *</CFormLabel>
                                <CFormInput 
                                    id="pay_client_id" 
                                    type="text" 
                                    value={paymentForm.client_id} 
                                    readOnly 
                                    style={{ backgroundColor: "#f3f4f6" }}
                                />
                            </CCol>

                            {/* Amount Paid */}
                            <CCol md={6}>
                                <CFormLabel htmlFor="pay_amount">Amount Paid (INR) *</CFormLabel>
                                <CFormInput 
                                    id="pay_amount" 
                                    type="number" 
                                    step="any"
                                    value={paymentForm.amount_paid} 
                                    onChange={(e) => setPaymentForm({ ...paymentForm, amount_paid: e.target.value })}
                                    required 
                                />
                            </CCol>

                            {/* Payment Mode */}
                            <CCol md={6}>
                                <CFormLabel htmlFor="pay_mode">Payment Mode *</CFormLabel>
                                <CFormSelect 
                                    id="pay_mode" 
                                    value={paymentForm.payment_mode} 
                                    onChange={(e) => setPaymentForm({ ...paymentForm, payment_mode: e.target.value })}
                                    required
                                >
                                    <option value="Bank Transfer">Bank Transfer / NEFT</option>
                                    <option value="UPI">UPI (GPay/PhonePe)</option>
                                    <option value="Cash">Cash</option>
                                    <option value="Cheque">Cheque</option>
                                    <option value="Card">Credit/Debit Card</option>
                                </CFormSelect>
                            </CCol>

                            {/* Reference Number */}
                            <CCol md={12}>
                                <CFormLabel htmlFor="pay_ref">Gateway Transaction Reference (Txn ID) *</CFormLabel>
                                <CFormInput 
                                    id="pay_ref" 
                                    type="text" 
                                    placeholder="Enter bank reference or UPI UTR number"
                                    value={paymentForm.transaction_reference} 
                                    onChange={(e) => setPaymentForm({ ...paymentForm, transaction_reference: e.target.value })}
                                    required={paymentForm.payment_mode !== "Cash"}
                                />
                            </CCol>

                            {/* Notes */}
                            <CCol md={12}>
                                <CFormLabel htmlFor="pay_notes">Internal Notes</CFormLabel>
                                <CFormTextarea 
                                    id="pay_notes" 
                                    rows={2} 
                                    value={paymentForm.notes} 
                                    onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
                                />
                            </CCol>
                        </CRow>
                    </CModalBody>
                    <CModalFooter>
                        <CButton color="secondary" variant="ghost" onClick={() => setPaymentModalVisible(false)}>
                            Cancel
                        </CButton>
                        <CButton type="submit" color="success" className="text-white" disabled={recordingPayment}>
                            {recordingPayment ? <CSpinner size="sm" /> : "Record Transaction"}
                        </CButton>
                    </CModalFooter>
                </form>
            </CModal>
        </div>
    );
}
