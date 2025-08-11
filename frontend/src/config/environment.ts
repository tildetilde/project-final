// Environment configuration
export const config = {
  // Backend API URL
  backendUrl: import.meta.env.VITE_BACKEND_URL || 'http://localhost:8888',
  
  // Frontend URL
  frontendUrl: import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173',
  
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