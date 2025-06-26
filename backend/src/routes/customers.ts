import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer
} from '../controllers/customersController';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// GET /api/customers
router.get('/', getAllCustomers);

// POST /api/customers
router.post('/', createCustomer);

// GET /api/customers/:id
router.get('/:id', getCustomerById);

// PUT /api/customers/:id
router.put('/:id', updateCustomer);

// DELETE /api/customers/:id
router.delete('/:id', deleteCustomer);

export default router;