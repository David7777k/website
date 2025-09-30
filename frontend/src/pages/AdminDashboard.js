import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import AdminHeader from '../components/admin/AdminHeader';
import MenuManager from '../components/admin/MenuManager';
import StatsOverview from '../components/admin/StatsOverview';
import UserManager from '../components/admin/UserManager';
import EventManager from '../components/admin/EventManager';
import AdminAnalytics from '../components/admin/AdminAnalytics';
import AdminSettings from '../components/admin/AdminSettings';
import AdminNotifications from '../components/admin/AdminNotifications';
import { 
  BarChart3, 
  Package, 
  Settings, 
  Users, 
  Calendar,
  TrendingUp,
  Bell,
  Shield,
  RefreshCw
} from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const { user } = useAuth();

  const tabs = [
    { id: 'overview', label: 'Огляд', icon: BarChart3, badge: null, description: 'Загальна статистика' },
    { id: 'analytics', label: 'Аналітика', icon: TrendingUp, badge: null, description: 'Детальна аналітика' },
    { id: 'events', label: 'Події', icon: Calendar, badge: 3, description: 'Управління подіями' },
    { id: 'menu', label: 'Меню', icon: Package, badge: null, description: 'Управління меню' },
    { id: 'users', label: 'Користувачі', icon: Users, badge: 12, description: 'Управління користувачами' },
    { id: 'notifications', label: 'Сповіщення', icon: Bell, badge: 5, description: 'Системні сповіщення' },
    { id: 'security', label: 'Безпека', icon: Shield, badge: null, description: 'Налаштування безпеки' },
    { id: 'settings', label: 'Налаштування', icon: Settings, badge: null, description: 'Загальні налаштування' }
  ];

  const refreshData = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLastUpdate(new Date());
    setIsLoading(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <StatsOverview />;
      case 'analytics':
        return <AdminAnalytics />;
      case 'events':
        return <EventManager />;
      case 'menu':
        return <MenuManager />;
      case 'users':
        return <UserManager />;
      case 'notifications':
        return <AdminNotifications />;
      case 'security':
        return <AdminSettings section="security" />;
      case 'settings':
        return <AdminSettings section="general" />;
      default:
        return <StatsOverview />;
    }
  };

  const activeTabData = tabs.find(tab => tab.id === activeTab);

  return (
    <div className="admin-dashboard">
      <AdminHeader />
      
      <div className="dashboard-container">
        {/* Sidebar Navigation */}
        <div className="dashboard-sidebar">
          <div className="sidebar-header">
            <h2>Адмін Панель</h2>
            <p>Управління системою</p>
          </div>
          
          <nav className="dashboard-nav">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                  title={tab.description}
                >
                  <div className="nav-item-icon">
                    <IconComponent size={20} />
                  </div>
                  <div className="nav-item-content">
                    <span className="nav-item-label">{tab.label}</span>
                    <span className="nav-item-description">{tab.description}</span>
                  </div>
                  {tab.badge && (
                    <span className="nav-item-badge">{tab.badge}</span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="sidebar-footer">
            <div className="user-info">
              <div className="user-avatar">
                {user?.username?.charAt(0)?.toUpperCase() || 'A'}
              </div>
              <div className="user-details">
                <div className="user-name">{user?.username || 'Admin'}</div>
                <div className="user-role">{user?.role || 'Administrator'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="dashboard-main">
          <div className="dashboard-header">
            <div className="header-info">
              <h1>{activeTabData?.label}</h1>
              <p>{activeTabData?.description}</p>
            </div>
            
            <div className="header-actions">
              <div className="last-update">
                Оновлено: {lastUpdate.toLocaleTimeString('uk-UA')}
              </div>
              <button 
                className="btn btn-secondary refresh-btn"
                onClick={refreshData}
                disabled={isLoading}
              >
                <RefreshCw size={16} className={isLoading ? 'spin' : ''} />
                Оновити
              </button>
            </div>
          </div>

          <div className="dashboard-content">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;