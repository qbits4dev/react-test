import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && Array.isArray(allowedRoles) && allowedRoles.length > 0) {
    try {
      const userJson = localStorage.getItem('user');
      const user = userJson ? JSON.parse(userJson) : null;
      let role = user?.role || user?.data?.role || null;

      if (typeof role === 'string') {
        role = role.toLowerCase()
      } else if (Array.isArray(role)) {
        role = role.map((r) => String(r).toLowerCase())
      }

      const normalizedAllowedRoles = allowedRoles.map((r) => String(r).toLowerCase())

      const hasRole = Array.isArray(role)
        ? role.some((r) => normalizedAllowedRoles.includes(r))
        : normalizedAllowedRoles.includes(String(role))

      if (!role || !hasRole) {
        return <Navigate to="/unauthorized" replace />;
      }
    } catch (e) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
