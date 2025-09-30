import React from 'react';
import { TrendingUp, BarChart3, Users, DollarSign } from 'lucide-react';

const AdminAnalytics = () => {
  return (
    <div className="tab-content">
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <TrendingUp size={64} style={{ color: 'var(--bamboo-green)', marginBottom: '1rem' }} />
        <h3>Розширена аналітика</h3>
        <p>Детальні звіти та метрики продуктивності</p>
        <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ background: 'var(--gradient-card)', padding: '1rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
            <BarChart3 size={24} style={{ color: 'var(--bamboo-green)' }} />
            <p>Відвідуваність: +12%</p>
          </div>
          <div style={{ background: 'var(--gradient-card)', padding: '1rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
            <Users size={24} style={{ color: 'var(--bamboo-green)' }} />
            <p>Нові користувачі: 45</p>
          </div>
          <div style={{ background: 'var(--gradient-card)', padding: '1rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
            <DollarSign size={24} style={{ color: 'var(--bamboo-green)' }} />
            <p>Дохід: ₴25,400</p>
          </div>
        </div>
        <p style={{ marginTop: '2rem', color: 'var(--text-secondary)' }}>Функція в розробці</p>
      </div>
    </div>
  );
};

export default AdminAnalytics;