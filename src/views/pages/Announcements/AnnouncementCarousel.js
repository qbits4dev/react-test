import React, { useEffect, useMemo, useState } from 'react'
import {
  CBadge,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CCarousel,
  CCarouselItem,
  CProgress,
} from '@coreui/react'
import { cilChevronLeft, cilChevronRight, cilBullhorn, cilCalendar, cilDollar, cilStar, cilGift } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  getCategoryLabel,
  getCountdownLabel,
} from './announcementService'

/* ── Category → CoreUI color mapping ── */
const categoryBadgeColor = (category) => {
  if (category === 'payment_reminder') return 'warning'
  if (category === 'target_offer') return 'success'
  if (category === 'venture_launch') return 'info'
  return 'primary'
}

/* ── Category → CIcon mapping ── */
const categoryIcon = (category) => {
  if (category === 'payment_reminder') return cilDollar
  if (category === 'target_offer') return cilGift
  if (category === 'venture_launch') return cilStar
  return cilBullhorn
}

/* ── Category → border accent color (CoreUI semantic) ── */
const categoryBorderClass = (category) => {
  if (category === 'payment_reminder') return 'border-start-warning'
  if (category === 'target_offer') return 'border-start-success'
  if (category === 'venture_launch') return 'border-start-info'
  return 'border-start-primary'
}

/* ── Priority badge ── */
const priorityBadgeColor = (priority) => {
  if (priority === 'high') return 'danger'
  if (priority === 'medium') return 'warning'
  return 'success'
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

  /* ── Empty state ── */
  if (!safeItems.length) {
    return (
      <CCard className="mb-4">
        <CCardHeader className="d-flex align-items-center gap-2">
          <CIcon icon={cilBullhorn} size="lg" />
          <strong>{title}</strong>
        </CCardHeader>
        <CCardBody
          className="text-center py-5"
          style={{ minHeight: 200 }}
        >
          <div className="text-body-secondary">
            <div style={{ fontSize: 48, marginBottom: 12 }}>📣</div>
            <h5 className="fw-semibold mb-2">{title}</h5>
            <p className="text-body-secondary mb-0" style={{ maxWidth: 480, margin: '0 auto' }}>
              {emptyText}
            </p>
          </div>
        </CCardBody>
      </CCard>
    )
  }

  const current = safeItems[index]

  return (
    <CCard
      className="mb-4"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Header: title + navigation ── */}
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-2">
          <CIcon icon={cilBullhorn} size="lg" />
          <strong>{title}</strong>
          <CBadge color="primary" shape="rounded-pill" className="ms-1">
            {safeItems.length}
          </CBadge>
        </div>
        {safeItems.length > 1 && (
          <div className="d-flex align-items-center gap-3">
            {/* Dot indicators */}
            <div className="d-flex align-items-center gap-1">
              {safeItems.map((_, idx) => (
                <button
                  key={`dot_${idx}`}
                  type="button"
                  aria-label={`Go to slide ${idx + 1}`}
                  onClick={() => setIndex(idx)}
                  style={{
                    width: idx === index ? 20 : 8,
                    height: 8,
                    borderRadius: 4,
                    border: idx === index
                      ? '1px solid var(--cui-primary)'
                      : '1px solid var(--cui-border-color)',
                    cursor: 'pointer',
                    background: idx === index
                      ? 'var(--cui-primary)'
                      : 'var(--cui-tertiary-bg)',
                    transition: 'all 0.3s ease',
                    padding: 0,
                  }}
                />
              ))}
            </div>
            <small className="text-body-secondary d-none d-sm-inline">
              {index + 1}/{safeItems.length}
            </small>
            {/* Arrow button group — same pattern as Day/Month/Year toggles */}
            <CButtonGroup size="sm">
              <CButton color="outline-secondary" onClick={() => move('left')}>
                <CIcon icon={cilChevronLeft} size="sm" />
              </CButton>
              <CButton color="outline-secondary" onClick={() => move('right')}>
                <CIcon icon={cilChevronRight} size="sm" />
              </CButton>
            </CButtonGroup>
          </div>
        )}
      </CCardHeader>

      {/* ── Main slide content ── */}
      <CCardBody className="p-0">
        <div
          style={{
            transition: 'opacity 0.35s ease-in-out',
          }}
        >
          <CRow className="g-0 align-items-stretch">
            {/* ── Left: banner image (if available) ── */}
            {current.banner_image && (
              <CCol md={4} className="d-none d-md-block">
                <div
                  style={{
                    height: '100%',
                    minHeight: 220,
                    backgroundImage: `url(${current.banner_image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRight: '1px solid var(--cui-border-color)',
                  }}
                />
              </CCol>
            )}

            {/* ── Right: announcement details ── */}
            <CCol md={current.banner_image ? 8 : 12}>
              <div className="p-4">
                {/* Badges row */}
                <div className="d-flex align-items-center gap-2 mb-3 flex-wrap">
                  <CBadge color={categoryBadgeColor(current.category)}>
                    <CIcon icon={categoryIcon(current.category)} size="sm" className="me-1" />
                    {getCategoryLabel(current.category)}
                  </CBadge>
                  <CBadge color="secondary">
                    <CIcon icon={cilCalendar} size="sm" className="me-1" />
                    {getCountdownLabel(current)}
                  </CBadge>
                  {current.category === 'payment_reminder' && (
                    <CBadge color={priorityBadgeColor(current.reminder_priority)}>
                      {String(current.reminder_priority || 'medium').toUpperCase()} PRIORITY
                    </CBadge>
                  )}
                </div>

                {/* Title */}
                <h4 className="fw-semibold mb-2">{current.title}</h4>

                {/* Description */}
                <p className="text-body-secondary mb-3" style={{ maxWidth: 680 }}>
                  {current.description || current.offer_description}
                </p>

                {/* Payment details (if payment reminder) */}
                {current.category === 'payment_reminder' && (
                  <CRow className="g-3 mb-3">
                    {[
                      { label: 'Amount Due', value: current.payment_amount },
                      { label: 'Due Date', value: current.payment_due_date },
                      { label: 'Bank', value: current.deducting_bank },
                      { label: 'Project', value: current.project },
                      { label: 'Plot', value: current.plot_number },
                    ]
                      .filter((d) => d.value)
                      .map((d) => (
                        <CCol xs={6} md={4} key={d.label}>
                          <div className={`border-start border-start-4 ${categoryBorderClass(current.category)} py-1 px-3`}>
                            <div className="text-body-secondary text-truncate small">{d.label}</div>
                            <div className="fw-semibold">{d.value}</div>
                          </div>
                        </CCol>
                      ))}
                  </CRow>
                )}

                {/* CTA button */}
                {(current.cta_text || current.cta_url) && (
                  <a href={current.cta_url || '#'} target="_blank" rel="noreferrer">
                    <CButton color="primary" size="sm">
                      {current.cta_text || 'Learn More'}
                    </CButton>
                  </a>
                )}
              </div>
            </CCol>
          </CRow>
        </div>

        {/* ── Slide counter footer ── */}
        {safeItems.length > 1 && (
          <div
            className="px-4 py-2 d-flex align-items-center justify-content-between"
            style={{
              borderTop: '1px solid var(--cui-border-color)',
              background: 'var(--cui-tertiary-bg)',
            }}
          >
            <small className="text-body-secondary">
              Showing {index + 1} of {safeItems.length} announcements
            </small>
            <CProgress
              thin
              color="primary"
              value={((index + 1) / safeItems.length) * 100}
              style={{ width: 120 }}
            />
          </div>
        )}
      </CCardBody>
    </CCard>
  )
}

export default AnnouncementCarousel
