require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

/**
 * Analyzes text for AI probability using Gemini
 * @param {string} text - The input text to analyze
 * @returns {object} Analysis result
 */
async function analyzeText(text) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is missing in server environment variables.');
  }

  const modelsToTry = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-flash-latest'];
  let result;
  let lastError;

  for (const modelName of modelsToTry) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      result = await model.generateContent(prompt);
      lastError = null;
      break; 
    } catch (error) {
      console.warn(`Model ${modelName} failed:`, error.message);
      lastError = error;
      if (error.message.includes('503') || error.message.includes('429')) {
        continue;
      }
      break;
    }
  }

  if (lastError) {
    console.error('Gemini API Error:', lastError);
    throw new Error(lastError.message || 'Failed to analyze text using Gemini API.');
  }

  try {
    const response = await result.response;
    let textResponse = response.text().trim();
    
    // Strip markdown code blocks if the model wrapped the JSON
    if (textResponse.startsWith('\`\`\`json')) {
      textResponse = textResponse.replace(/^\`\`\`json/, '').replace(/\`\`\`$/, '').trim();
    } else if (textResponse.startsWith('\`\`\`')) {
      textResponse = textResponse.replace(/^\`\`\`/, '').replace(/\`\`\`$/, '').trim();
    }

    const jsonResult = JSON.parse(textResponse);
    return jsonResult;
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to analyze text using Gemini API.');
  }
}

/**
 * Humanizes text by rewriting it to sound natural using Gemini
 * @param {string} text - The input text to humanize
 * @returns {string} Humanized text
 */
async function humanizeText(text) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is missing in server environment variables.');
  }

  const modelsToTry = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-flash-latest'];
  let result;
  let lastError;

  for (const modelName of modelsToTry) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      result = await model.generateContent(prompt);
      lastError = null;
      break; 
    } catch (error) {
      console.warn(`Model ${modelName} failed:`, error.message);
      lastError = error;
      if (error.message.includes('503') || error.message.includes('429')) {
        continue;
      }
      break;
    }
  }

  if (lastError) {
    console.error('Gemini API Error:', lastError);
    throw new Error(lastError.message || 'Failed to humanize text using Gemini API.');
  }

  try {
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to humanize text using Gemini API.');
  }
}

module.exports = {
  analyzeText,
  humanizeText
};
