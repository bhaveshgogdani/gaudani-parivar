import express from 'express';
import {
  getTopThree,
  exportTopThreePdf,
  exportManageResultsPdf,
  exportCollegeListByVillage,
  exportSchoolListByVillage,
  exportPrintCollege,
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

// All report routes are admin only
router.get('/top-three', authMiddleware, getTopThree);
router.get('/summary', authMiddleware, getSummary);
router.get('/by-medium', authMiddleware, getByMedium);
router.get('/by-village', authMiddleware, getByVillage);
router.get('/by-standard', authMiddleware, getByStandard);
router.get('/top-performers', authMiddleware, getTopPerformers);
router.get('/awards/first-rank', authMiddleware, getAwardsList);
router.get('/awards/second-rank', authMiddleware, getAwardsList);
router.get('/awards/export', authMiddleware, exportAwardsDocx);
router.get('/top-three-pdf', authMiddleware, exportTopThreePdf);
router.get('/manage-results-pdf', authMiddleware, exportManageResultsPdf);
router.get('/college-list-by-village-pdf', authMiddleware, exportCollegeListByVillage);
router.get('/school-list-by-village-pdf', authMiddleware, exportSchoolListByVillage);
router.get('/print-college-pdf', authMiddleware, exportPrintCollege);
router.get('/export', authMiddleware, exportReport);

export default router;

