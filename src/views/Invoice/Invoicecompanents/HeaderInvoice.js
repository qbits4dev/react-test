import React from 'react'
import '../invoice.css'

export default function InvoiceHeader() {
  return (
    <div className="header">
      <div className="brand">
        <div className="logo">
          <img src="src\assets\images\siradithya.jpg" alt="Logo" />
          <div>
            <h1>Sri Aditya Developers</h1>
            <div className="tagline">Real Estate • Villas • Plots</div>
          </div>
        </div>
        <h2 className="fw-bold">INVOICE</h2>
      </div>

      <div className="wave">
        <svg viewBox="0 0 1440 180" preserveAspectRatio="none">
          <path d="M0,0 H1440 V120 C1100,80 800,150 0,120 Z" fill="var(--blue)"></path>
        </svg>
      </div>
    </div>
  )
}
