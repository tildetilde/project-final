// server/src/index.ts
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import quizRoutes from './routes/quizRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import connectDB from './config/database.js';
import { config } from './config/environment.js';
const app = express();
const port = config.PORT;
// Middleware
app.use(cors({
    origin: [
        config.FRONTEND_URI,
        "https://banganza.netlify.app",
    ],
    credentials: true, // Allow cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
}));
app.use(express.json()); // For handling JSON request bodies
// Health check endpoint
app.get("/", (req, res) => {
    res.json({
        message: "Backend server is running!",
        status: "ok",
        environment: config.NODE_ENV,
        timestamp: new Date().toISOString(),
        frontend: config.FRONTEND_URI,
    });
});
// Additional health check for production monitoring
app.get("/health", (req, res) => {
    const health = {
        status: "ok",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: config.NODE_ENV,
        database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    };
    if (health.database === "disconnected") {
        health.status = "warning";
    }
    res.json(health);
});
// Use the new quiz routes
app.use('/api/quiz', quizRoutes);
// Use admin routes
app.use('/api/admin', adminRoutes);
// 404 handler
app.use(notFound);
// Error handling middleware
app.use(errorHandler);
// Connect to MongoDB
connectDB();
// Start the server
app
    .listen(port, () => {
    console.log(`[Server] Backend server is running on port ${port}`);
    if (config.NODE_ENV === "production") {
        console.log("[Server] Production mode enabled");
    }
    else {
        console.log(`[Server] Development mode: http://127.0.0.1:${port}`);
    }
})
    .on("error", (err) => {
    console.error("[Server] Error starting the server:", err);
    process.exit(1);
});
