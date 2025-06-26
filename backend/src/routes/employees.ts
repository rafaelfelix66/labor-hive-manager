import { Router } from 'express';
import {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee
} from '../controllers/employeesController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// GET /api/employees
router.get('/', getAllEmployees);

// POST /api/employees
router.post('/', createEmployee);

// GET /api/employees/:id
router.get('/:id', getEmployeeById);

// PUT /api/employees/:id
router.put('/:id', updateEmployee);

// DELETE /api/employees/:id
router.delete('/:id', deleteEmployee);

export default router;