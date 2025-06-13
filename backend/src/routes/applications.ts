import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  getAllApplications,
  getApplicationById,
  createApplication,
  updateApplication,
  deleteApplication,
  getApplicationStats
} from '../controllers/applicationsController';

const router = Router();

// GET /api/applications/stats - Get application statistics
router.get('/stats', authenticate, getApplicationStats);

// GET /api/applications - Get all applications with filtering
router.get('/', authenticate, getAllApplications);

// POST /api/applications - Create new application (public endpoint)
router.post('/', createApplication);

// GET /api/applications/:id - Get application by ID
router.get('/:id', authenticate, getApplicationById);

// PUT /api/applications/:id - Update application (approve/reject)
router.put('/:id', authenticate, updateApplication);

// DELETE /api/applications/:id - Delete application
router.delete('/:id', authenticate, deleteApplication);

export default router;