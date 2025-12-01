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
      const role = user?.role || user?.data?.role || null;
      // If role is not present or not allowed, redirect to unauthorized
      if (!role || !allowedRoles.includes(role)) {
        return <Navigate to="/unauthorized" replace />;
      }
    } catch (e) {
      // If parsing fails, treat as unauthorized
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
