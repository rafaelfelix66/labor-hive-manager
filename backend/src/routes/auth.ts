import { Router } from 'express';
import { login, logout, getCurrentUser, createUser } from '../controllers/authController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// POST /api/auth/login
router.post('/login', login);

// POST /api/auth/logout
router.post('/logout', authenticate, logout);

// GET /api/auth/me
router.get('/me', authenticate, getCurrentUser);

// POST /api/auth/register (admin only)
router.post('/register', authenticate, authorize('admin'), createUser);

export default router;