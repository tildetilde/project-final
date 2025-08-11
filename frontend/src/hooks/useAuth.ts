import { useState, useEffect, useCallback } from 'react';

interface User {
  id: string;
  display_name: string;
  email: string;
  images?: Array<{ url: string }>;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

import { config } from '../config/environment';

const BACKEND_URL = config.backendUrl;

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
    error: null,
  });

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = useCallback(async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await fetch(`${BACKEND_URL}/user-profile`, {
        credentials: 'include',
      });

      if (response.ok) {
        const user = await response.json();
        setAuthState({
          isAuthenticated: true,
          user,
          isLoading: false,
          error: null,
        });
      } else {
        setAuthState({
          isAuthenticated: false,
          user: null,
          isLoading: false,
          error: null,
        });
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: 'Failed to check authentication status',
      });
    }
  }, []);

  const login = useCallback(() => {
    // Redirect to backend login endpoint
    window.location.href = `${BACKEND_URL}/login`;
  }, []);

  const logout = useCallback(async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/logout`, {
        credentials: 'include',
      });

      if (response.ok) {
        setAuthState({
          isAuthenticated: false,
          user: null,
          isLoading: false,
          error: null,
        });
      }
    } catch (error) {
      console.error('Error during logout:', error);
      setAuthState(prev => ({ ...prev, error: 'Failed to logout' }));
    }
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/refresh_token`, {
        credentials: 'include',
      });

      if (response.ok) {
        // Token refreshed successfully, check auth status again
        await checkAuthStatus();
      } else {
        // Token refresh failed, user needs to login again
        setAuthState({
          isAuthenticated: false,
          user: null,
          isLoading: false,
          error: 'Session expired. Please login again.',
        });
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      setAuthState(prev => ({ ...prev, error: 'Failed to refresh token' }));
    }
  }, [checkAuthStatus]);

  // Handle OAuth callback
  const handleOAuthCallback = useCallback(async () => {
    // Check if we're returning from OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    
    if (error) {
      setAuthState(prev => ({ ...prev, error }));
      return;
    }

    // Check auth status after OAuth callback
    await checkAuthStatus();
  }, [checkAuthStatus]);

  // Listen for OAuth callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('error') || window.location.pathname === '/dashboard') {
      handleOAuthCallback();
    }
  }, [handleOAuthCallback]);

  return {
    ...authState,
    login,
    logout,
    refreshToken,
    checkAuthStatus,
  };
};
