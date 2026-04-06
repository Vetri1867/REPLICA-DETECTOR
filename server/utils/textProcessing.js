/**
 * Text preprocessing utilities for plagiarism detection
 */

// Common English stop words
const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been',
  'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
  'could', 'should', 'may', 'might', 'shall', 'can', 'need', 'dare',
  'ought', 'used', 'it', 'its', 'he', 'she', 'they', 'them', 'their',
  'this', 'that', 'these', 'those', 'i', 'me', 'my', 'we', 'us', 'our',
  'you', 'your', 'not', 'no', 'nor', 'as', 'if', 'then', 'than', 'too',
  'very', 'just', 'about', 'above', 'after', 'again', 'all', 'also',
  'am', 'any', 'because', 'before', 'between', 'both', 'each', 'few',
  'get', 'got', 'here', 'how', 'into', 'more', 'most', 'much', 'must',
  'new', 'now', 'off', 'old', 'only', 'other', 'own', 'same', 'so',
  'some', 'still', 'such', 'there', 'through', 'under', 'up', 'when',
  'where', 'which', 'while', 'who', 'whom', 'why', 'what', 'out', 'over',
]);

/**
 * Basic text preprocessing
 */
function preprocessText(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')  // Remove punctuation
    .replace(/\s+/g, ' ')      // Normalize whitespace
    .trim();
}

/**
 * Remove stop words from text
 */
function removeStopWords(text) {
  return text
    .split(/\s+/)
    .filter(word => !STOP_WORDS.has(word.toLowerCase()))
    .join(' ');
}

/**
 * Generate n-grams from text
 */
function generateNgrams(text, n = 3) {
  const words = text.split(/\s+/).filter(Boolean);
  const ngrams = [];
  for (let i = 0; i <= words.length - n; i++) {
    ngrams.push(words.slice(i, i + n).join(' '));
  }
  return ngrams;
}

/**
 * Split text into sentences
 */
function tokenizeSentences(text) {
  return text
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);
}

/**
 * Extract keywords (non-stop words with frequency)
 */
function extractKeywords(text) {
  const words = preprocessText(text).split(/\s+/).filter(Boolean);
  const freq = {};

  words.forEach(word => {
    if (!STOP_WORDS.has(word) && word.length > 2) {
      freq[word] = (freq[word] || 0) + 1;
    }
  });

  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30)
    .map(([word, count]) => ({ word, count }));
}

/**
 * Calculate n-gram overlap between two texts
 */
function ngramOverlap(text1, text2, n = 3) {
  const ngrams1 = new Set(generateNgrams(text1, n));
  const ngrams2 = new Set(generateNgrams(text2, n));

  let intersection = 0;
  ngrams1.forEach(ng => {
    if (ngrams2.has(ng)) intersection++;
  });

  const union = ngrams1.size + ngrams2.size - intersection;
  return union === 0 ? 0 : (intersection / union) * 100;
}

/**
 * Sentence-wise comparison
 */
function compareSentences(text1, text2) {
  const stringSimilarity = require('string-similarity');
  const sentences1 = tokenizeSentences(text1);
  const sentences2 = tokenizeSentences(text2);

  const results = [];

  sentences1.forEach((s1, i) => {
    let bestMatch = { sentence: '', similarity: 0, index: -1 };
    sentences2.forEach((s2, j) => {
      const sim = stringSimilarity.compareTwoStrings(s1, s2);
      if (sim > bestMatch.similarity) {
        bestMatch = { sentence: s2, similarity: sim, index: j };
      }
    });

    if (bestMatch.similarity > 0.3) {
      results.push({
        sourceIndex: i,
        sourceSentence: s1,
        matchedSentence: bestMatch.sentence,
        matchedIndex: bestMatch.index,
        similarity: Math.round(bestMatch.similarity * 100),
      });
    }
  });

  return results;
}

/**
 * Find matching keywords between two texts
 */
function findKeywordMatches(text1, text2) {
  const keywords1 = extractKeywords(text1);
  const keywords2 = extractKeywords(text2);
  const kw2Set = new Set(keywords2.map(k => k.word));

  return keywords1.filter(k => kw2Set.has(k.word));
}

/**
 * Get color-coded similarity level
 */
function getSimilarityLevel(percentage) {
  if (percentage <= 20) return { level: 'low', color: '#2ecc71', label: 'Low Similarity' };
  if (percentage <= 50) return { level: 'moderate', color: '#f39c12', label: 'Moderate Similarity' };
  return { level: 'high', color: '#e74c3c', label: 'High Similarity' };
}

module.exports = {
  preprocessText,
  removeStopWords,
  generateNgrams,
  tokenizeSentences,
  extractKeywords,
  ngramOverlap,
  compareSentences,
  findKeywordMatches,
  getSimilarityLevel,
  STOP_WORDS,
};
