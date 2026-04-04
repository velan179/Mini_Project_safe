import express from 'express';
import {
  createBloodBank,
  getAllBloodBanks,
  searchBloodBanksByCity,
  getBloodBank,
  updateBloodBank,
  updateInventory,
  addReview,
  deleteBloodBank,
} from '../controllers/bloodBankController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllBloodBanks);
router.get('/search', searchBloodBanksByCity);
router.get('/:id', getBloodBank);

// Protected routes
router.use(authMiddleware);

router.post('/', createBloodBank);
router.put('/:id', updateBloodBank);
router.put('/:id/inventory', updateInventory);
router.post('/:id/review', addReview);
router.delete('/:id', deleteBloodBank);

export default router;
