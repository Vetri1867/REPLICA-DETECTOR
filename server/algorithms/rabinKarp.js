/**
 * Rabin-Karp Algorithm for pattern matching
 * Uses rolling hash for efficient multi-pattern search
 */

const BASE = 256;
const MOD = 101;

function rabinKarpSearch(text, pattern) {
  const results = [];
  const n = text.length;
  const m = pattern.length;

  if (m === 0 || n === 0 || m > n) return results;

  let patternHash = 0;
  let textHash = 0;
  let h = 1;

  // h = BASE^(m-1) % MOD
  for (let i = 0; i < m - 1; i++) {
    h = (h * BASE) % MOD;
  }

  // Initial hash values
  for (let i = 0; i < m; i++) {
    patternHash = (BASE * patternHash + pattern.charCodeAt(i)) % MOD;
    textHash = (BASE * textHash + text.charCodeAt(i)) % MOD;
  }

  // Slide the pattern over text
  for (let i = 0; i <= n - m; i++) {
    if (patternHash === textHash) {
      // Verify character by character
      let match = true;
      for (let j = 0; j < m; j++) {
        if (text[i + j] !== pattern[j]) {
          match = false;
          break;
        }
      }
      if (match) {
        results.push(i);
      }
    }

    // Calculate hash for next window
    if (i < n - m) {
      textHash = (BASE * (textHash - text.charCodeAt(i) * h) + text.charCodeAt(i + m)) % MOD;
      if (textHash < 0) textHash += MOD;
    }
  }

  return results;
}

/**
 * Find all matching n-grams between two texts using Rabin-Karp
 */
function rabinKarpCompare(text1, text2, ngramSize = 4) {
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

  // Generate n-grams from text2
  const ngrams2 = new Set();
  for (let i = 0; i <= words2.length - ngramSize; i++) {
    ngrams2.add(words2.slice(i, i + ngramSize).join(' '));
  }

  // Search for matches using Rabin-Karp on concatenated text
  const matches = [];
  const matchedPositions = new Set();

  for (let i = 0; i <= words1.length - ngramSize; i++) {
    const ngram = words1.slice(i, i + ngramSize).join(' ');
    if (ngrams2.has(ngram)) {
      // Use Rabin-Karp to find exact position in text2
      const positions = rabinKarpSearch(text2, ngram);
      if (positions.length > 0) {
        const key = `${i}-${ngram}`;
        if (!matchedPositions.has(key)) {
          matchedPositions.add(key);
          matches.push({
            text: ngram,
            positionInSource: i,
            positionInTarget: positions[0],
            length: ngram.length,
          });
        }
      }
    }
  }

  const totalNgrams1 = Math.max(1, words1.length - ngramSize + 1);

  return {
    matches,
    matchCount: matches.length,
    totalNgrams: totalNgrams1,
    similarity: (matches.length / totalNgrams1) * 100,
    executionTime: performance.now() - start,
    algorithm: 'Rabin-Karp',
  };
}

module.exports = { rabinKarpSearch, rabinKarpCompare };
