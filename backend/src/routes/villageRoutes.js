import express from 'express';
import {
  getVillages,
  getVillageById,
  createVillage,
  updateVillage,
  deleteVillage,
} from '../controllers/villageController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes (only active villages)
router.get('/', getVillages);
router.get('/all', authMiddleware, getVillages); // Admin: all villages including inactive
router.get('/:id', getVillageById);

// Admin only routes
router.post('/', authMiddleware, createVillage);
router.put('/:id', authMiddleware, updateVillage);
router.delete('/:id', authMiddleware, deleteVillage);

export default router;

