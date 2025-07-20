import express from 'express';
import AssessmentController from '../controllers/assessmentController.js';
import upload from '../config/multer.js';

const router = express.Router();
const assessmentController = new AssessmentController();

// GET / - Show assessment form
router.get('/', assessmentController.showForm.bind(assessmentController));

// POST /assess - Process assessment
router.post('/assess', 
  upload.single('resume'), 
  assessmentController.processAssessment.bind(assessmentController)
);

// Error handling middleware for file uploads
router.use((error, req, res, next) => {
  if (error) {
    return assessmentController.handleUploadError(error, req, res, next);
  }
  next();
});

export default router; 