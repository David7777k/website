import React from "react";
import { Search, Wifi, Clock, MapPin, Phone, MessageSquare, Instagram } from "lucide-react";
import { mockRestaurantInfo } from "../data/mockData";
import "./RestaurantInfo.css";

const RestaurantInfo = ({ searchQuery, onSearchChange }) => {
  return (
    <aside className="restaurant-info">
      <div className="search-section">
        <div className="search-container">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            placeholder="Пошук"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="info-card">
        <h3>Інформація про заклад</h3>
        
        <div className="info-item">
          <Wifi size={16} />
          <div>
            <span className="info-label">WiFi:</span>
            <span className="info-value">{mockRestaurantInfo.wifi}</span>
          </div>
        </div>
        
        <div className="info-item">
          <Clock size={16} />
          <div>
            <span className="info-label">Робочий час:</span>
            <span className="info-value">{mockRestaurantInfo.hours}</span>
          </div>
        </div>
        
        <div className="info-item">
          <MapPin size={16} />
          <div>
            <span className="info-label">Адреса:</span>
            <span className="info-value">{mockRestaurantInfo.address}</span>
          </div>
        </div>
        
        <div className="info-item">
          <Phone size={16} />
          <div>
            <span className="info-label">Телефон:</span>
            <a href={`tel:${mockRestaurantInfo.phone}`} className="info-link">
              {mockRestaurantInfo.phone}
            </a>
          </div>
        </div>
        
        <button className="feedback-btn">
          <MessageSquare size={16} />
          <span>Надіслати відгук</span>
        </button>
      </div>
      
      <div className="map-section">
        <h4>На карті</h4>
        <div className="map-placeholder">
          <div className="map-content">
            <MapPin size={24} />
            <p>Інтерактивна карта</p>
          </div>
        </div>
        <a 
          href={`https://maps.google.com/?q=${encodeURIComponent(mockRestaurantInfo.address)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="location-btn"
        >
          Отримати розташування
        </a>
      </div>
      
      <div className="social-section">
        <h4>Ми в соцмережах</h4>
        <a 
          href={mockRestaurantInfo.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="social-link"
        >
          <Instagram size={20} />
          <span>Instagram</span>
        </a>
      </div>
    </aside>
  );
};

export default RestaurantInfo;