import express from 'express';
import {
  getAlerts,
  createAlert,
  getAlert,
  updateAlert,
  deleteAlert,
  getActiveAlerts,
} from '../controllers/alertController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAlerts);
router.get('/active/only', getActiveAlerts);
router.get('/:id', getAlert);

// Protected routes
router.use(authMiddleware);

router.post('/', createAlert);
router.put('/:id', updateAlert);
router.delete('/:id', deleteAlert);

export default router;
