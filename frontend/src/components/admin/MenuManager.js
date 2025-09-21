import React, { useState } from 'react';
import { Plus, Search, Filter, Edit3, Trash2, Star, Sparkles, Flame } from 'lucide-react';
import MenuItemForm from './MenuItemForm';
import { mockMenuItems } from '../../data/mockData';
import './MenuManager.css';

const MenuManager = () => {
  const [menuItems, setMenuItems] = useState(mockMenuItems);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'cocktails', 'hookah', 'food', 'desserts'];
  const categoryNames = {
    all: 'Все категории',
    cocktails: 'Коктейли',
    hookah: 'Кальяны',
    food: 'Еда',
    desserts: 'Десерты'
  };

  const filteredItems = menuItems.filter(item => {
    const categoryMatch = selectedCategory === 'all' || item.category === selectedCategory;
    const searchMatch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && searchMatch;
  });

  const handleAddItem = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDeleteItem = (itemId) => {
    if (window.confirm('Вы уверены, что хотите удалить эту позицию?')) {
      setMenuItems(prev => prev.filter(item => item.id !== itemId));
    }
  };

  const handleSaveItem = (itemData) => {
    if (editingItem) {
      // Редактирование существующей позиции
      setMenuItems(prev => 
        prev.map(item => 
          item.id === editingItem.id 
            ? { ...itemData, id: editingItem.id }
            : item
        )
      );
    } else {
      // Добавление новой позиции
      const newItem = {
        ...itemData,
        id: Date.now().toString()
      };
      setMenuItems(prev => [...prev, newItem]);
    }
    setShowForm(false);
    setEditingItem(null);
  };

  const getBadgeIcon = (badge) => {
    switch (badge) {
      case 'hit':
        return <Star size={14} />;
      case 'new':
        return <Sparkles size={14} />;
      case 'popular':
        return <Flame size={14} />;
      default:
        return null;
    }
  };

  return (
    <div className="menu-manager">
      <div className="manager-header">
        <div className="header-content">
          <h2>Управление меню</h2>
          <button onClick={handleAddItem} className="btn btn-primary">
            <Plus size={20} />
            Добавить позицию
          </button>
        </div>
        
        <div className="manager-filters">
          <div className="search-container">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Поиск по меню..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="category-filter">
            <Filter size={20} className="filter-icon" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="category-select"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {categoryNames[category]}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="items-grid">
        {filteredItems.map(item => (
          <div key={item.id} className="menu-item-card">
            <div className="item-image-container">
              <img src={item.image} alt={item.name} className="item-image" />
              <div className="item-badges">
                {item.badges.map(badge => (
                  <span key={badge} className={`badge badge-${badge}`}>
                    {getBadgeIcon(badge)}
                    {badge === 'hit' && 'Хит'}
                    {badge === 'new' && 'Новинка'}
                    {badge === 'popular' && 'Популярное'}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="item-content">
              <div className="item-header">
                <h3 className="item-name">{item.name}</h3>
                <div className="item-price">{item.price} ₽</div>
              </div>
              
              <p className="item-category">{categoryNames[item.category]}</p>
              <p className="item-description">{item.description}</p>
              
              <div className="item-status">
                <span className={`status-badge ${item.available ? 'available' : 'unavailable'}`}>
                  {item.available ? 'Доступно' : 'Недоступно'}
                </span>
              </div>
              
              <div className="item-actions">
                <button 
                  onClick={() => handleEditItem(item)}
                  className="btn btn-secondary"
                >
                  <Edit3 size={16} />
                  Редактировать
                </button>
                <button 
                  onClick={() => handleDeleteItem(item.id)}
                  className="btn btn-danger"
                >
                  <Trash2 size={16} />
                  Удалить
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="no-items">
          <p>Позиции не найдены</p>
        </div>
      )}

      {showForm && (
        <MenuItemForm
          item={editingItem}
          onSave={handleSaveItem}
          onCancel={() => {
            setShowForm(false);
            setEditingItem(null);
          }}
        />
      )}
    </div>
  );
};

export default MenuManager;