import { Router } from 'express';
import { upload, uploadLicense, serveFile, downloadFile } from '../controllers/uploadController';

const router = Router();

// POST /api/uploads/license - Upload license file
router.post('/license', upload.single('license'), uploadLicense);

// GET /api/uploads/files/:filename - Serve file for viewing
router.get('/files/:filename', serveFile);

// GET /api/uploads/download/:filename - Download file
router.get('/download/:filename', downloadFile);

// Legacy endpoints for compatibility
router.post('/documents', (req, res) => {
  res.json({
    success: true,
    message: 'File upload endpoint - to be implemented',
    data: null,
  });
});

router.get('/:id', (req, res) => {
  res.json({
    success: true,
    message: 'File download endpoint - to be implemented',
    data: null,
  });
});

export default router;