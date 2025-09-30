import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import './NotificationSystem.css';

// Notification Context
const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

// Notification Provider
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [toastNotifications, setToastNotifications] = useState([]);
  const wsRef = useRef(null);

  useEffect(() => {
    // Initialize with mock notifications
    loadMockNotifications();
    
    // Initialize WebSocket connection (mock)
    initializeWebSocket();
    
    // Request notification permissions
    requestNotificationPermission();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const loadMockNotifications = () => {
    const mockNotifications = [
      {
        id: 1,
        type: 'visit',
        title: 'Новий візит',
        message: 'Олександр К. підтвердив візит на 19:30',
        time: new Date(Date.now() - 5 * 60 * 1000),
        isRead: false,
        priority: 'high'
      },
      {
        id: 2,
        type: 'music',
        title: 'Новий трек',
        message: 'Додано "Океан Ельзи - Обійми" до черги модерації',
        time: new Date(Date.now() - 10 * 60 * 1000),
        isRead: false,
        priority: 'medium'
      },
      {
        id: 3,
        type: 'tip',
        title: 'Чайові отримано',
        message: 'Ви отримали чайові 75 ₴ від столика №5',
        time: new Date(Date.now() - 20 * 60 * 1000),
        isRead: true,
        priority: 'low'
      },
      {
        id: 4,
        type: 'rating',
        title: 'Нова оцінка',
        message: 'Марія П. залишила оцінку 5⭐ за сервіс',
        time: new Date(Date.now() - 30 * 60 * 1000),
        isRead: true,
        priority: 'medium'
      }
    ];
    setNotifications(mockNotifications);
  };

  const initializeWebSocket = () => {
    // Mock WebSocket connection
    setIsConnected(true);
    
    // Simulate real-time notifications
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance every 30 seconds
        const newNotification = generateRandomNotification();
        addNotification(newNotification);
      }
    }, 30000);

    return () => clearInterval(interval);
  };

  const generateRandomNotification = () => {
    const types = ['visit', 'music', 'tip', 'rating'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    const messages = {
      visit: [
        'Новий візит від Андрій М. на 20:00',
        'Підтверджено візит від Катерина С.',
        'Скасовано візит від Іван К.'
      ],
      music: [
        'Новий трек у черзі модерації',
        'Трек схвалено і додано до плейлиста',
        'Запит на музику від VIP столика'
      ],
      tip: [
        'Отримано чайові 50 ₴',
        'Чайові 100 ₴ від столика №3',
        'Великі чайові 200 ₴!'
      ],
      rating: [
        'Нова оцінка 5⭐ за сервіс',
        'Відгук залишено з оцінкою 4⭐',
        'Відмінна оцінка за обслуговування'
      ]
    };

    return {
      id: Date.now(),
      type,
      title: type === 'visit' ? 'Новий візит' : 
             type === 'music' ? 'Музичне повідомлення' :
             type === 'tip' ? 'Чайові' : 'Рейтинг',
      message: messages[type][Math.floor(Math.random() * messages[type].length)],
      time: new Date(),
      isRead: false,
      priority: Math.random() > 0.5 ? 'high' : 'medium'
    };
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      console.log('Notification permission:', permission);
    }
  };

  const addNotification = (notification) => {
    const newNotification = {
      ...notification,
      id: notification.id || Date.now(),
      time: notification.time || new Date(),
      isRead: false
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Show toast notification
    showToast(newNotification);

    // Show desktop notification for high priority
    if (newNotification.priority === 'high') {
      showDesktopNotification(newNotification);
    }

    // Play notification sound
    playNotificationSound();
  };

  const showToast = (notification) => {
    const toast = {
      id: Date.now(),
      ...notification,
      autoClose: true
    };

    setToastNotifications(prev => [...prev, toast]);

    // Auto remove after 5 seconds
    setTimeout(() => {
      removeToast(toast.id);
    }, 5000);
  };

  const removeToast = (toastId) => {
    setToastNotifications(prev => prev.filter(t => t.id !== toastId));
  };

  const showDesktopNotification = (notification) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const desktopNotification = new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: notification.type,
        requireInteraction: notification.priority === 'high'
      });

      desktopNotification.onclick = () => {
        window.focus();
        markAsRead(notification.id);
        desktopNotification.close();
      };

      // Auto close after 10 seconds for non-high priority
      if (notification.priority !== 'high') {
        setTimeout(() => {
          desktopNotification.close();
        }, 10000);
      }
    }
  };

  const playNotificationSound = () => {
    // Create audio context for notification sound
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.3);

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.log('Audio notification not supported');
    }
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, isRead: true }))
    );
  };

  const deleteNotification = (notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const getUnreadCount = () => {
    return notifications.filter(n => !n.isRead).length;
  };

  const value = {
    notifications,
    isConnected,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    getUnreadCount
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toastNotifications} removeToast={removeToast} />
    </NotificationContext.Provider>
  );
};

