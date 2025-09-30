// BottomNavigation.js
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './BottomNavigation.css';

const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    {
      id: 'events',
      name: 'Афіша',
      icon: '🎪',
      path: '/events',
      activeIcon: '🎪'
    },
    {
      id: 'menu',
      name: 'Меню',
      icon: '🍽️',
      path: '/menu',
      activeIcon: '🍽️'
    },
    {
      id: 'music',
      name: 'Музика',
      icon: '🎵',
      path: '/music',
      activeIcon: '🎵'
    },
    {
      id: 'profile',
      name: 'Профіль',
      icon: '👤',
      path: '/profile',
      activeIcon: '👤'
    }
  ];

  const isActive = (path) => {
    if (path === '/events' && (location.pathname === '/' || location.pathname === '/events')) {
      return true;
    }
    return location.pathname === path;
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="bottom-navigation">
      <div className="nav-container">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
            onClick={() => handleNavigation(item.path)}
          >
            <div className="nav-icon">
              {isActive(item.path) ? item.activeIcon : item.icon}
            </div>
            <span className="nav-label">{item.name}</span>
            {isActive(item.path) && <div className="active-indicator" />}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomNavigation;