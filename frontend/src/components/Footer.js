import React from 'react';
import { Instagram, Phone, MapPin, Clock } from 'lucide-react';
<<<<<<< HEAD
import { useTranslation } from 'react-i18next';
import './Footer.css';

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-about">
          <div className="footer-logo">
            <div className="logo-text">
              <span className="logo-main">LOUNGE</span>
              <span className="logo-sub">bar & hookah</span>
            </div>
          </div>
          <p className="footer-description">
            {t('best_hookahs')}
          </p>
          <div className="social-links">
            <a href="#" aria-label="Instagram" className="social-link">
              <Instagram size={20} />
            </a>
          </div>
        </div>

        <div className="footer-contacts">
          <h4 className="footer-title">{t('contacts_title')}</h4>
          <div className="contact-item"><Phone size={16} /><span>{t('phone')}</span></div>
          <div className="contact-item"><MapPin size={16} /><span>{t('address')}</span></div>
        </div>

        <div className="footer-hours">
          <h4 className="footer-title">{t('working_hours_title')}</h4>
         <div className="schedule-item"><Clock size={16} /><span>{t('working_hours_text')}</span></div>
        </div>

        <div className="footer-nav">
            <h4 className="footer-title">{t('navigation')}</h4>
          <nav>
            <a href="#menu">{t('menu')}</a>
            <a href="#about">{t('about')}</a>
            <a href="#contact">{t('contact')}</a>
            <a href="#booking">{t('booking')}</a>
          </nav>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p>{t('copyright')}</p>
          <div className="footer-links">
            <a href="#">{t('privacy')}</a>
            <a href="#">{t('terms')}</a>
=======
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
            <h4 className="footer-title">Контакти</h4>
            <div className="contact-info">
              <div className="contact-item">
                <Phone size={18} />
                <span>+380 (44) 123-45-67</span>
              </div>
              <div className="contact-item">
                <MapPin size={18} />
                <span>вул. Центральна, 123</span>
              </div>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">Режим роботи</h4>
            <div className="schedule">
              <div className="schedule-item">
                <Clock size={18} />
                <div className="schedule-text">
                  <div>Пн-Пт: 17:00 - 23:00</div>
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
>>>>>>> 5c8c9a3fc7653b7c9a1ca2ab213073fd9c16ab34
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;