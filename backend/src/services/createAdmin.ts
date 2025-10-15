import connectDB from '../config/database.js';
import { Admin } from '../models/Admin.js';
import { config } from '../config/environment.js';

const createInitialAdmin = async () => {
  try {
    await connectDB();
    
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username: config.ADMIN_USERNAME });
    if (existingAdmin) {
      console.log('[CreateAdmin] Admin user already exists');
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
    console.log(`[CreateAdmin] Initial admin user created successfully: ${config.ADMIN_USERNAME} (${config.ADMIN_EMAIL})`);
    
    process.exit(0);
  } catch (error) {
    console.error('[CreateAdmin] Error creating admin user', error);
    process.exit(1);
  }
};

createInitialAdmin();
