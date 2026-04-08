const express = require('express');
const router = express.Router();
const natural = require('natural');
const { rabinKarpCompare } = require('../algorithms/rabinKarp');
const { kmpCompare } = require('../algorithms/kmp');
const {
  preprocessText,
  removeStopWords,
  ngramOverlap,
  compareSentences,
  findKeywordMatches,
  extractKeywords,
  getSimilarityLevel,
} = require('../utils/textProcessing');

router.post('/', (req, res) => {
  try {
    const {
      text1,
      text2,
      algorithm = 'rabin-karp',
      threshold = 20,
      ngramSize = 4,
    } = req.body;

    if (!text1 || !text2) {
      return res.status(400).json({ error: 'Both text1 and text2 are required' });
    }

    // Preprocess
    const processed1 = preprocessText(text1);
    const processed2 = preprocessText(text2);
    const cleaned1 = removeStopWords(processed1);
    const cleaned2 = removeStopWords(processed2);

    // Algorithm-based comparison
    let algorithmResult;
    if (algorithm === 'kmp') {
      algorithmResult = kmpCompare(cleaned1, cleaned2, ngramSize);
    } else {
      algorithmResult = rabinKarpCompare(cleaned1, cleaned2, ngramSize);
    }

    // String similarity (cosine-like)
    const overallSimilarity = Math.round(
      natural.DiceCoefficient(processed1, processed2) * 100
    );

    // N-gram overlap
    const ngramSimilarity = Math.round(ngramOverlap(cleaned1, cleaned2, 3));

    // Sentence-wise comparison
    const sentenceComparison = compareSentences(processed1, processed2);

    // Keyword matching
    const keywordMatches = findKeywordMatches(text1, text2);
    const keywords1 = extractKeywords(text1);
    const keywords2 = extractKeywords(text2);

    // Combined similarity score
    const combinedSimilarity = Math.round(
      (overallSimilarity * 0.4 + algorithmResult.similarity * 0.3 + ngramSimilarity * 0.3)
    );

    // Similarity level
    const similarityLevel = getSimilarityLevel(combinedSimilarity);

    // Threshold check
    const isPlagiarized = combinedSimilarity >= threshold;

    res.json({
      overallSimilarity,
      algorithmSimilarity: Math.round(algorithmResult.similarity),
      ngramSimilarity,
      combinedSimilarity,
      similarityLevel,
      isPlagiarized,
      threshold,
      algorithm: algorithmResult.algorithm,
      executionTime: Math.round(algorithmResult.executionTime * 100) / 100,
      matches: algorithmResult.matches.slice(0, 50),
      matchCount: algorithmResult.matchCount,
      sentenceComparison: sentenceComparison.slice(0, 30),
      keywordMatches,
      keywords1,
      keywords2,
      processedText1: processed1,
      processedText2: processed2,
    });
  } catch (error) {
    console.error('Compare error:', error);
    res.status(500).json({ error: 'Comparison failed: ' + error.message });
  }
});

module.exports = router;
