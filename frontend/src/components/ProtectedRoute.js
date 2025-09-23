import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Перевірка авторизації...</p>
      </div>
    );
  }

  // Only protect admin routes - allow guests to browse the rest of the site
  if (!user && location.pathname.startsWith('/admin')) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedRoute;