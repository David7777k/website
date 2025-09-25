import React from 'react';
import { Package, Star, TrendingUp, Users } from 'lucide-react';
import './StatsOverview.css';

const StatsOverview = () => {
  const stats = [
    {
<<<<<<< HEAD
      title: 'Всего позиций',
=======
      title: 'Усього позицій',
>>>>>>> 5c8c9a3fc7653b7c9a1ca2ab213073fd9c16ab34
      value: '24',
      change: '+3',
      changeType: 'positive',
      icon: Package
    },
    {
<<<<<<< HEAD
      title: 'Популярные',
=======
      title: 'Популярні',
>>>>>>> 5c8c9a3fc7653b7c9a1ca2ab213073fd9c16ab34
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
<<<<<<< HEAD
      title: 'Посетители',
=======
      title: 'Відвідувачі',
>>>>>>> 5c8c9a3fc7653b7c9a1ca2ab213073fd9c16ab34
      value: '142',
      change: '+12',
      changeType: 'positive',
      icon: Users
    }
  ];

  const recentActions = [
    { action: 'Додано нову позицію', item: 'Panda Premium', time: '2 години тому' },
    { action: 'Оновлено ціну', item: 'Мохіто Класичний', time: '4 години тому' },
    { action: 'Позначено як хіт', item: 'Бургер BBQ Бекон', time: '6 годин тому' },
    { action: 'Завантажено фото', item: 'Курячі Крилця Гострі', time: '8 годин тому' }
  ];

<<<<<<< HEAD
  const exportCsv = () => {
    const rows = [];
    rows.push(['Type','Title','Value','Change']);
    stats.forEach(s => rows.push(['stat', s.title, s.value, s.change]));
    rows.push([]);
    rows.push(['RecentAction','Action','Item','Time']);
    recentActions.forEach(a => rows.push(['recent', a.action, a.item, a.time]));

    const csvContent = rows.map(r => r.map(cell => `"${String(cell).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `stats_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="stats-overview">
      <div className="overview-header">
          <h2>Огляд</h2>
        <p>Статистика вашого меню</p>
        <div className="overview-actions">
          <button className="btn" onClick={exportCsv}>Експортувати статистику (CSV)</button>
        </div>
=======
  return (
    <div className="stats-overview">
      <div className="overview-header">
  <h2>Огляд</h2>
  <p>Статистика вашого меню</p>
>>>>>>> 5c8c9a3fc7653b7c9a1ca2ab213073fd9c16ab34
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
        <h3>Нещодавня активність</h3>
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