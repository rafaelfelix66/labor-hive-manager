import { Router } from 'express';

const router = Router();

// GET /api/providers
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Get all service providers endpoint - to be implemented',
    data: [],
  });
});

// POST /api/providers
router.post('/', (req, res) => {
  res.json({
    success: true,
    message: 'Create service provider endpoint - to be implemented',
    data: null,
  });
});

// GET /api/providers/:id
router.get('/:id', (req, res) => {
  res.json({
    success: true,
    message: 'Get service provider by ID endpoint - to be implemented',
    data: null,
  });
});

// PUT /api/providers/:id
router.put('/:id', (req, res) => {
  res.json({
    success: true,
    message: 'Update service provider endpoint - to be implemented',
    data: null,
  });
});

// DELETE /api/providers/:id
router.delete('/:id', (req, res) => {
  res.json({
    success: true,
    message: 'Delete service provider endpoint - to be implemented',
    data: null,
  });
});

export default router;