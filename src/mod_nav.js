import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBullhorn,
  cilSpeedometer,
  cilUser,
  cilPeople,
  cilBuilding,
  cilLocationPin,
  cilChartLine,
  cilFile,
  cilSettings,
  cilLockLocked,
  cilStar,
  cilBell,
  cilCalendar,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

// ==================== ROLE DEFINITIONS ====================
export const ROLES = {
  ADMIN: 'admin',
  AGENT: 'agent',
  CLIENT: 'customer',
}

// ==================== NAVIGATION CONFIGURATION ====================
const navigationConfig = [
  {
    component: CNavItem,
    name: 'Announcements & Updates',
    to: '/announcements',
    icon: <CIcon icon={cilBullhorn} customClassName="nav-icon" />,
    allowedRoles: [ROLES.ADMIN, ROLES.AGENT, ROLES.CLIENT],
  },
  {
    component: CNavItem,
    name: 'Send Notification',
    to: '/notifications/send',
    icon: <CIcon icon={cilBell} customClassName="nav-icon" />,
    allowedRoles: [ROLES.ADMIN],
  },

  // CATEGORY 2: USER MANAGEMENT (ADMIN ONLY)
  {
    component: CNavTitle,
    name: 'User Management',
    allowedRoles: [ROLES.ADMIN, ROLES.AGENT],
  },
  {
    component: CNavGroup,
    name: 'Agents',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
    allowedRoles: [ROLES.ADMIN,ROLES.AGENT],
    items: [
      { component: CNavItem, name: 'View Agents', to: '/GetAgents', allowedRoles: [ROLES.ADMIN, ROLES.AGENT] },
      { component: CNavItem, name: 'Register Agent', to: '/register_agent', allowedRoles: [ROLES.ADMIN] },
    ],
  },
  {
    component: CNavGroup,
    name: 'Clients',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
    allowedRoles: [ROLES.ADMIN, ROLES.AGENT],
    items: [
      { component: CNavItem, name: 'View Clients', to: '/GetClients?type=leads', allowedRoles: [ROLES.ADMIN, ROLES.AGENT] },
      { component: CNavItem, name: 'Add Clients', to: '/register_cilent', allowedRoles: [ROLES.ADMIN, ROLES.AGENT] },
    ],
  },
  {
    component: CNavGroup,
    name: 'Customers',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
    allowedRoles: [ROLES.ADMIN, ROLES.AGENT],
    items: [
      { component: CNavItem, name: 'View Customers', to: '/GetClients?type=clients', allowedRoles: [ROLES.ADMIN, ROLES.AGENT] },
      { component: CNavItem, name: 'Add Customer', to: '/register_client', allowedRoles: [ROLES.ADMIN, ROLES.AGENT] },
    ],
  },

  // CATEGORY 3: PROJECTS & PROPERTIES (ADMIN & AGENT)
  {
    component: CNavTitle,
    name: 'Projects & Properties',
    allowedRoles: [ROLES.ADMIN, ROLES.AGENT],
  },
  {
    component: CNavItem,
    name: 'Projects',
    to: '/newProjects',
    icon: <CIcon icon={cilBuilding} customClassName="nav-icon" />,
    allowedRoles: [ROLES.ADMIN, ROLES.AGENT, ROLES.CLIENT],
  },
  {
    component: CNavItem,
    name: 'Site Visits',
    to: '/GetBookVisit',
    icon: <CIcon icon={cilCalendar} customClassName="nav-icon" />,
    allowedRoles: [ROLES.ADMIN, ROLES.AGENT],
  },
  {
    component: CNavItem,
    name: 'Bookings',
    to: '/GetBookings',
    icon: <CIcon icon={cilChartLine} customClassName="nav-icon" />,
    allowedRoles: [ROLES.ADMIN, ROLES.AGENT, ROLES.CLIENT, 'client'],
  },

  // CATEGORY 4: TARGETS & GOALS (ADMIN & AGENT)
  {
    component: CNavTitle,
    name: 'Targets & Goals',
    allowedRoles: [ROLES.ADMIN, ROLES.AGENT],
  },
  {
    component: CNavGroup,
    name: 'Targets',
    icon: <CIcon icon={cilChartLine} customClassName="nav-icon" />,
    allowedRoles: [ROLES.ADMIN, ROLES.AGENT],
    items: [
      { component: CNavItem, name: 'View Targets', to: '/GetTargets', allowedRoles: [ROLES.ADMIN, ROLES.AGENT] },
      { component: CNavItem, name: 'Set Targets', to: '/PostTargets', allowedRoles: [ROLES.ADMIN] },
    ],
  },

  // CATEGORY 5: FINANCIAL (ALL ROLES)
  {
    component: CNavTitle,
    name: 'Financial',
    allowedRoles: [ROLES.ADMIN, ROLES.AGENT, ROLES.CLIENT],
  },
  {
    component: CNavItem,
    name: 'Invoices',
    to: '/Invoice',
    icon: <CIcon icon={cilFile} customClassName="nav-icon" />,
    allowedRoles: [ROLES.ADMIN, ROLES.AGENT, ROLES.CLIENT],
  },

  // CATEGORY 6: ACCOUNT SETTINGS (ALL ROLES)
  {
    component: CNavTitle,
    name: 'Account Settings',
    allowedRoles: [ROLES.ADMIN, ROLES.AGENT, ROLES.CLIENT],
  },
  {
    component: CNavGroup,
    name: 'My Account',
    icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
    allowedRoles: [ROLES.ADMIN, ROLES.AGENT, ROLES.CLIENT],
    items: [
      { component: CNavItem, name: 'Profile', to: '/Profile', allowedRoles: [ROLES.ADMIN, ROLES.AGENT, ROLES.CLIENT] },
      { component: CNavItem, name: 'Forgot User ID', to: '/ForgotUID', allowedRoles: [ROLES.ADMIN] },
      { component: CNavItem, name: 'Forgot Password', to: '/ForgotPassword', allowedRoles: [ROLES.ADMIN, ROLES.AGENT, ROLES.CLIENT] },
    ],
  },

]

// ==================== FILTER NAVIGATION BASED ON ROLE ====================
export const getNavigationForRole = () => {
  const userDataString = localStorage.getItem('user') // Corrected key
  let userRole = null

  if (userDataString) {
    try {
      const userData = JSON.parse(userDataString)
      userRole = userData?.role?.toLowerCase() || null // Adjusted to get role from user object
      // console.log('Navigation filter - User role:', userRole)
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error)
    }
  }

  if (!userRole || !Object.values(ROLES).includes(userRole)) {
    console.warn('No valid user role found, returning empty navigation.')
    return []
  }

  const filterNavItems = (items) =>
    items
      .filter((item) => {
        if (!item.allowedRoles) return true // Always show items without role restrictions
        return item.allowedRoles.some((role) => role.toLowerCase() === userRole)
      })
      .map((item) => {
        const { allowedRoles, ...safeItem } = item // remove before CoreUI render

        if (item.items) {
          const filtered = filterNavItems(item.items)
          return filtered.length > 0 ? { ...safeItem, items: filtered } : null
        }
        return safeItem
      })
      .filter(Boolean)

  return filterNavItems(navigationConfig)
}

export default navigationConfig
