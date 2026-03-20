import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'

// routes config
import routes from '../routes'
import ProtectedRoute from './ProtectedRoute'

const AppContent = () => {
  return (
    <CContainer className="px-4" lg>
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          {routes.map((route, idx) => {
            const allowedRoles = route.meta?.allowedRoles || route.roles || []
            return (
              route.element && (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  element={
                    allowedRoles && Array.isArray(allowedRoles) && allowedRoles.length > 0 ? (
                      <ProtectedRoute allowedRoles={allowedRoles}>
                        <route.element />
                      </ProtectedRoute>
                    ) : (
                      <route.element />
                    )
                  }
                />
              )
            )
          })}
          <Route path="/" element={<Navigate to="login" replace />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Suspense>
    </CContainer>
  )
}

export default React.memo(AppContent)
