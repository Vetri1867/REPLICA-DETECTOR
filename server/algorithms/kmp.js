/**
 * KMP (Knuth-Morris-Pratt) Algorithm for pattern matching
 * Uses failure function for efficient pattern search
 */

function computeFailureFunction(pattern) {
  const m = pattern.length;
  const failure = new Array(m).fill(0);
  let j = 0;

  for (let i = 1; i < m; i++) {
    while (j > 0 && pattern[i] !== pattern[j]) {
      j = failure[j - 1];
    }
    if (pattern[i] === pattern[j]) {
      j++;
    }
    failure[i] = j;
  }

  return failure;
}

function kmpSearch(text, pattern) {
  const results = [];
  const n = text.length;
  const m = pattern.length;

  if (m === 0 || n === 0 || m > n) return results;

  const failure = computeFailureFunction(pattern);
  let j = 0;

  for (let i = 0; i < n; i++) {
    while (j > 0 && text[i] !== pattern[j]) {
      j = failure[j - 1];
    }
    if (text[i] === pattern[j]) {
      j++;
    }
    if (j === m) {
      results.push(i - m + 1);
      j = failure[j - 1];
    }
  }

  return results;
}

/**
 * Find all matching n-grams between two texts using KMP
 */
function kmpCompare(text1, text2, ngramSize = 4) {
  const start = performance.now();

  const words1 = text1.split(/\s+/).filter(Boolean);
  const words2 = text2.split(/\s+/).filter(Boolean);

  if (words1.length < ngramSize || words2.length < ngramSize) {
    return {
      matches: [],
      matchCount: 0,
      totalNgrams: 0,
      executionTime: performance.now() - start,
    };
  }

  const matches = [];
  const matchedNgrams = new Set();

  for (let i = 0; i <= words1.length - ngramSize; i++) {
    const ngram = words1.slice(i, i + ngramSize).join(' ');

    if (matchedNgrams.has(ngram)) continue;

    // Use KMP to search for this ngram in text2
    const positions = kmpSearch(text2, ngram);
    if (positions.length > 0) {
      matchedNgrams.add(ngram);
      matches.push({
        text: ngram,
        positionInSource: i,
        positionInTarget: positions[0],
        length: ngram.length,
      });
    }
  }

  const totalNgrams1 = Math.max(1, words1.length - ngramSize + 1);

  return {
    matches,
    matchCount: matches.length,
    totalNgrams: totalNgrams1,
    similarity: (matches.length / totalNgrams1) * 100,
    executionTime: performance.now() - start,
    algorithm: 'KMP',
  };
}

module.exports = { kmpSearch, kmpCompare };
