import express from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// UPDATE player profile (protected route)
router.put('/profile', protect, async (req, res) => {
  try {
    const {
      position, age, height, weight, dominantFoot, team, location,
      skills, bio, profileImage
    } = req.body;

    // Find user and update profile fields
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          position, age, height, weight, dominantFoot, team, location,
          skills, bio, profileImage
        }
      },
      { new: true, runValidators: true }
    ).select('-password'); // Don't return password

    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET player profile (protected)
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// SEARCH players (for scouts - protected)
router.get('/search', protect, async (req, res) => {
  try {
    const { position, minAge, maxAge, minRating, skill } = req.query;
    
    let filter = { role: 'player' }; // Only search players

    // Add filters if provided
    if (position) filter.position = position;
    if (minAge || maxAge) {
      filter.age = {};
      if (minAge) filter.age.$gte = parseInt(minAge);
      if (maxAge) filter.age.$lte = parseInt(maxAge);
    }
    if (minRating && skill) {
      filter[`skills.${skill}`] = { $gte: parseInt(minRating) };
    }

    const players = await User.find(filter)
      .select('-password -email') // Don't expose sensitive data
      .limit(50); // Limit results

    res.json({ players, count: players.length });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
