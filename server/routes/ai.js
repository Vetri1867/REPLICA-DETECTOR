const express = require('express');
const router = express.Router();
const { analyzeText, humanizeText } = require('../utils/aiService');

// POST /api/ai/detect
router.post('/detect', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.trim() === '') {
      return res.status(400).json({ error: 'Text is required' });
    }

    const analysis = await analyzeText(text);
    res.json(analysis);
  } catch (error) {
    console.error('AI Detect Error:', error.message);
    res.status(500).json({ error: error.message || 'Internal server error during analysis' });
  }
});

// POST /api/ai/humanize
router.post('/humanize', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.trim() === '') {
      return res.status(400).json({ error: 'Text is required' });
    }

    const humanizedText = await humanizeText(text);
    res.json({ result: humanizedText });
  } catch (error) {
    console.error('AI Humanize Error:', error.message);
    res.status(500).json({ error: error.message || 'Internal server error during humanization' });
  }
});

module.exports = router;
