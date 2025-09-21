import React from 'react';
import { ChevronDown } from 'lucide-react';
import './Hero.css';

const Hero = () => {
  const scrollToMenu = () => {
    const menuSection = document.getElementById('menu');
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero">
      <div className="hero-background">
        <div className="hero-image"></div>
        <div className="hero-overlay"></div>
      </div>
      
      <div className="hero-content">
        <div className="container">
          <div className="hero-text">
            <h1 className="hero-title fade-in">
              Атмосфера
              <span className="hero-accent"> релакса</span>
            </h1>
            <p className="hero-subtitle fade-in">
              Лучшие кальяны, авторские коктейли и домашняя кухня 
              в самом уютном лаундж-баре города
            </p>
            <div className="hero-buttons fade-in">
              <button className="btn btn-primary" onClick={scrollToMenu}>
                Смотреть меню
              </button>
              <a href="#about" className="btn btn-secondary">
                Узнать больше
              </a>
            </div>
          </div>
        </div>
        
        <button className="scroll-indicator" onClick={scrollToMenu}>
          <ChevronDown size={24} />
        </button>
      </div>
    </section>
  );
};

export default Hero;