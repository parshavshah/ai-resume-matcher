// Assessment Model - Handles assessment data and business logic

export class Assessment {
  constructor(jobDescription, resumeContent) {
    this.jobDescription = jobDescription;
    this.resumeContent = resumeContent;
    this.timestamp = new Date();
  }

  // Validate assessment data
  validate() {
    const errors = [];

    if (!this.jobDescription || this.jobDescription.trim().length === 0) {
      errors.push('Job description is required');
    }

    if (!this.resumeContent || this.resumeContent.trim().length === 0) {
      errors.push('Resume content is required');
    }

    if (this.jobDescription && this.jobDescription.length > 5000) {
      errors.push('Job description is too long (max 5000 characters)');
    }

    if (this.resumeContent && this.resumeContent.length > 10000) {
      errors.push('Resume content is too long (max 10000 characters)');
    }

    return errors;
  }

  // Generate assessment prompt for OpenAI
  generatePrompt() {
    return `
You are an expert HR professional. Analyze the compatibility between a job description and a candidate's resume.

Job Description:
${this.jobDescription}

Candidate Resume:
${this.resumeContent}

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
  }

  // Get assessment result structure
  static getResultStructure() {
    return {
      score: 0,
      strengths: [],
      weaknesses: [],
      recommendation: '',
      reasoning: ''
    };
  }
}

export default Assessment; 