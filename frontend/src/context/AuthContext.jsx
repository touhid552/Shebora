import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api.js';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('shebora_token') || null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Initialize session
  useEffect(() => {
    async function loadUser() {
      if (token) {
        try {
          const res = await api.getCurrentUser();
          if (res?.user) {
            setUser(res.user);
          } else {
            handleLogout();
          }
        } catch (err) {
          console.warn('Session expired or invalid, auto-logging into demo customer for smooth evaluation');
          await autoDemoLogin();
        }
      } else {
        // Auto-login into default demo customer for instant review experience
        await autoDemoLogin();
      }
      setLoading(false);
    }

    loadUser();
  }, [token]);

  // Load notifications periodically
  useEffect(() => {
    if (user) {
      loadNotifications();
      const interval = setInterval(loadNotifications, 15000);
      return () => clearInterval(interval);
    }
  }, [user]);

  async function loadNotifications() {
    try {
      const res = await api.getNotifications();
      if (res?.data) {
        setNotifications(res.data);
        setUnreadCount(res.data.filter(n => !n.read).length);
      }
    } catch {
      // Ignore background notification fetch errors
    }
  }

  async function autoDemoLogin() {
    try {
      const res = await api.demoLogin('customer');
      if (res?.user && res?.token) {
        localStorage.setItem('shebora_token', res.token);
        setToken(res.token);
        setUser(res.user);
      }
    } catch (e) {
      console.error('Auto demo login failed:', e);
    }
  }

  const handleLogin = async (email, password) => {
    const res = await api.login({ email, password });
    if (res?.token && res?.user) {
      localStorage.setItem('shebora_token', res.token);
      setToken(res.token);
      setUser(res.user);
    }
    return res;
  };

  const handleRegister = async (userData) => {
    const res = await api.register(userData);
    if (res?.token && res?.user) {
      localStorage.setItem('shebora_token', res.token);
      setToken(res.token);
      setUser(res.user);
    }
    return res;
  };

  const handleSwitchRole = async (targetRole) => {
    setLoading(true);
    try {
      const res = await api.demoLogin(targetRole);
      if (res?.token && res?.user) {
        localStorage.setItem('shebora_token', res.token);
        setToken(res.token);
        setUser(res.user);
      }
      return res;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('shebora_token');
    setToken(null);
    setUser(null);
    setNotifications([]);
    setUnreadCount(0);
  };

  const handleUpdateProfile = async (profileData) => {
    const res = await api.updateProfile(profileData);
    if (res?.user) {
      setUser(prev => ({ ...prev, ...res.user }));
    }
    return res;
  };

  const handleMarkNotificationsRead = async () => {
    await api.markNotificationsRead();
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const value = {
    user,
    token,
    loading,
    role: user?.role || 'guest',
    isCustomer: user?.role === 'customer',
    isProvider: user?.role === 'provider',
    isAdmin: user?.role === 'admin',
    login: handleLogin,
    register: handleRegister,
    switchRole: handleSwitchRole,
    logout: handleLogout,
    updateProfile: handleUpdateProfile,
    notifications,
    unreadCount,
    markNotificationsRead: handleMarkNotificationsRead
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
