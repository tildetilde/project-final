// server/src/index.ts
import 'dotenv/config';
import express, { Request, Response } from 'express';
import session from 'express-session';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import SpotifyWebApi from 'spotify-web-api-node';
import mongoose, { Document, Schema } from 'mongoose';

// Validate that all necessary environment variables exist
const requiredEnvVars = [
    'CLIENT_ID',
    'CLIENT_SECRET',
    'REDIRECT_URI',
    'MONGODB_URI',
    'FRONTEND_URI',
    'SESSION_SECRET'
];

// Log environment info for debugging
console.log('Environment:', process.env.NODE_ENV || 'development');
console.log('Frontend URI:', process.env.FRONTEND_URI || 'http://localhost:5173');
console.log('Backend Port:', process.env.PORT || 8888);

for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        console.error(`Error: The environment variable ${envVar} is missing`);
        process.exit(1);
    }
}

const app = express();
const port = process.env.PORT || 8888;

// Extend the session object with our own properties
declare module 'express-session' {
    interface SessionData {
        spotify_auth_state?: string; // Made optional as it's cleared after use
        accessToken?: string;
        refreshToken?: string;
        expiresIn?: number;
        tokenCreatedAt?: number; // Add timestamp when token was created
    }
}

// Middleware
app.use(cors({
    origin: [
        process.env.FRONTEND_URI || 'http://localhost:5173',
        'https://banganza.netlify.app' // Add your deployed frontend
    ],
    credentials: true, // Allow cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
}));
app.use(cookieParser());
app.use(express.json()); // For handling JSON request bodies

// Health check endpoint
app.get('/', (req: Request, res: Response) => {
    res.json({
        message: 'Backend server is running!',
        status: 'ok',
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString(),
        frontend: process.env.FRONTEND_URI || 'http://localhost:5173'
    });
});

// Additional health check for production monitoring
app.get('/health', (req: Request, res: Response) => {
    const health = {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    };
    
    if (health.database === 'disconnected') {
        health.status = 'warning';
    }
    
    res.json(health);
});

app.use(session({
    secret: process.env.SESSION_SECRET as string,
    resave: true, // Changed to true to ensure session is saved
    saveUninitialized: true, // Changed to true to save new sessions
    cookie: {
        httpOnly: true, // Improve security by making the cookie inaccessible to JavaScript
        secure: process.env.NODE_ENV === 'production', // Use secure cookies only in production
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Required for cross-origin cookies in production
        maxAge: 60 * 60 * 1000 // 1 hour
    },
    name: 'spotify-session' // Give the session a specific name
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI as string)
    .then(() => {
        console.log('Connected to MongoDB Atlas');
        // Only populate the database when successfully connected
        populateQuizQuestionsFromPlaylist();
    })
    .catch(err => {
        console.error('Could not connect to MongoDB Atlas:', err);
        console.log('Server is running without database connection for development...');
        // Don't exit for development - allow server to run without DB
    });

// Spotify API instance
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: process.env.REDIRECT_URI
});

