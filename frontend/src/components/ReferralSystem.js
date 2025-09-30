// ReferralSystem.js
import React, { useState, useEffect } from 'react';
import './ReferralSystem.css';

const ReferralSystem = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [userLevel, setUserLevel] = useState(3);
  const [userTokens, setUserTokens] = useState(2450);
  const [referralCode] = useState('LOUNGE2024XYZ');
  const [showCopyToast, setShowCopyToast] = useState(false);

  // Mock data
  const [stats, setStats] = useState({
    totalReferrals: 23,
    activeReferrals: 18,
    totalTokensEarned: 5670,
    currentLevel: 3,
    nextLevelProgress: 75
  });

  const [earningHistory, setEarningHistory] = useState([
    {
      id: 1,
      type: 'referral',
      description: 'Новий реферал: Олександр К.',
      tokens: 150,
      date: '2024-01-15T10:30:00Z',
      icon: '👥'
    },
    {
      id: 2,
      type: 'bonus',
      description: 'Бонус за активність',
      tokens: 50,
      date: '2024-01-14T15:45:00Z',
      icon: '🎁'
    },
    {
      id: 3,
      type: 'challenge',
      description: 'Виклик "5 рефералів"',
      tokens: 200,
      date: '2024-01-13T09:20:00Z',
      icon: '🏆'
    },
    {
      id: 4,
      type: 'referral',
      description: 'Новий реферал: Марія В.',
      tokens: 150,
      date: '2024-01-12T14:10:00Z',
      icon: '👥'
    },
    {
      id: 5,
      type: 'level',
      description: 'Досягнуто 3-й рівень',
      tokens: 300,
      date: '2024-01-10T16:00:00Z',
      icon: '⭐'
    }
  ]);

  const [challenges, setChallenges] = useState([
    {
      id: 1,
      title: 'Перший Реферал',
      description: 'Запросіть свого першого друга',
      reward: 100,
      progress: 100,
      maxProgress: 1,
      completed: true
    },
    {
      id: 2,
      title: 'Команда з 5 осіб',
      description: 'Залучіть 5 активних рефералів',
      reward: 250,
      progress: 3,
      maxProgress: 5,
      completed: false
    },
    {
      id: 3,
      title: 'Соціальний Майстер',
      description: 'Поділіться в 3 соціальних мережах',
      reward: 150,
      progress: 2,
      maxProgress: 3,
      completed: false
    },
    {
      id: 4,
      title: 'Місячний Чемпіон',
      description: 'Залучіть 10 рефералів за місяць',
      reward: 500,
      progress: 7,
      maxProgress: 10,
      completed: false
    }
  ]);

  const [myReferrals, setMyReferrals] = useState([
    {
      id: 1,
      name: 'Олександр К.',
      email: 'alex.k@example.com',
      joinDate: '2024-01-15',
      status: 'active',
      tokensEarned: 150,
      visits: 12
    },
    {
      id: 2,
      name: 'Марія В.',
      email: 'maria.v@example.com',
      joinDate: '2024-01-12',
      status: 'active',
      tokensEarned: 150,
      visits: 8
    },
    {
      id: 3,
      name: 'Дмитро П.',
      email: 'dmitro.p@example.com',
      joinDate: '2024-01-08',
      status: 'pending',
      tokensEarned: 0,
      visits: 1
    },
    {
      id: 4,
      name: 'Анна С.',
      email: 'anna.s@example.com',
      joinDate: '2024-01-05',
      status: 'active',
      tokensEarned: 150,
      visits: 15
    }
  ]);

  const [leaderboard, setLeaderboard] = useState([
    { rank: 1, name: 'Володимир К.', referrals: 47, tokens: 8950 },
    { rank: 2, name: 'Катерина М.', referrals: 39, tokens: 7420 },
    { rank: 3, name: 'Андрій Л.', referrals: 35, tokens: 6830 },
    { rank: 4, name: 'Ви', referrals: 23, tokens: 5670 },
    { rank: 5, name: 'Ольга Р.', referrals: 18, tokens: 4250 }
  ]);

  const levels = [
    { level: 1, name: 'Новачок', minReferrals: 0, bonus: 1.0 },
    { level: 2, name: 'Друг', minReferrals: 5, bonus: 1.2 },
    { level: 3, name: 'Амбасадор', minReferrals: 15, bonus: 1.5 },
    { level: 4, name: 'Експерт', minReferrals: 30, bonus: 1.8 },
    { level: 5, name: 'Легенда', minReferrals: 50, bonus: 2.0 }
  ];

  const getCurrentLevel = () => levels.find(l => l.level === userLevel) || levels[0];
  const getNextLevel = () => levels.find(l => l.level === userLevel + 1);

  const handleCopyReferralLink = async () => {
    const referralLink = `https://our-lounge.com/join?ref=${referralCode}`;
    
    try {
      await navigator.clipboard.writeText(referralLink);
      setShowCopyToast(true);
      setTimeout(() => setShowCopyToast(false), 3000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = referralLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setShowCopyToast(true);
      setTimeout(() => setShowCopyToast(false), 3000);
    }
  };

  const handleSocialShare = (platform) => {
    const referralLink = `https://our-lounge.com/join?ref=${referralCode}`;
    const shareText = "Приєднуйтесь до найкращого лаунжу в місті! Отримайте бонуси за реєстрацію.";
    
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(referralLink)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + referralLink)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(shareText)}`
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('uk-UA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Щойно';
    if (diffInHours < 24) return `${diffInHours} год тому`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} дн тому`;
    return formatDate(dateString);
  };

  const renderOverviewTab = () => (
    <div className="overview-content">
      {/* Stats Cards */}
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-header">
            <h3>Загальні Реферали</h3>
            <div className="stat-icon">👥</div>
          </div>
          <div className="stat-value">{stats.totalReferrals}</div>
          <div className="stat-change positive">+3 цього місяця</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <h3>Активні Реферали</h3>
            <div className="stat-icon">✅</div>
          </div>
          <div className="stat-value">{stats.activeReferrals}</div>
          <div className="stat-change positive">+2 цього тижня</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <h3>Зароблено Токенів</h3>
            <div className="stat-icon">🪙</div>
          </div>
          <div className="stat-value">{stats.totalTokensEarned}</div>
          <div className="stat-change positive">+450 цього місяця</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <h3>Поточний Рівень</h3>
            <div className="stat-icon">⭐</div>
          </div>
          <div className="stat-value">{getCurrentLevel().name}</div>
          <div className="stat-change positive">Рівень {userLevel}</div>
        </div>
      </div>

      {/* Level Progress */}
      <div className="level-progress">
        <h3>Прогрес до наступного рівня</h3>
        <div className="level-info">
          <span className="current-level">Рівень {userLevel}: {getCurrentLevel().name}</span>
          {getNextLevel() && (
            <span className="next-level">Наступний: {getNextLevel().name}</span>
          )}
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${stats.nextLevelProgress}%` }}
          ></div>
        </div>
        <div className="progress-text">
          {getNextLevel() ? 
            `${stats.totalReferrals}/${getNextLevel().minReferrals} рефералів` :
            'Максимальний рівень досягнуто!'
          }
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <div className="action-card">
          <h3>Запросити Друзів</h3>
          <p>Поділіться своїм реферальним кодом та отримайте бонуси</p>
          <button 
            className="action-btn"
            onClick={() => setActiveTab('referrals')}
          >
            🔗 Поділитися
          </button>
        </div>

        <div className="action-card">
          <h3>Переглянути Виклики</h3>
          <p>Виконуйте завдання та заробляйте додаткові токени</p>
          <button 
            className="action-btn secondary"
            onClick={() => setActiveTab('tokens')}
          >
            🏆 Виклики
          </button>
        </div>

        <div className="action-card">
          <h3>Використати Токени</h3>
          <p>Обміняйте токени на знижки та бонуси</p>
          <button className="action-btn secondary">
            🛍️ Магазин
          </button>
        </div>
      </div>
    </div>
  );

  const renderTokensTab = () => (
    <div className="tokens-content">
      <div>
        {/* Token Balance */}
        <div className="token-balance">
          <div className="balance-amount">{userTokens}</div>
          <div className="balance-label">Ваші Токени</div>
        </div>

        {/* Earning History */}
        <div className="earning-history">
          <h3>Історія Заробітку</h3>
          {earningHistory.map(item => (
            <div key={item.id} className="history-item">
              <div className="history-info">
                <div className="history-icon">{item.icon}</div>
                <div className="history-details">
                  <h4>{item.description}</h4>
                  <p>{formatTimeAgo(item.date)}</p>
                </div>
              </div>
              <div className="history-tokens">+{item.tokens}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Challenges */}
      <div className="challenges-section">
        <h3>Активні Виклики</h3>
        {challenges.map(challenge => (
          <div key={challenge.id} className="challenge-item">
            <div className="challenge-header">
              <h4 className="challenge-title">{challenge.title}</h4>
              <div className="challenge-reward">+{challenge.reward} токенів</div>
            </div>
            <p className="challenge-description">{challenge.description}</p>
            <div className="challenge-progress">
              <div 
                className="challenge-progress-fill"
                style={{ width: `${(challenge.progress / challenge.maxProgress) * 100}%` }}
              ></div>
            </div>
            <div className="challenge-progress-text">
              {challenge.progress}/{challenge.maxProgress} 
              {challenge.completed && ' ✅ Завершено'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderReferralsTab = () => (
    <div className="referrals-content">
      <div>
        {/* Share Section */}
        <div className="share-section">
          <h3>Поділіться з Друзями</h3>
          
          <div className="referral-link">
            <input
              type="text"
              className="link-input"
              value={`https://our-lounge.com/join?ref=${referralCode}`}
              readOnly
            />
            <button className="copy-btn" onClick={handleCopyReferralLink}>
              📋 Копіювати
            </button>
          </div>

          <div className="social-share">
            <button 
              className="social-btn facebook"
              onClick={() => handleSocialShare('facebook')}
            >
              📘 Facebook
            </button>
            <button 
              className="social-btn twitter"
              onClick={() => handleSocialShare('twitter')}
            >
              🐦 Twitter
            </button>
            <button 
              className="social-btn whatsapp"
              onClick={() => handleSocialShare('whatsapp')}
            >
              💬 WhatsApp
            </button>
            <button 
              className="social-btn telegram"
              onClick={() => handleSocialShare('telegram')}
            >
              ✈️ Telegram
            </button>
          </div>
        </div>

        {/* My Referrals */}
        <div className="referral-list">
          <h3>Мої Реферали ({myReferrals.length})</h3>
          {myReferrals.map(referral => (
            <div key={referral.id} className="referral-item">
              <div className="referral-info">
                <div className="referral-avatar">
                  {referral.name.charAt(0)}
                </div>
                <div className="referral-details">
                  <h4>{referral.name}</h4>
                  <p>Приєднався: {formatDate(referral.joinDate)}</p>
                </div>
              </div>
              <div className="referral-status">
                <span className={`status-badge ${referral.status}`}>
                  {referral.status === 'active' ? 'Активний' : 'Очікує'}
                </span>
                <div className="earned-tokens">+{referral.tokensEarned}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="leaderboard">
        <h3>Топ Рефералів</h3>
        {leaderboard.map(user => (
          <div key={user.rank} className="leaderboard-item">
            <div className={`rank ${user.rank <= 3 ? 'top3' : ''}`}>
              #{user.rank}
            </div>
            <div className="user-info">
              <h4>{user.name}</h4>
              <p>{user.tokens} токенів</p>
            </div>
            <div className="referral-count">{user.referrals}</div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="referral-system">
      <div className="referral-container">
        {/* Header */}
        <div className="referral-header">
          <h1>Реферальна Система</h1>
          <p>Запрошуйте друзів та заробляйте разом</p>
        </div>

        {/* Navigation Tabs */}
        <div className="referral-tabs">
          <button 
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Огляд
          </button>
          <button 
            className={`tab-btn ${activeTab === 'tokens' ? 'active' : ''}`}
            onClick={() => setActiveTab('tokens')}
          >
            Токени
          </button>
          <button 
            className={`tab-btn ${activeTab === 'referrals' ? 'active' : ''}`}
            onClick={() => setActiveTab('referrals')}
          >
            Реферали
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'tokens' && renderTokensTab()}
        {activeTab === 'referrals' && renderReferralsTab()}

        {/* Copy Toast */}
        {showCopyToast && (
          <div className="copy-toast">
            ✅ Реферальне посилання скопійовано!
          </div>
        )}
      </div>
    </div>
  );
};

export default ReferralSystem;