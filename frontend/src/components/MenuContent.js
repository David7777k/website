import React from "react";
import MenuItem from "./MenuItem";
import "./MenuContent.css";

const MenuContent = ({ 
  categoryData, 
  searchQuery, 
  favorites, 
  onToggleFavorite 
}) => {
  const filteredItems = categoryData.items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <main className="menu-content">
      <div className="menu-header">
        <h2 className="category-title">{categoryData.title}</h2>
        {categoryData.subtitle && (
          <p className="category-subtitle">{categoryData.subtitle}</p>
        )}
      </div>
      
      <div className="menu-items">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <MenuItem
              key={item.id}
              item={item}
              isFavorite={favorites.has(item.id)}
              onToggleFavorite={onToggleFavorite}
            />
          ))
        ) : (
          <div className="no-results">
            <p>Немає результатів за вашим запитом</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default MenuContent;