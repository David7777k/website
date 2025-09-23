import React from "react";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { mockCategories } from "../data/mockData";
import "./Sidebar.css";

const Sidebar = ({ selectedCategory, onCategorySelect }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        <Link to="/popular" className="popular-link">
          <Star size={16} />
          <span>Популярне</span>
        </Link>
        
        <div className="menu-section">
          <h3 className="menu-title">Меню:</h3>
          <div className="menu-categories">
            {mockCategories.map((category) => (
              <button
                key={category.id}
                className={`category-btn ${
                  selectedCategory === category.id ? "active" : ""
                }`}
                onClick={() => onCategorySelect(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;