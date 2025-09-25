import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, Home } from 'lucide-react';
import './AdminHeader.css';

const AdminHeader = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="admin-header">
      <div className="admin-header-content">
        <Link to="/" className="admin-logo">
          <Home size={20} />
<<<<<<< HEAD
          <span>На головну</span>
        </Link>
        
        <div className="admin-title">
          <h1>Панель адміністратора</h1>
=======
          <span>На главную</span>
        </Link>
        
        <div className="admin-title">
          <h1>Панель администратора</h1>
>>>>>>> 5c8c9a3fc7653b7c9a1ca2ab213073fd9c16ab34
        </div>
        
        <button onClick={handleLogout} className="logout-btn">
          <LogOut size={20} />
<<<<<<< HEAD
          <span>Вийти</span>
=======
          <span>Выйти</span>
>>>>>>> 5c8c9a3fc7653b7c9a1ca2ab213073fd9c16ab34
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;