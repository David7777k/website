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
          <span>На главную</span>
        </Link>
        
        <div className="admin-title">
          <h1>Панель администратора</h1>
        </div>
        
        <button onClick={handleLogout} className="logout-btn">
          <LogOut size={20} />
          <span>Выйти</span>
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;