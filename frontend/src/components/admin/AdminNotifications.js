import React from 'react';
import { Bell } from 'lucide-react';

const AdminNotifications = () => {
  return (
    <div className="tab-content">
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <Bell size={64} style={{ color: 'var(--bamboo-green)', marginBottom: '1rem' }} />
        <h3>Система сповіщень</h3>
        <p>Управління push-сповіщеннями та алертами</p>
        <p style={{ marginTop: '2rem', color: 'var(--text-secondary)' }}>Функція в розробці</p>
      </div>
    </div>
  );
};

export default AdminNotifications;