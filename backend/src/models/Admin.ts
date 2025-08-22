import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IAdmin extends Document {
  username: string;
  password: string;
  email: string;
  isActive: boolean;
  lastLogin?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const AdminSchema = new Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  password: { 
    type: String, 
    required: true,
    minlength: 6
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  lastLogin: { 
    type: Date 
  }
}, { 
  timestamps: true 
});

// Hash password before saving
AdminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Method to compare passwords
AdminSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const Admin = model<IAdmin>('Admin', AdminSchema);
