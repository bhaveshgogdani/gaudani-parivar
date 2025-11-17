import mongoose from 'mongoose';
import Admin from '../models/Admin.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

export const connectDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connected successfully');
    
    // Create default admin if no admin exists
    await createDefaultAdmin();
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const createDefaultAdmin = async () => {
  try {
    const adminCount = await Admin.countDocuments();
    
    if (adminCount === 0) {
      const defaultEmail = process.env.DEFAULT_ADMIN_EMAIL;
      const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD;
      const defaultUsername = process.env.DEFAULT_ADMIN_USERNAME;
      const defaultFullName = process.env.DEFAULT_ADMIN_FULLNAME;

      // Create admin with plain password (will be hashed by pre-save hook)
      const defaultAdmin = new Admin({
        email: defaultEmail,
        password: defaultPassword, // Will be hashed by pre-save hook
        username: defaultUsername,
        fullName: defaultFullName,
        role: 'admin',
        isActive: true,
      });

      await defaultAdmin.save();
      console.log('✅ Default admin user created successfully');
      console.log(`   Email: ${defaultEmail}`);
      console.log(`   Password: ${defaultPassword}`);
      console.log('   ⚠️  Please change the default password after first login!');
    } else {
      console.log('ℹ️  Admin users already exist, skipping default admin creation');
    }
  } catch (error) {
    console.error('❌ Error creating default admin:', error);
  }
};

export default connectDatabase;