// Generate a random string for the state parameter (for security)
const generateRandomString = (length: number): string => {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

// --- Authentication routes (for the user to log in with Spotify) ---

// 1. Log in with Spotify
app.get('/login', (req: Request, res: Response) => {
    const state = generateRandomString(16);
    req.session.spotify_auth_state = state; // Save state in the session

    console.log('OAuth login initiated with state:', state);
    console.log('Session ID:', req.sessionID);
    console.log('Frontend URI:', process.env.FRONTEND_URI);
    console.log('Session data before redirect:', req.session);

    // Required scopes to control the user's Spotify app and read playback status
    const scope = [
        'user-read-private',
        'user-read-email',
        'user-read-playback-state',
        'user-modify-playback-state'
    ];

    const authUrl = spotifyApi.createAuthorizeURL(scope, state);
    console.log('Redirecting to Spotify OAuth URL:', authUrl);

    // Force session save before redirect
    req.session.save((err) => {
        if (err) {
            console.error('Error saving session:', err);
            return res.status(500).json({ error: 'Failed to save session' });
        }
        console.log('Session saved successfully, redirecting to Spotify');
        res.redirect(authUrl);
    });
});

// 2. Callback after Spotify authentication
app.get('/callback', async (req: Request, res: Response) => {
    const { code, state } = req.query as { code: string | null; state: string | null };
    const storedState = req.session.spotify_auth_state;

    console.log('OAuth callback received:');
    console.log('- Received state:', state);
    console.log('- Stored state:', storedState);
    console.log('- Session ID:', req.sessionID);
    console.log('- Session data:', req.session);

    if (state === null) {
        console.error('No state parameter received from Spotify');
        res.redirect(`${process.env.FRONTEND_URI}/login?error=no_state`);
        return;
    }

    if (!storedState) {
        console.error('No stored state found in session');
        res.redirect(`${process.env.FRONTEND_URI}/login?error=no_stored_state`);
        return;
    }

    if (state !== storedState) {
        console.error('State mismatch in OAuth callback');
        console.error('- Expected:', storedState);
        console.error('- Received:', state);
        res.redirect(`${process.env.FRONTEND_URI}/login?error=state_mismatch`);
        return;
    }

    if (!code) {
        console.error('No authorization code received from Spotify');
        res.redirect(`${process.env.FRONTEND_URI}/login?error=no_code`);
        return;
    }

    // Clear state from the session
    req.session.spotify_auth_state = undefined;
    
    try {
        const data = await spotifyApi.authorizationCodeGrant(code);
        const { access_token, refresh_token, expires_in } = data.body;

        // Save tokens in the session
        req.session.accessToken = access_token;
        req.session.refreshToken = refresh_token;
        req.session.expiresIn = expires_in;
        req.session.tokenCreatedAt = Date.now(); // Store timestamp

        console.log('OAuth tokens received and stored in session');
        console.log('- Access token length:', access_token ? access_token.length : 0);
        console.log('- Refresh token length:', refresh_token ? refresh_token.length : 0);
        console.log('- Expires in:', expires_in);

        // Redirect to the frontend callback route to handle the OAuth completion
        res.redirect(`${process.env.FRONTEND_URI}/callback?success=true`);
    } catch (err) {
        console.error('Could not get access token:', err);
        res.redirect(`${process.env.FRONTEND_URI}/login?error=invalid_token`);
    }
});

// 3. Refresh access token
app.get('/refresh_token', async (req: Request, res: Response) => {
    try {
        const refreshToken = req.session.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ error: 'No refresh token in session.' });
        }
        spotifyApi.setRefreshToken(refreshToken);
        const data = await spotifyApi.refreshAccessToken();
        const { access_token, expires_in } = data.body;

        req.session.accessToken = access_token;
        req.session.expiresIn = expires_in;
        req.session.tokenCreatedAt = Date.now(); // Update timestamp
        res.json({ success: true });
    } catch (err) {
        console.error('Could not refresh access token:', err);
        res.status(500).json({ error: 'Could not refresh access token' });
    }
});

// 3.5. Check token status
app.get('/token-status', (req: Request, res: Response) => {
    const { accessToken, expiresIn, tokenCreatedAt } = req.session;
    
    if (!accessToken || !expiresIn || !tokenCreatedAt) {
        return res.status(401).json({ 
            valid: false, 
            reason: 'No tokens in session',
            needsRefresh: false 
        });
    }
    
    const now = Date.now();
    const tokenAge = now - tokenCreatedAt;
    const timeUntilExpiry = (expiresIn * 1000) - tokenAge;
    
    // Token is valid if it hasn't expired yet
    const isValid = timeUntilExpiry > 0;
    
    // Suggest refresh if token expires in less than 5 minutes
    const needsRefresh = timeUntilExpiry < (5 * 60 * 1000);
    
    res.json({
        valid: isValid,
        reason: isValid ? 'Token is valid' : 'Token has expired',
        needsRefresh,
        timeUntilExpiry: Math.max(0, timeUntilExpiry),
        expiresIn: expiresIn * 1000,
        tokenAge
    });
});

// 4. Get user profile (via backend session)
app.get('/user-profile', async (req: Request, res: Response) => {
    try {
        const accessToken = req.session.accessToken;
        if (!accessToken) {
            return res.status(401).json({ error: 'Not logged in.' });
        }
        spotifyApi.setAccessToken(accessToken);
        const data = await spotifyApi.getMe();
        res.json(data.body);
    } catch (err) {
        console.error('Error fetching user profile:', err);
        res.status(500).json({ error: 'Could not fetch user profile.' });
    }
});

