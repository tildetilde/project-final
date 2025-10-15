import mongoose from 'mongoose';
import { config } from './environment.js';

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = config.MONGODB_URI;
    
    const conn = await mongoose.connect(mongoURI);
    
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('[Database] MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('[Database] MongoDB disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('[Database] MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error('[Database] Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

export default connectDB;
