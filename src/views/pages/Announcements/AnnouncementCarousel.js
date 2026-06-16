import React, { useEffect, useMemo, useState } from 'react'
import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCol,
  CRow,
} from '@coreui/react'
import { cilChevronLeft, cilChevronRight } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  getCategoryLabel,
  getCountdownLabel,
} from './announcementService'

const categoryBadgeColor = (category) => {
  if (category === 'payment_reminder') return 'warning'
  if (category === 'target_offer') return 'success'
  if (category === 'venture_launch') return 'info'
  return 'primary'
}

const cardBg = (category) => {
  if (category === 'payment_reminder') return 'linear-gradient(135deg, #ffe29f 0%, #ffa99f 100%)'
  if (category === 'target_offer') return 'linear-gradient(135deg, #c2ffd8 0%, #465efb 100%)'
  if (category === 'venture_launch') return 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)'
  return 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)'
}

const categoryTheme = (category) => {
  if (category === 'venture_launch') {
    return {
      accent: '#d4af37',
      overlay: 'linear-gradient(120deg, rgba(9,27,20,0.75) 0%, rgba(9,27,20,0.35) 55%, rgba(0,0,0,0.25) 100%)',
    }
  }
  if (category === 'target_offer') {
    return {
      accent: '#f4c430',
      overlay: 'linear-gradient(120deg, rgba(15,37,77,0.78) 0%, rgba(32,59,133,0.42) 55%, rgba(0,0,0,0.25) 100%)',
    }
  }
  if (category === 'payment_reminder') {
    return {
      accent: '#ef233c',
      overlay: 'linear-gradient(120deg, rgba(49,28,28,0.78) 0%, rgba(115,35,35,0.46) 55%, rgba(0,0,0,0.25) 100%)',
    }
  }
  return {
    accent: '#4cc9f0',
    overlay: 'linear-gradient(120deg, rgba(18,38,66,0.78) 0%, rgba(25,82,117,0.44) 55%, rgba(0,0,0,0.25) 100%)',
  }
}

const dotStyle = {
  width: 10,
  height: 10,
  borderRadius: '50%',
  border: 'none',
  cursor: 'pointer',
}

