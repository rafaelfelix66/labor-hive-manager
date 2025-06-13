import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService
} from '../controllers/servicesController';

const router = Router();

// GET /api/services - Get all services (public for application form)
router.get('/', getAllServices);

// GET /api/services/:id - Get service by ID
router.get('/:id', authenticate, getServiceById);

// POST /api/services - Create new service
router.post('/', authenticate, createService);

// PUT /api/services/:id - Update service
router.put('/:id', authenticate, updateService);

// DELETE /api/services/:id - Delete service (soft delete)
router.delete('/:id', authenticate, deleteService);

export default router;