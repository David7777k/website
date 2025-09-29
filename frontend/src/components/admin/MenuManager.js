import React, { useState } from 'react';
import { Plus, Search, Filter, Edit3, Trash2, Star, Sparkles, Flame } from 'lucide-react';
import MenuItemForm from './MenuItemForm';
import { mockMenuItems, getMockMenuItems } from '../../data/mockData';
import './MenuManager.css';
import { useTranslation } from 'react-i18next';

const MenuManager = () => {
  const { t, i18n } = useTranslation();

  // Initialize with localized strings so components render text, not objects
  const [menuItems, setMenuItems] = useState(() => getMockMenuItems(i18n.language || 'ru'));  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
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
    return val;  };

  const filteredItems = menuItems.filter(item => {
    const categoryMatch = selectedCategory === 'all' || item.category === selectedCategory;
    const searchMatch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && searchMatch;
  });

  // keep menuItems localized when language changes
  React.useEffect(() => {
    setMenuItems(getMockMenuItems(i18n.language || 'ru'));
  }, [i18n.language]);
  const handleAddItem = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDeleteItem = (itemId) => {
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
  const handleSaveItem = (itemData) => {
    if (editingItem) {
      // Р РµРґР°РєС‚РёСЂРѕРІР°РЅРёРµ СЃСѓС‰РµСЃС‚РІСѓСЋС‰РµР№ РїРѕР·РёС†РёРё
      setMenuItems(prev => 
        prev.map(item => 
          item.id === editingItem.id 
            ? { ...itemData, id: editingItem.id }
            : item
        )
      );
    } else {
      // Р”РѕР±Р°РІР»РµРЅРёРµ РЅРѕРІРѕР№ РїРѕР·РёС†РёРё
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
          <h2>{t('manage_menu')}</h2>
          <div className="manager-actions">
            <button onClick={handleAddItem} className="btn btn-primary">
            <Plus size={20} />
              {t('add_item')}
          </button>
              <button className="btn" onClick={bulkDelete} disabled={selectedIds.length===0}>{t('delete_selected')}</button>
              <button className="btn" onClick={exportSelectedCsv} disabled={selectedIds.length===0}>{t('export_csv')}</button>
              <button className="btn" onClick={exportSelectedJson} disabled={selectedIds.length===0}>{t('export_json')}</button>
          </div>        </div>
        
        <div className="manager-filters">
          <div className="search-container">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder={t('search_placeholder')}              value={searchQuery}
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
                  {getCategoryLabel(category)}                </option>
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
                    {badge === 'hit' && t('badge_hit')}
                    {badge === 'new' && t('badge_new')}
                    {badge === 'popular' && t('badge_popular')}                  </span>
                ))}
              </div>
            </div>
            
            <div className="item-content">
                <div className="item-header">                <h3 className="item-name">{item.name}</h3>
                <div className="item-price">{item.price} в‚ґ</div>
              </div>
              
              <p className="item-category">{getCategoryLabel(item.category)}</p>              <p className="item-description">{item.description}</p>
              
              <div className="item-status">
                <span className={`status-badge ${item.available ? 'available' : 'unavailable'}`}>
                  {item.available ? t('available') : t('unavailable')}                </span>
              </div>
              
              <div className="item-actions">
                <input type="checkbox" checked={selectedIds.includes(item.id)} onChange={() => toggleSelect(item.id)} />                <button 
                  onClick={() => handleEditItem(item)}
                  className="btn btn-secondary"
                >
                  <Edit3 size={16} />
                  {t('edit')}                </button>
                <button 
                  onClick={() => handleDeleteItem(item.id)}
                  className="btn btn-danger"
                >
                  <Trash2 size={16} />
                  {t('delete')}                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="no-items">
          <p>{t('no_items_found')}</p>        </div>
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
