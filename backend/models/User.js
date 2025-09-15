import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['player', 'scout', 'federation', 'admin'],
    default: 'player'
  },
  // NEW PLAYER PROFILE FIELDS
  position: {
    type: String,
    enum: ['Goalkeeper', 'Defender', 'Midfielder', 'Forward', ''],
    default: ''
  },
  age: {
    type: Number,
    min: 13,
    max: 40
  },
  height: {
    type: Number, // in cm
    min: 140,
    max: 220
  },
  weight: {
    type: Number, // in kg
    min: 40,
    max: 120
  },
  dominantFoot: {
    type: String,
    enum: ['Left', 'Right', 'Both', ''],
    default: ''
  },
  team: {
    type: String,
    trim: true
  },
  location: {
    city: String,
    country: String
  },
  skills: {
    pace: { type: Number, min: 1, max: 100 },
    shooting: { type: Number, min: 1, max: 100 },
    passing: { type: Number, min: 1, max: 100 },
    dribbling: { type: Number, min: 1, max: 100 },
    defense: { type: Number, min: 1, max: 100 },
    physical: { type: Number, min: 1, max: 100 }
  },
  bio: {
    type: String,
    maxlength: 500
  },
  profileImage: {
    type: String // URL to image
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
