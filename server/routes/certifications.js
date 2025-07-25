import express from 'express';
import {
  addCertification,
  getMyCertifications,
  updateCertificationStatus,
  getTodayCertifications,
  getAllCertificates,
} from '../controllers/certController.js';
import { verifyToken, verifyAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Today's Certifications Count
router.get('/today', verifyToken, getTodayCertifications);

// All Certifications (GET & POST)
router.get('/', verifyToken, getMyCertifications);
router.post('/', verifyToken, addCertification);

// Update Certification Status
router.put('/:id', verifyToken, updateCertificationStatus);

router.get('/certificates', verifyToken, verifyAdmin, getAllCertificates);

export default router;
