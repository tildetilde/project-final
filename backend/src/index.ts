// server/src/index.ts
import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import quizRoutes from './routes/quizRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import connectDB from './config/database.js';

// Validate that all necessary environment variables exist
const requiredEnvVars = [
  "MONGODB_URI",
  "FRONTEND_URI",
];

// Log environment info for debugging
console.log("Environment:", process.env.NODE_ENV || "development");
console.log(
  "Frontend URI:",
  process.env.FRONTEND_URI || "http://127.0.0.1:5173"
);
console.log("Backend Port:", process.env.PORT || 8888);

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Error: The environment variable ${envVar} is missing`);
    process.exit(1);
  }
}

const app = express();
const port = process.env.PORT || 8888;

// Middleware
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URI || "http://127.0.0.1:5173",
      "https://banganza.netlify.app",
    ],
    credentials: true, // Allow cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  })
);
app.use(express.json()); // For handling JSON request bodies

// Health check endpoint
app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Backend server is running!",
    status: "ok",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
    frontend: process.env.FRONTEND_URI || "http://127.0.0.1:5173",
  });
});

// Additional health check for production monitoring
app.get("/health", (req: Request, res: Response) => {
  const health = {
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  };

  if (health.database === "disconnected") {
    health.status = "warning";
  }

  res.json(health);
});

// Use the new quiz routes
app.use('/api/quiz', quizRoutes);

// 404 handler
app.use(notFound);

// Error handling middleware
app.use(errorHandler);

// Connect to MongoDB
connectDB();

// Start the server
app
  .listen(port, () => {
    console.log(`Backend server is running on port ${port}`);
    if (process.env.NODE_ENV === "production") {
      console.log("Production mode enabled");
    } else {
      console.log(`Development mode: http://127.0.0.1:${port}`);
    }
  })
  .on("error", (err) => {
    console.error("Error starting the server:", err);
    process.exit(1);
  });