import React from "react";
import { Link } from "react-router-dom";
import { User, Menu } from "lucide-react";
import "./Header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <Link to="/" className="logo">
            <h1>Panda</h1>
            <span className="subtitle">Чайна</span>
          </Link>
        </div>
        
        <nav className="header-nav">
          <Link to="/" className="nav-link">Меню</Link>
          <Link to="/feedback" className="nav-link">Залишити відгук</Link>
        </nav>
        
        <div className="header-right">
          <button className="header-btn">
            <User size={20} />
          </button>
          <button className="header-btn mobile-menu">
            <Menu size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;