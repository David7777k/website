import React from 'react';
import { Settings, Shield } from 'lucide-react';

const AdminSettings = ({ section }) => {
  const isSecuritySection = section === 'security';
  
  return (
    <div className="tab-content">
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        {isSecuritySection ? (
          <Shield size={64} style={{ color: 'var(--bamboo-green)', marginBottom: '1rem' }} />
        ) : (
          <Settings size={64} style={{ color: 'var(--bamboo-green)', marginBottom: '1rem' }} />
        )}
        <h3>{isSecuritySection ? 'Налаштування безпеки' : 'Загальні налаштування'}</h3>
        <p>{isSecuritySection ? 'RBAC, двофакторна аутентифікація, логи' : 'Конфігурація системи та персоналізація'}</p>
        <p style={{ marginTop: '2rem', color: 'var(--text-secondary)' }}>Функція в розробці</p>
      </div>
    </div>
  );
};

export default AdminSettings;