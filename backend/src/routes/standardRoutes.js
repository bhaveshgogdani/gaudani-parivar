import express from 'express';
import {
  getStandards,
  getStandardById,
  createStandard,
  updateStandard,
  deleteStandard,
} from '../controllers/standardController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes (only active standards)
router.get('/', getStandards);
router.get('/all', authMiddleware, getStandards); // Admin: all standards including inactive
router.get('/:id', getStandardById);

// Admin only routes
router.post('/', authMiddleware, createStandard);
router.put('/:id', authMiddleware, updateStandard);
router.delete('/:id', authMiddleware, deleteStandard);

export default router;

