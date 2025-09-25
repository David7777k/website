import React, { useState } from "react";
import { Heart, Share2, Plus, Minus } from "lucide-react";
import "./MenuItem.css";

const MenuItem = ({ item, isFavorite, onToggleFavorite }) => {
  const [quantity, setQuantity] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [selectedFlavor, setSelectedFlavor] = useState(item?.flavors?.[0] || '');

  const handleQuantityChange = (delta) => {
    setQuantity(Math.max(0, quantity + delta));
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: item.name,
        text: `${item.name} - ${item.price} ₴`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(
        `${item.name} - ${item.price} ₴ - ${window.location.href}`
      );
    }
  };

  const formatDescription = (description) => {
    if (!description) return "";
    const lines = description.split('\n');
    if (!showFullDescription && lines.length > 3) {
      return lines.slice(0, 3).join('\n') + '...';
    }
    return description;
  };

  return (
    <div className="menu-item">
      {item.image && (
        <div className="item-image">
          <img src={item.image} alt={item.name} />
        </div>
      )}
      
      <div className="item-content">
        <div className="item-header">
          <h3 className="item-name">{item.name}</h3>
          <div className="item-price">{item.price} ₴</div>
        </div>
        
        {item.weight && (
          <div className="item-weight">{item.weight}</div>
        )}
        
        {item.description && (
          <div className="item-description">
            <pre>{formatDescription(item.description)}</pre>
            {item.description.split('\n').length > 3 && (
              <button 
                className="toggle-description"
                onClick={() => setShowFullDescription(!showFullDescription)}
              >
                {showFullDescription ? "Показати менше" : "Показати більше"}
              </button>
            )}
          </div>
        )}

<<<<<<< HEAD
        {/* Flavor selector for hookah */}
=======
>>>>>>> 5c8c9a3fc7653b7c9a1ca2ab213073fd9c16ab34
        {item.category === 'hookah' && item.flavors && (
          <div className="hookah-flavors">
            <label htmlFor={`flavor-${item.id}`}>Смак:</label>
            <select
              id={`flavor-${item.id}`}
              value={selectedFlavor}
              onChange={(e) => setSelectedFlavor(e.target.value)}
            >
              {item.flavors.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
        )}
<<<<<<< HEAD
        
=======

>>>>>>> 5c8c9a3fc7653b7c9a1ca2ab213073fd9c16ab34
        <div className="item-actions">
          <div className="item-controls">
            <button
              className={`favorite-btn ${isFavorite ? "active" : ""}`}
              onClick={() => onToggleFavorite(item.id)}
            >
              <Heart size={18} fill={isFavorite ? "#e11d48" : "none"} />
            </button>
            
            {item.rating && (
              <div className="item-rating">
                {item.rating}
              </div>
            )}
            
            <button className="share-btn" onClick={handleShare}>
              <Share2 size={18} />
            </button>
          </div>
          
          <div className="quantity-controls">
            <button 
              className="quantity-btn"
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity === 0}
            >
              <Minus size={16} />
            </button>
            <span className="quantity">{quantity}</span>
            <button 
              className="quantity-btn"
              onClick={() => handleQuantityChange(1)}
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuItem;