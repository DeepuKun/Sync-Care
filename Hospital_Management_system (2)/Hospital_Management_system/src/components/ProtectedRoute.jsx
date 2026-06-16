import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    // Redirect to login selection page if not authenticated
    return <Navigate to="/Login_choice" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // Redirect to login selection page if role unauthorized
    return <Navigate to="/Login_choice" replace />;
  }

  return children;
};

export default ProtectedRoute;
