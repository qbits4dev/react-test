import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CCard, CCardBody, CCardHeader, CCol, CRow, CContainer,
  CTable, CTableHead, CTableBody, CTableRow, CTableHeaderCell, CTableDataCell, CButton
} from '@coreui/react'

export default function Skandagreenvalley() {
  const navigate = useNavigate()
  const [plots, setPlots] = useState([]) // State to store plots from API
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch plots data from API
  useEffect(() => {
    const fetchPlots = async () => {
      try {
        const response = await fetch('${apiBaseUrl}/projects/plots')
        if (!response.ok) {
          throw new Error('Failed to fetch plots')
        }
        const data = await response.json()
        // Adjust data format to match expected display keys
        const formattedPlots = data.map(plot => ({
          plotNo: plot.plot_number,
          area: plot.size + ' sq.ft',
          price: `₹${plot.price.toLocaleString()}`,
        }))
        setPlots(formattedPlots)
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }
    fetchPlots()
  }, [])

  const features = [
    "24/7 Security and gated community",
    "Children's play area and parks",
    "Clubhouse and community hall",
    "Ample parking space",
    "Well-planned roads and drainage system"
  ]

  const highlights = [
    "Prime location with easy access to main roads",
    "Eco-friendly project with landscaped gardens",
    "Flexible payment plans available",
    "Approved by local authorities"
  ]

  return (
    <CContainer className="my-5">
      {/* Hero Section */}
      <CRow className="mb-5">
        <CCol>
          <div style={{ position: 'relative', textAlign: 'center', borderRadius: '12px', overflow: 'hidden' }}>
            <img
              src="src/assets/images/skandagreenvalley.png"
              alt="Skanda Green Valley"
              style={{ width: '100%', height: '450px', objectFit: 'cover', filter: 'brightness(60%)', transition: 'transform 0.5s' }}
              className="hero-img"
            />
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
              <h1 style={{ fontSize: '3rem', fontWeight: '800', color: '#FFD700', marginBottom: '10px', textShadow: '2px 2px 8px rgba(0,0,0,0.6)' }}>
                Skanda Green Valley
              </h1>
              <p style={{ fontSize: '1.25rem', color: 'white', maxWidth: '600px', margin: '0 auto', textShadow: '1px 1px 6px rgba(0,0,0,0.5)' }}>
                Premium residential plots surrounded by nature, modern amenities, and luxurious lifestyle.
              </p>
            </div>
          </div>
        </CCol>
      </CRow>

      {/* Description */}
      <CRow className="mb-5">
        <CCol>
          <CCard style={{ borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }}>
            <CCardHeader className="h5 text-white" style={{ backgroundColor: '#00695C', borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}>
              Description
            </CCardHeader>
            <CCardBody style={{ fontSize: '1.05rem', lineHeight: '1.8' }}>
              Skanda Green Valley is a premium residential project offering beautifully designed plots in a serene environment.
              Nestled amidst greenery, it provides a perfect blend of modern amenities and natural beauty, making it ideal for families and investors alike.
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Features & Highlights Side by Side */}
      <CRow className="mb-5">
        <CCol md={6} className="mb-3">
          <CCard style={{ borderRadius: '16px', boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }}>
            <CCardHeader className="h5 text-white" style={{ background: 'linear-gradient(90deg, #4CAF50, #81C784)', borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}>
              Features & Facilities
            </CCardHeader>
            <CCardBody>
              <ul style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
                {features.map((feature, idx) => <li key={idx}>{feature}</li>)}
              </ul>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol md={6} className="mb-3">
          <CCard style={{ borderRadius: '16px', boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }}>
            <CCardHeader className="h5 text-white" style={{ background: 'linear-gradient(90deg, #FF9800, #FFC107)', borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}>
              Highlights
            </CCardHeader>
            <CCardBody>
              <ul style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
                {highlights.map((highlight, idx) => <li key={idx}>{highlight}</li>)}
              </ul>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Available Plots Table */}
      <CRow className="mb-5">
        <CCol>
          <CCard style={{ borderRadius: '16px', boxShadow: '0 8px 25px rgba(0,0,0,0.15)' }}>
            <CCardHeader className="h5 text-white" style={{ backgroundColor: '#3F51B5', borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}>
              Available Plots
            </CCardHeader>
            <CCardBody>
              {loading && <p>Loading plots...</p>}
              {error && <p style={{ color: 'red' }}>{error}</p>}
              {!loading && !error && (
                <CTable striped hover responsive bordered>
                  <CTableHead color="dark">
                    <CTableRow>
                      <CTableHeaderCell>Plot No</CTableHeaderCell>
                      <CTableHeaderCell>Area</CTableHeaderCell>
                      <CTableHeaderCell>Price</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {plots.map((plot, idx) => (
                      <CTableRow key={idx}>
                        <CTableDataCell>{plot.plotNo}</CTableDataCell>
                        <CTableDataCell>{plot.area}</CTableDataCell>
                        <CTableDataCell>{plot.price}</CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              )}

              <div className="text-center mt-4">
                <CButton
                  color="success"
                  style={{
                    borderRadius: '50px',
                    padding: '12px 40px',
                    fontWeight: '600',
                    fontSize: '1.1rem',
                    transition: 'all 0.3s',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
                  }}
                  onClick={() => navigate('/bookSite')}
                  onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                  onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                >
                  Book a Plot
                </CButton>
              </div>

            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}
