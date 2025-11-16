import express from 'express';
import {
  getTopThree,
  exportTopThreeDocx,
  getAwardsList,
  getSummary,
  exportReport,
  getByMedium,
  getByVillage,
  getByStandard,
  getTopPerformers,
  exportAwardsDocx,
} from '../controllers/reportController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/top-three', getTopThree);

// Admin only routes
router.get('/summary', authMiddleware, getSummary);
router.get('/by-medium', authMiddleware, getByMedium);
router.get('/by-village', authMiddleware, getByVillage);
router.get('/by-standard', authMiddleware, getByStandard);
router.get('/top-performers', authMiddleware, getTopPerformers);
router.get('/awards/first-rank', authMiddleware, getAwardsList);
router.get('/awards/second-rank', authMiddleware, getAwardsList);
router.get('/awards/export', authMiddleware, exportAwardsDocx);
router.get('/top-three-export', authMiddleware, exportTopThreeDocx);
router.get('/export', authMiddleware, exportReport);

export default router;

