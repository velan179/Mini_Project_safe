import express from 'express';
import {
  register,
  login,
  getCurrentUser,
  updateProfile,
  changePassword,
} from '../controllers/authController.js';
import authMiddleware from '../middleware/auth.js';
import { validateEmail, validatePassword } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.post('/register', validateEmail, validatePassword, register);
router.post('/login', validateEmail, login);

// Protected routes
router.get('/me', authMiddleware, getCurrentUser);
router.put('/profile', authMiddleware, updateProfile);
router.put('/change-password', authMiddleware, changePassword);

export default router;
