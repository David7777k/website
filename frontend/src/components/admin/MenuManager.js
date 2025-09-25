import React, { useState } from 'react';
import { Plus, Search, Filter, Edit3, Trash2, Star, Sparkles, Flame } from 'lucide-react';
import MenuItemForm from './MenuItemForm';
<<<<<<< HEAD
import { mockMenuItems, getMockMenuItems } from '../../data/mockData';
import './MenuManager.css';
import { useTranslation } from 'react-i18next';

const MenuManager = () => {
  const { t, i18n } = useTranslation();

  // Initialize with localized strings so components render text, not objects
  const [menuItems, setMenuItems] = useState(() => getMockMenuItems(i18n.language || 'ru'));
=======
import { mockMenuItems } from '../../data/mockData';
import './MenuManager.css';

const MenuManager = () => {
  const [menuItems, setMenuItems] = useState(mockMenuItems);
>>>>>>> 5c8c9a3fc7653b7c9a1ca2ab213073fd9c16ab34
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
<<<<<<< HEAD
  const [selectedIds, setSelectedIds] = useState([]);

  const categories = ['all', 'cocktails', 'hookah', 'food', 'desserts'];

  const categoryNames = {
    all: t('category_all'),
    cocktails: t('category_cocktails'),
    hookah: t('category_hookah'),
    food: t('category_food'),
    desserts: t('category_desserts')
  };

  const getCategoryLabel = (key) => {
    const val = categoryNames[key] || key;
    // categoryNames here are strings from t(), so just return
    return val;
=======

  const categories = ['all', 'cocktails', 'hookah', 'food', 'desserts'];
  const categoryNames = {
    all: 'Все категории',
    cocktails: 'Коктейли',
    hookah: 'Кальяны',
    food: 'Еда',
    desserts: 'Десерты'
>>>>>>> 5c8c9a3fc7653b7c9a1ca2ab213073fd9c16ab34
  };

  const filteredItems = menuItems.filter(item => {
    const categoryMatch = selectedCategory === 'all' || item.category === selectedCategory;
    const searchMatch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && searchMatch;
  });

<<<<<<< HEAD
  // keep menuItems localized when language changes
  React.useEffect(() => {
    setMenuItems(getMockMenuItems(i18n.language || 'ru'));
  }, [i18n.language]);

=======
>>>>>>> 5c8c9a3fc7653b7c9a1ca2ab213073fd9c16ab34
  const handleAddItem = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDeleteItem = (itemId) => {
<<<<<<< HEAD
    if (window.confirm(t('confirm_delete_item'))) {
      setMenuItems(prev => prev.filter(item => item.id !== itemId));
      setSelectedIds(prev => prev.filter(id => id !== itemId));
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const bulkDelete = () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(t('confirm_delete_selected'))) {
      setMenuItems(prev => prev.filter(item => !selectedIds.includes(item.id)));
      setSelectedIds([]);
    }
  };

  const exportSelectedCsv = () => {
    const rows = [['id','name','price','category','available']];
    menuItems.filter(i => selectedIds.includes(i.id)).forEach(i => {
      rows.push([i.id, i.name, i.price, i.category, i.available]);
    });
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `menu_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const exportSelectedJson = () => {
    const data = menuItems.filter(i => selectedIds.includes(i.id));
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `menu_export_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

=======
    if (window.confirm('Вы уверены, что хотите удалить эту позицию?')) {
      setMenuItems(prev => prev.filter(item => item.id !== itemId));
    }
  };

>>>>>>> 5c8c9a3fc7653b7c9a1ca2ab213073fd9c16ab34
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
<<<<<<< HEAD
          <h2>{t('manage_menu')}</h2>
          <div className="manager-actions">
            <button onClick={handleAddItem} className="btn btn-primary">
            <Plus size={20} />
              {t('add_item')}
          </button>
              <button className="btn" onClick={bulkDelete} disabled={selectedIds.length===0}>{t('delete_selected')}</button>
              <button className="btn" onClick={exportSelectedCsv} disabled={selectedIds.length===0}>{t('export_csv')}</button>
              <button className="btn" onClick={exportSelectedJson} disabled={selectedIds.length===0}>{t('export_json')}</button>
          </div>
=======
          <h2>Управление меню</h2>
          <button onClick={handleAddItem} className="btn btn-primary">
            <Plus size={20} />
            Добавить позицию
          </button>
>>>>>>> 5c8c9a3fc7653b7c9a1ca2ab213073fd9c16ab34
        </div>
        
        <div className="manager-filters">
          <div className="search-container">
            <Search size={20} className="search-icon" />
            <input
              type="text"
<<<<<<< HEAD
              placeholder={t('search_placeholder')}
=======
              placeholder="Поиск по меню..."
>>>>>>> 5c8c9a3fc7653b7c9a1ca2ab213073fd9c16ab34
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
<<<<<<< HEAD
                  {getCategoryLabel(category)}
=======
                  {categoryNames[category]}
>>>>>>> 5c8c9a3fc7653b7c9a1ca2ab213073fd9c16ab34
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
<<<<<<< HEAD
                    {badge === 'hit' && t('badge_hit')}
                    {badge === 'new' && t('badge_new')}
                    {badge === 'popular' && t('badge_popular')}
=======
                    {badge === 'hit' && 'Хит'}
                    {badge === 'new' && 'Новинка'}
                    {badge === 'popular' && 'Популярное'}
>>>>>>> 5c8c9a3fc7653b7c9a1ca2ab213073fd9c16ab34
                  </span>
                ))}
              </div>
            </div>
            
            <div className="item-content">
