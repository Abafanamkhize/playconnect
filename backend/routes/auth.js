// routes/auth.js
import express from 'express';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// SIGNUP/REGISTER route
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    const user = new User({ name, email, password, role });
    await user.save();
    
    const token = generateToken(user._id);
    
    const userResponse = { ...user.toObject() };
    delete userResponse.password;
    
    res.status(201).json({ 
      message: 'User created successfully', 
      user: userResponse,
      token 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// LOGIN route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const token = generateToken(user._id);
    
    const userResponse = { ...user.toObject() };
    delete userResponse.password;
    
    res.json({ 
      message: 'Login successful', 
      user: userResponse,
      token 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PROTECTED ROUTE (test)
router.get('/profile', protect, async (req, res) => {
  try {
    res.json({
      message: 'Access granted to protected route',
      user: req.user
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
