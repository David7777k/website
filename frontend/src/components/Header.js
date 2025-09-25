import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
<<<<<<< HEAD
import { useTranslation } from 'react-i18next';
=======
>>>>>>> 5c8c9a3fc7653b7c9a1ca2ab213073fd9c16ab34
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
<<<<<<< HEAD
  const { t, i18n } = useTranslation();

  const changeLang = (lng) => {
    i18n.changeLanguage(lng);
  };
=======
>>>>>>> 5c8c9a3fc7653b7c9a1ca2ab213073fd9c16ab34

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
<<<<<<< HEAD
            {t('menu')}
          </a>
          <a href="#about" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            {t('about')}
          </a>
          <a href="#contact" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            {t('contact')}
=======
            Меню
          </a>
          <a href="#about" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            Про нас
          </a>
          <a href="#contact" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            Контакти
>>>>>>> 5c8c9a3fc7653b7c9a1ca2ab213073fd9c16ab34
          </a>
          <Link 
            to="/admin/login" 
            className="admin-link"
            onClick={() => setIsMenuOpen(false)}
          >
            <User size={18} />
<<<<<<< HEAD
            {t('admin')}
          </Link>

          <div className="lang-switcher">
            <button onClick={() => changeLang('ru')} className={`lang-btn ${i18n.language === 'ru' ? 'active' : ''}`}>RU</button>
            <button onClick={() => changeLang('uk')} className={`lang-btn ${i18n.language === 'uk' ? 'active' : ''}`}>UK</button>
          </div>
=======
            Admin
          </Link>
>>>>>>> 5c8c9a3fc7653b7c9a1ca2ab213073fd9c16ab34
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