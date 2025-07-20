import OpenAI from 'openai';
import { appConfig } from '../config/app.js';

class OpenAIService {
  constructor() {
    if (!appConfig.openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }
    
    this.openai = new OpenAI({
      apiKey: appConfig.openaiApiKey
    });
  }

  async analyzeAssessment(prompt) {
    try {
      const completion = await this.openai.chat.completions.create({
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

      const response = completion.choices[0].message.content;
      return JSON.parse(response);
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error('Failed to analyze assessment with AI');
    }
  }

  // Validate OpenAI API key
  static validateApiKey() {
    return !!appConfig.openaiApiKey;
  }
}

export default OpenAIService; 