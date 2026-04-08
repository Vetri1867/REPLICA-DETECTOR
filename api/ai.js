const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

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
      break; // Success
    } catch (error) {
      console.warn(`Model ${modelName} failed:`, error.message);
      lastError = error;
      // If it's a 503 (high demand) or 429 (rate limit), try the next model
      if (error.message.includes('503') || error.message.includes('429')) {
        continue;
      }
      break; // For other errors like 400 or 403, fail immediately
    }
  }

  if (lastError) {
    throw lastError;
  }

  const response = await result.response;
  let textResponse = response.text().trim();

  // Strip markdown code blocks if the model wrapped the JSON
  if (textResponse.startsWith('\`\`\`json')) {
    textResponse = textResponse.replace(/^\`\`\`json/, '').replace(/\`\`\`$/, '').trim();
  } else if (textResponse.startsWith('\`\`\`')) {
    textResponse = textResponse.replace(/^\`\`\`/, '').replace(/\`\`\`$/, '').trim();
  }

  return JSON.parse(textResponse);
}

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
      break; // Success
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
    throw lastError;
  }

  const response = await result.response;
  return response.text().trim();
}

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text, action } = req.body;

    if (!text || text.trim() === '') {
      return res.status(400).json({ error: 'Text is required' });
    }

    if (!action || !['detect', 'humanize'].includes(action)) {
      return res.status(400).json({ error: 'action must be "detect" or "humanize"' });
    }

    if (action === 'detect') {
      const analysis = await analyzeText(text);
      return res.json(analysis);
    } else {
      const humanizedText = await humanizeText(text);
      return res.json({ result: humanizedText });
    }
  } catch (error) {
    console.error('AI API Error:', error.message);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};
