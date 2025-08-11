// server/src/index.ts
import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import SpotifyWebApi from 'spotify-web-api-node';
import mongoose, { Schema } from 'mongoose';
// Validate that all necessary environment variables exist
const requiredEnvVars = [
    'CLIENT_ID',
    'CLIENT_SECRET',
    'REDIRECT_URI',
    'MONGODB_URI',
    'FRONTEND_URI',
    'SESSION_SECRET'
];
for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        console.error(`Error: The environment variable ${envVar} is missing`);
        process.exit(1);
    }
}
const app = express();
const port = 8888;
// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URI, // Allow only your frontend
    credentials: true // Allow cookies
}));
app.use(cookieParser());
app.use(express.json()); // For handling JSON request bodies
// Health check endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Backend server is running!',
        status: 'ok',
        timestamp: new Date().toISOString()
    });
});
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true, // Improve security by making the cookie inaccessible to JavaScript
        secure: process.env.NODE_ENV === 'production', // Use secure cookies only in production
        maxAge: 60 * 60 * 1000 // 1 hour
    }
}));
// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
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
const generateRandomString = (length) => {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};
// --- Authentication routes (for the user to log in with Spotify) ---
// 1. Log in with Spotify
app.get('/login', (req, res) => {
    const state = generateRandomString(16);
    req.session.spotify_auth_state = state; // Save state in the session
    // Required scopes to control the user's Spotify app and read playback status
    const scope = [
        'user-read-private',
        'user-read-email',
        'user-read-playback-state',
        'user-modify-playback-state'
    ];
    res.redirect(spotifyApi.createAuthorizeURL(scope, state));
});
// 2. Callback after Spotify authentication
app.get('/callback', async (req, res) => {
    const { code, state } = req.query;
    const storedState = req.session.spotify_auth_state;
    if (state === null || state !== storedState) {
        res.redirect(`${process.env.FRONTEND_URI}/#error=state_mismatch`);
    }
    else {
        req.session.spotify_auth_state = undefined; // Clear state from the session
        try {
            const data = await spotifyApi.authorizationCodeGrant(code);
            const { access_token, refresh_token, expires_in } = data.body;
            // Save tokens in the session
            req.session.accessToken = access_token;
            req.session.refreshToken = refresh_token;
            req.session.expiresIn = expires_in;
            // Redirect to the frontend without sending tokens in the URL
            res.redirect(`${process.env.FRONTEND_URI}/dashboard`);
        }
        catch (err) {
            console.error('Could not get access token:', err);
            res.redirect(`${process.env.FRONTEND_URI}/#error=invalid_token`);
        }
    }
});
// 3. Refresh access token
app.get('/refresh_token', async (req, res) => {
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
        res.json({ success: true });
    }
    catch (err) {
        console.error('Could not refresh access token:', err);
        res.status(500).json({ error: 'Could not refresh access token' });
    }
});
// 4. Get user profile (via backend session)
app.get('/user-profile', async (req, res) => {
    try {
        const accessToken = req.session.accessToken;
        if (!accessToken) {
            return res.status(401).json({ error: 'Not logged in.' });
        }
        spotifyApi.setAccessToken(accessToken);
        const data = await spotifyApi.getMe();
        res.json(data.body);
    }
    catch (err) {
        console.error('Error fetching user profile:', err);
        res.status(500).json({ error: 'Could not fetch user profile.' });
    }
});
// 5. Log out
app.get('/logout', (req, res) => {
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
app.post('/play-track', async (req, res) => {
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
    }
    catch (err) {
        console.error('Error during playback:', err);
        res.status(500).json({ error: 'Could not play the track.' });
    }
});
// 7. Pause playback
app.post('/pause-track', async (req, res) => {
    try {
        const { deviceId } = req.body;
        const accessToken = req.session.accessToken;
        if (!accessToken || !deviceId) {
            return res.status(400).json({ error: 'Invalid request.' });
        }
        spotifyApi.setAccessToken(accessToken);
        await spotifyApi.pause({ device_id: deviceId });
        res.status(200).json({ success: true });
    }
    catch (err) {
        console.error('Error during pause:', err);
        res.status(500).json({ error: 'Could not pause the track.' });
    }
});
const quizSchema = new Schema({
    trackId: String,
    trackTitle: String,
    trackArtist: String,
    releaseYear: Number,
    trackUrl: String,
});
const QuizQuestion = mongoose.model('QuizQuestion', quizSchema);
// API route to fetch quiz questions
app.get('/quiz-questions', async (req, res) => {
    try {
        // Check if mongoose is connected
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({ error: 'Database is not available' });
        }
        const questions = await QuizQuestion.find({});
        res.json(questions);
    }
    catch (err) {
        console.error('Error fetching quiz questions:', err);
        res.status(500).json({ error: 'Could not fetch quiz questions' });
    }
});
// API route to fetch quiz questions with statistics and formatted information
app.get('/quiz-questions/detailed', async (req, res) => {
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
        const artistCounts = {};
        questions.forEach(q => {
            artistCounts[q.trackArtist] = (artistCounts[q.trackArtist] || 0) + 1;
        });
        // Top 5 artists
        const topArtists = Object.entries(artistCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([artist, count]) => ({ artist, count }));
        // Group by decade
        const decadeCounts = {};
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
    }
    catch (err) {
        console.error('Error fetching detailed quiz questions:', err);
        res.status(500).json({ error: 'Could not fetch detailed quiz questions' });
    }
});
// API route to get a random quiz question
app.get('/quiz-questions/random', async (req, res) => {
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
    }
    catch (err) {
        console.error('Error fetching random quiz question:', err);
        res.status(500).json({ error: 'Could not fetch a random quiz question' });
    }
});
// --- **NEW ROUTE TO VIEW RAW DATA FROM THE SPOTIFY API** ---
// Use this route to verify that fetching the playlist works.
// You can then remove it once you have tested it.
app.get('/raw-playlist-data', async (req, res) => {
    const playlistId = '6YHoO8ETcwxgq5WTjDpyAQ'; // Your playlist
    try {
        const data = await spotifyApi.clientCredentialsGrant();
        spotifyApi.setAccessToken(data.body['access_token']);
        const playlistData = await spotifyApi.getPlaylistTracks(playlistId);
        res.json(playlistData.body); // Send the entire raw data
    }
    catch (err) {
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
            const track = item.track;
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
        }).filter(Boolean); // Filter out any null values
        if (quizQuestions.length > 0) {
            await QuizQuestion.insertMany(quizQuestions);
            console.log(`Database has been populated with ${quizQuestions.length} questions from the playlist.`);
        }
        else {
            console.log('Could not find any songs to create questions from.');
        }
    }
    catch (error) {
        console.error('An error occurred while populating the database:', error);
    }
}
// Start the server
app.listen(port, () => {
    console.log(`Backend server is running on http://localhost:${port}`);
}).on('error', (err) => {
    console.error('Error starting the server:', err);
    process.exit(1);
});
