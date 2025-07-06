import express from 'express';
import User from '../models/User.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).sort({ createdAt: -1 }); // Only regular users
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching users' });
  }
});

router.get('/unverified', verifyToken, async (req, res) => {
  try {
    const unverifiedUsers = await User.find({ role: 'user', isVerified: false }).sort({ createdAt: -1 });
    res.json(unverifiedUsers);
  } catch (error) {
    res.status(500).json({ msg: 'Error fetching unverified users' });
  }
});

export default router;
