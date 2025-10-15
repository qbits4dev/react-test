import React from 'react'
import {
    CCard,
    CCardBody,
    CCardHeader,
    CListGroup,
    CListGroupItem,
    CBadge,
    CRow,
    CCol,
} from '@coreui/react'
import dayjs from 'dayjs'

export default function UpcomingVisitsWidget() {
    const today = dayjs()
    const nextThreeDays = [1, 2, 3].map((i) => today.add(i, 'day'))

    const visits = [
        {
            date: today.add(1, 'day').format('YYYY-MM-DD'),
            client: 'Mr. Ramesh (Aditya Meadows)',
            time: '10:00 AM',
            location: 'BhanuGudi, Kakinada',
            status: 'Confirmed',
        },
        {
            date: today.add(1, 'day').format('YYYY-MM-DD'),
            client: 'Mrs. Priya (Sri Aditya Enclave)',
            time: '02:00 PM',
            location: 'Kakinada Office',
            status: 'Pending',
        },
        {
            date: today.add(2, 'day').format('YYYY-MM-DD'),
            client: 'Mr. Naresh (Aditya Heights)',
            time: '11:30 AM',
            location: 'Kakinada',
            status: 'Confirmed',
        },
        {
            date: today.add(3, 'day').format('YYYY-MM-DD'),
            client: 'Ms. Kavya (Skandha Green Valley)',
            time: '04:00 PM',
            location: 'Hamsavaram',
            status: 'Scheduled',
        },
    ]

    const getBadgeColor = (status) => {
        switch (status) {
            case 'Confirmed':
                return 'success'
            case 'Pending':
                return 'warning'
            default:
                return 'info'
        }
    }

    return (
        <>
            <style>{`
        .visit-card {
          border: none;
          border-radius: 1rem;
          background: linear-gradient(145deg, #f9fafc, #ffffff);
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          overflow: hidden;
          transition: all 0.3s ease-in-out;
        }

        .visit-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0,0,0,0.08);
        }

        .visit-header {
          background: linear-gradient(90deg, #4e73df, #2e59d9);
          color: #fff;
          padding: 0.75rem 1rem;
          border-bottom: none;
        }

        .visit-header h6 {
          font-weight: 600;
          letter-spacing: 0.3px;
        }

        .visit-body {
          padding: 1rem;
        }

        .visit-day-title {
          font-weight: 600;
          color: #4e73df;
          font-size: 0.95rem;
          text-align: center;
          margin-bottom: 0.5rem;
        }

        .visit-item {
          background: #f8f9fc;
          border-radius: 0.5rem;
          margin-bottom: 0.5rem;
          transition: all 0.25s ease;
        }

        .visit-item:hover {
          background: #eef2ff;
        }

        .visit-client {
          font-weight: 600;
          color: #343a40;
          font-size: 0.9rem;
        }

        .visit-details {
          font-size: 0.8rem;
          color: #6c757d;
          line-height: 1.3;
        }

        .no-visits {
          text-align: center;
          color: #adb5bd;
          font-size: 0.85rem;
          padding: 1rem 0;
        }

        @media (max-width: 768px) {
          .visit-day-title {
            font-size: 0.9rem;
          }
          .visit-client {
            font-size: 0.85rem;
          }
        }
      `}</style>

            <CCard className="visit-card h-100">
                <CCardHeader className="visit-header">
                    <div className="d-flex justify-content-between align-items-center">
                        <h6 className="mb-0">Upcoming Client Visits</h6>
                        <small>{today.format('MMM D')}</small>
                    </div>
                </CCardHeader>
                <CCardBody className="visit-body">
                    <CRow className="g-3">
                        {nextThreeDays.map((day, index) => {
                            const dateStr = day.format('YYYY-MM-DD')
                            const dayVisits = visits.filter((v) => v.date === dateStr)

                            return (
                                <CCol key={index} lg={6} md={6} sm={12}>
                                    <div className="visit-day-title">{day.format('ddd, MMM D')}</div>
                                    {dayVisits.length > 0 ? (
                                        <CListGroup flush>
                                            {dayVisits.map((visit, idx) => (
                                                <CListGroupItem
                                                    key={idx}
                                                    className="visit-item border-0 px-3 py-2"
                                                >
                                                    <div className="d-flex justify-content-between align-items-start">
                                                        <div>
                                                            <div className="visit-client">{visit.client}</div>
                                                            <div className="visit-details">
                                                                🕒 {visit.time}
                                                                <br />
                                                                📍 {visit.location}
                                                            </div>
                                                        </div>
                                                        <CBadge color={getBadgeColor(visit.status)}>
                                                            {visit.status}
                                                        </CBadge>
                                                    </div>
                                                </CListGroupItem>
                                            ))}
                                        </CListGroup>
                                    ) : (
                                        <div className="no-visits">No visits</div>
                                    )}
                                </CCol>
                            )
                        })}
                    </CRow>
                </CCardBody>
            </CCard>
        </>
    )
}
