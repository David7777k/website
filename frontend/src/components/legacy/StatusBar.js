import React from "react";
import { MapPin, Clock } from "lucide-react";
import "./StatusBar.css";

const StatusBar = () => {
  return (
    <div className="status-bar">
      <div className="status-content">
        <div className="status-badge">
          <MapPin size={16} />
          <span>В закладі</span>
        </div>
        <div className="status-hours">
          <Clock size={16} />
          <span>З 17:00 до 23:00</span>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;