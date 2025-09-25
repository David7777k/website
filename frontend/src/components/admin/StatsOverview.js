import React from 'react';
import { Package, Star, TrendingUp, Users } from 'lucide-react';
import './StatsOverview.css';

const StatsOverview = () => {
  const stats = [
    {
      title: 'Р’СЃРµРіРѕ РїРѕР·РёС†РёР№',      value: '24',
      change: '+3',
      changeType: 'positive',
      icon: Package
    },
    {
      title: 'РџРѕРїСѓР»СЏСЂРЅС‹Рµ',      value: '8',
      change: '+2',
      changeType: 'positive', 
      icon: Star
    },
    {
      title: 'РќРѕРІРёРЅРєРё',
      value: '5',
      change: '+1',
      changeType: 'positive',
      icon: TrendingUp
    },
    {
      title: 'РџРѕСЃРµС‚РёС‚РµР»Рё',      value: '142',
      change: '+12',
      changeType: 'positive',
      icon: Users
    }
  ];

  const recentActions = [
    { action: 'Р”РѕРґР°РЅРѕ РЅРѕРІСѓ РїРѕР·РёС†С–СЋ', item: 'Panda Premium', time: '2 РіРѕРґРёРЅРё С‚РѕРјСѓ' },
    { action: 'РћРЅРѕРІР»РµРЅРѕ С†С–РЅСѓ', item: 'РњРѕС…С–С‚Рѕ РљР»Р°СЃРёС‡РЅРёР№', time: '4 РіРѕРґРёРЅРё С‚РѕРјСѓ' },
    { action: 'РџРѕР·РЅР°С‡РµРЅРѕ СЏРє С…С–С‚', item: 'Р‘СѓСЂРіРµСЂ BBQ Р‘РµРєРѕРЅ', time: '6 РіРѕРґРёРЅ С‚РѕРјСѓ' },
    { action: 'Р—Р°РІР°РЅС‚Р°Р¶РµРЅРѕ С„РѕС‚Рѕ', item: 'РљСѓСЂСЏС‡С– РљСЂРёР»С†СЏ Р“РѕСЃС‚СЂС–', time: '8 РіРѕРґРёРЅ С‚РѕРјСѓ' }
  ];

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
          <h2>РћРіР»СЏРґ</h2>
        <p>РЎС‚Р°С‚РёСЃС‚РёРєР° РІР°С€РѕРіРѕ РјРµРЅСЋ</p>
        <div className="overview-actions">
          <button className="btn" onClick={exportCsv}>Р•РєСЃРїРѕСЂС‚СѓРІР°С‚Рё СЃС‚Р°С‚РёСЃС‚РёРєСѓ (CSV)</button>
        </div>      </div>

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
                  {stat.change} Р·Р° РЅРµРґРµР»СЋ
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="recent-activity">
        <h3>РќРµС‰РѕРґР°РІРЅСЏ Р°РєС‚РёРІРЅС–СЃС‚СЊ</h3>
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