const AnnouncementCarousel = ({
  title,
  items = [],
  emptyText = 'Stay Tuned! New announcements and exciting opportunities will be available soon.',
}) => {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  const safeItems = useMemo(() => (Array.isArray(items) ? items : []), [items])

  useEffect(() => {
    if (index > safeItems.length - 1) setIndex(0)
  }, [safeItems, index])

  useEffect(() => {
    if (paused || safeItems.length < 2) return undefined

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % safeItems.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [paused, safeItems])

  const move = (direction) => {
    if (!safeItems.length) return
    setIndex((prev) => {
      if (direction === 'left') return (prev - 1 + safeItems.length) % safeItems.length
      return (prev + 1) % safeItems.length
    })
  }

  if (!safeItems.length) {
    return (
      <CCard className="border-0 shadow mb-4" style={{ borderRadius: 24, overflow: 'hidden' }}>
        <CCardBody
          style={{
            minHeight: 360,
            background: 'linear-gradient(120deg, #19323c 0%, #2f5d62 45%, #4f8a8b 100%)',
            position: 'relative',
            color: '#f1faee',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.25) 0, rgba(255,255,255,0) 45%)',
            }}
          />
          <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'grid', placeItems: 'center' }}>
            <div style={{ textAlign: 'center', maxWidth: 620 }}>
              <div style={{ fontSize: 58, lineHeight: 1, marginBottom: 14 }}>📣</div>
              <h3 className="mb-3" style={{ fontWeight: 800 }}>{title}</h3>
              <p className="mb-0" style={{ fontSize: 18 }}>{emptyText}</p>
            </div>
          </div>
        </CCardBody>
      </CCard>
    )
  }

  const current = safeItems[index]
  const theme = categoryTheme(current.category)
  const priorityColor = current.reminder_priority === 'high' ? '#c1121f' : current.reminder_priority === 'medium' ? '#f77f00' : '#588157'

  return (
    <CCard
      className="border-0 shadow mb-4"
      style={{
        borderRadius: 24,
        overflow: 'hidden',
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <CCardBody
        style={{
          backgroundImage: `${theme.overlay}, url(${current.banner_image || ''})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          position: 'relative',
          minHeight: 390,
          transition: 'all 300ms ease',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backdropFilter: 'blur(1.8px)',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.03) 100%)',
          }}
        />

        <div style={{ position: 'relative', zIndex: 1, height: '100%' }}>
          <CRow className="align-items-center">
            <CCol md={8}>
              <div
                style={{
                  marginTop: 14,
                  background: 'rgba(255,255,255,0.18)',
                  border: '1px solid rgba(255,255,255,0.35)',
                  borderRadius: 20,
                  padding: '20px 20px 18px',
                  color: 'white',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.25)',
                }}
              >
                <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
                <CBadge color={categoryBadgeColor(current.category)}>{getCategoryLabel(current.category)}</CBadge>
                <CBadge color="dark">{getCountdownLabel(current)}</CBadge>
                {current.category === 'payment_reminder' && (
                  <span
                    style={{
                      color: priorityColor,
                      fontWeight: 700,
                      background: 'rgba(255,255,255,0.8)',
                      borderRadius: 999,
                      padding: '2px 10px',
                    }}
                  >
                    {String(current.reminder_priority || 'medium').toUpperCase()} PRIORITY
                  </span>
                )}
                </div>

                <h2 className="mb-2" style={{ fontWeight: 800, letterSpacing: 0.3 }}>{current.title}</h2>
                <p className="mb-2" style={{ maxWidth: 760, fontSize: 16 }}>{current.description || current.offer_description}</p>

                {current.category === 'payment_reminder' && (
                  <div className="d-flex flex-wrap gap-3" style={{ color: '#fff6e8' }}>
                    <strong>Amount Due: {current.payment_amount || '-'}</strong>
                    <strong>Due: {current.payment_due_date || '-'}</strong>
                    <strong>Bank: {current.deducting_bank || '-'}</strong>
                    <strong>Project: {current.project || '-'}</strong>
                    <strong>Plot: {current.plot_number || '-'}</strong>
                  </div>
                )}

                {(current.cta_text || current.cta_url) && (
                  <div className="mt-3">
                    <a href={current.cta_url || '#'} target="_blank" rel="noreferrer">
                      <CButton
                        size="sm"
                        style={{
                          background: theme.accent,
                          borderColor: theme.accent,
                          color: '#1d1d1d',
                          fontWeight: 700,
                        }}
                      >
                        {current.cta_text || 'Learn More'}
                      </CButton>
                    </a>
                  </div>
                )}
              </div>
            </CCol>

            <CCol md={4} className="text-center">
              <div
                style={{
                  minHeight: 240,
                  borderRadius: 22,
                  border: '1px solid rgba(255,255,255,0.4)',
                  background: 'rgba(255,255,255,0.14)',
                  backdropFilter: 'blur(5px)',
                  boxShadow: '0 15px 28px rgba(0,0,0,0.22)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 20,
                  textAlign: 'center',
                }}
              >
                <div>
                  <div style={{ fontSize: 34, marginBottom: 10 }}>✨</div>
                  <strong style={{ fontSize: 18 }}>{getCategoryLabel(current.category)}</strong>
                  <p className="mb-0 mt-2" style={{ fontSize: 14, opacity: 0.95 }}>
                    Premium CRM update crafted for better engagement.
                  </p>
                </div>
              </div>
            </CCol>
          </CRow>
        </div>
      </CCardBody>

      <div className="d-flex justify-content-between align-items-center px-3 py-2 bg-white">
        <div className="d-flex gap-2">
          {safeItems.map((_, idx) => (
            <button
              key={`dot_${idx}`}
              type="button"
              style={{
                ...dotStyle,
                background: idx === index ? '#0d6efd' : '#cfd8dc',
              }}
              aria-label={`Go to slide ${idx + 1}`}
              onClick={() => setIndex(idx)}
            />
          ))}
        </div>

        <div className="d-flex gap-2">
          <CButton color="light" size="sm" onClick={() => move('left')}>
            <CIcon icon={cilChevronLeft} />
          </CButton>
          <CButton color="light" size="sm" onClick={() => move('right')}>
            <CIcon icon={cilChevronRight} />
          </CButton>
        </div>
      </div>
    </CCard>
  )
}

export default AnnouncementCarousel
