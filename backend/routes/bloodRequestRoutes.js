import express from 'express';
import {
  createBloodRequest,
  getBloodRequests,
  getUserBloodRequests,
  getBloodRequest,
  updateBloodRequest,
  respondToBloodRequest,
  updateBloodRequestStatus,
  deleteBloodRequest,
  getMatchingDonors,
  getBloodRequestStats,
} from '../controllers/bloodRequestController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getBloodRequests);
router.get('/stats', getBloodRequestStats);

// Protected routes
router.use(authMiddleware);

router.post('/', createBloodRequest);
router.get('/user/my-requests', getUserBloodRequests);
router.get('/:id', getBloodRequest);
router.put('/:id', updateBloodRequest);
router.post('/:id/respond', respondToBloodRequest);
router.put('/:id/status', updateBloodRequestStatus);
router.delete('/:id', deleteBloodRequest);
router.get('/:id/matching-donors', getMatchingDonors);

export default router;