<<<<<<< HEAD
                <div className="item-header">
=======
              <div className="item-header">
>>>>>>> 5c8c9a3fc7653b7c9a1ca2ab213073fd9c16ab34
                <h3 className="item-name">{item.name}</h3>
                <div className="item-price">{item.price} ₴</div>
              </div>
              
<<<<<<< HEAD
              <p className="item-category">{getCategoryLabel(item.category)}</p>
=======
              <p className="item-category">{categoryNames[item.category]}</p>
>>>>>>> 5c8c9a3fc7653b7c9a1ca2ab213073fd9c16ab34
              <p className="item-description">{item.description}</p>
              
              <div className="item-status">
                <span className={`status-badge ${item.available ? 'available' : 'unavailable'}`}>
<<<<<<< HEAD
                  {item.available ? t('available') : t('unavailable')}
=======
                  {item.available ? 'Доступно' : 'Недоступно'}
>>>>>>> 5c8c9a3fc7653b7c9a1ca2ab213073fd9c16ab34
                </span>
              </div>
              
              <div className="item-actions">
<<<<<<< HEAD
                <input type="checkbox" checked={selectedIds.includes(item.id)} onChange={() => toggleSelect(item.id)} />
=======
>>>>>>> 5c8c9a3fc7653b7c9a1ca2ab213073fd9c16ab34
                <button 
                  onClick={() => handleEditItem(item)}
                  className="btn btn-secondary"
                >
                  <Edit3 size={16} />
<<<<<<< HEAD
                  {t('edit')}
=======
                  Редактировать
>>>>>>> 5c8c9a3fc7653b7c9a1ca2ab213073fd9c16ab34
                </button>
                <button 
                  onClick={() => handleDeleteItem(item.id)}
                  className="btn btn-danger"
                >
                  <Trash2 size={16} />
<<<<<<< HEAD
                  {t('delete')}
=======
                  Удалить
>>>>>>> 5c8c9a3fc7653b7c9a1ca2ab213073fd9c16ab34
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="no-items">
<<<<<<< HEAD
          <p>{t('no_items_found')}</p>
=======
          <p>Позиции не найдены</p>
>>>>>>> 5c8c9a3fc7653b7c9a1ca2ab213073fd9c16ab34
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