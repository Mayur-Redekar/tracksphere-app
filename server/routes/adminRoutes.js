import express from 'express';
import { getAdminStats } from '../controllers/adminController.js';
import { verifyToken, verifyAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected route for admin dashboard stats
router.get('/', verifyToken, verifyAdmin, getAdminStats);

export default router;
