import { Router } from 'express';

const router = Router();

// GET /api/suppliers
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Get all suppliers endpoint - to be implemented',
    data: [],
  });
});

// POST /api/suppliers
router.post('/', (req, res) => {
  res.json({
    success: true,
    message: 'Create supplier endpoint - to be implemented',
    data: null,
  });
});

// GET /api/suppliers/:id
router.get('/:id', (req, res) => {
  res.json({
    success: true,
    message: 'Get supplier by ID endpoint - to be implemented',
    data: null,
  });
});

// PUT /api/suppliers/:id
router.put('/:id', (req, res) => {
  res.json({
    success: true,
    message: 'Update supplier endpoint - to be implemented',
    data: null,
  });
});

// DELETE /api/suppliers/:id
router.delete('/:id', (req, res) => {
  res.json({
    success: true,
    message: 'Delete supplier endpoint - to be implemented',
    data: null,
  });
});

export default router;