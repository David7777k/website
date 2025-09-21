import React from 'react';
import { Search } from 'lucide-react';
import MenuCard from './MenuCard';
import { categoryNames } from '../data/mockData';
import './MenuSection.css';

const MenuSection = ({
  items,
  categories,
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  loading
}) => {
  return (
    <section id="menu" className="menu-section">
      <div className="container">
        <div className="menu-header">
          <h2 className="section-title slide-up">Наше меню</h2>
          <p className="section-subtitle slide-up">
            Лучшие коктейли, ароматные кальяны и вкусная еда
          </p>
        </div>

        <div className="menu-controls slide-up">
          <div className="search-container">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Поиск по меню..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="category-filters">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => onCategoryChange(category)}
                className={`category-btn ${
                  selectedCategory === category ? 'active' : ''
                }`}
              >
                {categoryNames[category] || category}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="loading">
            <div className="loading-spinner"></div>
          </div>
        ) : (
          <div className="menu-grid fade-in">
            {items.length > 0 ? (
              items.map((item, index) => (
                <MenuCard 
                  key={item.id} 
                  item={item} 
                  delay={index * 0.1}
                />
              ))
            ) : (
              <div className="no-results">
                <p>Не найдено позиций по вашему запросу</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default MenuSection;