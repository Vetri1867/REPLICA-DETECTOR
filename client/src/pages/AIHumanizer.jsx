import { useState } from 'react';
import LoadingOverlay from '../components/LoadingOverlay';

// Removed mock synonyms and humanizeText function

export default function AIHumanizer() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);

  const handleHumanize = async () => {
    if (!inputText.trim() || inputText.trim().length < 20) {
      alert('Please enter at least 20 characters of text.');
      return;
    }

    setLoading(true);
    setOutputText('');
    setStats(null);

    try {
      const response = await fetch('http://localhost:5000/api/ai/humanize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText })
      });

      if (!response.ok) {
        throw new Error('Humanize failed');
      }

      const { result } = await response.json();

      // Count changes
      const originalWords = inputText.split(/\s+/).length;
      const changedWords = result.split(/\s+/).length;
      const wordsChanged = Math.abs(originalWords - changedWords) +
        inputText.split(/\s+/).filter((w, i) => {
          const resultWords = result.split(/\s+/);
          return resultWords[i] !== w;
        }).length;

      setOutputText(result);
      setStats({
        originalLength: inputText.length,
        newLength: result.length,
        originalWords: originalWords,
        newWords: changedWords,
        wordsModified: Math.min(wordsChanged, originalWords),
        changePercent: Math.round((Math.min(wordsChanged, originalWords) / originalWords) * 100),
      });
    } catch (err) {
      console.error(err);
      alert('Failed to humanize text using AI model. Make sure server is running and API key is set.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputText);
    alert('Copied to clipboard!');
  };

  return (
    <div style={styles.page}>
      <LoadingOverlay visible={loading} />

      <div className="animate-in">
        <h1 style={styles.title}>
          <span>✍️</span> AI Humanizer
        </h1>
        <p style={styles.subtitle}>
          Transform AI-generated text into natural, human-like writing
        </p>
      </div>

      <div style={styles.mainGrid} className="animate-slide">
        {/* Input */}
        <div style={styles.panel} className="glass-card">
          <div style={styles.panelHeader}>
            <span style={styles.panelDot1} />
            <span style={styles.panelTitle}>AI Text (Input)</span>
            <span style={styles.panelCount}>{inputText.length} chars</span>
          </div>
          <textarea
            className="textarea"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder="Paste your AI-generated text here..."
            style={{ minHeight: 300, border: 'none', background: 'transparent', borderRadius: 0 }}
          />
        </div>

        {/* Output */}
        <div style={styles.panel} className="glass-card">
          <div style={styles.panelHeader}>
            <span style={styles.panelDot2} />
            <span style={styles.panelTitle}>Humanized (Output)</span>
            {outputText && (
              <button className="btn btn-sm btn-secondary" onClick={copyToClipboard} style={{ padding: '4px 12px', fontSize: '0.75rem' }}>
                📋 Copy
              </button>
            )}
          </div>
          <div style={styles.outputBox}>
            {outputText || 'Humanized text will appear here...'}
          </div>
        </div>
      </div>

      <div style={styles.actions}>
        <button className="btn btn-primary" onClick={handleHumanize} style={{ padding: '14px 44px', fontSize: '1rem' }}>
          ✨ Humanize Text
        </button>
        <button className="btn btn-secondary" onClick={() => { setInputText(''); setOutputText(''); setStats(null); }}>
          🗑️ Clear All
        </button>
      </div>

      {/* Stats */}
      {stats && (
        <div style={styles.statsGrid} className="animate-in">
          {[
            { label: 'Words Modified', value: stats.wordsModified, color: '#00D4FF' },
            { label: 'Change Ratio', value: stats.changePercent + '%', color: '#4CA1AF' },
            { label: 'Original Words', value: stats.originalWords, color: 'rgba(255,255,255,0.5)' },
            { label: 'Output Words', value: stats.newWords, color: '#2ecc71' },
          ].map((s, i) => (
            <div key={i} style={styles.statCard} className="glass-card">
              <span style={{ ...styles.statValue, color: s.color }}>{s.value}</span>
              <span style={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    maxWidth: 1100,
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
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 20,
    marginBottom: 24,
  },
  panel: {
    overflow: 'hidden',
  },
  panelHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '14px 20px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    background: 'rgba(0,0,0,0.1)',
  },
  panelDot1: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: '#e74c3c',
  },
  panelDot2: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: '#2ecc71',
  },
  panelTitle: {
    flex: 1,
    fontSize: '0.85rem',
    fontWeight: 600,
    color: 'rgba(255,255,255,0.7)',
  },
  panelCount: {
    fontSize: '0.75rem',
    color: 'rgba(255,255,255,0.3)',
  },
  outputBox: {
    padding: 20,
    fontSize: '0.92rem',
    lineHeight: 1.8,
    color: 'rgba(255,255,255,0.8)',
    minHeight: 300,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  actions: {
    display: 'flex',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 32,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 12,
  },
  statCard: {
    padding: '20px 16px',
    textAlign: 'center',
  },
  statValue: {
    display: 'block',
    fontSize: '1.6rem',
    fontWeight: 800,
  },
  statLabel: {
    fontSize: '0.75rem',
    color: 'rgba(255,255,255,0.4)',
    fontWeight: 500,
  },
};
