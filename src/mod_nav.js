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
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    component: CNavItem,
    name: 'AgentDashboard',
    to: '/Agentdashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    component: CNavItem,
    name: 'ClientDashboard',
    to: '/Clientdashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    component: CNavItem,
    name: 'AdminDashboard',
    to: '/Admindashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },

  // {
  //   component: CNavTitle,
  //   name: 'Extras',
  // },
  {
    component: CNavGroup,
    name: 'Pages',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Login',
        to: '/login',
      },
      {
        component: CNavItem,
        name: 'Register',
        to: '/register',
      },
      {
        component: CNavItem,
        name: 'Error 404',
        to: '/404',
      },
      {
        component: CNavItem,
        name: 'Error 500',
        to: '/500',
      },
      {
        component: CNavItem,
        name: 'Register Agent',
        to: '/register_agent',
      },
      {
        component: CNavItem,
        name: 'Client Register',
        to: '/cilent_register',
      },
      {
        component: CNavItem,
        name: 'Invoice',
        to: '/invoiceApp',
      },
      {
        component: CNavItem,
        name: 'Projects',
        to: '/newProjects',
      },
      {
        component: CNavItem,
        name: 'Plots',
        to: '/Plots',
      },
      {
        component: CNavItem,
        name: 'Get Projects',
        to: '/GetProjects',
      },
      {
        component: CNavItem,
        name: 'Post Projects',
        to: '/PostProjects',
      },
      {
        component: CNavItem,
        name: 'Get plots',
        to: '/GetPlots',
      },
      {
        component: CNavItem,
        name: 'Post plots',
        to: '/PostPlots',
      },
      {
        component: CNavItem,
        name: 'Post Targets',
        to: '/PostTargets',
      },
      {
        component: CNavItem,
        name: 'Get Targets',
        to: '/GetTargets',
      },
      {
        component: CNavItem,
        name: 'Get Agents',
        to: '/GetAgents',
      },
    ],
  },
]

export default _nav
