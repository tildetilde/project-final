import { useState, useEffect, useCallback } from 'react';
import { config } from '../config/environment';

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

const BACKEND_URL = config.backendUrl;
const USE_MOCK = import.meta.env.VITE_USE_SPOTIFY_MOCK === '1';

export const useAuth = (autoCheck = true) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
    error: null,
  });

  // --- Helpers för mockläge ---
  const setMockAuthenticated = useCallback(() => {
    const mockUser: User = {
      id: 'dev',
      display_name: 'Mock User',
      email: 'mock@example.com',
      images: [{ url: 'https://placehold.co/64x64' }],
    };
    setAuthState({
      isAuthenticated: true,
      user: mockUser,
      isLoading: false,
      error: null,
    });
  }, []);

  const refreshToken = useCallback(async () => {
    if (USE_MOCK) {
      // Inget att refresha i mock – låtsas att allt gick bra
      return true;
    }
    try {
      console.log('Refreshing access token...');
      const response = await fetch(`${BACKEND_URL}/refresh_token`, {
        credentials: 'include',
      });

      if (response.ok) {
        console.log('Token refreshed successfully');
        return true;
      } else {
        console.log('Token refresh failed, redirecting to login');
        setAuthState({
          isAuthenticated: false,
          user: null,
          isLoading: false,
          error: 'Session expired. Please login again.',
        });
        window.location.href = '/login';
        return false;
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      setAuthState(prev => ({ ...prev, error: 'Failed to refresh token' }));
      window.location.href = '/login';
      return false;
    }
  }, []);

  const checkTokenStatus = useCallback(async () => {
    if (USE_MOCK) return; // hoppa över i mockläge
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
      } else if (response.status === 401) {
        console.log('No valid session found during token status check');
      }
    } catch (error) {
      console.error('Error checking token status:', error);
    }
  }, [refreshToken]);

  const checkAuthStatus = useCallback(async (isRetry = false) => {
    // Direktbypass i mockläge
    if (USE_MOCK) {
      setMockAuthenticated();
      return;
    }

    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

      // 1) token-status
      const tokenResponse = await fetch(`${BACKEND_URL}/token-status`, {
        credentials: 'include',
      });

      if (tokenResponse.ok) {
        const tokenStatus = await tokenResponse.json();

        if (tokenStatus.needsRefresh && tokenStatus.valid) {
          console.log('Token needs refresh, refreshing before profile check...');
          const refreshSuccess = await refreshToken();
          if (refreshSuccess && !isRetry) {
            await checkAuthStatus(true);
          }
          return;
        }

        if (!tokenStatus.valid) {
          console.log('Token expired, attempting refresh...');
          const refreshSuccess = await refreshToken();
          if (refreshSuccess && !isRetry) {
            await checkAuthStatus(true);
          }
          return;
        }
      } else if (tokenResponse.status === 401) {
        console.log('No valid session found - user not authenticated');
        setAuthState({
          isAuthenticated: false,
          user: null,
          isLoading: false,
          error: null,
        });
        return;
      }

      // 2) hämta profil
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
      } else if (response.status === 401 && !isRetry) {
        console.log('Token expired, attempting refresh...');
        const refreshSuccess = await refreshToken();
        if (refreshSuccess) {
          await checkAuthStatus(true);
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
  }, [refreshToken, setMockAuthenticated]);

  // Check authentication status on mount
  useEffect(() => {
    if (!autoCheck) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return;
    }

    if (USE_MOCK) {
      // Direkt inloggad i mockläge
      setMockAuthenticated();
      return;
    }

    checkAuthStatus();

    // Proaktiv refresh var 5:e minut (ej i mock)
    const interval = setInterval(() => {
      checkTokenStatus();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [checkAuthStatus, checkTokenStatus, autoCheck, setMockAuthenticated]);

  const login = useCallback(() => {
    if (USE_MOCK) {
      // Sätt inloggat och gå vidare lokalt
      setMockAuthenticated();
      // välj den route som passar din app bäst
      window.location.href = '/dashboard';
      return;
    }
    window.location.href = `${BACKEND_URL}/login`;
  }, [setMockAuthenticated]);

  const logout = useCallback(async () => {
    if (USE_MOCK) {
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: null,
      });
      window.location.href = '/login';
      return;
    }

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
    if (USE_MOCK) {
      setMockAuthenticated();
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');

    if (error) {
      setAuthState(prev => ({ ...prev, error }));
      return;
    }

    await checkAuthStatus();
  }, [checkAuthStatus, setMockAuthenticated]);

  // Listen for OAuth callback
  useEffect(() => {
    if (USE_MOCK) return; // inget callbackflöde i mock

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
