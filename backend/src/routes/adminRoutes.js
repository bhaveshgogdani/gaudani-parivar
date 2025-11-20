import express from 'express';
import { login, getDashboard, getSettings, updateSettings } from '../controllers/adminController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route
router.post('/login', login);
router.get('/settings/public', getSettings); // Public route to check last date

// Protected routes
router.get('/dashboard', authMiddleware, getDashboard);
router.get('/settings', authMiddleware, getSettings);
router.put('/settings', authMiddleware, updateSettings);

export default router;

