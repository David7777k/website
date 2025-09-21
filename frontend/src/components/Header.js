import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
            Меню
          </a>
          <a href="#about" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            О нас
          </a>
          <a href="#contact" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            Контакты
          </a>
          <Link 
            to="/admin/login" 
            className="admin-link"
            onClick={() => setIsMenuOpen(false)}
          >
            <User size={18} />
            Admin
          </Link>
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