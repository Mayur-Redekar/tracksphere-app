import express from 'express';
import {
  register,
  login,
  refreshToken,
  verifyUser,
  deleteUser, 
} from '../controllers/authController.js';
import { loginLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Register new user
router.post('/register', register);

// Login
router.post('/login', loginLimiter, login);

// Refresh JWT token
router.post('/refresh-token', refreshToken);

// Toggle verification status by Admin
router.put('/verify-user/:id', verifyUser);

// Delete users by admin
router.delete('/delete-user/:id', deleteUser);

export default router;
