import React from 'react';
import { Instagram, Phone, MapPin, Clock } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <div className="logo-text">
                <span className="logo-main">LOUNGE</span>
                <span className="logo-sub">bar & hookah</span>
              </div>
            </div>
            <p className="footer-description">
              Уютный лаундж-бар с лучшими кальянами, авторскими коктейлями 
              и домашней атмосферой в центре города.
            </p>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="Instagram">
                <Instagram size={24} />
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">Контакты</h4>
            <div className="contact-info">
              <div className="contact-item">
                <Phone size={18} />
                <span>+7 (999) 123-45-67</span>
              </div>
              <div className="contact-item">
                <MapPin size={18} />
                <span>ул. Центральная, 123</span>
              </div>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">Режим работы</h4>
            <div className="schedule">
              <div className="schedule-item">
                <Clock size={18} />
                <div className="schedule-text">
                  <div>Пн-Чт: 18:00 - 02:00</div>
                  <div>Пт-Сб: 18:00 - 04:00</div>
                  <div>Вс: 18:00 - 01:00</div>
                </div>
              </div>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">Навигация</h4>
            <nav className="footer-nav">
              <a href="#menu">Меню</a>
              <a href="#about">О нас</a>
              <a href="#contact">Контакты</a>
              <a href="#booking">Бронирование</a>
            </nav>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2024 LOUNGE. Все права защищены.</p>
          <div className="footer-links">
            <a href="#">Политика конфиденциальности</a>
            <a href="#">Условия использования</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;