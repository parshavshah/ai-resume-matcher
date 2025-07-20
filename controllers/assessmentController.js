import Assessment from '../models/Assessment.js';
import OpenAIService from '../services/openaiService.js';
import FileService from '../services/fileService.js';

class AssessmentController {
  constructor() {
    this.openaiService = new OpenAIService();
    this.fileService = new FileService();
  }

  // Show assessment form
  async showForm(req, res) {
    try {
      res.render('index', { result: null, error: null });
    } catch (error) {
      console.error('Error showing form:', error);
      res.render('index', { 
        result: null, 
        error: 'An error occurred while loading the form.' 
      });
    }
  }

  // Process assessment
  async processAssessment(req, res) {
    try {
      const { jobDescription } = req.body;
      const resumeFile = req.file;

      // Validate inputs
      if (!jobDescription || !resumeFile) {
        return res.render('index', { 
          result: null, 
          error: 'Please provide both job description and resume file.' 
        });
      }

      // Validate OpenAI API key
      if (!OpenAIService.validateApiKey()) {
        return res.render('index', { 
          result: null, 
          error: 'OpenAI API key not configured. Please set up your API key in the Secrets tool.' 
        });
      }

      // Read resume content
      const resumeContent = await this.fileService.readFile(resumeFile.path);

      // Create assessment model
      const assessment = new Assessment(jobDescription, resumeContent);

      // Validate assessment data
      const validationErrors = assessment.validate();
      if (validationErrors.length > 0) {
        await this.fileService.deleteFile(resumeFile.path);
        return res.render('index', { 
          result: null, 
          error: validationErrors.join(', ') 
        });
      }

      // Generate prompt and analyze
      const prompt = assessment.generatePrompt();
      const analysis = await this.openaiService.analyzeAssessment(prompt);

      // Clean up uploaded file
      await this.fileService.deleteFile(resumeFile.path);

      // Render results
      res.render('index', { result: analysis, error: null });

    } catch (error) {
      console.error('Error during assessment:', error);
      
      // Clean up uploaded file if it exists
      if (req.file) {
        await this.fileService.deleteFile(req.file.path);
      }

      res.render('index', { 
        result: null, 
        error: 'An error occurred during assessment. Please try again.' 
      });
    }
  }

  // Handle file upload errors
  handleUploadError(error, req, res, next) {
    console.error('File upload error:', error);
    
    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.render('index', { 
          result: null, 
          error: 'File size too large. Maximum size is 5MB.' 
        });
      }
    }
    
    res.render('index', { 
      result: null, 
      error: error.message || 'File upload error occurred.' 
    });
  }
}

export default AssessmentController; 