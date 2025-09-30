import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="brand-name">LOUNGE</span>
              <span className="brand-subtitle">bar & hookah</span>
            </h1>
            <p className="hero-description">
              Премиальный лаундж-бар в центре города. Атмосфера уюта, качественные напитки и незабываемый отдых.
            </p>
            <div className="hero-actions">
              <button 
                className="btn btn-primary hero-btn"
                onClick={() => navigate('/events')}
              >
                🎪 Афіша подій
              </button>
              <button 
                className="btn btn-secondary hero-btn"
                onClick={() => navigate('/menu')}
              >
                🍸 Меню
              </button>
            </div>
          </div>
          
          <div className="hero-features">
            <div className="feature-card">
              <div className="feature-icon">🎵</div>
              <h3>Музыка</h3>
              <p>DJ-сеты и живая музыка каждые выходные</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎰</div>
              <h3>Колесо фортуны</h3>
              <p>Выиграй скидки и бесплатные напитки</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🍹</div>
              <h3>Коктейли</h3>
              <p>Авторские коктейли от лучших барменов</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="quick-nav-section">
        <div className="quick-nav-container">
          <h2>Быстрый переход</h2>
          <div className="quick-nav-grid">
            <div className="quick-nav-card" onClick={() => navigate('/events')}>
              <div className="quick-nav-icon">🎪</div>
              <h3>События</h3>
              <p>Афиша и мероприятия</p>
            </div>
            <div className="quick-nav-card" onClick={() => navigate('/menu')}>
              <div className="quick-nav-icon">🍸</div>
              <h3>Меню</h3>
              <p>Напитки и закуски</p>
            </div>
            <div className="quick-nav-card" onClick={() => navigate('/music')}>
              <div className="quick-nav-icon">🎵</div>
              <h3>Музыка</h3>
              <p>Заказ треков</p>
            </div>
            <div className="quick-nav-card" onClick={() => navigate('/profile')}>
              <div className="quick-nav-icon">👤</div>
              <h3>Профиль</h3>
              <p>Личный кабинет</p>
            </div>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="info-section">
        <div className="info-container">
          <div className="info-card">
            <h3>🕒 Часы работы</h3>
            <p>Пн-Чт: 18:00 - 02:00</p>
            <p>Пт-Сб: 18:00 - 04:00</p>
            <p>Вс: 18:00 - 01:00</p>
          </div>
          <div className="info-card">
            <h3>📍 Адрес</h3>
            <p>ул. Центральная, 123</p>
            <p>г. Киев</p>
            <p>+38 (044) 123-45-67</p>
          </div>
          <div className="info-card">
            <h3>🎊 Особенности</h3>
            <p>• Система лояльности</p>
            <p>• Бронирование столиков</p>
            <p>• Приватные кабинеты</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
