import mongoose from 'mongoose';
import { config } from './environment.js';
import { logger } from '../utils/logger.js';
const connectDB = async () => {
    try {
        const mongoURI = config.MONGODB_URI;
        const conn = await mongoose.connect(mongoURI);
        logger.info(`MongoDB Connected: ${conn.connection.host}`, 'Database');
        // Handle connection events
        mongoose.connection.on('error', (err) => {
            logger.error('MongoDB connection error', 'Database', err);
        });
        mongoose.connection.on('disconnected', () => {
            logger.warn('MongoDB disconnected', 'Database');
        });
        // Graceful shutdown
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            logger.info('MongoDB connection closed through app termination', 'Database');
            process.exit(0);
        });
    }
    catch (error) {
        logger.error('Error connecting to MongoDB', 'Database', error);
        process.exit(1);
    }
};
export default connectDB;
