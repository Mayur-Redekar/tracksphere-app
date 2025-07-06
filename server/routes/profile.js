// routes/profile.js
import express from 'express';
import { getUserProfile, updateUserProfile, updatePassword } from '../controllers/userController.js';
import upload from '../middleware/upload.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get profile by ID (required for dashboard)
router.get('/:id', verifyToken, getUserProfile);

// Update profile
router.put('/:id', verifyToken, upload.single('profilePic'), updateUserProfile);

// Update password
router.put('/:id/password', verifyToken, updatePassword);

export default router;
