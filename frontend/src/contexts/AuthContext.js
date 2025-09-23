import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
const API = `${BACKEND_URL.replace(/\/$/, '')}/api`;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app load
    const token = localStorage.getItem('adminToken');
    const storedUser = JSON.parse(localStorage.getItem('user')) || null;
    if (token) {
      verifyToken(token);
    } else if (storedUser) {
      setUser(storedUser);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async (token) => {
    try {
      const response = await axios.get(`${API}/admin/verify`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Backend may return different shapes: { username, role } or a user object.
      const data = response?.data || {};
      const resolvedUser = data.user || {
        id: data.id || data.username || data._id || null,
        username: data.username || (data.user && data.user.username) || null,
        name: data.name || (data.user && data.user.name) || data.username || null,
        role: data.role || (data.user && data.user.role) || 'user'
      };

      if (resolvedUser && resolvedUser.username) {
        setUser(resolvedUser);
        localStorage.setItem('user', JSON.stringify(resolvedUser));
        // Ensure token stored
        localStorage.setItem('adminToken', token);
      } else {
        // Unexpected response — clear token
        localStorage.removeItem('adminToken');
        setUser(null);
      }
    } catch (error) {
      localStorage.removeItem('adminToken');
      // keep stored guest if exists
      const storedUser = JSON.parse(localStorage.getItem('user')) || null;
      if (storedUser && storedUser.role === 'guest') setUser(storedUser);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const response = await axios.post(`${API}/admin/login`, {
        username,
        password
      });
      // Backend returns { access_token, user } according to server implementation
      const data = response?.data || {};
      const token = data.access_token || data.token || data.accessToken || null;
      const user = data.user || data;

      if (token) {
        localStorage.setItem('adminToken', token);
      }

      // Normalize user object
      const resolvedUser = user && user.username ? user : {
        id: user && (user.id || user._id) ? (user.id || user._id) : user.username,
        username: user && user.username ? user.username : username,
        name: user && user.name ? user.name : user && user.username ? user.username : username,
        role: user && user.role ? user.role : 'admin'
      };

      setUser(resolvedUser);
      localStorage.setItem('user', JSON.stringify(resolvedUser));
      return { success: true };
    } catch (error) {
      // If backend not available, allow a demo admin for local testing
      const isNetworkError = !error.response;
      if (isNetworkError && username === 'admin' && password === 'admin123') {
        const demoUser = { id: 'admin-demo', username: 'admin', name: 'Admin', role: 'admin' };
        setUser(demoUser);
        localStorage.setItem('user', JSON.stringify(demoUser));
        return { success: true };
      }
      return {
        success: false,
        error: error.response?.data?.detail || 'Помилка входу'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  // Allow setting a guest user for testing without auth
  const setGuest = () => {
    const guest = { id: 'guest', name: 'Гість', role: 'guest' };
    localStorage.setItem('user', JSON.stringify(guest));
    setUser(guest);
  };

  const isAdmin = () => user && (user.role === 'admin' || user.role === 'superadmin');

  // Client-side Google sign-in helper (uses Google Identity Services token)
  const signInWithGoogle = async (idToken) => {
    // If you have a backend endpoint, exchange idToken there. Here we store basic info client-side.
    try {
      // Decode basic info from idToken if desired, or call backend. For now, store a simple user object.
      const googleUser = { id: 'google', name: 'Google User', role: 'user' };
      localStorage.setItem('user', JSON.stringify(googleUser));
      setUser(googleUser);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const value = {
    user,
    login,
    logout,
    setGuest,
    signInWithGoogle,
    isAdmin,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};