import React from 'react';
import { Package, Star, TrendingUp, Users } from 'lucide-react';
import './StatsOverview.css';

const StatsOverview = () => {
  const stats = [
    {
      title: 'Всего позиций',
      value: '24',
      change: '+3',
      changeType: 'positive',
      icon: Package
    },
    {
      title: 'Популярные',
      value: '8',
      change: '+2',
      changeType: 'positive', 
      icon: Star
    },
    {
      title: 'Новинки',
      value: '5',
      change: '+1',
      changeType: 'positive',
      icon: TrendingUp
    },
    {
      title: 'Посетители',
      value: '142',
      change: '+12',
      changeType: 'positive',
      icon: Users
    }
  ];

  const recentActions = [
    { action: 'Добавлена новая позиция', item: 'Кальян Мятный Бриз', time: '2 часа назад' },
    { action: 'Обновлена цена', item: 'Мохито Классик', time: '4 часа назад' },
    { action: 'Помечено как хит', item: 'Бургер BBQ Бекон', time: '6 часов назад' },
    { action: 'Загружено фото', item: 'Куриные Крылья Острые', time: '8 часов назад' }
  ];

  return (
    <div className="stats-overview">
      <div className="overview-header">
        <h2>Обзор</h2>
        <p>Статистика вашего меню</p>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className="stat-card">
              <div className="stat-icon">
                <IconComponent size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-title">{stat.title}</div>
                <div className={`stat-change ${stat.changeType}`}>
                  {stat.change} за неделю
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="recent-activity">
        <h3>Недавняя активность</h3>
        <div className="activity-list">
          {recentActions.map((action, index) => (
            <div key={index} className="activity-item">
              <div className="activity-content">
                <div className="activity-action">{action.action}</div>
                <div className="activity-item-name">{action.item}</div>
              </div>
              <div className="activity-time">{action.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsOverview;