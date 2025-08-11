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

  const refreshToken = useCallback(async () => {
    try {
      console.log('Refreshing access token...');
      const response = await fetch(`${BACKEND_URL}/refresh_token`, {
        credentials: 'include',
      });

      if (response.ok) {
        // Token refreshed successfully
        console.log('Token refreshed successfully');
        return true;
      } else {
        // Token refresh failed, user needs to login again
        console.log('Token refresh failed, redirecting to login');
        setAuthState({
          isAuthenticated: false,
          user: null,
          isLoading: false,
          error: 'Session expired. Please login again.',
        });
        // Redirect to login page
        window.location.href = '/login';
        return false;
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      setAuthState(prev => ({ ...prev, error: 'Failed to refresh token' }));
      // Redirect to login page on error
      window.location.href = '/login';
      return false;
    }
  }, []);

  const checkTokenStatus = useCallback(async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/token-status`, {
        credentials: 'include',
      });
      
      if (response.ok) {
        const status = await response.json();
        if (status.needsRefresh && status.valid) {
          console.log('Token needs refresh, refreshing proactively...');
          await refreshToken();
        }
      }
    } catch (error) {
      console.error('Error checking token status:', error);
    }
  }, [refreshToken]);

  const checkAuthStatus = useCallback(async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // First check token status
      const tokenResponse = await fetch(`${BACKEND_URL}/token-status`, {
        credentials: 'include',
      });
      
      if (tokenResponse.ok) {
        const tokenStatus = await tokenResponse.json();
        
        if (tokenStatus.needsRefresh && tokenStatus.valid) {
          // Token is valid but needs refresh, refresh it first
          console.log('Token needs refresh, refreshing before profile check...');
          const refreshSuccess = await refreshToken();
          if (refreshSuccess) {
            // Token refreshed successfully, check auth status again
            await checkAuthStatus();
          }
          return; // checkAuthStatus will be called again after refresh
        }
        
        if (!tokenStatus.valid) {
          // Token is expired, try to refresh
          console.log('Token expired, attempting refresh...');
          const refreshSuccess = await refreshToken();
          if (refreshSuccess) {
            // Token refreshed successfully, check auth status again
            await checkAuthStatus();
          }
          return;
        }
      }
      
      // Token is valid, proceed with profile check
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
      } else if (response.status === 401) {
        // Token expired or invalid, try to refresh
        console.log('Token expired, attempting refresh...');
        const refreshSuccess = await refreshToken();
        if (refreshSuccess) {
          // Token refreshed successfully, check auth status again
          await checkAuthStatus();
        }
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
  }, [refreshToken]);

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
    
    // Set up proactive token refresh every 5 minutes
    const interval = setInterval(() => {
      checkTokenStatus();
    }, 5 * 60 * 1000); // Check every 5 minutes
    
    return () => clearInterval(interval);
  }, [checkAuthStatus, checkTokenStatus]);

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
