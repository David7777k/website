import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import GoogleAuthButton from '../components/GoogleAuthButton';
import { Lock, User, Eye, EyeOff } from 'lucide-react';
import './AdminLogin.css';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { user, login, setGuest, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  // Якщо користувач вже авторизований і не гість — перенаправляємо в адмінку
  if (user && user.role !== 'guest') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    if (!username || !password) {
      setError('Введіть ім\'я користувача та пароль');
      setIsLoading(false);
      return;
    }

    try {
      const result = await login(username.trim(), password);
      if (!result.success) {
        setError(result.error || 'Неправильне ім\'я користувача або пароль');
      }
    } catch (err) {
      setError(err?.message || 'Помилка при вході');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="login-icon">
              <Lock size={32} />
            </div>
            <h2>Адмін-панель</h2>
            <p>Введіть дані для входу</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <div className="input-group">
                <User className="input-icon" size={20} />
                <input
                  type="text"
                  placeholder="Ім'я користувача"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <div className="input-group">
                <Lock className="input-icon" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="form-input"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary login-btn"
              disabled={isLoading}
              aria-busy={isLoading}
            >
              {isLoading ? <div className="loading-spinner"></div> : 'Увійти'}
            </button>
          </form>

          <div className="login-extras">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                // quick guest mode for testing — set guest and navigate to home
                setGuest();
                navigate('/');
              }}
            >
              Продовжити як гість
            </button>

            <div className="google-signin-note">
              <p>Або увійдіть через Google:</p>
              {/* The real Google button will be implemented separately; placeholder for now */}
              <GoogleAuthButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;