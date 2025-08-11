# Environment Setup Guide

## Critical OAuth Configuration

To fix the OAuth callback issue, you need to set the correct `REDIRECT_URI` in your environment variables.

### For Development (Local)
Create a `.env` file in your backend directory with:

```bash
# Spotify OAuth Configuration
CLIENT_ID=your_spotify_client_id_here
CLIENT_SECRET=your_spotify_client_secret_here
REDIRECT_URI=http://localhost:8888/callback

# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name

# Frontend Configuration
FRONTEND_URI=http://localhost:5173

# Security
SESSION_SECRET=your_very_long_random_secret_string_here

# Environment
NODE_ENV=development

# Port
PORT=8888
```

### For Production
Set these environment variables in your Render dashboard:

```bash
CLIENT_ID=your_spotify_client_id_here
CLIENT_SECRET=your_spotify_client_secret_here
REDIRECT_URI=https://your-backend-url.onrender.com/callback
FRONTEND_URI=https://banganza.netlify.app
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name
SESSION_SECRET=your_very_long_random_secret_string_here
NODE_ENV=production
PORT=10000
```

## Important Notes

1. **REDIRECT_URI MUST match your Spotify app settings exactly**
   - Development: `http://localhost:8888/callback`
   - Production: `https://your-backend-url.onrender.com/callback`

2. **The OAuth flow is:**
   - User clicks login → Frontend → Backend `/login`
   - Backend → Spotify OAuth
   - Spotify → Backend `/callback` (NOT frontend)
   - Backend processes OAuth → Redirects to frontend `/callback`
   - Frontend handles completion → Dashboard

3. **Never set REDIRECT_URI to your frontend URL** - it must point to your backend callback endpoint.

## Testing the Fix

1. Set the correct environment variables
2. Restart your backend server
3. Try the OAuth flow again
4. Check the backend console for OAuth logs
5. The callback should now work properly 