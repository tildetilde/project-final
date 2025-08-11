# Hitster Frontend

A music timeline game built with React, TypeScript, and Tailwind CSS.

## Features

- **Spotify OAuth Integration**: Seamless login with Spotify accounts
- **Protected Routes**: Authentication-based routing for game features
- **Modern UI**: Beautiful, responsive design with Tailwind CSS
- **TypeScript**: Full type safety throughout the application

## Authentication Flow

The application uses Spotify OAuth for authentication:

1. User clicks "Start Game with Spotify" button
2. User is redirected to Spotify for authorization
3. After authorization, user is redirected back to `/callback`
4. The callback page verifies authentication and redirects to `/dashboard`
5. User can now access protected game features

## Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend server running on port 8888

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:5173](http://localhost:5173) in your browser

### Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_BACKEND_URL=http://localhost:8888
VITE_FRONTEND_URL=http://localhost:5173
```

## Project Structure

```
src/
├── components/          # Reusable UI components
├── config/             # Configuration files
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── ui/                 # Base UI components
└── App.tsx            # Main application component
```

## Key Components

- **LoginForm**: Main login interface with Spotify OAuth
- **Dashboard**: Protected dashboard for authenticated users
- **OAuthCallback**: Handles OAuth callback from Spotify
- **useAuth**: Authentication hook managing user state

## Development

- **Build**: `npm run build`
- **Preview**: `npm run preview`
- **Lint**: `npm run lint`

## Backend Integration

This frontend integrates with the Hitster backend server which provides:

- Spotify OAuth endpoints
- User profile management
- Quiz question API
- Spotify playback controls

Make sure the backend server is running before testing authentication features.
