import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Edit, Trash2, Users, Clock, MapPin } from 'lucide-react';
import './EventManager.css';

const EventManager = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock data
    setTimeout(() => {
      setEvents([
        {
          id: 1,
          title: 'Halloween Party 2024',
          description: 'Грандіозна Halloween вечірка з конкурсами',
          date: '2024-10-31T20:00:00Z',
          endDate: '2024-11-01T02:00:00Z',
          location: 'Основний зал',
          price: 500,
          maxAttendees: 100,
          currentAttendees: 67,
          status: 'active',
          category: 'party',
          image: null
        },
        {
          id: 2,
          title: 'Вечір живої музики',
          description: 'Виступ місцевих музикантів',
          date: '2024-11-15T19:00:00Z',
          endDate: '2024-11-15T23:00:00Z',
          location: 'Сцена',
          price: 300,
          maxAttendees: 50,
          currentAttendees: 23,
          status: 'active',
          category: 'music',
          image: null
        }
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const getStatusBadge = (status) => {
    const badges = {
      active: { text: 'Активний', class: 'status-active' },
      draft: { text: 'Чернетка', class: 'status-draft' },
      cancelled: { text: 'Скасований', class: 'status-cancelled' }
    };
    return badges[status] || badges.active;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('uk-UA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="event-manager">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Завантаження подій...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="event-manager">
      <div className="manager-header">
        <div className="header-info">
          <h2>Управління подіями</h2>
          <p>Всього подій: {events.length}</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={16} />
          Створити подію
        </button>
      </div>

      <div className="events-grid">
        {events.map(event => {
          const statusBadge = getStatusBadge(event.status);
          const attendancePercent = (event.currentAttendees / event.maxAttendees) * 100;
          
          return (
            <div key={event.id} className="event-card">
              <div className="event-header">
                <div className="event-category">{event.category}</div>
                <span className={`status-badge ${statusBadge.class}`}>
                  {statusBadge.text}
                </span>
              </div>
              
              <div className="event-content">
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                
                <div className="event-details">
                  <div className="detail-item">
                    <Calendar size={16} />
                    {formatDate(event.date)}
                  </div>
                  <div className="detail-item">
                    <MapPin size={16} />
                    {event.location}
                  </div>
                  <div className="detail-item">
                    <Users size={16} />
                    {event.currentAttendees}/{event.maxAttendees}
                  </div>
                </div>
                
                <div className="attendance-progress">
                  <div className="progress-info">
                    <span>Заповненість</span>
                    <span>{Math.round(attendancePercent)}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${attendancePercent}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="event-actions">
                <button className="btn btn-secondary">
                  <Edit size={16} />
                  Редагувати
                </button>
                <button className="btn btn-danger">
                  <Trash2 size={16} />
                  Видалити
                </button>
              </div>
            </div>
          );
        })}
      </div>
      
      {events.length === 0 && (
        <div className="empty-state">
          <Calendar size={48} />
          <h3>Подій немає</h3>
          <p>Створіть першу подію для залу</p>
        </div>
      )}
    </div>
  );
};

export default EventManager;