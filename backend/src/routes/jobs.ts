import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob
} from '../controllers/jobsController';

const router = Router();

// GET /api/jobs - Get all jobs (public for application form)
router.get('/', getAllJobs);

// GET /api/jobs/:id - Get job by ID
router.get('/:id', authenticate, getJobById);

// POST /api/jobs - Create new job
router.post('/', authenticate, createJob);

// PUT /api/jobs/:id - Update job
router.put('/:id', authenticate, updateJob);

// DELETE /api/jobs/:id - Delete job (soft delete)
router.delete('/:id', authenticate, deleteJob);

export default router;