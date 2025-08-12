// Environment configuration
export const config = {
  // Backend API URL - Use production for OAuth, local for development
  backendUrl: import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8888',
  
  // Frontend URL
  frontendUrl: import.meta.env.VITE_FRONTEND_URL || 'http://127.0.0.1:5173',
  
  // App name
  appName: 'Hitster',
  
  // Spotify OAuth scopes
  spotifyScopes: [
    'user-read-private',
    'user-read-email',
    'user-read-playback-state',
    'user-modify-playback-state'
  ]
}; 