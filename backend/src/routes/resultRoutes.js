import express from 'express';
import {
  createResult,
  getResults,
  getResultById,
  updateResult,
  deleteResult,
} from '../controllers/resultController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { upload } from '../config/multer.js';

const router = express.Router();

// Public routes
router.post('/', upload.fields([
  { name: 'resultImage', maxCount: 1 },
  { name: 'resultImage2', maxCount: 1 }
]), createResult);
router.get('/', getResults);
router.get('/:id', getResultById);

// Admin only routes
router.put('/:id', authMiddleware, upload.fields([
  { name: 'resultImage', maxCount: 1 },
  { name: 'resultImage2', maxCount: 1 }
]), updateResult);
router.delete('/:id', authMiddleware, deleteResult);

export default router;

