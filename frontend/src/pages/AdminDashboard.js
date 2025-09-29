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
    { id: 'overview', label: 'РћРіР»СЏРґ', icon: BarChart3 },
    { id: 'menu', label: 'РњРµРЅСЋ', icon: Package },
    { id: 'users', label: 'РљРѕСЂРёСЃС‚СѓРІР°С‡С–', icon: Users },
    { id: 'settings', label: 'РќР°Р»Р°С€С‚СѓРІР°РЅРЅСЏ', icon: Settings }  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <StatsOverview />;
      case 'menu':
        return <MenuManager />;
      case 'users':
        return <div className="tab-content">РЈРїСЂР°РІР»РµРЅРёРµ РїРѕР»СЊР·РѕРІР°С‚РµР»СЏРјРё (РІ СЂР°Р·СЂР°Р±РѕС‚РєРµ)</div>;
      case 'settings':
        return <div className="tab-content">РќР°СЃС‚СЂРѕР№РєРё (РІ СЂР°Р·СЂР°Р±РѕС‚РєРµ)</div>;
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
                <span>РђРґРјС–РЅС–СЃС‚СЂР°С‚РѕСЂ</span>              </div>
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
