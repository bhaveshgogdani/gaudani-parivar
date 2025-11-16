import express from 'express';
import { login, getDashboard } from '../controllers/adminController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route
router.post('/login', login);

// Protected routes
router.get('/dashboard', authMiddleware, getDashboard);

export default router;

