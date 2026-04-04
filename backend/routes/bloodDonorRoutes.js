import express from 'express';
import {
  registerAsDonor,
  getDonorProfile,
  searchDonors,
  getAvailableDonors,
  updateDonorAvailability,
  recordDonation,
  updateDonorProfile,
  getDonorStats,
} from '../controllers/bloodDonorController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/search', searchDonors);
router.get('/available/all', getAvailableDonors);
router.get('/stats', getDonorStats);

// Protected routes
router.use(authMiddleware);

router.post('/register', registerAsDonor);
router.get('/profile/me', getDonorProfile);
router.put('/availability/update', updateDonorAvailability);
router.post('/donation/record', recordDonation);
router.put('/profile/update', updateDonorProfile);

export default router;
