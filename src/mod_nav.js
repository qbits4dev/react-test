import React from 'react'
import CIcon from '@coreui/icons-react'
import {
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
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

// ==================== ROLE DEFINITIONS ====================
export const ROLES = {
  ADMIN: 'admin',
  AGENT: 'agent',
  CLIENT: 'client',
}

// ==================== NAVIGATION CONFIGURATION ====================
const navigationConfig = [
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
    allowedRoles: [ROLES.ADMIN,,ROLES.AGENT],
    items: [
      { component: CNavItem, name: 'Client Register', to: '/register_cilent', allowedRoles: [ROLES.ADMIN] },
      { component: CNavItem, name: 'Register Client', to: '/register_client', allowedRoles: [ROLES.ADMIN] },
    ],
  },

  // CATEGORY 3: PROJECTS & PROPERTIES (ADMIN & AGENT)
  {
    component: CNavTitle,
    name: 'Projects & Properties',
    allowedRoles: [ROLES.ADMIN, ROLES.AGENT],
  },
  {
    component: CNavGroup,
    name: 'Projects',
    icon: <CIcon icon={cilBuilding} customClassName="nav-icon" />,
    allowedRoles: [ROLES.ADMIN, ROLES.AGENT],
    items: [
      { component: CNavItem, name: 'View All Projects', to: '/newProjects', allowedRoles: [ROLES.ADMIN, ROLES.AGENT] },
      { component: CNavItem, name: 'Get Projects', to: '/GetProjects', allowedRoles: [ROLES.ADMIN, ROLES.AGENT] },
      { component: CNavItem, name: 'Add Project', to: '/PostProjects', allowedRoles: [ROLES.ADMIN] },
    ],
  },
  {
    component: CNavGroup,
    name: 'Plots',
    icon: <CIcon icon={cilLocationPin} customClassName="nav-icon" />,
    allowedRoles: [ROLES.ADMIN, ROLES.AGENT],
    items: [
      { component: CNavItem, name: 'View All Plots', to: '/Plots', allowedRoles: [ROLES.ADMIN, ROLES.AGENT] },
      { component: CNavItem, name: 'Get Plots', to: '/GetPlots', allowedRoles: [ROLES.ADMIN, ROLES.AGENT] },
      { component: CNavItem, name: 'Add Plot', to: '/PostPlots', allowedRoles: [ROLES.ADMIN] },
    ],
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
      { component: CNavItem, name: 'Client Profile', to: '/ClientProfile', allowedRoles: [ROLES.ADMIN, ROLES.AGENT, ROLES.CLIENT] },
      { component: CNavItem, name: 'Forgot User ID', to: '/ForgotUID', allowedRoles: [ROLES.ADMIN] },
      { component: CNavItem, name: 'Forgot Password', to: '/ForgotPassword', allowedRoles: [ROLES.ADMIN, ROLES.AGENT, ROLES.CLIENT] },
    ],
  },

  // CATEGORY 7: AUTHENTICATION (ADMIN ONLY)
  {
    component: CNavTitle,
    name: 'Authentication',
    allowedRoles: [ROLES.ADMIN],
  },
  {
    component: CNavGroup,
    name: 'Auth Pages',
    icon: <CIcon icon={cilLockLocked} customClassName="nav-icon" />,
    allowedRoles: [ROLES.ADMIN],
    items: [
      { component: CNavItem, name: 'Login', to: '/login', allowedRoles: [ROLES.ADMIN] },
      { component: CNavItem, name: 'Register', to: '/register', allowedRoles: [ROLES.ADMIN] },
      { component: CNavItem, name: 'Universal Register', to: '/ARegister', allowedRoles: [ROLES.ADMIN] },
    ],
  },

  // CATEGORY 8: ERROR PAGES (ADMIN ONLY)
  {
    component: CNavGroup,
    name: 'Error Pages',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    allowedRoles: [ROLES.ADMIN],
    items: [
      { component: CNavItem, name: 'Error 404', to: '/404', allowedRoles: [ROLES.ADMIN] },
      { component: CNavItem, name: 'Error 500', to: '/500', allowedRoles: [ROLES.ADMIN] },
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
