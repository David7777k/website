import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import AdminHeader from '../components/admin/AdminHeader';
import MenuManager from '../components/admin/MenuManager';
import StatsOverview from '../components/admin/StatsOverview';
import { BarChart3, Package, Settings, Users } from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { user } = useAuth();

  const tabs = [
<<<<<<< HEAD
    { id: 'overview', label: 'Огляд', icon: BarChart3 },
    { id: 'menu', label: 'Меню', icon: Package },
    { id: 'users', label: 'Користувачі', icon: Users },
    { id: 'settings', label: 'Налаштування', icon: Settings }
=======
    { id: 'overview', label: 'Обзор', icon: BarChart3 },
    { id: 'menu', label: 'Меню', icon: Package },
    { id: 'users', label: 'Пользователи', icon: Users },
    { id: 'settings', label: 'Настройки', icon: Settings }
>>>>>>> 5c8c9a3fc7653b7c9a1ca2ab213073fd9c16ab34
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <StatsOverview />;
      case 'menu':
        return <MenuManager />;
      case 'users':
        return <div className="tab-content">Управление пользователями (в разработке)</div>;
      case 'settings':
        return <div className="tab-content">Настройки (в разработке)</div>;
      default:
        return <StatsOverview />;
    }
  };

  return (
    <div className="admin-dashboard">
      <AdminHeader />
      
      <div className="dashboard-container">
        <aside className="dashboard-sidebar">
          <div className="sidebar-content">
            <div className="user-info">
              <div className="user-avatar">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              <div className="user-details">
                <h3>{user?.username}</h3>
<<<<<<< HEAD
                <span>Адміністратор</span>
=======
                <span>Администратор</span>
>>>>>>> 5c8c9a3fc7653b7c9a1ca2ab213073fd9c16ab34
              </div>
            </div>
            
            <nav className="sidebar-nav">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`nav-btn ${activeTab === tab.id ? 'active' : ''}`}
                  >
                    <IconComponent size={20} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>
        
        <main className="dashboard-main">
          <div className="content-container">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;