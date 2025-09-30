import React from 'react';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';import './Hero.css';

const Hero = () => {
  const scrollToMenu = () => {
    const menuSection = document.getElementById('menu');
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const { t } = useTranslation();
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
                {t('atmosphere')}
                <span className="hero-accent"> {t('atmosphere_accent')}</span>
            </h1>
            <p className="hero-subtitle fade-in">
              {t('best_hookahs')}
            </p>
            <div className="hero-buttons fade-in">
              <button className="btn btn-primary" onClick={scrollToMenu}>
                {t('see_menu')}
              </button>
              <a href="#about" className="btn btn-secondary">
                {t('learn_more')}              </a>
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
