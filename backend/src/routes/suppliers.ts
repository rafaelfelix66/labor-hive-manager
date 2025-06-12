import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  getAllSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier
} from '../controllers/suppliersController';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// GET /api/suppliers
router.get('/', getAllSuppliers);

// POST /api/suppliers
router.post('/', createSupplier);

// GET /api/suppliers/:id
router.get('/:id', getSupplierById);

// PUT /api/suppliers/:id
router.put('/:id', updateSupplier);

// DELETE /api/suppliers/:id
router.delete('/:id', deleteSupplier);

export default router;