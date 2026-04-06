import { useState } from 'react';
import LoadingOverlay from '../components/LoadingOverlay';

// Heuristic AI detection based on text analysis patterns
function analyzeForAI(text) {
  if (!text || text.trim().length < 50) {
    return { score: 0, analysis: [], verdict: 'Need more text (min 50 chars)' };
  }

  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 5);
  const words = text.split(/\s+/).filter(Boolean);
  const analysis = [];
  let totalScore = 0;

  // 1. Sentence length uniformity (AI tends to be more uniform)
  if (sentences.length > 2) {
    const lengths = sentences.map(s => s.trim().split(/\s+/).length);
    const avg = lengths.reduce((a, b) => a + b, 0) / lengths.length;
    const variance = lengths.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / lengths.length;
    const cv = Math.sqrt(variance) / avg; // coefficient of variation

    const uniformity = Math.max(0, Math.min(100, (1 - cv) * 100));
    if (uniformity > 60) {
      totalScore += uniformity * 0.3;
      analysis.push({
        metric: 'Sentence Length Uniformity',
        score: Math.round(uniformity),
        detail: `CV: ${cv.toFixed(2)} — AI text tends to have uniform sentence lengths`,
        type: uniformity > 75 ? 'high' : 'moderate',
      });
    }
  }

  // 2. Vocabulary richness (type-token ratio)
  const uniqueWords = new Set(words.map(w => w.toLowerCase()));
  const ttr = uniqueWords.size / words.length;
  const vocabFlag = ttr < 0.5;
  if (ttr < 0.65) {
    const vocScore = Math.max(0, (1 - ttr) * 100);
    totalScore += vocScore * 0.2;
    analysis.push({
      metric: 'Vocabulary Diversity',
      score: Math.round((1 - ttr) * 100),
      detail: `TTR: ${ttr.toFixed(2)} — Lower diversity may indicate AI generation`,
      type: ttr < 0.45 ? 'high' : 'moderate',
    });
  }

  // 3. Transition word frequency
  const transitions = ['however', 'furthermore', 'moreover', 'additionally', 'consequently',
    'therefore', 'nevertheless', 'in conclusion', 'on the other hand', 'as a result',
    'in addition', 'for instance', 'for example', 'in other words', 'specifically'];
  const lowerText = text.toLowerCase();
  const transCount = transitions.filter(t => lowerText.includes(t)).length;
  const transRatio = transCount / Math.max(1, sentences.length);
  if (transRatio > 0.2) {
    const transScore = Math.min(100, transRatio * 200);
    totalScore += transScore * 0.2;
    analysis.push({
      metric: 'Transition Word Density',
      score: Math.round(transScore),
      detail: `${transCount} transition phrases found — AI uses them heavily`,
      type: transRatio > 0.4 ? 'high' : 'moderate',
    });
  }

  // 4. Repetitive phrasing patterns
  const bigrams = [];
  for (let i = 0; i < words.length - 1; i++) {
    bigrams.push(words[i].toLowerCase() + ' ' + words[i + 1].toLowerCase());
  }
  const bigramSet = new Set(bigrams);
  const repetitionRate = 1 - (bigramSet.size / Math.max(1, bigrams.length));
  if (repetitionRate > 0.1) {
    const repScore = Math.min(100, repetitionRate * 300);
    totalScore += repScore * 0.15;
    analysis.push({
      metric: 'Phrasing Repetition',
      score: Math.round(repScore),
      detail: `${Math.round(repetitionRate * 100)}% repeated bigrams — AI tends to repeat structures`,
      type: repetitionRate > 0.25 ? 'high' : 'moderate',
    });
  }

  // 5. Formality and consistency
  const formalWords = ['utilize', 'demonstrate', 'facilitate', 'implement',
    'significant', 'comprehensive', 'fundamental', 'essential'];
  const formalCount = formalWords.filter(w => lowerText.includes(w)).length;
  if (formalCount >= 2) {
    const formalScore = Math.min(100, formalCount * 25);
    totalScore += formalScore * 0.15;
    analysis.push({
      metric: 'Formal Language Usage',
      score: Math.round(formalScore),
      detail: `${formalCount} formal academic words — common in AI text`,
      type: formalCount >= 4 ? 'high' : 'moderate',
    });
  }

  const finalScore = Math.min(95, Math.round(totalScore));

  let verdict = 'Likely Human-Written';
  if (finalScore > 70) verdict = 'Likely AI-Generated';
  else if (finalScore > 40) verdict = 'Possibly AI-Generated';

  return { score: finalScore, analysis, verdict };
}

