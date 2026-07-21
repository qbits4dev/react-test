const getApiBaseUrl = () => {
  return (
    globalThis.apiBaseUrl ||
    globalThis.__API_BASE_URL__ ||
    import.meta.env.VITE_API_BASE_URL ||
    ''
  ).replace(/\/$/, '')
}

// Invoices
export const listInvoices = async (params = {}) => {
  const query = new URLSearchParams(params).toString()
  const res = await fetch(`${getApiBaseUrl()}/invoices/${query ? `?${query}` : ''}`)
  if (!res.ok) throw new Error(await res.text() || 'Failed to fetch invoices')
  return res.json()
}

export const getInvoiceById = async (invoiceId) => {
  const res = await fetch(`${getApiBaseUrl()}/invoices/${invoiceId}`)
  if (!res.ok) throw new Error(await res.text() || 'Failed to fetch invoice')
  return res.json()
}

export const createInvoice = async (payload) => {
  const res = await fetch(`${getApiBaseUrl()}/invoices/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  if (!res.ok) throw new Error(await res.text() || 'Failed to create invoice')
  return res.json()
}

export const getInvoiceHtml = async (invoiceId) => {
  const res = await fetch(`${getApiBaseUrl()}/invoices/${invoiceId}/html`)
  if (!res.ok) throw new Error(await res.text() || 'Failed to fetch invoice HTML')
  return res.text()
}

export const sendInvoiceEmail = async (invoiceId) => {
  const res = await fetch(`${getApiBaseUrl()}/invoices/${invoiceId}/send-email`, {
    method: 'POST'
  })
  if (!res.ok) throw new Error(await res.text() || 'Failed to send invoice email')
  return res.json()
}

// Payments
export const listPayments = async (params = {}) => {
  const query = new URLSearchParams(params).toString()
  const res = await fetch(`${getApiBaseUrl()}/payments/${query ? `?${query}` : ''}`)
  if (!res.ok) throw new Error(await res.text() || 'Failed to fetch payments')
  return res.json()
}

export const getPaymentById = async (paymentId) => {
  const res = await fetch(`${getApiBaseUrl()}/payments/${paymentId}`)
  if (!res.ok) throw new Error(await res.text() || 'Failed to fetch payment')
  return res.json()
}

export const createPayment = async (payload) => {
  const res = await fetch(`${getApiBaseUrl()}/payments/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  if (!res.ok) throw new Error(await res.text() || 'Failed to record payment')
  return res.json()
}

export const updatePaymentStatus = async (paymentId, status) => {
  const res = await fetch(`${getApiBaseUrl()}/payments/${paymentId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  })
  if (!res.ok) throw new Error(await res.text() || 'Failed to update payment status')
  return res.json()
}

// Payment Plans
export const getPaymentPlan = async (bookingId) => {
  const res = await fetch(`${getApiBaseUrl()}/payment-plans/${bookingId}`)
  if (!res.ok) {
    if (res.status === 404) return null // No payment plan set up yet
    throw new Error(await res.text() || 'Failed to fetch payment plan')
  }
  return res.json()
}

export const setupPaymentPlan = async (bookingId, payload) => {
  const res = await fetch(`${getApiBaseUrl()}/payment-plans/${bookingId}/setup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  if (!res.ok) throw new Error(await res.text() || 'Failed to setup payment plan')
  return res.json()
}

// Invoice Templates
export const listTemplates = async () => {
  const res = await fetch(`${getApiBaseUrl()}/invoice-templates/`)
  if (!res.ok) throw new Error(await res.text() || 'Failed to fetch templates')
  return res.json()
}

export const createOrUpdateTemplate = async (payload) => {
  const res = await fetch(`${getApiBaseUrl()}/invoice-templates/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  if (!res.ok) throw new Error(await res.text() || 'Failed to save template')
  return res.json()
}

export const getClientProfile = async (clientId) => {
  const res = await fetch(`${getApiBaseUrl()}/users/${clientId}`)
  if (!res.ok) return null
  return res.json()
}

export const generatePremiumInvoiceHtml = (invoice, clientProfile = null, logoImgUrl = '') => {
  const clientName = clientProfile 
    ? `${clientProfile.first_name || ''} ${clientProfile.last_name || ''}`.trim() 
    : `Client ID: ${invoice.client_id}`;
  const clientMobile = clientProfile?.mobile || clientProfile?.phone || '—';
  const clientEmail = clientProfile?.email || '—';
  const clientAddress = clientProfile?.address || '—';

  const basePriceFormatted = parseFloat(invoice.base_price || 0).toLocaleString('en-IN');
  const amenitiesFormatted = parseFloat(invoice.amenities_charges || 0).toLocaleString('en-IN');
  const otherFormatted = parseFloat(invoice.other_charges || 0).toLocaleString('en-IN');
  const totalFormatted = parseFloat(invoice.total_amount || 0).toLocaleString('en-IN');
  const paidFormatted = parseFloat(invoice.paid_amount || 0).toLocaleString('en-IN');
  const balanceFormatted = parseFloat(invoice.balance_due || 0).toLocaleString('en-IN');
  const rateFormatted = parseFloat(invoice.rate || 0).toLocaleString('en-IN');
  const areaFormatted = parseFloat(invoice.area || 0).toLocaleString('en-IN');

  const invoiceDateFormatted = new Date(invoice.invoice_date).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  });
  const dueDateFormatted = new Date(invoice.due_date).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  });

  const statusColor = invoice.status === 'paid' ? '#10b981' : invoice.status === 'partially_paid' ? '#f59e0b' : '#ef4444';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Invoice - ${invoice.invoice_number}</title>
      <style>
        html, body {
          margin: 0;
          padding: 0;
          background-color: #ffffff;
          -webkit-print-color-adjust: exact;
        }
        body {
          font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          padding: 24px;
          color: #333333;
          line-height: 1.4;
          font-size: 12.5px;
        }
        .invoice-card {
          max-width: 800px;
          margin: 0 auto;
          background: #ffffff;
          page-break-inside: avoid;
        }
        .header-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        .header-logo-text {
          font-size: 24px;
          font-weight: 800;
          color: #1e3a8a;
          letter-spacing: -0.5px;
          text-transform: uppercase;
        }
        .header-subtext {
          font-size: 10px;
          color: #d97706;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          font-weight: 700;
          margin-top: 1px;
        }
        .header-right {
          text-align: right;
          font-size: 11px;
          color: #4b5563;
          line-height: 1.4;
        }
        .divider {
          border-bottom: 2px solid #1e3a8a;
          margin: 12px 0 18px 0;
        }
        .info-grid {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 18px;
        }
        .info-col {
          width: 50%;
          vertical-align: top;
        }
        .section-title {
          font-size: 10.5px;
          font-weight: 700;
          color: #1e3a8a;
          text-transform: uppercase;
          margin-bottom: 5px;
          letter-spacing: 0.5px;
        }
        .info-card-box {
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 12px;
          min-height: 95px;
          margin-right: 8px;
        }
        .info-card-box.last {
          margin-right: 0;
          margin-left: 8px;
        }
        .info-text {
          font-size: 12.5px;
          margin: 3px 0;
          color: #1e293b;
        }
        .info-label {
          color: #64748b;
          font-size: 11.5px;
          display: inline-block;
          width: 75px;
        }
        .status-badge {
          display: inline-block;
          padding: 3px 8px;
          font-size: 9px;
          font-weight: 700;
          text-transform: uppercase;
          color: white;
          background-color: ${statusColor};
          border-radius: 12px;
          margin-top: 2px;
          letter-spacing: 0.5px;
        }
        .property-panel {
          background: linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%);
          color: white;
          border-radius: 6px;
          padding: 12px 20px;
          margin-bottom: 18px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }
        .property-title {
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #93c5fd;
          font-weight: 700;
          margin-bottom: 6px;
        }
        .property-grid {
          width: 100%;
          border-collapse: collapse;
        }
        .property-cell {
          width: 33.3%;
          font-size: 11px;
          color: #cbd5e1;
        }
        .property-value {
          font-size: 13.5px;
          font-weight: 700;
          color: #ffffff;
          margin-top: 1px;
        }
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 15px;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          overflow: hidden;
        }
        .items-table th {
          background-color: #1e3a8a;
          color: #ffffff;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          text-align: left;
          padding: 10px 14px;
          letter-spacing: 0.5px;
        }
        .items-table td {
          padding: 10px 14px;
          font-size: 12.5px;
          border-bottom: 1px solid #e2e8f0;
          color: #334155;
          vertical-align: top;
        }
        .items-table tr:nth-child(even) {
          background-color: #f8fafc;
        }
        .items-table tr:last-child td {
          border-bottom: none;
        }
        .text-right {
          text-align: right !important;
        }
        .summary-wrapper {
          width: 100%;
          margin-top: 5px;
          margin-bottom: 15px;
        }
        .summary-table {
          width: 300px;
          margin-left: auto;
          border-collapse: collapse;
        }
        .summary-row td {
          padding: 6px 10px;
          font-size: 12.5px;
        }
        .summary-label {
          color: #475569;
          text-align: right;
        }
        .summary-value {
          text-align: right;
          font-weight: 600;
          color: #0f172a;
        }
        .summary-grand-total {
          background-color: #f1f5f9;
          font-size: 14px !important;
          font-weight: 700 !important;
          color: #1e3a8a !important;
          border-top: 1px solid #cbd5e1;
          border-bottom: 1px solid #cbd5e1;
        }
        .summary-balance-due {
          background-color: #fee2e2;
          font-size: 13.5px !important;
          font-weight: 700 !important;
          color: #991b1b !important;
        }
        .summary-balance-paid {
          background-color: #d1fae5;
          font-size: 13.5px !important;
          font-weight: 700 !important;
          color: #065f46 !important;
        }
        .notes-card {
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 12px;
          background-color: #ffffff;
          font-size: 11px;
          color: #475569;
          line-height: 1.5;
        }
        .notes-title {
          font-weight: 700;
          color: #1e3a8a;
          margin-bottom: 5px;
          text-transform: uppercase;
          font-size: 10px;
          letter-spacing: 0.5px;
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 3px;
        }
        .signature-table {
          width: 100%;
          margin-top: 30px;
          border-collapse: collapse;
        }
        .signature-col {
          width: 50%;
          text-align: center;
          font-size: 11px;
          color: #64748b;
        }
        .signature-line {
          width: 160px;
          border-bottom: 1px dashed #cbd5e1;
          margin: 0 auto 6px auto;
        }
        .footer-banner {
          text-align: center;
          font-size: 10px;
          color: #94a3b8;
          margin-top: 30px;
          border-top: 1px solid #f1f5f9;
          padding-top: 12px;
        }
      </style>
    </head>
    <body>
      <div class="invoice-card">
        <!-- Logo and Corporate Info -->
        <table class="header-table">
          <tr>
            <td style="border: none; padding: 0;">
              <table style="border-collapse: collapse; border: none; margin: 0; padding: 0;">
                <tr>
                  <td style="border: none; padding: 0; padding-right: 15px; vertical-align: middle;">
                    ${logoImgUrl ? `
                      <img src="${logoImgUrl}" alt="Sri Aditya Developers" style="height: 52px; max-height: 52px; width: auto; object-fit: contain; display: block;" />
                    ` : `
                      <svg width="52" height="52" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: block;">
                        <circle cx="50" cy="50" r="48" fill="#1e3a8a" />
                        <path d="M30 65V42L50 24L70 42V65H58V50H42V65H30Z" fill="#ffffff" />
                        <path d="M50 15C52.5 15 54.5 17 54.5 19.5C54.5 22 52.5 24 50 24C47.5 24 45.5 22 45.5 19.5C45.5 17 47.5 15 50 15Z" fill="#fbbf24" />
                        <path d="M50 8V12" stroke="#fbbf24" stroke-width="2.5" stroke-linecap="round" />
                        <path d="M38 11L41 14" stroke="#fbbf24" stroke-width="2.5" stroke-linecap="round" />
                        <path d="M62 11L59 14" stroke="#fbbf24" stroke-width="2.5" stroke-linecap="round" />
                        <path d="M28 20L31 22" stroke="#fbbf24" stroke-width="2.5" stroke-linecap="round" />
                        <path d="M72 20L69 22" stroke="#fbbf24" stroke-width="2.5" stroke-linecap="round" />
                        <circle cx="50" cy="50" r="43" stroke="#fbbf24" stroke-width="1.5" stroke-dasharray="4 2" />
                      </svg>
                    `}
                  </td>
                  <td style="border: none; padding: 0; vertical-align: middle;">
                    <div class="header-logo-text" style="line-height: 1.1;">Sri Aditya Developers</div>
                    <div class="header-subtext">Venture Plots & Villas</div>
                  </td>
                </tr>
              </table>
            </td>
            <td class="header-right" style="border: none; padding: 0; vertical-align: middle;">
              <strong>Sri Aditya Corporate Office</strong><br>
              Plot No. 42, Sri Aditya Towers, Road No. 36<br>
              Madhapur, Hyderabad, TS - 500081<br>
              sales@sriadityadevelopers.com | +91 99999 88888
            </td>
          </tr>
        </table>

        <div class="divider"></div>

        <!-- Bill To & Metadata -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="width: 50%; vertical-align: top; padding-right: 10px; border: none; padding-bottom: 0;">
              <div class="section-title">Bill To</div>
              <div class="info-card-box" style="margin-right: 0;">
                <p class="info-text" style="font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 6px;">${clientName}</p>
                <p class="info-text"><span class="info-label">Mobile:</span> ${clientMobile}</p>
                <p class="info-text"><span class="info-label">Email:</span> ${clientEmail}</p>
                <p class="info-text"><span class="info-label">Address:</span> ${clientAddress}</p>
              </div>
            </td>
            <td style="width: 50%; vertical-align: top; padding-left: 10px; border: none; padding-bottom: 0;">
              <div class="section-title">Invoice Details</div>
              <div class="info-card-box last" style="margin-left: 0;">
                <p class="info-text" style="margin-top: 0; margin-bottom: 6px;"><span class="info-label">Invoice No:</span> <strong>${invoice.invoice_number}</strong></p>
                <p class="info-text"><span class="info-label">Date:</span> ${invoiceDateFormatted}</p>
                <p class="info-text"><span class="info-label">Due Date:</span> ${dueDateFormatted}</p>
                <p class="info-text">
                  <span class="info-label">Status:</span> 
                  <span class="status-badge">${invoice.status.replace('_', ' ')}</span>
                </p>
              </div>
            </td>
          </tr>
        </table>

        <!-- Ledger Items Table -->
        <table class="items-table">
          <thead>
            <tr>
              <th style="width: 50%;">Description / Venture Allotment Item</th>
              <th class="text-right" style="width: 15%;">Quantity</th>
              <th class="text-right" style="width: 15%;">Unit Rate</th>
              <th class="text-right" style="width: 20%;">Total Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong style="color: #0f172a;">Base Property Cost: Plot No. ${invoice.plot_number}</strong><br>
                <span style="font-size: 11px; color: #64748b;">Project / Venture: <strong>"${invoice.project_name}"</strong></span>
              </td>
              <td class="text-right">${areaFormatted} sq.ft</td>
              <td class="text-right">₹ ${rateFormatted}</td>
              <td class="text-right" style="font-weight: 600; color: #0f172a;">₹ ${basePriceFormatted}</td>
            </tr>
            <tr>
              <td>
                <strong style="color: #0f172a;">Amenities & Infrastructure Development Charges</strong><br>
                <span style="font-size: 11px; color: #64748b;">Roads, water grids, electrical layout & general maintenance setup</span>
              </td>
              <td class="text-right">1 Unit</td>
              <td class="text-right">₹ ${amenitiesFormatted}</td>
              <td class="text-right" style="font-weight: 600; color: #0f172a;">₹ ${amenitiesFormatted}</td>
            </tr>
            <tr>
              <td>
                <strong style="color: #0f172a;">Other Statutory, Documentation & Admin Fees</strong><br>
                <span style="font-size: 11px; color: #64748b;">Legal fee drafting, administrative processing & verification ledger documentation</span>
              </td>
              <td class="text-right">1 Unit</td>
              <td class="text-right">₹ ${otherFormatted}</td>
              <td class="text-right" style="font-weight: 600; color: #0f172a;">₹ ${otherFormatted}</td>
            </tr>
          </tbody>
        </table>

        <!-- Totals Ledger -->
        <div class="summary-wrapper">
          <table class="summary-table">
            <tr class="summary-row">
              <td class="summary-label">Subtotal</td>
              <td class="summary-value">₹ ${totalFormatted}</td>
            </tr>
            <tr class="summary-row">
              <td class="summary-label summary-grand-total">Grand Total</td>
              <td class="summary-value summary-grand-total">₹ ${totalFormatted}</td>
            </tr>
            <tr class="summary-row">
              <td class="summary-label">Amount Paid</td>
              <td class="summary-value" style="color: #059669; font-weight: 600;">₹ ${paidFormatted}</td>
            </tr>
            <tr class="summary-row">
              <td class="summary-label ${invoice.balance_due > 0 ? 'summary-balance-due' : 'summary-balance-paid'}">
                ${invoice.balance_due > 0 ? 'Balance Due' : 'Paid In Full'}
              </td>
              <td class="summary-value ${invoice.balance_due > 0 ? 'summary-balance-due' : 'summary-balance-paid'}">
                ₹ ${balanceFormatted}
              </td>
            </tr>
          </table>
        </div>

        ${invoice.manual_note ? `
        <div class="notes-card" style="margin-top: 10px; border-left: 4px solid #1e3a8a; background-color: #f8fafc; padding: 10px;">
          <div class="notes-title">Office Remarks / Note</div>
          <div style="font-size: 11.5px; color: #0f172a;">${invoice.manual_note}</div>
        </div>
        ` : ''}

        <!-- Terms and Payment Details Row -->
        <table style="width: 100%; border-collapse: collapse; margin-top: 18px;">
          <tr>
            <td style="width: 50%; vertical-align: top; padding-right: 8px;">
              <div class="notes-card" style="min-height: 145px; border-top: 3px solid #1e3a8a;">
                <div class="notes-title">Bank Transfer Details</div>
                <table style="width: 100%; font-size: 11.5px; margin-top: 3px; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 2px 0; color: #64748b; border: none; width: 85px;">Beneficiary:</td>
                    <td style="padding: 2px 0; font-weight: 700; color: #0f172a; border: none;">Sri Aditya Developers Pvt Ltd</td>
                  </tr>
                  <tr>
                    <td style="padding: 2px 0; color: #64748b; border: none;">Bank Name:</td>
                    <td style="padding: 2px 0; font-weight: 600; color: #0f172a; border: none;">HDFC Bank Limited</td>
                  </tr>
                  <tr>
                    <td style="padding: 2px 0; color: #64748b; border: none;">Account No:</td>
                    <td style="padding: 2px 0; font-weight: 700; color: #1e3a8a; border: none; font-size: 12px;">50200084729105</td>
                  </tr>
                  <tr>
                    <td style="padding: 2px 0; color: #64748b; border: none;">Account Type:</td>
                    <td style="padding: 2px 0; color: #334155; border: none;">Current Account</td>
                  </tr>
                  <tr>
                    <td style="padding: 2px 0; color: #64748b; border: none;">IFSC Code:</td>
                    <td style="padding: 2px 0; font-weight: 700; color: #0f172a; border: none;">HDFC0001620</td>
                  </tr>
                  <tr>
                    <td style="padding: 2px 0; color: #64748b; border: none;">UPI VPA ID:</td>
                    <td style="padding: 2px 0; font-weight: 600; color: #059669; border: none;">sriaditya@hdfc</td>
                  </tr>
                </table>
              </div>
            </td>
            <td style="width: 50%; vertical-align: top; padding-left: 8px;">
              <div class="notes-card" style="min-height: 145px; border-top: 3px solid #d97706;">
                <div class="notes-title" style="color: #d97706;">Terms & Conditions</div>
                <ol style="margin: 0; padding-left: 12px; font-size: 10.5px; color: #475569;">
                  <li>All payments must be made in favor of "Sri Aditya Developers Pvt Ltd".</li>
                  <li>Title registration charges, stamp duty, and associated legal documentation costs are extra.</li>
                  <li>Applicable taxes (GST/RERA/Local cess) will be applied at active rates.</li>
                  <li>Possession allotments will proceed only upon full settlement of all pending dues.</li>
                </ol>
              </div>
            </td>
          </tr>
        </table>

        <!-- Signatures -->
        <table class="signature-table">
          <tr>
            <td class="signature-col">
              <div class="signature-line"></div>
              Customer Acceptance Signature
            </td>
            <td class="signature-col">
              <div class="signature-line"></div>
              Authorized Signatory<br>
              <strong>For Sri Aditya Developers Pvt Ltd</strong>
            </td>
          </tr>
        </table>

        <!-- Footer Banner -->
        <div class="footer-banner">
          This is a computer generated ledger document, verified digitally by Sri Aditya Developers Billing Dept.<br>
          <strong>www.sriadityadevelopers.com</strong>
        </div>
      </div>
    </body>
    </html>
  `;
}
