import React, { useState } from 'react';
import { X, Upload, Save } from 'lucide-react';
import './MenuItemForm.css';

const MenuItemForm = ({ item, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: item?.name || '',
    description: item?.description || '',
    price: item?.price || '',
    category: item?.category || 'cocktails',
    image: item?.image || '',
    badges: item?.badges || [],
    available: item?.available !== undefined ? item.available : true
  });

  const [imagePreview, setImagePreview] = useState(item?.image || '');

  const categories = [
    { value: 'cocktails', label: 'Коктейли' },
    { value: 'hookah', label: 'Кальяны' },
    { value: 'food', label: 'Еда' },
    { value: 'desserts', label: 'Десерты' }
  ];

  const badgeOptions = [
    { value: 'hit', label: 'Хит' },
    { value: 'new', label: 'Новинка' },
    { value: 'popular', label: 'Популярное' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target.result;
        setImagePreview(imageUrl);
        setFormData(prev => ({
          ...prev,
          image: imageUrl
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBadgeChange = (badge) => {
    setFormData(prev => ({
      ...prev,
      badges: prev.badges.includes(badge)
        ? prev.badges.filter(b => b !== badge)
        : [...prev.badges, badge]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      price: Number(formData.price)
    });
  };

  return (
    <div className="menu-item-form-overlay">
      <div className="menu-item-form">
        <div className="form-header">
          <h3>{item ? 'Редактировать позицию' : 'Добавить позицию'}</h3>
          <button onClick={onCancel} className="close-btn">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="form-content">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name">Название *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="form-input"
                placeholder="Введите название"
              />
            </div>

            <div className="form-group">
              <label htmlFor="price">Цена (₽) *</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                min="0"
                step="1"
                className="form-input"
                placeholder="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Категория *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="form-select"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="available"
                  checked={formData.available}
                  onChange={handleInputChange}
                  className="form-checkbox"
                />
                <span>Доступно для заказа</span>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Описание *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows="4"
              className="form-textarea"
              placeholder="Введите описание позиции"
            />
          </div>

          <div className="form-group">
            <label>Изображение</label>
            <div className="image-upload">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="file-input"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="upload-label">
                <Upload size={20} />
                <span>Загрузить изображение</span>
              </label>
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Превью" />
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Метки</label>
            <div className="badges-selection">
              {badgeOptions.map(badge => (
                <label key={badge.value} className="badge-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.badges.includes(badge.value)}
                    onChange={() => handleBadgeChange(badge.value)}
                  />
                  <span className={`badge-label badge-${badge.value}`}>
                    {badge.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="btn btn-secondary">
              Отмена
            </button>
            <button type="submit" className="btn btn-primary">
              <Save size={20} />
              {item ? 'Сохранить' : 'Добавить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MenuItemForm;