import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { AppSidebarNav } from './AppSidebarNav'

import logo from '/src/assets/brand/logo.jpeg'
import { sygnet } from 'src/assets/brand/sygnet'

// Import the filtered navigation function instead of static array
import navigationConfig, { getNavigationForRole } from '../mod_nav'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  // Get filtered navigation based on user role from local storage
  const navigation = React.useMemo(() => getNavigationForRole(), [])

  const handleBrandClick = () => {
    const userRoleString = localStorage.getItem('user')
    let userRole = null

    if (userRoleString) {
      try {
        const userData = JSON.parse(userRoleString)
        userRole = userData?.role?.toLowerCase()
      } catch {
        userRole = null
      }
    }

    if (userRole === 'admin') {
      navigate('/AdminDashboard')
    } else if (userRole === 'agent') {
      navigate('/AgentDashboard')
    } else if (userRole === 'client') {  // corrected 'client' instead of 'customer'
      navigate('/ClientDashboard')
    } else {
      navigate('/dashboard') // fallback
    }
  }

  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand
          onClick={handleBrandClick}
          className="d-flex align-items-center"
          style={{ cursor: 'pointer', textDecoration: 'none' }}
        >
          <img src={logo} alt="AdityaDevelopers" className="sidebar-brand-full" height={35} />
          <span className="ms-2 fw-bold sidebar-brand-full">Sri Aditya Developers</span>
          <CIcon customClassName="sidebar-brand-narrow" icon={sygnet} height={32} />
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>

      {/* Pass filtered navigation items here */}
      <AppSidebarNav items={navigation} />

      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