// 5. Log out
app.get('/logout', (req: Request, res: Response) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error during logout:', err);
            return res.status(500).json({ error: 'Could not log out.' });
        }
        res.json({ success: true });
    });
});

// --- Spotify Player routes (acting as a proxy) ---

// 6. Play a track on the user's active device
app.post('/play-track', async (req: Request, res: Response) => {
    try {
        const { trackId, deviceId } = req.body;
        const accessToken = req.session.accessToken;

        if (!accessToken || !trackId || !deviceId) {
            return res.status(400).json({ error: 'Invalid request.' });
        }
        spotifyApi.setAccessToken(accessToken);
        await spotifyApi.play({
            uris: [`spotify:track:${trackId}`],
            device_id: deviceId
        });
        res.status(200).json({ success: true });
    } catch (err) {
        console.error('Error during playback:', err);
        res.status(500).json({ error: 'Could not play the track.' });
    }
});

// 7. Pause playback
app.post('/pause-track', async (req: Request, res: Response) => {
    try {
        const { deviceId } = req.body;
        const accessToken = req.session.accessToken;
        if (!accessToken || !deviceId) {
            return res.status(400).json({ error: 'Invalid request.' });
        }
        spotifyApi.setAccessToken(accessToken);
        await spotifyApi.pause({ device_id: deviceId });
        res.status(200).json({ success: true });
    } catch (err) {
        console.error('Error during pause:', err);
        res.status(500).json({ error: 'Could not pause the track.' });
    }
});

// --- MongoDB Model (Quiz Questions) ---
// This model defines how your quiz questions are stored in the database.
// `trackId` is the Spotify Track ID, used to play the song.

// Define an interface for the data model
interface IQuizQuestion extends Document {
    trackId: string;
    trackTitle: string;
    trackArtist: string;
    releaseYear: number;
    trackUrl: string;
}

const quizSchema: Schema = new Schema({
    trackId: String,
    trackTitle: String,
    trackArtist: String,
    releaseYear: Number,
    trackUrl: String,
});

const QuizQuestion = mongoose.model<IQuizQuestion>('QuizQuestion', quizSchema);

// API route to fetch quiz questions
app.get('/quiz-questions', async (req: Request, res: Response) => {
    try {
        // Check if mongoose is connected
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({ error: 'Database is not available' });
        }
        const questions = await QuizQuestion.find({});
        res.json(questions);
    } catch (err) {
        console.error('Error fetching quiz questions:', err);
        res.status(500).json({ error: 'Could not fetch quiz questions' });
    }
});

// API route to fetch quiz questions with statistics and formatted information
app.get('/quiz-questions/detailed', async (req: Request, res: Response) => {
    try {
        // Check if mongoose is connected
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({ error: 'Database is not available' });
        }

        const questions = await QuizQuestion.find({});

        // Calculate statistics
        const totalQuestions = questions.length;
        const years = questions.map(q => q.releaseYear);
        const uniqueYears = [...new Set(years)].sort((a, b) => a - b);
        const yearRange = {
            min: Math.min(...years),
            max: Math.max(...years)
        };

        // Group by artist
        const artistCounts: { [key: string]: number } = {};
        questions.forEach(q => {
            artistCounts[q.trackArtist] = (artistCounts[q.trackArtist] || 0) + 1;
        });

        // Top 5 artists
        const topArtists = Object.entries(artistCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([artist, count]) => ({ artist, count }));

        // Group by decade
        const decadeCounts: { [key: string]: number } = {};
        questions.forEach(q => {
            const decade = Math.floor(q.releaseYear / 10) * 10;
            const decadeLabel = `${decade}s`;
            decadeCounts[decadeLabel] = (decadeCounts[decadeLabel] || 0) + 1;
        });

        const response = {
            summary: {
                totalQuestions,
                yearRange,
                uniqueYears: uniqueYears.length,
                decades: Object.keys(decadeCounts).length
            },
            statistics: {
                topArtists,
                decadeBreakdown: decadeCounts,
                yearDistribution: uniqueYears
            },
            questions: questions.map(q => ({
                id: q._id,
                trackId: q.trackId,
                title: q.trackTitle,
                artist: q.trackArtist,
                year: q.releaseYear,
                decade: `${Math.floor(q.releaseYear / 10) * 10}s`
            }))
        };

        res.json(response);
    } catch (err) {
        console.error('Error fetching detailed quiz questions:', err);
        res.status(500).json({ error: 'Could not fetch detailed quiz questions' });
    }
});

