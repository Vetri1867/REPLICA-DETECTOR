const express = require('express');
const router = express.Router();
const { analyzeText, humanizeText } = require('../utils/aiService');

// POST /api/ai/
router.post('/', async (req, res) => {
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
      res.json(analysis);
    } else {
      const humanizedText = await humanizeText(text);
      res.json({ result: humanizedText });
    }
  } catch (error) {
    console.error('AI API Error:', error.message);
    res.status(500).json({ error: error.message || 'Internal server error during analysis' });
  }
});

module.exports = router;
