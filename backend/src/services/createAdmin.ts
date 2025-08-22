import connectDB from '../config/database.js';
import { Admin } from '../models/Admin.js';
import { config } from '../config/environment.js';
import { logger } from '../utils/logger.js';

const createInitialAdmin = async () => {
  try {
    await connectDB();
    
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username: config.ADMIN_USERNAME });
    if (existingAdmin) {
      logger.info('Admin user already exists', 'CreateAdmin');
      process.exit(0);
    }
    
    // Create initial admin user
    const admin = new Admin({
      username: config.ADMIN_USERNAME,
      password: config.ADMIN_PASSWORD,
      email: config.ADMIN_EMAIL,
      isActive: true
    });
    
    await admin.save();
    logger.info('Initial admin user created successfully', 'CreateAdmin', {
      username: config.ADMIN_USERNAME,
      email: config.ADMIN_EMAIL,
    });
    
    process.exit(0);
  } catch (error) {
    logger.error('Error creating admin user', 'CreateAdmin', error as Error);
    process.exit(1);
  }
};

createInitialAdmin();
