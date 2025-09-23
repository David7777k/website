import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();

  const changeLang = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
          <div className="logo-text">
            <span className="logo-main">LOUNGE</span>
            <span className="logo-sub">bar & hookah</span>
          </div>
        </Link>

        <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
          <a href="#menu" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            {t('menu')}
          </a>
          <a href="#about" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            {t('about')}
          </a>
          <a href="#contact" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            {t('contact')}
          </a>
          <Link 
            to="/admin/login" 
            className="admin-link"
            onClick={() => setIsMenuOpen(false)}
          >
            <User size={18} />
            {t('admin')}
          </Link>

          <div className="lang-switcher">
            <button onClick={() => changeLang('ru')} className={`lang-btn ${i18n.language === 'ru' ? 'active' : ''}`}>RU</button>
            <button onClick={() => changeLang('uk')} className={`lang-btn ${i18n.language === 'uk' ? 'active' : ''}`}>UK</button>
          </div>
        </nav>

        <button 
          className="mobile-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </header>
  );
};

export default Header;