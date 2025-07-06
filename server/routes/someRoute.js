import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/protected-data', verifyToken, (req, res) => {
  res.json({ msg: '✅ This is protected data', user: req.user });
});

export default router;
