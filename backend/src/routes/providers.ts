import { Router } from 'express';
import {
  getAllProviders,
  getProviderById,
  createProvider,
  updateProvider,
  deleteProvider
} from '../controllers/providersController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// GET /api/providers
router.get('/', getAllProviders);

// POST /api/providers
router.post('/', createProvider);

// GET /api/providers/:id
router.get('/:id', getProviderById);

// PUT /api/providers/:id
router.put('/:id', updateProvider);

// DELETE /api/providers/:id
router.delete('/:id', deleteProvider);

export default router;