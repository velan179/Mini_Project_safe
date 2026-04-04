import express from 'express';
import {
  uploadEvidence,
  getUserEvidence,
  getEvidence,
  deleteEvidence,
  updateEvidenceStatus,
  getPublicEvidence,
} from '../controllers/evidenceController.js';
import authMiddleware from '../middleware/auth.js';
import upload from '../middleware/fileUpload.js';

const router = express.Router();

// Protected routes
router.use(authMiddleware);

router.post('/upload', upload.single('file'), uploadEvidence);
router.get('/user/all', getUserEvidence);
router.get('/public/all', getPublicEvidence);
router.get('/:id', getEvidence);
router.delete('/:id', deleteEvidence);
router.put('/:id/status', updateEvidenceStatus);

export default router;
