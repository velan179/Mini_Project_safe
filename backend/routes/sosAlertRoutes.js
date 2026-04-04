import express from 'express';
import {
  createSOSAlert,
  getSOSAlerts,
  getUserSOSAlerts,
  getSOSAlert,
  updateSOSAlertStatus,
  addRespondent,
  getNearbyAlerts,
  deleteSOSAlert,
} from '../controllers/sosAlertController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getSOSAlerts);
router.get('/nearby/search', getNearbyAlerts);

// Protected routes
router.use(authMiddleware);

router.post('/', createSOSAlert);
router.get('/user/my-alerts', getUserSOSAlerts);
router.get('/:id', getSOSAlert);
router.put('/:id/status', updateSOSAlertStatus);
router.post('/:id/respond', addRespondent);
router.delete('/:id', deleteSOSAlert);

export default router;
