import React from 'react'
import classNames from 'classnames'

import {
  CAvatar,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CProgress,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cibCcAmex,
  cibCcApplePay,
  cibCcMastercard,
  cibCcPaypal,
  cibCcStripe,
  cibCcVisa,
  cibGoogle,
  cibFacebook,
  cibLinkedin,
  cifBr,
  cifEs,
  cifFr,
  cifIn,
  cifPl,
  cifUs,
  cibTwitter,
  cilCloudDownload,
  cilPeople,
  cilUser,
  cilUserFemale,
} from '@coreui/icons'

import avatar1 from 'src/assets/images/avatars/1.jpg'
import avatar2 from 'src/assets/images/avatars/2.jpg'
import avatar3 from 'src/assets/images/avatars/3.jpg'
import avatar4 from 'src/assets/images/avatars/4.jpg'
import avatar5 from 'src/assets/images/avatars/5.jpg'
import avatar6 from 'src/assets/images/avatars/6.jpg'

import WidgetsBrand from '../widgets/WidgetsBrand'
// import WidgetsDropdown from '../widgets/WidgetsDropdown'
import WidgetsDropdown from '../widgets/WidgetsCardsAd'

import MainChart from './MainChart'

const ClientDashboard = () => {

  const agentWidgetsData = [

    {
      id: 'site-visits',
      title: 'Site Visits',
      value: '30', // Replace with actual data
      percentageChange: '8%', // Replace with actual data
      changeIcon: 'cilArrowTop', // Replace with actual icon
      color: 'warning',
      // Add a 'buttonLink' property for the booking form
      buttonLink: '/bookvisit', // Replace with the actual route to the booking form
      buttonText: 'Book Visit', // Text for the button
    },
    {
      id: 'Projects',
      title: 'Projects',
      buttonLink: '/newProjects',
      color: 'info',
    },
  ]

  return (

    <WidgetsDropdown widgetsData={agentWidgetsData} className="mb-4" />


  )
}

export default ClientDashboard
