import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import routes from '../routes'

import { CBreadcrumb, CBreadcrumbItem } from '@coreui/react'

const AppBreadcrumb = () => {
  const currentLocation = useLocation().pathname
  const navigate = useNavigate()

  const handleHomeClick = () => {
    const userRole = localStorage.getItem('user_role')
    if (userRole === 'admin') {
      navigate('/AdminDashboard')
    } else if (userRole === 'agent') {
      navigate('/AgentDashboard')
    } else if (userRole === 'customer') {
      navigate('/ClientDashboard')
    } else {
      navigate('/dashboard') // Fallback route
    }
  }

  const getRouteName = (pathname, routes) => {
    const currentRoute = routes.find((route) => route.path === pathname)
    return currentRoute ? currentRoute.name : false
  }

  const getBreadcrumbs = (location) => {
    const breadcrumbs = []
    location.split('/').reduce((prev, curr, index, array) => {
      const currentPathname = `${prev}/${curr}`
      const routeName = getRouteName(currentPathname, routes)
      // routeName &&
      if (routeName && routeName !== 'Dashboard' && routeName !== 'Home') {
        breadcrumbs.push({
          pathname: currentPathname,
          name: routeName,
          active: index + 1 === array.length ? true : false,
        })
      }
      return currentPathname
    })
    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs(currentLocation)

  return (
    <CBreadcrumb className="my-0">
      {/* <CBreadcrumbItem href="/">Home</CBreadcrumbItem> */}
      <CBreadcrumbItem onClick={handleHomeClick} style={{ cursor: 'pointer' }}>
        Home
      </CBreadcrumbItem>
      
      {breadcrumbs.map((breadcrumb, index) => {
        return (
          <CBreadcrumbItem
            {...(breadcrumb.active ? { active: true } : { href: breadcrumb.pathname })}
            key={index}
          >
            {breadcrumb.name}
          </CBreadcrumbItem>
        )
      })}
    </CBreadcrumb>
  )
}

export default React.memo(AppBreadcrumb)
