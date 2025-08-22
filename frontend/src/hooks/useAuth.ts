import { useState, useEffect } from 'react';
import { config } from '../config/environment';
import { Admin } from '../types/admin';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('adminToken'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (token) {
      checkAuth();
    }
  }, [token]);

  const checkAuth = async () => {
    try {
      const response = await fetch(`${config.backendUrl}/api/admin/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setAdmin(data.data.admin);
          setIsAuthenticated(true);
        } else {
          logout();
        }
      } else {
        logout();
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      logout();
    }
  };

  const login = async (username: string, password: string) => {
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${config.backendUrl}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok && data.success && data.data) {
        localStorage.setItem('adminToken', data.data.token);
        setToken(data.data.token);
        setAdmin(data.data.admin);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        const errorMessage = data.error?.message || data.message || 'Login failed';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      setError('Network error occurred');
      return { success: false, error: 'Network error occurred' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await fetch(`${config.backendUrl}/api/admin/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('adminToken');
      setToken(null);
      setAdmin(null);
      setIsAuthenticated(false);
    }
  };

  const clearError = () => setError('');

  return {
    isAuthenticated,
    admin,
    token,
    loading,
    error,
    login,
    logout,
    clearError
  };
};
