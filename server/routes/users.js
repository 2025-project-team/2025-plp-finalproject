import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    // In real app, this would use auth middleware
    const userId = req.headers['user-id'] || req.query.userId;
    
    if (!userId) {
      return res.status(400).json({
        error: 'User ID required'
      });
    }
    
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }
    
    res.json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
});

// Update user profile
router.put('/profile', async (req, res) => {
  try {
    const { userId, ...updateData } = req.body;
    
    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }
    
    res.json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
});

// Add emergency contact
router.post('/emergency-contacts', async (req, res) => {
  try {
    const { userId, contact } = req.body;
    
    const user = await User.findByIdAndUpdate(
      userId,
      { $push: { emergencyContacts: contact } },
      { new: true, runValidators: true }
    ).select('-password');
    
    res.json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
});

export default router;