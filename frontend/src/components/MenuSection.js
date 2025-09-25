import React from 'react';
<<<<<<< HEAD
import { useTranslation } from 'react-i18next';
=======
>>>>>>> 5c8c9a3fc7653b7c9a1ca2ab213073fd9c16ab34
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
<<<<<<< HEAD
  const { i18n } = useTranslation();

  const getCategoryLabel = (category) => {
    const value = categoryNames[category] || category;
    if (typeof value === 'object') {
      return value[i18n.language] || value.ru || category;
    }
    return value;
  };

=======
>>>>>>> 5c8c9a3fc7653b7c9a1ca2ab213073fd9c16ab34
  return (
    <section id="menu" className="menu-section">
      <div className="container">
        <div className="menu-header">
          <h2 className="section-title slide-up">Наше меню</h2>
          <p className="section-subtitle slide-up">
<<<<<<< HEAD
            Лучшие коктейли, ароматные кальяны и вкусная еда
=======
            Найкращі коктейлі, ароматні кальяни та смачна їжа
>>>>>>> 5c8c9a3fc7653b7c9a1ca2ab213073fd9c16ab34
          </p>
        </div>

        <div className="menu-controls slide-up">
          <div className="search-container">
            <Search size={20} className="search-icon" />
            <input
              type="text"
<<<<<<< HEAD
              placeholder="Поиск по меню..."
=======
              placeholder="Пошук у меню..."
>>>>>>> 5c8c9a3fc7653b7c9a1ca2ab213073fd9c16ab34
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
<<<<<<< HEAD
                  {getCategoryLabel(category)}
=======
                {categoryNames[category] || category}
>>>>>>> 5c8c9a3fc7653b7c9a1ca2ab213073fd9c16ab34
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
<<<<<<< HEAD
                <p>Не найдено позиций по вашему запросу</p>
=======
                <p>Не знайдено позицій за вашим запитом</p>
>>>>>>> 5c8c9a3fc7653b7c9a1ca2ab213073fd9c16ab34
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default MenuSection;