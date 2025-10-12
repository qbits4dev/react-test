import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilExternalLink,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
  cilUser,
  cilUserPlus,
  cilSettings,
  cilChartLine,
  cilBuilding,
  cilLocationPin,
  cilFile,
  cilLockLocked,
  cilPeople,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

// ==================== OLD CODE (COMMENTED OUT) ====================
// const _nav = [
//   ... (all previous code commented out as before)
// ]
// export default _nav
// ==================== END OLD CODE ====================

// ==================== NEW CODE WITH STRICT ROLE-BASED ACCESS ====================

// Define roles
export const ROLES = {
  ADMIN: 'admin',
  AGENT: 'agent',
  CLIENT: 'client',
}

// Navigation configuration with STRICT role-based access
const navigationConfig = [
  // ========== CATEGORY 1: DASHBOARD (Role-Specific) ==========
  // {
  //   component: CNavTitle,
  //   name: 'Dashboard',
  //   allowedRoles: [ROLES.ADMIN, ROLES.AGENT, ROLES.CLIENT],
  // },
  // {
  //   component: CNavItem,
  //   name: 'Admin Dashboard',
  //   to: '/Admindashboard',
  //   icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  //   badge: {
  //     color: 'danger',
  //     text: 'ADMIN',
  //   },
  //   allowedRoles: [ROLES.ADMIN], // ONLY ADMIN
  // },
  // {
  //   component: CNavItem,
  //   name: 'Agent Dashboard',
  //   to: '/Agentdashboard',
  //   icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  //   badge: {
  //     color: 'info',
  //     text: 'AGENT',
  //   },
  //   allowedRoles: [ROLES.AGENT], // ONLY AGENT
  // },
  // {
  //   component: CNavItem,
  //   name: 'Client Dashboard',
  //   to: '/Clientdashboard',
  //   icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  //   badge: {
  //     color: 'success',
  //     text: 'CLIENT',
  //   },
  //   allowedRoles: [ROLES.CLIENT], // ONLY CLIENT
  // },

  // ========== CATEGORY 2: USER MANAGEMENT (ADMIN ONLY) ==========
  {
    component: CNavTitle,
    name: 'User Management',
    allowedRoles: [ROLES.ADMIN], // ONLY ADMIN sees this section
  },
  {
    component: CNavGroup,
    name: 'Agents',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
    allowedRoles: [ROLES.ADMIN], // ONLY ADMIN
    items: [
      {
        component: CNavItem,
        name: 'View Agents',
        to: '/GetAgents',
        allowedRoles: [ROLES.ADMIN],
      },
      {
        component: CNavItem,
        name: 'Register Agent',
        to: '/register_agent',
        allowedRoles: [ROLES.ADMIN],
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Clients',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
    allowedRoles: [ROLES.ADMIN], // ONLY ADMIN
    items: [
      {
        component: CNavItem,
        name: 'Register Client',
        to: '/cilent_register',
        allowedRoles: [ROLES.ADMIN],
      },
    ],
  },

  // ========== CATEGORY 3: PROJECTS & PROPERTIES (ADMIN & AGENT) ==========
  {
    component: CNavTitle,
    name: 'Projects & Properties',
    allowedRoles: [ROLES.ADMIN, ROLES.AGENT], // Admin and Agent only
  },
  {
    component: CNavGroup,
    name: 'Projects',
    icon: <CIcon icon={cilBuilding} customClassName="nav-icon" />,
    allowedRoles: [ROLES.ADMIN, ROLES.AGENT],
    items: [
      {
        component: CNavItem,
        name: 'View All Projects',
        to: '/newProjects',
        allowedRoles: [ROLES.ADMIN, ROLES.AGENT], // Both can view
      },
      {
        component: CNavItem,
        name: 'Get Projects',
        to: '/GetProjects',
        allowedRoles: [ROLES.ADMIN, ROLES.AGENT], // Both can get
      },
      {
        component: CNavItem,
        name: 'Add Project',
        to: '/PostProjects',
        allowedRoles: [ROLES.ADMIN], // ONLY ADMIN can add
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Plots',
    icon: <CIcon icon={cilLocationPin} customClassName="nav-icon" />,
    allowedRoles: [ROLES.ADMIN, ROLES.AGENT],
    items: [
      {
        component: CNavItem,
        name: 'View All Plots',
        to: '/Plots',
        allowedRoles: [ROLES.ADMIN, ROLES.AGENT], // Both can view
      },
      {
        component: CNavItem,
        name: 'Get Plots',
        to: '/GetPlots',
        allowedRoles: [ROLES.ADMIN, ROLES.AGENT], // Both can get
      },
      {
        component: CNavItem,
        name: 'Add Plot',
        to: '/PostPlots',
        allowedRoles: [ROLES.ADMIN], // ONLY ADMIN can add
      },
    ],
  },

  // ========== CATEGORY 4: TARGETS & GOALS (ADMIN & AGENT) ==========
  {
    component: CNavTitle,
    name: 'Targets & Goals',
    allowedRoles: [ROLES.ADMIN, ROLES.AGENT], // Admin and Agent only
  },
  {
    component: CNavGroup,
    name: 'Targets',
    icon: <CIcon icon={cilChartLine} customClassName="nav-icon" />,
    allowedRoles: [ROLES.ADMIN, ROLES.AGENT],
    items: [
      {
        component: CNavItem,
        name: 'View Targets',
        to: '/GetTargets',
        allowedRoles: [ROLES.ADMIN, ROLES.AGENT], // Both can view
      },
      {
        component: CNavItem,
        name: 'Set Targets',
        to: '/PostTargets',
        allowedRoles: [ROLES.ADMIN], // ONLY ADMIN can set
      },
    ],
  },

  // ========== CATEGORY 5: FINANCIAL (ALL ROLES - But different access) ==========
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
    allowedRoles: [ROLES.ADMIN, ROLES.AGENT, ROLES.CLIENT], // All can see invoices
  },

  // ========== CATEGORY 6: ACCOUNT SETTINGS (ALL ROLES) ==========
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
      {
        component: CNavItem,
        name: 'Profile',
        to: '/Profile',
        allowedRoles: [ROLES.ADMIN, ROLES.AGENT, ROLES.CLIENT],
      },
      {
        component: CNavItem,
        name: 'Forgot User ID',
        to: '/ForgotUID',
        allowedRoles: [ROLES.ADMIN, ROLES.AGENT, ROLES.CLIENT],
      },
      {
        component: CNavItem,
        name: 'Forgot Password',
        to: '/ForgotPassword',
        allowedRoles: [ROLES.ADMIN, ROLES.AGENT, ROLES.CLIENT],
      },
    ],
  },

  // ========== CATEGORY 7: AUTHENTICATION (ADMIN ONLY - For Development) ==========
  {
    component: CNavTitle,
    name: 'Authentication',
    allowedRoles: [ROLES.ADMIN], // ONLY ADMIN
  },
  {
    component: CNavGroup,
    name: 'Auth Pages',
    icon: <CIcon icon={cilLockLocked} customClassName="nav-icon" />,
    allowedRoles: [ROLES.ADMIN], // ONLY ADMIN
    items: [
      {
        component: CNavItem,
        name: 'Login',
        to: '/login',
        allowedRoles: [ROLES.ADMIN],
      },
      {
        component: CNavItem,
        name: 'Register',
        to: '/register',
        allowedRoles: [ROLES.ADMIN],
      },
      {
        component: CNavItem,
        name: 'Universal Register',
        to: '/ARegister',
        allowedRoles: [ROLES.ADMIN],
      },
    ],
  },

  // ========== CATEGORY 8: ERROR PAGES (ADMIN ONLY) ==========
  {
    component: CNavGroup,
    name: 'Error Pages',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    allowedRoles: [ROLES.ADMIN], // ONLY ADMIN
    items: [
      {
        component: CNavItem,
        name: 'Error 404',
        to: '/404',
        allowedRoles: [ROLES.ADMIN],
      },
      {
        component: CNavItem,
        name: 'Error 500',
        to: '/500',
        allowedRoles: [ROLES.ADMIN],
      },
    ],
  },
]

// Filter navigation based on user role from localStorage
export const getNavigationForRole = () => {
  // Get user from localStorage
  const userDataString = localStorage.getItem('user')
  let userRole = null

  if (userDataString) {
    try {
      const userData = JSON.parse(userDataString)
      userRole = userData?.role
      console.log('Navigation filter - User role:', userRole)
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error)
    }
  }

  if (!userRole) {
    console.log('No user role found, returning empty navigation')
    return []
  }

  const filterNavItems = (items) => {
    return items
      .filter((item) => {
        if (!item.allowedRoles) return true
        return item.allowedRoles.includes(userRole)
      })
      .map((item) => {
        if (item.items) {
          const filteredItems = filterNavItems(item.items)
          if (filteredItems.length > 0) {
            return { ...item, items: filteredItems }
          }
          return null
        }
        return item
      })
      .filter((item) => item !== null)
  }

  return filterNavItems(navigationConfig)
}

export default navigationConfig
// ==================== END NEW CODE ====================
