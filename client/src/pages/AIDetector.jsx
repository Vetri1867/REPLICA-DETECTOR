import { useState } from 'react';
import LoadingOverlay from '../components/LoadingOverlay';

// Removed mock analyzeForAI function

export default function AIDetector() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnalyze = async () => {
    if (!text.trim() || text.trim().length < 50) {
      alert('Please enter at least 50 characters of text.');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, action: 'detect' })
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const analysis = await response.json();
      setResult(analysis);
    } catch (err) {
      console.error(err);
      alert('Failed to analyze text using AI models. Make sure server is running and API key is set.');
    } finally {
      setLoading(false);
    }
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
