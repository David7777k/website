import React from 'react';
import { Instagram, Phone, MapPin, Clock } from 'lucide-react';
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
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;