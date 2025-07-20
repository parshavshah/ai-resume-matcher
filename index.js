
import express from 'express';
import multer from 'multer';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

const upload = multer({ storage: storage });

// Create uploads directory if it doesn't exist
await fs.ensureDir('uploads');

// Set up EJS as the template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
  res.render('index', { result: null, error: null });
});

app.post('/assess', upload.single('resume'), async (req, res) => {
  try {
    const { jobDescription } = req.body;
    const resumeFile = req.file;

    if (!jobDescription || !resumeFile) {
      return res.render('index', { 
        result: null, 
        error: 'Please provide both job description and resume file.' 
      });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.render('index', { 
        result: null, 
        error: 'OpenAI API key not configured. Please set up your API key in the Secrets tool.' 
      });
    }

    // Read the resume file
    const resumeContent = await fs.readFile(resumeFile.path, 'utf-8');

    // Create prompt for OpenAI
    const prompt = `
You are an expert HR professional. Analyze the compatibility between a job description and a candidate's resume.

Job Description:
${jobDescription}

Candidate Resume:
${resumeContent}

Please provide:
1. A compatibility score from 0-100 (where 100 is a perfect match)
2. Key strengths that align with the job requirements
3. Areas where the candidate may not meet requirements
4. Overall recommendation

Format your response as JSON with the following structure:
{
  "score": number,
  "strengths": [string array],
  "weaknesses": [string array],
  "recommendation": "string",
  "reasoning": "string"
}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert HR professional who analyzes candidate-job fit. Always respond with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1000
    });

    const analysis = JSON.parse(completion.choices[0].message.content);

    // Clean up uploaded file
    await fs.remove(resumeFile.path);

    res.render('index', { result: analysis, error: null });

  } catch (error) {
    console.error('Error during assessment:', error);
    
    // Clean up uploaded file if it exists
    if (req.file) {
      await fs.remove(req.file.path).catch(() => {});
    }

    res.render('index', { 
      result: null, 
      error: 'An error occurred during assessment. Please try again.' 
    });
  }
});

app.listen(5000, '0.0.0.0', () => {
  console.log('HR Assessment App running on http://0.0.0.0:5000');
});
