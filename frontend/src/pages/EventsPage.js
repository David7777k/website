// EventsPage.js
import React, { useState, useEffect } from 'react';
import './EventsPage.css';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [featuredEvent, setFeaturedEvent] = useState(null);
  const [filter, setFilter] = useState('all');

  // Mock events data
  useEffect(() => {
    const mockEvents = [
      {
        id: 1,
        title: "Хелловін Паті 🎃",
        description: "Готуйтеся до найстрашнішої ночі року! Конкурси костюмів, спеціальні коктейлі та незабутня атмосфера",
        date: "2024-10-31T20:00:00Z",
        endDate: "2024-11-01T02:00:00Z",
        image: "/api/placeholder/600/300",
        category: "party",
        featured: true,
        price: "Безкоштовно",
        location: "Головний зал",
        tags: ["halloween", "костюми", "конкурси"],
        capacity: 100,
        registered: 73,
        organizer: "Panda Lounge Team"
      },
      {
        id: 2,
        title: "Живі Виступи: Інді Вечір",
        description: "Вечір живої музики з кращими українськими інді-виконавцями",
        date: "2024-11-15T19:00:00Z",
        endDate: "2024-11-15T23:00:00Z",
        image: "/api/placeholder/600/300",
        category: "music",
        featured: false,
        price: "200 грн",
        location: "Музична зона",
        tags: ["live music", "інді", "українські виконавці"],
        capacity: 60,
        registered: 45,
        organizer: "Music Events UA"
      },
      {
        id: 3,
        title: "Майстер-клас Кальянів",
        description: "Навчіться готувати ідеальний кальян від наших професійних кальянщиків",
        date: "2024-11-08T18:00:00Z",
        endDate: "2024-11-08T20:00:00Z",
        image: "/api/placeholder/600/300",
        category: "workshop",
        featured: false,
        price: "150 грн",
        location: "VIP зона",
        tags: ["кальян", "майстер-клас", "навчання"],
        capacity: 15,
        registered: 8,
        organizer: "Panda Lounge Masters"
      },
      {
        id: 4,
        title: "Кіно під Зірками",
        description: "Перегляд культових фільмів на великому екрані в атмосфері лаунжу",
        date: "2024-11-22T21:00:00Z",
        endDate: "2024-11-23T00:00:00Z",
        image: "/api/placeholder/600/300",
        category: "entertainment",
        featured: false,
        price: "100 грн",
        location: "Кіно-зона",
        tags: ["кіно", "фільми", "релакс"],
        capacity: 40,
        registered: 12,
        organizer: "Cinema Lounge"
      },
      {
        id: 5,
        title: "New Year 2025 Celebration",
        description: "Зустрічайте Новий Рік разом з нами! Фейєрверк, подарунки та незабутні емоції",
        date: "2024-12-31T22:00:00Z",
        endDate: "2025-01-01T05:00:00Z",
        image: "/api/placeholder/600/300",
        category: "party",
        featured: true,
        price: "500 грн",
        location: "Весь лаунж",
        tags: ["новий рік", "святкування", "фейєрверк"],
        capacity: 150,
        registered: 89,
        organizer: "Panda Lounge Team"
      }
    ];

    setEvents(mockEvents);
    setFeaturedEvent(mockEvents.find(event => event.featured));
  }, []);

  const getTimeRemaining = (eventDate) => {
    const now = new Date();
    const event = new Date(eventDate);
    const diff = event - now;

    if (diff <= 0) return null;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return { days, hours, minutes };
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('uk-UA', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFilteredEvents = () => {
    if (filter === 'all') return events;
    return events.filter(event => event.category === filter);
  };

  const getCategoryColor = (category) => {
    const colors = {
      party: '#FF6B6B',
      music: '#4ECDC4',
      workshop: '#45B7D1',
      entertainment: '#96CEB4'
    };
    return colors[category] || '#00CC00';
  };

  const handleRegister = (eventId) => {
    setEvents(events.map(event => {
      if (event.id === eventId && event.registered < event.capacity) {
        return { ...event, registered: event.registered + 1 };
      }
      return event;
    }));
  };

  const filteredEvents = getFilteredEvents();

  return (
    <div className="events-page">
      <div className="events-container">
        {/* Header */}
        <div className="events-header">
          <h1 className="gradient-text">🎪 Афіша Подій</h1>
          <p>Не пропустіть найкращі події в Panda Lounge</p>
        </div>

        {/* Featured Event Banner */}
        {featuredEvent && (
          <div className="featured-event">
            <div className="featured-banner">
              <div className="banner-content">
                <div className="event-badge">Рекомендуємо</div>
                <h2>{featuredEvent.title}</h2>
                <p>{featuredEvent.description}</p>
                <div className="event-details">
                  <span className="event-date">📅 {formatDate(featuredEvent.date)}</span>
                  <span className="event-price">💰 {featuredEvent.price}</span>
                  <span className="event-location">📍 {featuredEvent.location}</span>
                </div>
                <div className="event-stats">
                  <div className="stat">
                    <span className="stat-number">{featuredEvent.registered}</span>
                    <span className="stat-label">Зареєстровано</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">{featuredEvent.capacity - featuredEvent.registered}</span>
                    <span className="stat-label">Вільно місць</span>
                  </div>
                </div>
                <button 
                  className="btn btn-primary register-btn"
                  onClick={() => handleRegister(featuredEvent.id)}
                >
                  🎫 Зареєструватися
                </button>
              </div>
              <div className="banner-timer">
                {(() => {
                  const timeLeft = getTimeRemaining(featuredEvent.date);
                  if (!timeLeft) return <div className="timer-expired">Подія завершена</div>;
                  return (
                    <div className="countdown-timer">
                      <div className="timer-title">До початку:</div>
                      <div className="timer-display">
                        <div className="timer-unit">
                          <span className="timer-number">{timeLeft.days}</span>
                          <span className="timer-label">днів</span>
                        </div>
                        <div className="timer-separator">:</div>
                        <div className="timer-unit">
                          <span className="timer-number">{timeLeft.hours}</span>
                          <span className="timer-label">годин</span>
                        </div>
                        <div className="timer-separator">:</div>
                        <div className="timer-unit">
                          <span className="timer-number">{timeLeft.minutes}</span>
                          <span className="timer-label">хвилин</span>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="filter-tabs">
          <button 
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Всі події
          </button>
          <button 
            className={`filter-tab ${filter === 'party' ? 'active' : ''}`}
            onClick={() => setFilter('party')}
          >
            🎉 Вечірки
          </button>
          <button 
            className={`filter-tab ${filter === 'music' ? 'active' : ''}`}
            onClick={() => setFilter('music')}
          >
            🎵 Музика
          </button>
          <button 
            className={`filter-tab ${filter === 'workshop' ? 'active' : ''}`}
            onClick={() => setFilter('workshop')}
          >
            🎓 Майстер-класи
          </button>
          <button 
            className={`filter-tab ${filter === 'entertainment' ? 'active' : ''}`}
            onClick={() => setFilter('entertainment')}
          >
            🎪 Розваги
          </button>
        </div>

        {/* Events Grid */}
        <div className="events-grid">
          {filteredEvents.map(event => {
            const timeLeft = getTimeRemaining(event.date);
            const isUpcoming = timeLeft !== null;
            
            return (
              <div key={event.id} className={`event-card ${!isUpcoming ? 'past-event' : ''}`}>
                <div className="event-image">
                  <div 
                    className="image-placeholder"
                    style={{ backgroundColor: getCategoryColor(event.category) }}
                  >
                    <span className="event-emoji">
                      {event.category === 'party' && '🎉'}
                      {event.category === 'music' && '🎵'}
                      {event.category === 'workshop' && '🎓'}
                      {event.category === 'entertainment' && '🎪'}
                    </span>
                  </div>
                  <div className="event-category" style={{ backgroundColor: getCategoryColor(event.category) }}>
                    {event.category === 'party' && 'Вечірка'}
                    {event.category === 'music' && 'Музика'}
                    {event.category === 'workshop' && 'Майстер-клас'}
                    {event.category === 'entertainment' && 'Розваги'}
                  </div>
                </div>
                
                <div className="event-content">
                  <h3>{event.title}</h3>
                  <p>{event.description}</p>
                  
                  <div className="event-meta">
                    <div className="meta-item">
                      <span className="meta-icon">📅</span>
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-icon">📍</span>
                      <span>{event.location}</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-icon">💰</span>
                      <span>{event.price}</span>
                    </div>
                  </div>

                  <div className="event-tags">
                    {event.tags.map((tag, index) => (
                      <span key={index} className="tag">#{tag}</span>
                    ))}
                  </div>

                  <div className="event-progress">
                    <div className="progress-info">
                      <span>Зареєстровано: {event.registered}/{event.capacity}</span>
                      <span>{Math.round((event.registered / event.capacity) * 100)}%</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ 
                          width: `${(event.registered / event.capacity) * 100}%`,
                          backgroundColor: getCategoryColor(event.category)
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="event-actions">
                    {isUpcoming ? (
                      <button 
                        className="btn btn-primary"
                        onClick={() => handleRegister(event.id)}
                        disabled={event.registered >= event.capacity}
                      >
                        {event.registered >= event.capacity ? '🚫 Місць немає' : '🎫 Зареєструватися'}
                      </button>
                    ) : (
                      <button className="btn btn-secondary" disabled>
                        ⏰ Подія завершена
                      </button>
                    )}
                    
                    <button className="btn btn-secondary">
                      📤 Поділитися
                    </button>
                  </div>

                  {isUpcoming && timeLeft && (
                    <div className="mini-countdown">
                      <span>Через: </span>
                      <span className="countdown-text">
                        {timeLeft.days}д {timeLeft.hours}г {timeLeft.minutes}хв
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredEvents.length === 0 && (
          <div className="no-events">
            <div className="no-events-icon">🎪</div>
            <h3>Поки що немає подій</h3>
            <p>Слідкуйте за оновленнями, незабаром з'являться нові захоплюючі події!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;