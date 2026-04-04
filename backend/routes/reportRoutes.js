import express from 'express';
import {
  createReport,
  getReports,
  getUserReports,
  getReport,
  updateReport,
  updateReportStatus,
  likeReport,
  deleteReport,
  getReportStats,
} from '../controllers/reportController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getReports);
router.get('/stats', getReportStats);
router.get('/:id', getReport);

// Protected routes
router.use(authMiddleware);

router.post('/', createReport);
router.get('/user/my-reports', getUserReports);
router.put('/:id', updateReport);
router.put('/:id/status', updateReportStatus);
router.post('/:id/like', likeReport);
router.delete('/:id', deleteReport);

export default router;
