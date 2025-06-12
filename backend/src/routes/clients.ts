import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient
} from '../controllers/clientsController';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// GET /api/clients
router.get('/', getAllClients);

// POST /api/clients
router.post('/', createClient);

// GET /api/clients/:id
router.get('/:id', getClientById);

// PUT /api/clients/:id
router.put('/:id', updateClient);

// DELETE /api/clients/:id
router.delete('/:id', deleteClient);

export default router;