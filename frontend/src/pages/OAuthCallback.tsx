import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const OAuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { checkAuthStatus, error } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Check if there's an error in the URL
        const urlParams = new URLSearchParams(window.location.search);
        const errorParam = urlParams.get('error');
        const successParam = urlParams.get('success');
        
        if (errorParam) {
          console.error('OAuth error:', errorParam);
          navigate('/login?error=' + encodeURIComponent(errorParam));
          return;
        }

        if (successParam === 'true') {
          console.log('OAuth successful, checking authentication status...');
          // Wait a moment for the backend session to be established
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Check authentication status
          await checkAuthStatus();
          
          // Redirect to dashboard after successful authentication
          navigate('/dashboard');
        } else {
          console.log('No success parameter, checking auth status directly...');
          // Check authentication status
          await checkAuthStatus();
          
          // Redirect to dashboard after successful authentication
          navigate('/dashboard');
        }
      } catch (err) {
        console.error('Error handling OAuth callback:', err);
        navigate('/login?error=authentication_failed');
      }
    };

    handleCallback();
  }, [checkAuthStatus, navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
        <p className="text-muted-foreground">Completing authentication...</p>
        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}
      </div>
    </div>
  );
};

export default OAuthCallback; 