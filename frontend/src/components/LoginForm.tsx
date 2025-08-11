import React from "react"
import { useAuth } from "../hooks/useAuth"
import { Button } from "../ui/Button"

export const LoginForm: React.FC = () => {
  const { login, isLoading, error: authError } = useAuth()
  
  // Get error from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const urlError = urlParams.get('error');
  
  // Use URL error if available, otherwise use auth error
  const error = urlError || authError;

  const handleSpotifyLogin = () => {
    login()
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground">Hitster</h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Build your music timeline and guess the years in this exciting music game
          </p>
        </div>

        {/* Error display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error === 'state_mismatch' && 'Authentication failed. Please try again.'}
            {error === 'invalid_token' && 'Authentication failed. Please try again.'}
            {error === 'authentication_failed' && 'Authentication failed. Please try again.'}
            {!['state_mismatch', 'invalid_token', 'authentication_failed'].includes(error) && error}
          </div>
        )}

        <Button 
          onClick={handleSpotifyLogin} 
          className="px-8 py-3 text-lg bg-[#1DB954] hover:bg-[#1ed760] border-[#1DB954] text-white hover:text-white"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Connecting to Spotify...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-3">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z" />
              </svg>
              <span>Start Game with Spotify</span>
            </div>
          )}
        </Button>

        {/* Game info */}
        <div className="mt-6 p-4 bg-muted/30 rounded-xl border border-border-muted max-w-md mx-auto">
          <div className="flex items-start space-x-3">
            <div className="w-5 h-5 text-primary mt-0.5 flex-shrink-0 relative">
              <div className="absolute top-0 left-0 w-2 h-2 bg-current rounded-full" />
              <div className="absolute top-0 right-0 w-2 h-2 bg-current rounded-full" />
              <div className="absolute bottom-0 left-0 w-5 h-2 bg-current rounded-full" />
            </div>
            <div className="text-sm text-muted-foreground leading-relaxed">
              <p className="font-medium text-foreground mb-1">Ready to play?</p>
              <p>Connect with Spotify to start your music timeline game. Only one player needs to log in.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
