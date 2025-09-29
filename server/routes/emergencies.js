import express from 'express';
import Emergency from '../models/Emergency.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Report new emergency
router.post('/', async (req, res) => {
  try {
    const {
      type,
      severity,
      location,
      description,
      reporter,
      numberOfPeople
    } = req.body;
    
    const emergency = await Emergency.create({
      type,
      severity,
      location,
      description,
      reporter,
      numberOfPeople
    });
    
    // Emit real-time event
    const io = req.app.get('io');
    io.emit('new-emergency', emergency);
    
    res.status(201).json({
      status: 'success',
      data: {
        emergency
      }
    });
  } catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
});

// Get all emergencies
router.get('/', async (req, res) => {
  try {
    const { status, limit = 50 } = req.query;
    
    let query = {};
    if (status) {
      query.status = status;
    }
    
    const emergencies = await Emergency.find(query)
      .populate('reporter.userId', 'name phone')
      .populate('responders.userId', 'name role')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));
    
    res.json({
      status: 'success',
      results: emergencies.length,
      data: {
        emergencies
      }
    });
  } catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
});

// Get active emergencies
router.get('/active', async (req, res) => {
  try {
    const emergencies = await Emergency.find({
      status: { $in: ['reported', 'dispatched', 'in-progress'] }
    })
      .populate('reporter.userId', 'name phone')
      .sort({ createdAt: -1 });
    
    res.json({
      status: 'success',
      results: emergencies.length,
      data: {
        emergencies
      }
    });
  } catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
});

// Get single emergency
router.get('/:id', async (req, res) => {
  try {
    const emergency = await Emergency.findById(req.params.id)
      .populate('reporter.userId', 'name phone')
      .populate('responders.userId', 'name role');
    
    if (!emergency) {
      return res.status(404).json({
        error: 'Emergency not found'
      });
    }
    
    res.json({
      status: 'success',
      data: {
        emergency
      }
    });
  } catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
});

// Update emergency status
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    const emergency = await Emergency.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    
    if (!emergency) {
      return res.status(404).json({
        error: 'Emergency not found'
      });
    }
    
    // Emit real-time update
    const io = req.app.get('io');
    io.to(req.params.id).emit('emergency-status-changed', {
      emergencyId: req.params.id,
      status,
      emergency
    });
    
    res.json({
      status: 'success',
      data: {
        emergency
      }
    });
  } catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
});

export default router;