export default function AIDetector() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnalyze = () => {
    if (!text.trim() || text.trim().length < 50) {
      alert('Please enter at least 50 characters of text.');
      return;
    }

    setLoading(true);
    setResult(null);

    // Simulate async processing
    setTimeout(() => {
      const analysis = analyzeForAI(text);
      setResult(analysis);
      setLoading(false);
    }, 1500);
  };

  const getScoreColor = (score) => {
    if (score <= 30) return '#2ecc71';
    if (score <= 60) return '#f39c12';
    return '#e74c3c';
  };

  return (
    <div style={styles.page}>
      <LoadingOverlay visible={loading} />

      <div className="animate-in">
        <h1 style={styles.title}>
          <span>🤖</span> AI Content Detector
        </h1>
        <p style={styles.subtitle}>
          Analyze text to determine whether it was written by a human or AI
        </p>
      </div>

      <div style={styles.inputSection} className="glass-card animate-slide">
        <label className="label">Paste your text below</label>
        <textarea
          className="textarea"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Paste the text you want to analyze for AI-generated content... (min 50 characters)"
          style={{ minHeight: 220 }}
        />
        <div style={styles.footer}>
          <span style={styles.charCount}>{text.length} characters</span>
          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn btn-secondary btn-sm" onClick={() => { setText(''); setResult(null); }}>
              Clear
            </button>
            <button className="btn btn-primary" onClick={handleAnalyze}>
              🔬 Analyze Text
            </button>
          </div>
        </div>
      </div>

      {result && (
        <div className="animate-in" style={{ marginTop: 24 }}>
          {/* Main Score Card */}
          <div style={styles.scoreCard} className="glass-card">
            <div style={styles.gaugeWrap}>
              <svg width="200" height="120" viewBox="0 0 200 120">
                <path
                  d="M 20 100 A 80 80 0 0 1 180 100"
                  fill="none"
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="14"
                  strokeLinecap="round"
                />
                <path
                  d="M 20 100 A 80 80 0 0 1 180 100"
                  fill="none"
                  stroke={getScoreColor(result.score)}
                  strokeWidth="14"
                  strokeLinecap="round"
                  strokeDasharray={`${(result.score / 100) * 251.2} 251.2`}
                  style={{ filter: `drop-shadow(0 0 8px ${getScoreColor(result.score)}44)` }}
                />
              </svg>
              <div style={styles.gaugeLabel}>
                <span style={{ ...styles.gaugeValue, color: getScoreColor(result.score) }}>
                  {result.score}%
                </span>
                <span style={styles.gaugeText}>AI Probability</span>
              </div>
            </div>
            <div style={{
              ...styles.verdict,
              background: getScoreColor(result.score) + '18',
              color: getScoreColor(result.score),
              borderColor: getScoreColor(result.score) + '44',
            }}>
              {result.verdict}
            </div>
          </div>

          {/* Analysis Details */}
          {result.analysis.length > 0 && (
            <div style={styles.analysisGrid}>
              {result.analysis.map((a, i) => (
                <div key={i} style={styles.analysisCard} className="glass-card">
                  <div style={styles.analysisHeader}>
                    <span style={styles.analysisMetric}>{a.metric}</span>
                    <span style={{
                      ...styles.analysisBadge,
                      background: a.type === 'high' ? 'rgba(231,76,60,0.15)' : 'rgba(243,156,18,0.15)',
                      color: a.type === 'high' ? '#e74c3c' : '#f39c12',
                    }}>
                      {a.score}%
                    </span>
                  </div>
                  <p style={styles.analysisDetail}>{a.detail}</p>
                  <div style={styles.analysisBar}>
                    <div style={{
                      ...styles.analysisBarFill,
                      width: `${a.score}%`,
                      background: a.type === 'high'
                        ? 'linear-gradient(90deg, #e74c3c, #ff6b6b)'
                        : 'linear-gradient(90deg, #f39c12, #f1c40f)',
                    }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    maxWidth: 900,
    margin: '0 auto',
    padding: '40px 20px 60px',
  },
  title: {
    fontSize: '2.2rem',
    fontWeight: 800,
    marginBottom: 8,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  subtitle: {
    fontSize: '1.05rem',
    color: 'rgba(255,255,255,0.55)',
    marginBottom: 32,
  },
  inputSection: {
    padding: 28,
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  charCount: {
    fontSize: '0.8rem',
    color: 'rgba(255,255,255,0.35)',
  },
  scoreCard: {
    padding: 40,
    textAlign: 'center',
    marginBottom: 24,
  },
  gaugeWrap: {
    position: 'relative',
    display: 'inline-block',
    marginBottom: 12,
  },
  gaugeLabel: {
    position: 'absolute',
    bottom: 12,
    left: '50%',
    transform: 'translateX(-50%)',
    textAlign: 'center',
  },
  gaugeValue: {
    display: 'block',
    fontSize: '2.4rem',
    fontWeight: 900,
    lineHeight: 1,
  },
  gaugeText: {
    fontSize: '0.75rem',
    color: 'rgba(255,255,255,0.4)',
    fontWeight: 500,
  },
  verdict: {
    display: 'inline-block',
    padding: '8px 24px',
    borderRadius: 50,
    fontWeight: 700,
    fontSize: '0.9rem',
    border: '1px solid',
  },
  analysisGrid: {
    display: 'grid',
    gap: 12,
  },
  analysisCard: {
    padding: '20px 24px',
  },
  analysisHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  analysisMetric: {
    fontWeight: 700,
    fontSize: '0.92rem',
    color: '#fff',
  },
  analysisBadge: {
    padding: '3px 10px',
    borderRadius: 50,
    fontSize: '0.75rem',
    fontWeight: 700,
  },
  analysisDetail: {
    fontSize: '0.82rem',
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 10,
  },
  analysisBar: {
    height: 4,
    borderRadius: 2,
    background: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
  },
  analysisBarFill: {
    height: '100%',
    borderRadius: 2,
    transition: 'width 0.8s ease',
  },
};
