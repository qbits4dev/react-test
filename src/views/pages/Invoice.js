import React, { useState } from 'react'
import {
  CContainer,
  CCard,
  CCardBody,
  CFormInput,
  CFormTextarea,
} from '@coreui/react'

// Single-file CoreUI React component with full CSS + user-editable Bill To & Property Details
export default function InvoiceCoreUIComponent() {
  const [billTo, setBillTo] = useState({
    name: 'Mr./Ms. Client Name',
    address: 'Client Address Line 1',
    city: 'City, State, PIN',
    phone: '+91-XXXXXXXXXX',
    email: 'client@example.com',
  })

  const [property, setProperty] = useState({
    project: 'Aditya Meadows',
    type: 'Villa',
    unit: 'V-12',
    plot: '45',
    area: '2,400 sq.ft',
    location: 'Kokapet, Hyderabad',
  })

  return (
    <CContainer className="p-0" style={{ maxWidth: '210mm' }}>
      <style>{`
:root {
  --blue: #1f5cff;
  --blue-mid: #5184ff;
  --blue-dark: #0d2a68;
  --ink: #111827;
  --muted: #6b7280;
  --line: #dfe7f5;
  --ring: #cfe0ff;
  --bg-soft: #ecf2ff;
}
* { box-sizing: border-box; }
body, .invoice-root { font-family: system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"; color: var(--ink); }
.page { width: 210mm; min-height: 297mm; margin: 0 auto; position: relative; display: flex; flex-direction: column; }
.page::after { content: ""; position: absolute; top: 6mm; left: 6mm; right: 6mm; bottom: 6mm; border: 1px solid var(--ring); border-radius: 8px; pointer-events: none; z-index: 9; }
header.header { position: relative; height: 44mm; background: var(--blue); overflow: hidden; }
header .wave { position: absolute; inset: 0; }
.brand { position: absolute; left: 16mm; top: 50%; transform: translateY(-50%); display: flex; align-items: center; gap: 12px; color: #fff; }
.brand .logo-wrap { width: 20mm; height: 20mm; border-radius: 50%; background: #fff; display: grid; place-items: center; padding: 2px; outline: 2px solid #fff; outline-offset: -2px; }
.brand .logo-wrap img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; display: block; }
.brand .title .name { font-weight: 700; font-size: 16px; }
.brand .title .tag { font-size: 12px; opacity: 0.95; }
.inv-title { position: absolute; right: 16mm; top: 50%; transform: translateY(-50%); color: #fff; font-weight: 800; font-size: 22px; letter-spacing: 0.5px; }
footer.footer { height: 20mm; background: var(--blue-dark); color: #fff; font-size: 12px; display: flex; align-items: flex-end; padding: 6px 16mm; }
.card { position: relative; margin: 10mm 16mm; padding: 10mm; border-radius: 12px; background: #fff; border: 1px solid var(--line); }
.card::after { content: ""; position: absolute; inset: 8px; border-radius: 10px; border: 1px solid var(--ring); pointer-events: none; }
.wm { position: absolute; inset: 0; display: grid; place-items: center; pointer-events: none; z-index: 0; }
.wm img { width: 130mm; height: 130mm; object-fit: contain; border-radius: 50%; filter: grayscale(10%); opacity: 0.12; }
.content { position: relative; z-index: 1; }
.ribbon { display: grid; grid-template-columns: 1fr 240px; gap: 16px; background: #f5f9ff; border: 1px solid var(--line); border-radius: 8px; padding: 12px 16px; margin-bottom: 12px; }
.ribbon h1 { margin: 0; font-size: 18px; color: #0F1D5A; }
.meta { border: 1px solid var(--line); border-radius: 8px; padding: 8px 10px; background: #fff; font-size: 12px; }
.info { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
.cardlet { border: 1px solid var(--line); border-radius: 8px; background: #fff; padding: 10px 12px; font-size: 13px; }
.cardlet h3 { margin: 0 0 4px; color: #1E3A8A; font-size: 14px; }
.items { width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 8px; }
.items th { background: var(--bg-soft); color: #0F1D5A; text-align: left; padding: 8px; font-weight: 700; border-bottom: 1px solid var(--line); }
.items td { padding: 8px; border-bottom: 1px solid var(--line); vertical-align: top; }
.items tr:last-child td { background: var(--blue); color: #fff; font-weight: 700; border-bottom: none; }
.totals { display: grid; grid-template-columns: 1.2fr 1fr 1.4fr 1fr; gap: 0; border: 1px solid var(--line); border-radius: 8px; overflow: hidden; margin-bottom: 8px; }
.totals div { padding: 8px 10px; background: #f7fbff; font-weight: 700; }
.lower { display: grid; grid-template-columns: 0.36fr 1fr; gap: 12px; }
.qrbox, .terms { border: 1px solid var(--line); border-radius: 8px; background: #fff; padding: 10px 12px; }
.signs { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 12px; color: var(--muted); font-size: 13px; }
@media print { .page { width: auto; min-height: auto; } .no-print { display: none !important; } }

/* Input styling to blend inputs with the invoice design */
.cardlet .inline-input,
.cardlet .inline-textarea {
  width: 100%;
  border: none;
  background: transparent;
  padding: 0;
  margin: 0 0 6px 0;
  font: inherit;
  color: inherit;
  outline: none;
  resize: none;
}
/* make the name field slightly bolder to resemble original design */
.cardlet .inline-input.name-field { font-weight: 700; font-size: 14px; }
/* small visual help when editing */
.cardlet .inline-input:focus, .cardlet .inline-textarea:focus {
  box-shadow: 0 0 0 4px rgba(81,132,255,0.07);
  border-radius: 6px;
}

`}</style>

      <div className="page invoice-root">
        <header className="header">
          <div className="wave">
            <svg viewBox="0 0 1440 180" preserveAspectRatio="none">
              <path d="M0,0 H1440 V120 C1100,80 800,150 0,120 Z" fill="var(--blue)"></path>
              {/* <path d="M0,40 C400,120 1000,80 1440,110 V180 H0 Z" fill="var(--blue-mid)"></path> */}
            </svg>
          </div>

          <div className="brand">
            <div className="logo-wrap">
              {/* user requested to ignore the original embedded image source - use placeholder */}
              <img src="src\assets\images\siradithya.jpg" alt="Sri Aditya Developers Logo" />
            </div>
            <div className="title">
              <div className="name">Sri Aditya Developers</div>
              <div className="tag">Real Estate • Villas • Plots</div>
            </div>
          </div>

          <div className="inv-title">INVOICE</div>
        </header>

        <CCard className="card">
          <CCardBody className="content">
            <div className="wm"><img src="/placeholder-watermark.png" alt="watermark" /></div>

            <section className="ribbon">
              <h1>Invoice</h1>
              <div className="meta">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    <tr>
                      <td style={{ color: '#374151', width: '45%' }}>Invoice No.</td>
                      <td style={{ textAlign: 'right', fontWeight: 600 }}>SAD-INV-1007</td>
                    </tr>
                    <tr>
                      <td style={{ color: '#374151' }}>Invoice Date</td>
                      <td style={{ textAlign: 'right', fontWeight: 600 }}>17-Aug-2025</td>
                    </tr>
                    <tr>
                      <td style={{ color: '#374151' }}>Due Date</td>
                      <td style={{ textAlign: 'right', fontWeight: 600 }}>24-Aug-2025</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="info">
              <div className="cardlet">
                <h3>Bill To</h3>
                <CFormInput
                  className="inline-input name-field"
                  placeholder="Client Name"
                  value={billTo.name}
                  onChange={(e) => setBillTo({ ...billTo, name: e.target.value })}
                />
                <CFormTextarea
                  className="inline-textarea"
                  rows={2}
                  placeholder="Address"
                  value={billTo.address}
                  onChange={(e) => setBillTo({ ...billTo, address: e.target.value })}
                />
                <CFormInput
                  className="inline-input"
                  placeholder="City, State, PIN"
                  value={billTo.city}
                  onChange={(e) => setBillTo({ ...billTo, city: e.target.value })}
                />
                <CFormInput
                  className="inline-input"
                  placeholder="Phone"
                  value={billTo.phone}
                  onChange={(e) => setBillTo({ ...billTo, phone: e.target.value })}
                />
                <CFormInput
                  className="inline-input"
                  placeholder="Email"
                  value={billTo.email}
                  onChange={(e) => setBillTo({ ...billTo, email: e.target.value })}
                />
              </div>

              <div className="cardlet">
                <h3>Property Details</h3>
                <div style={{ marginBottom: 6 }}>
                  <CFormInput
                    className="inline-input"
                    placeholder="Project"
                    value={property.project}
                    onChange={(e) => setProperty({ ...property, project: e.target.value })}
                  />
                </div>
                <div style={{ marginBottom: 6 }}>
                  <CFormInput
                    className="inline-input"
                    placeholder="Property Type"
                    value={property.type}
                    onChange={(e) => setProperty({ ...property, type: e.target.value })}
                  />
                </div>
                <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                  <CFormInput
                    style={{ flex: 1 }}
                    className="inline-input"
                    placeholder="Unit No"
                    value={property.unit}
                    onChange={(e) => setProperty({ ...property, unit: e.target.value })}
                  />
                  <CFormInput
                    style={{ flex: 1 }}
                    className="inline-input"
                    placeholder="Plot No"
                    value={property.plot}
                    onChange={(e) => setProperty({ ...property, plot: e.target.value })}
                  />
                </div>
                <div style={{ marginBottom: 6 }}>
                  <CFormInput
                    className="inline-input"
                    placeholder="Super Built-up Area"
                    value={property.area}
                    onChange={(e) => setProperty({ ...property, area: e.target.value })}
                  />
                </div>
                <div>
                  <CFormInput
                    className="inline-input"
                    placeholder="Location"
                    value={property.location}
                    onChange={(e) => setProperty({ ...property, location: e.target.value })}
                  />
                </div>
              </div>
            </section>

            <section>
              <table className="items">
                <thead>
                  <tr>
                    <th style={{ width: '52%' }}>Description</th>
                    <th style={{ width: '16%' }} className="num">Qty/Area</th>
                    <th style={{ width: '16%' }} className="num">Rate</th>
                    <th style={{ width: '16%' }} className="num">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Base Price (Property Value)</td>
                    <td className="num">{property.area}</td>
                    <td className="num">10,000</td>
                    <td className="num">24,000,000</td>
                  </tr>
                  <tr>
                    <td>Development Charges</td>
                    <td className="num">1</td>
                    <td className="num">500,000</td>
                    <td className="num">500,000</td>
                  </tr>
                  <tr>
                    <td>GST (18%)</td>
                    <td className="num">—</td>
                    <td className="num">—</td>
                    <td className="num">4,290,000</td>
                  </tr>
                  <tr>
                    <td colSpan={3} style={{ textAlign: 'right', fontWeight: 700 }}>Total</td>
                    <td className="num">28,790,000</td>
                  </tr>
                </tbody>
              </table>

              <div className="totals">
                <div>Subtotal</div>
                <div style={{ textAlign: 'right' }}>24,500,000</div>
                <div>Tax</div>
                <div style={{ textAlign: 'right' }}>4,290,000</div>
              </div>

              <div className="words">Amount in words: Twenty-eight million seven hundred ninety thousand only.</div>

              <div className="lower">
                <div className="qrbox">
                  <h3>Payment</h3>
                  <div id="qrcode">[QR]</div>
                  <div className="muted">UPI / Bank transfer details here</div>
                </div>

                <div className="terms">
                  <h3>Terms & Notes</h3>
                  <div>1. Payment due within 7 days of invoice date.<br />2. Late payment subject to interest.</div>

                  <div className="signs">
                    <div>Authorized Signatory</div>
                    <div>For Sri Aditya Developers</div>
                  </div>
                </div>
              </div>

            </section>

          </CCardBody>
        </CCard>

        <footer className="footer">
          <div className="contact">Sri Aditya Developers • Address line • Phone: +91-XXXXXXXXXX • Email: info@sriaditya.dev</div>
        </footer>

      </div>
    </CContainer>
  )
}
