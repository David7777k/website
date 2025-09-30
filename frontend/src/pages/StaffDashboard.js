import React, { useState, useEffect, useRef } from 'react';
import './StaffDashboard.css';

const StaffDashboard = () => {
  const [activeTab, setActiveTab] = useState('visits');
  const [isQrScannerActive, setIsQrScannerActive] = useState(false);
  const [pendingVisits, setPendingVisits] = useState([]);
  const [musicQueue, setMusicQueue] = useState([]);
  const [staffStats, setStaffStats] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [promoLimit, setPromoLimit] = useState(2);
  const [createdPromos, setCreatedPromos] = useState(0);
  const qrReaderRef = useRef(null);

  // Mock data initialization
  useEffect(() => {
    loadMockData();
  }, []);

  const loadMockData = () => {
    // Mock pending visits
    setPendingVisits([
      {
        id: 1,
        customerName: 'Олександр Коваленко',
        phone: '+380501234567',
        time: '19:30',
        qrCode: 'QR123456',
        status: 'pending'
      },
      {
        id: 2,
        customerName: 'Марія Петренко',
        phone: '+380507654321',
        time: '20:15',
        qrCode: 'QR789012',
        status: 'pending'
      },
      {
        id: 3,
        customerName: 'Дмитро Іваненко',
        phone: '+380509876543',
        time: '21:00',
        qrCode: 'QR345678',
        status: 'pending'
      }
    ]);

    // Mock music queue
    setMusicQueue([
      {
        id: 1,
        title: 'Океан Ельзи - Обійми',
        artist: 'Океан Ельзи',
        genre: 'Рок',
        requestedBy: 'Анна К.',
        duration: '4:23',
        status: 'pending'
      },
      {
        id: 2,
        title: 'KAZKA - Плакала',
        artist: 'KAZKA',
        genre: 'Поп',
        requestedBy: 'Сергій М.',
        duration: '3:45',
        status: 'pending'
      },
      {
        id: 3,
        title: 'Бумбокс - Вахтерам',
        artist: 'Бумбокс',
        genre: 'Альтернатива',
        requestedBy: 'Олена В.',
        duration: '3:56',
        status: 'pending'
      }
    ]);

    // Mock staff stats
    setStaffStats({
      totalVisits: 47,
      averageRating: 4.8,
      totalTips: 2340,
      weeklyActivity: [12, 8, 15, 9, 13, 7, 11],
      serviceRating: 4.9,
      personalityRating: 4.7
    });

    // Mock notifications
    setNotifications([
      {
        id: 1,
        type: 'visit',
        message: 'Новий візит від Олександр К.',
        time: '2 хвилини тому',
        isRead: false
      },
      {
        id: 2,
        type: 'music',
        message: 'Новий трек у черзі модерації',
        time: '5 хвилин тому',
        isRead: false
      },
      {
        id: 3,
        type: 'tip',
        message: 'Отримано чайові 50 ₴',
        time: '10 хвилин тому',
        isRead: true
      },
      {
        id: 4,
        type: 'rating',
        message: 'Нова оцінка: 5 ⭐',
        time: '15 хвилин тому',
        isRead: true
      }
    ]);
  };

  // QR Scanner functions
  const startQrScanner = () => {
    setIsQrScannerActive(true);
    // Mock QR scanner - in real app would use html5-qrcode library
    setTimeout(() => {
      const mockQrResult = 'QR123456';
      handleQrScan(mockQrResult);
    }, 2000);
  };

  const stopQrScanner = () => {
    setIsQrScannerActive(false);
  };

  const handleQrScan = (qrCode) => {
    const visit = pendingVisits.find(v => v.qrCode === qrCode);
    if (visit) {
      confirmVisit(visit.id);
      setIsQrScannerActive(false);
    }
  };

  // Visit management
  const confirmVisit = (visitId) => {
    setPendingVisits(prev => prev.filter(v => v.id !== visitId));
    // Add success notification
    setNotifications(prev => [
      {
        id: Date.now(),
        type: 'success',
        message: 'Візит підтверджено успішно',
        time: 'Щойно',
        isRead: false
      },
      ...prev
    ]);
  };

  const rejectVisit = (visitId) => {
    setPendingVisits(prev => prev.filter(v => v.id !== visitId));
  };

  // Music moderation
  const approveTrack = (trackId) => {
    setMusicQueue(prev => prev.filter(t => t.id !== trackId));
    setNotifications(prev => [
      {
        id: Date.now(),
        type: 'success',
        message: 'Трек схвалено та додано до черги',
        time: 'Щойно',
        isRead: false
      },
      ...prev
    ]);
  };

  const rejectTrack = (trackId) => {
    setMusicQueue(prev => prev.filter(t => t.id !== trackId));
  };

  // Promo creation
  const createPromo = (promoData) => {
    if (createdPromos >= promoLimit) {
      alert('Досягнуто ліміт акцій на тиждень (2 акції)');
      return;
    }
    setCreatedPromos(prev => prev + 1);
    setNotifications(prev => [
      {
        id: Date.now(),
        type: 'success',
        message: `Акцію "${promoData.title}" створено`,
        time: 'Щойно',
        isRead: false
      },
      ...prev
    ]);
  };

  // Notification management
  const markAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
    );
  };

  const deleteNotification = (notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const tabs = [
    { id: 'visits', label: 'Візити', icon: '📱' },
    { id: 'music', label: 'Музика', icon: '🎵' },
    { id: 'promos', label: 'Акції', icon: '🎁' },
    { id: 'stats', label: 'Статистика', icon: '📊' },
    { id: 'notifications', label: 'Уведомления', icon: '🔔' }
  ];

  return (
    <div className="staff-dashboard">
      <div className="dashboard-header">
        <h1>🔧 Панель Персоналу</h1>
        <p>Керування відвідуваннями, музикою та акціями</p>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
            {tab.id === 'notifications' && notifications.filter(n => !n.isRead).length > 0 && (
              <span className="notification-badge">
                {notifications.filter(n => !n.isRead).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {/* Visits Tab */}
        {activeTab === 'visits' && (
          <div className="visits-tab">
            <div className="qr-scanner-section">
              <h2>📱 QR-Сканер</h2>
              <div className="qr-scanner-container">
                {!isQrScannerActive ? (
                  <div className="qr-scanner-placeholder">
                    <div className="qr-placeholder-icon">📷</div>
                    <p>Натисніть кнопку для запуску QR-сканера</p>
                    <button className="btn btn-primary" onClick={startQrScanner}>
                      Запустити сканер
                    </button>
                  </div>
                ) : (
                  <div className="qr-scanner-active">
                    <div className="scanning-animation">
                      <div className="scanning-line"></div>
                    </div>
                    <p>Сканування QR-коду...</p>
                    <button className="btn btn-secondary" onClick={stopQrScanner}>
                      Зупинити
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="pending-visits-section">
              <h2>⏳ Очікують підтвердження ({pendingVisits.length})</h2>
              <div className="visits-list">
                {pendingVisits.map(visit => (
                  <div key={visit.id} className="visit-card">
                    <div className="visit-info">
                      <h3>{visit.customerName}</h3>
                      <p>📞 {visit.phone}</p>
                      <p>🕐 {visit.time}</p>
                      <p>🎫 {visit.qrCode}</p>
                    </div>
                    <div className="visit-actions">
                      <button
                        className="btn btn-primary"
                        onClick={() => confirmVisit(visit.id)}
                      >
                        ✅ Підтвердити
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={() => rejectVisit(visit.id)}
                      >
                        ❌ Відхилити
                      </button>
                    </div>
                  </div>
                ))}
                {pendingVisits.length === 0 && (
                  <div className="empty-state">
                    <p>✨ Всі візити оброблено</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Music Tab */}
        {activeTab === 'music' && (
          <div className="music-tab">
            <h2>🎵 Черга модерації ({musicQueue.length})</h2>
            <div className="music-queue">
              {musicQueue.map(track => (
                <div key={track.id} className="track-card">
                  <div className="track-info">
                    <h3>{track.title}</h3>
                    <p>🎤 {track.artist}</p>
                    <p>🎭 {track.genre}</p>
                    <p>👤 Замовив: {track.requestedBy}</p>
                    <p>⏱️ {track.duration}</p>
                  </div>
                  <div className="track-actions">
                    <button
                      className="btn btn-primary"
                      onClick={() => approveTrack(track.id)}
                    >
                      ✅ Схвалити
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => rejectTrack(track.id)}
                    >
                      ❌ Відхилити
                    </button>
                  </div>
                </div>
              ))}
              {musicQueue.length === 0 && (
                <div className="empty-state">
                  <p>🎶 Черга модерації порожня</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Promos Tab */}
        {activeTab === 'promos' && (
          <div className="promos-tab">
            <div className="promo-limit-info">
              <h2>🎁 Створення Акцій</h2>
              <p>Використано: {createdPromos}/{promoLimit} акцій на тиждень</p>
              <div className="promo-progress">
                <div 
                  className="promo-progress-bar"
                  style={{ width: `${(createdPromos / promoLimit) * 100}%` }}
                ></div>
              </div>
            </div>

            {createdPromos < promoLimit && (
              <div className="promo-form">
                <h3>Створити нову акцію</h3>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  createPromo({
                    title: formData.get('title'),
                    description: formData.get('description'),
                    discount: formData.get('discount'),
                    duration: formData.get('duration')
                  });
                  e.target.reset();
                }}>
                  <div className="form-group">
                    <label>Назва акції</label>
                    <input type="text" name="title" required placeholder="Наприклад: Щаслива година" />
                  </div>
                  <div className="form-group">
                    <label>Опис</label>
                    <textarea name="description" required placeholder="Детальний опис акції"></textarea>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Знижка (%)</label>
                      <input type="number" name="discount" min="5" max="50" required />
                    </div>
                    <div className="form-group">
                      <label>Термін дії (дні)</label>
                      <input type="number" name="duration" min="1" max="30" required />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary">
                    🎁 Створити Акцію
                  </button>
                </form>
              </div>
            )}

            <div className="created-promos">
              <h3>Історія створених акцій</h3>
              {createdPromos === 0 ? (
                <div className="empty-state">
                  <p>📝 Ще не створено жодної акції</p>
                </div>
              ) : (
                <div className="promo-history">
                  {[...Array(createdPromos)].map((_, index) => (
                    <div key={index} className="promo-history-item">
                      <p>🎁 Акція #{index + 1} - Створено сьогодні</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <div className="stats-tab">
            <h2>📊 Особиста Статистика</h2>
            
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">🎯</div>
                <div className="stat-info">
                  <h3>{staffStats.totalVisits}</h3>
                  <p>Обслужено візитів</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">⭐</div>
                <div className="stat-info">
                  <h3>{staffStats.averageRating}</h3>
                  <p>Середній рейтинг</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">💰</div>
                <div className="stat-info">
                  <h3>{staffStats.totalTips} ₴</h3>
                  <p>Отримано чайових</p>
                </div>
              </div>
            </div>

            <div className="rating-breakdown">
              <h3>📈 Детальні рейтинги</h3>
              <div className="rating-items">
                <div className="rating-item">
                  <span>⭐ Сервіс:</span>
                  <span>{staffStats.serviceRating}/5</span>
                </div>
                <div className="rating-item">
                  <span>😊 Спілкування:</span>
                  <span>{staffStats.personalityRating}/5</span>
                </div>
              </div>
            </div>

            <div className="activity-chart">
              <h3>📅 Активність по днях</h3>
              <div className="chart-container">
                {staffStats.weeklyActivity?.map((value, index) => (
                  <div key={index} className="chart-bar">
                    <div 
                      className="chart-bar-fill"
                      style={{ height: `${(value / 15) * 100}%` }}
                    ></div>
                    <span className="chart-label">
                      {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'][index]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="notifications-tab">
            <div className="notifications-header">
              <h2>🔔 Уведомления</h2>
              <div className="notification-filters">
                <button className="filter-btn active">Всі</button>
                <button className="filter-btn">Непрочитані</button>
                <button className="filter-btn">Сьогодні</button>
              </div>
            </div>

            <div className="notifications-list">
              {notifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`notification-item ${notification.isRead ? 'read' : 'unread'}`}
                >
                  <div className="notification-icon">
                    {notification.type === 'visit' && '👤'}
                    {notification.type === 'music' && '🎵'}
                    {notification.type === 'tip' && '💰'}
                    {notification.type === 'rating' && '⭐'}
                    {notification.type === 'success' && '✅'}
                  </div>
                  <div className="notification-content">
                    <p>{notification.message}</p>
                    <span className="notification-time">{notification.time}</span>
                  </div>
                  <div className="notification-actions">
                    {!notification.isRead && (
                      <button 
                        className="mark-read-btn"
                        onClick={() => markAsRead(notification.id)}
                      >
                        👁️
                      </button>
                    )}
                    <button 
                      className="delete-btn"
                      onClick={() => deleteNotification(notification.id)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
              {notifications.length === 0 && (
                <div className="empty-state">
                  <p>🔕 Немає уведомлень</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffDashboard;