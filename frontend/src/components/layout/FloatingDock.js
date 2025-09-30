// FloatingDock.js
import React, { useState } from 'react';
import './FloatingDock.css';

const FloatingDock = ({ onStaffLike, onFortuneWheel, isWheelAvailable = true }) => {
  const [showTooltip, setShowTooltip] = useState(null);

  const handleStaffLike = () => {
    onStaffLike && onStaffLike();
  };

  const handleFortuneWheel = () => {
    if (isWheelAvailable) {
      onFortuneWheel && onFortuneWheel();
    }
  };

  const showTooltipHandler = (type) => {
    setShowTooltip(type);
    setTimeout(() => setShowTooltip(null), 2000);
  };

  return (
    <div className="floating-dock">
      <div className="dock-container">
        {/* Staff Like Button */}
        <button
          className="dock-btn staff-like-btn"
          onClick={handleStaffLike}
          onMouseEnter={() => showTooltipHandler('staff')}
          aria-label="Подобається кальянщик"
        >
          <div className="btn-icon">❤️</div>
          <div className="btn-pulse"></div>
          {showTooltip === 'staff' && (
            <div className="tooltip">
              Подобається кальянщик
            </div>
          )}
        </button>

        {/* Fortune Wheel Button */}
        <button
          className={`dock-btn wheel-btn ${!isWheelAvailable ? 'disabled' : ''}`}
          onClick={handleFortuneWheel}
          onMouseEnter={() => showTooltipHandler('wheel')}
          disabled={!isWheelAvailable}
          aria-label="Колесо фортуни"
        >
          <div className="btn-icon">🎡</div>
          {isWheelAvailable && <div className="btn-glow"></div>}
          {!isWheelAvailable && (
            <div className="countdown-badge">
              <span>6д</span>
            </div>
          )}
          {showTooltip === 'wheel' && (
            <div className="tooltip">
              {isWheelAvailable ? 'Колесо фортуни' : 'Доступно через 6 днів'}
            </div>
          )}
        </button>

        {/* Background Decoration */}
        <div className="dock-bg">
          <div className="floating-particles">
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloatingDock;