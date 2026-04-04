import express from 'express';
import {
  getTrustedContacts,
  addTrustedContact,
  getTrustedContact,
  updateTrustedContact,
  deleteTrustedContact,
  setPrimaryContact,
} from '../controllers/trustedContactController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

router.get('/', getTrustedContacts);
router.post('/', addTrustedContact);
router.get('/:id', getTrustedContact);
router.put('/:id', updateTrustedContact);
router.delete('/:id', deleteTrustedContact);
router.put('/:id/set-primary', setPrimaryContact);

export default router;
