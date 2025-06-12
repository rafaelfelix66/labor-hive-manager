import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  getBills,
  getBillById,
  createBill,
  updateBill,
  deleteBill,
  generateBillPDF,
  getReports
} from '../controllers/billsController';

const router = Router();

// Apply authentication to all routes
router.use(authenticate);

// GET /api/bills - Get all bills with filtering
router.get('/', getBills);

// GET /api/bills/reports - Get financial reports
router.get('/reports', getReports);

// POST /api/bills - Create new bill
router.post('/', createBill);

// GET /api/bills/:id - Get bill by ID
router.get('/:id', getBillById);

// PUT /api/bills/:id - Update bill
router.put('/:id', updateBill);

// DELETE /api/bills/:id - Delete bill
router.delete('/:id', deleteBill);

// GET /api/bills/:id/pdf - Generate bill PDF
router.get('/:id/pdf', generateBillPDF);

export default router;