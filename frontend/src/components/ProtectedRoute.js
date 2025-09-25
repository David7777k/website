import React from 'react';
<<<<<<< HEAD
import { Navigate, useLocation } from 'react-router-dom';
=======
import { Navigate } from 'react-router-dom';
>>>>>>> 5c8c9a3fc7653b7c9a1ca2ab213073fd9c16ab34
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
<<<<<<< HEAD
  const location = useLocation();
=======
>>>>>>> 5c8c9a3fc7653b7c9a1ca2ab213073fd9c16ab34

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
<<<<<<< HEAD
        <p>Перевірка авторизації...</p>
=======
        <p>Проверка авторизации...</p>
>>>>>>> 5c8c9a3fc7653b7c9a1ca2ab213073fd9c16ab34
      </div>
    );
  }

<<<<<<< HEAD
  // Only protect admin routes - allow guests to browse the rest of the site
  if (!user && location.pathname.startsWith('/admin')) {
=======
  if (!user) {
>>>>>>> 5c8c9a3fc7653b7c9a1ca2ab213073fd9c16ab34
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedRoute;