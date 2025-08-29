import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

interface EnvironmentConfig {
  NODE_ENV: string;
  PORT: number;
  MONGODB_URI: string;
  FRONTEND_URI: string;
  JWT_SECRET: string;
  ADMIN_USERNAME: string;
  ADMIN_PASSWORD: string;
  ADMIN_EMAIL: string;
}

const requiredEnvVars = [
  'MONGODB_URI',
  'FRONTEND_URI',
  'JWT_SECRET',
  'ADMIN_USERNAME',
  'ADMIN_PASSWORD',
  'ADMIN_EMAIL',
] as const;

const validateEnvironment = (): EnvironmentConfig => {
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}\n` +
      'Please check your .env file and ensure all required variables are set.'
    );
  }

 
  if (process.env.NODE_ENV === 'production') {
    if (process.env.JWT_SECRET!.length < 32) {
      throw new Error('JWT_SECRET must be at least 32 characters long in production');
    }
    
    if (!process.env.MONGODB_URI!.includes('mongodb.net')) {
      console.warn('Warning: Using non-Atlas MongoDB URI in production');
    }
  }

  return {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: parseInt(process.env.PORT || '8888', 10),
    MONGODB_URI: process.env.MONGODB_URI!,
    FRONTEND_URI: process.env.FRONTEND_URI!,
    JWT_SECRET: process.env.JWT_SECRET!,
    ADMIN_USERNAME: process.env.ADMIN_USERNAME!,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD!,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL!,
  };
};

export const config = validateEnvironment();