// Notification Bell Component
export const NotificationBell = ({ onClick }) => {
  const { notifications, getUnreadCount } = useNotifications();
  const unreadCount = getUnreadCount();
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (unreadCount > 0) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 500);
      return () => clearTimeout(timer);
    }
  }, [unreadCount]);

  return (
    <div className={`notification-bell ${isAnimating ? 'animate' : ''}`} onClick={onClick}>
      <span className="bell-icon">🔔</span>
      {unreadCount > 0 && (
        <span className="notification-count">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </div>
  );
};

// Notification Panel Component
export const NotificationPanel = ({ isOpen, onClose }) => {
  const { 
    notifications, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    clearAllNotifications,
    isConnected 
  } = useNotifications();
  
  const [filter, setFilter] = useState('all'); // all, unread, today

  const filteredNotifications = notifications.filter(notification => {
    const today = new Date();
    const notificationDate = new Date(notification.time);
    
    switch (filter) {
      case 'unread':
        return !notification.isRead;
      case 'today':
        return notificationDate.toDateString() === today.toDateString();
      default:
        return true;
    }
  });

  const formatTime = (time) => {
    const now = new Date();
    const notificationTime = new Date(time);
    const diffMs = now - notificationTime;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 1) return 'Щойно';
    if (diffMins < 60) return `${diffMins} хв тому`;
    if (diffHours < 24) return `${diffHours} год тому`;
    return notificationTime.toLocaleDateString('uk-UA');
  };

  const getNotificationIcon = (type) => {
    const icons = {
      visit: '👤',
      music: '🎵',
      tip: '💰',
      rating: '⭐',
      system: '⚙️'
    };
    return icons[type] || '📢';
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="notification-panel-overlay" onClick={onClose} />
      <div className="notification-panel">
        <div className="panel-header">
          <h3>🔔 Уведомления</h3>
          <div className="connection-status">
            <span className={`connection-dot ${isConnected ? 'connected' : 'disconnected'}`} />
            {isConnected ? 'Підключено' : 'Відключено'}
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="panel-filters">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Всі ({notifications.length})
          </button>
          <button 
            className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
            onClick={() => setFilter('unread')}
          >
            Непрочитані ({notifications.filter(n => !n.isRead).length})
          </button>
          <button 
            className={`filter-btn ${filter === 'today' ? 'active' : ''}`}
            onClick={() => setFilter('today')}
          >
            Сьогодні
          </button>
        </div>

        <div className="panel-actions">
          <button className="action-btn" onClick={markAllAsRead}>
            👁️ Позначити всі прочитаними
          </button>
          <button className="action-btn danger" onClick={clearAllNotifications}>
            🗑️ Очистити всі
          </button>
        </div>

        <div className="notifications-list">
          {filteredNotifications.length === 0 ? (
            <div className="empty-notifications">
              <p>📭 Немає уведомлень</p>
            </div>
          ) : (
            filteredNotifications.map(notification => (
              <div 
                key={notification.id} 
                className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
              >
                <div className="notification-icon">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="notification-content">
                  <h4>{notification.title}</h4>
                  <p>{notification.message}</p>
                  <span className="notification-time">
                    {formatTime(notification.time)}
                  </span>
                </div>
                <div className="notification-actions">
                  {!notification.isRead && (
                    <button 
                      className="mark-read-btn"
                      onClick={() => markAsRead(notification.id)}
                      title="Позначити прочитаним"
                    >
                      👁️
                    </button>
                  )}
                  <button 
                    className="delete-btn"
                    onClick={() => deleteNotification(notification.id)}
                    title="Видалити"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

// Toast Container Component
const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <Toast 
          key={toast.id} 
          toast={toast} 
          onClose={() => removeToast(toast.id)} 
        />
      ))}
    </div>
  );
};

// Individual Toast Component
const Toast = ({ toast, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation
    setTimeout(() => setIsVisible(true), 10);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(), 300);
  };

  const getToastTypeClass = (type) => {
    const classes = {
      visit: 'toast-info',
      music: 'toast-info',
      tip: 'toast-success',
      rating: 'toast-success',
      error: 'toast-error',
      warning: 'toast-warning'
    };
    return classes[type] || 'toast-info';
  };

  const getToastIcon = (type) => {
    const icons = {
      visit: '👤',
      music: '🎵',
      tip: '💰',
      rating: '⭐',
      error: '❌',
      warning: '⚠️',
      success: '✅'
    };
    return icons[type] || '📢';
  };

  return (
    <div className={`toast ${getToastTypeClass(toast.type)} ${isVisible ? 'visible' : ''}`}>
      <div className="toast-icon">
        {getToastIcon(toast.type)}
      </div>
      <div className="toast-content">
        <h4>{toast.title}</h4>
        <p>{toast.message}</p>
      </div>
      <button className="toast-close" onClick={handleClose}>
        ✕
      </button>
    </div>
  );
};

export default NotificationSystem;