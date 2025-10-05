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

// sidebar nav config
import navigation from '../mod_nav'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  const handleBrandClick = () => {
    const userRole = localStorage.getItem('user_role');
    if (userRole === 'admin') {
      navigate('/AdminDashboard');
    } else if (userRole === 'agent') {
      navigate('/AgentDashboard');
    } else if (userRole === 'customer') {
      navigate('/ClientDashboard');
    } else {
      navigate('/dashboard'); // Fallback route
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
