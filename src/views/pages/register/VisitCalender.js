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

    // Example data (replace with API later)
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
            location: 'kakinada Office',
            status: 'Pending',
        },
        {
            date: today.add(2, 'day').format('YYYY-MM-DD'),
            client: 'Mr. Naresh (Aditya Heights)',
            time: '11:30 AM',
            location: 'kakinada',
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
        <CCard className="h-100 shadow-sm border-0 rounded-4">
            <CCardHeader className="bg-primary text-white py-2">
                <div className="d-flex justify-content-between align-items-center">
                    <h6 className="mb-0">Upcoming Client Visits</h6>
                    <small>{today.format('MMM D')}</small>
                </div>
            </CCardHeader>
            <CCardBody className="p-3">
                <CRow>
                    {nextThreeDays.map((day, index) => {
                        const dateStr = day.format('YYYY-MM-DD')
                        const dayVisits = visits.filter((v) => v.date === dateStr)

                        return (
                            <CCol key={index} md={6} sm={12} className="mb-3 mb-md-0">
                                <div className="fw-semibold text-center text-primary mb-2">
                                    {day.format('ddd, MMM D')}
                                </div>
                                {dayVisits.length > 0 ? (
                                    <CListGroup flush>
                                        {dayVisits.map((visit, idx) => (
                                            <CListGroupItem
                                                key={idx}
                                                className="py-2 px-2 border-0 border-bottom small"
                                            >
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div>
                                                        <div className="fw-semibold text-dark">{visit.client}</div>
                                                        <div className="text-muted">
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
                                    <div className="text-center text-muted small py-2">
                                        No visits
                                    </div>
                                )}
                            </CCol>
                        )
                    })}
                </CRow>
            </CCardBody>
        </CCard>
    )
}
