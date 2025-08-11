# Production Setup Guide

## Environment Variables Required

Set these environment variables in your Render dashboard:

### Spotify OAuth Configuration
```
CLIENT_ID=your_spotify_client_id_here
CLIENT_SECRET=your_spotify_client_secret_here
REDIRECT_URI=https://your-backend-url.onrender.com/callback
```

### Database Configuration
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name
```

### Frontend Configuration
```
FRONTEND_URI=https://banganza.netlify.app
```

### Security
```
SESSION_SECRET=your_very_long_random_secret_string_here
```

### Environment
```
NODE_ENV=production
```

### Port (Render will set this automatically)
```
PORT=10000
```

## Important Notes

1. **REDIRECT_URI**: Must match exactly what you set in your Spotify app settings
2. **SESSION_SECRET**: Use a long, random string (at least 32 characters)
3. **FRONTEND_URI**: Must include your deployed frontend URL
4. **NODE_ENV**: Must be set to 'production' for secure cookies

## Deployment Steps

1. Push your updated code to your repository
2. In Render, ensure all environment variables are set
3. Redeploy your backend service
4. Test the OAuth flow from your deployed frontend

## Testing

After deployment, test these endpoints:
- `GET /` - Basic health check
- `GET /health` - Detailed health status
- `GET /login` - Spotify OAuth initiation
- `GET /callback` - OAuth callback handling

## Troubleshooting

- Check Render logs for any startup errors
- Verify all environment variables are set correctly
- Ensure your Spotify app redirect URI matches exactly
- Check that your MongoDB connection string is valid 