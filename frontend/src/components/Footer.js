import React from "react";
import { MapPin, Phone, Mail, Instagram, Clock } from "lucide-react";
import { mockRestaurantInfo } from "../data/mockData";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>Контактні дані</h4>
          <div className="contact-item">
            <MapPin size={16} />
            <span>{mockRestaurantInfo.address}</span>
          </div>
          <div className="contact-item">
            <Phone size={16} />
            <a href={`tel:${mockRestaurantInfo.phone}`}>
              {mockRestaurantInfo.phone}
            </a>
          </div>
          <div className="contact-item">
            <Mail size={16} />
            <a href={`mailto:${mockRestaurantInfo.email}`}>
              {mockRestaurantInfo.email}
            </a>
          </div>
        </div>
        
        <div className="footer-section">
          <h4>Робочий час</h4>
          <div className="working-hours">
            {Object.entries(mockRestaurantInfo.workingHours).map(([day, hours]) => (
              <div key={day} className="hours-item">
                <span className="day">{day}</span>
                <span className="hours">{hours}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="footer-section">
          <h4>Ми в соцмережах</h4>
          <div className="social-links">
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
        </div>
        
        <div className="footer-section">
          <h4>На карті</h4>
          <div className="map-preview">
            <div className="map-placeholder-small">
              <MapPin size={20} />
            </div>
            <a 
              href={`https://maps.google.com/?q=${encodeURIComponent(mockRestaurantInfo.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="get-location-btn"
            >
              Отримати розташування
            </a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <div className="copyright">
            © 2025 Panda
          </div>
          <div className="footer-links">
            <a href="/cookie-policy">Політика використання файлів cookie</a>
            <a href="/terms-of-use">Умови користування</a>
            <a href="/privacy-policy">Політика конфіденційності</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;