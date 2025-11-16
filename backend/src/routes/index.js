import express from 'express';
import resultRoutes from './resultRoutes.js';
import villageRoutes from './villageRoutes.js';
import standardRoutes from './standardRoutes.js';
import reportRoutes from './reportRoutes.js';
import adminRoutes from './adminRoutes.js';

const router = express.Router();

router.use('/results', resultRoutes);
router.use('/villages', villageRoutes);
router.use('/standards', standardRoutes);
router.use('/reports', reportRoutes);
router.use('/admin', adminRoutes);

export default router;