// API route to get a random quiz question
app.get('/quiz-questions/random', async (req: Request, res: Response) => {
    try {
        // Check if mongoose is connected
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({ error: 'Database is not available' });
        }

        const count = await QuizQuestion.countDocuments();
        if (count === 0) {
            return res.status(404).json({ error: 'No quiz questions available' });
        }

        const randomIndex = Math.floor(Math.random() * count);
        const randomQuestion = await QuizQuestion.findOne().skip(randomIndex);

        if (!randomQuestion) {
            return res.status(404).json({ error: 'Could not find a random question' });
        }

        res.json({
            question: {
                id: randomQuestion._id,
                trackId: randomQuestion.trackId,
                title: randomQuestion.trackTitle,
                artist: randomQuestion.trackArtist,
                year: randomQuestion.releaseYear,
                decade: `${Math.floor(randomQuestion.releaseYear / 10) * 10}s`
            },
            totalQuestions: count
        });
    } catch (err) {
        console.error('Error fetching random quiz question:', err);
        res.status(500).json({ error: 'Could not fetch a random quiz question' });
    }
});

// --- **NEW ROUTE TO VIEW RAW DATA FROM THE SPOTIFY API** ---
// Use this route to verify that fetching the playlist works.
// You can then remove it once you have tested it.
app.get('/raw-playlist-data', async (req: Request, res: Response) => {
    const playlistId = '6YHoO8ETcwxgq5WTjDpyAQ'; // Your playlist

    try {
        const data = await spotifyApi.clientCredentialsGrant();
        spotifyApi.setAccessToken(data.body['access_token']);

        const playlistData = await spotifyApi.getPlaylistTracks(playlistId);
        res.json(playlistData.body); // Send the entire raw data
    } catch (err) {
        console.error('Error fetching raw data from Spotify:', err);
        res.status(500).json({ error: 'Could not fetch raw data.' });
    }
});

// --- Function to add quiz questions from a specific playlist ---
// Use this function to populate your MongoDB database with questions from your playlist.
// It fetches an app-specific access token, so it does not require a logged-in user.

async function populateQuizQuestionsFromPlaylist() {
    // ID for the playlist you want to fetch tracks from.
    const playlistId = '6YHoO8ETcwxgq5WTjDpyAQ';

    try {
        // Check if mongoose is connected before proceeding
        if (mongoose.connection.readyState !== 1) {
            console.log('MongoDB not connected, skipping database population');
            return;
        }

        // Remove existing questions before adding new ones
        await QuizQuestion.deleteMany({});
        console.log('Existing quiz questions have been cleared from the database.');

        const data = await spotifyApi.clientCredentialsGrant();
        spotifyApi.setAccessToken(data.body['access_token']);
        console.log('Fetched Client Credentials token.');

        const playlistData = await spotifyApi.getPlaylistTracks(playlistId);
        const tracks = playlistData.body.items.filter(item => item.track);

        const quizQuestions = tracks.map(item => {
            const track = item.track as SpotifyApi.TrackObjectFull;
            if (track) {
                const trackTitle = track.name;
                const trackArtist = track.artists[0]?.name || 'Unknown Artist';
                const releaseYear = new Date(track.album.release_date).getFullYear();
                const trackUrl = track.external_urls.spotify;
                return {
                    trackId: track.id,
                    trackTitle,
                    trackArtist,
                    releaseYear,
                    trackUrl,
                };
            }
        }).filter(Boolean) as IQuizQuestion[]; // Filter out any null values

        if (quizQuestions.length > 0) {
            await QuizQuestion.insertMany(quizQuestions);
            console.log(`Database has been populated with ${quizQuestions.length} questions from the playlist.`);
        } else {
            console.log('Could not find any songs to create questions from.');
        }

    } catch (error) {
        console.error('An error occurred while populating the database:', error);
    }
}


// Start the server
app.listen(port, () => {
    console.log(`Backend server is running on port ${port}`);
    if (process.env.NODE_ENV === 'production') {
        console.log('Production mode enabled');
    } else {
        console.log(`Development mode: http://localhost:${port}`);
    }
}).on('error', (err) => {
    console.error('Error starting the server:', err);
    process.exit(1);
});
