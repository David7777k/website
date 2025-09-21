import React, { useState } from 'react';
import { Heart, Star, Flame, Sparkles } from 'lucide-react';
import './MenuCard.css';

const MenuCard = ({ item, delay = 0 }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [liked, setLiked] = useState(false);

  const getBadgeIcon = (badge) => {
    switch (badge) {
      case 'hit':
        return <Star size={16} />;
      case 'new':
        return <Sparkles size={16} />;
      case 'popular':
        return <Flame size={16} />;
      default:
        return null;
    }
  };

  const getBadgeText = (badge) => {
    switch (badge) {
      case 'hit':
        return 'Хит';
      case 'new':
        return 'Новинка';
      case 'popular':
        return 'Популярное';
      default:
        return badge;
    }
  };

  return (
    <div 
      className="menu-card"
      style={{
        animationDelay: `${delay}s`
      }}
    >
      <div className="card-image-container">
        {!imageLoaded && <div className="image-placeholder">
          <div className="loading-spinner"></div>
        </div>}
        <img
          src={item.image}
          alt={item.name}
          className={`card-image ${imageLoaded ? 'loaded' : ''}`}
          onLoad={() => setImageLoaded(true)}
        />
        
        <div className="card-badges">
          {item.badges.map((badge) => (
            <div key={badge} className={`badge badge-${badge}`}>
              {getBadgeIcon(badge)}
              <span>{getBadgeText(badge)}</span>
            </div>
          ))}
        </div>
        
        <button 
          className={`like-btn ${liked ? 'liked' : ''}`}
          onClick={() => setLiked(!liked)}
          aria-label="Добавить в избранное"
        >
          <Heart size={20} fill={liked ? "currentColor" : "none"} />
        </button>
      </div>
      
      <div className="card-content">
        <div className="card-header">
          <h3 className="card-title">{item.name}</h3>
          <div className="card-price">{item.price} ₽</div>
        </div>
        
        <p className="card-description">{item.description}</p>
        
        <div className="card-actions">
          <button className="btn btn-primary card-btn">
            Заказать
          </button>
          <div className="card-availability">
            <div className={`availability-dot ${item.available ? 'available' : 'unavailable'}`}></div>
            <span>{item.available ? 'Доступно' : 'Недоступно'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;