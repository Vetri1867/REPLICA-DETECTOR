export default function TextHighlighter({ text1, text2, matches = [], sentenceComparison = [] }) {
  // Build a set of matched phrases for highlighting
  const matchedPhrases = matches.map(m => m.text.toLowerCase());

  function highlightText(text, isSource = true) {
    if (!text || matchedPhrases.length === 0) {
      return <span>{text}</span>;
    }

    let result = text;
    let segments = [{ text: result, highlighted: false }];

    matchedPhrases.forEach(phrase => {
      const newSegments = [];
      segments.forEach(seg => {
        if (seg.highlighted) {
          newSegments.push(seg);
          return;
        }

        const parts = seg.text.toLowerCase().split(phrase.toLowerCase());
        if (parts.length <= 1) {
          newSegments.push(seg);
          return;
        }

        let idx = 0;
        parts.forEach((part, i) => {
          if (part.length > 0) {
            newSegments.push({
              text: seg.text.substring(idx, idx + part.length),
              highlighted: false,
            });
          }
          idx += part.length;
          if (i < parts.length - 1) {
            newSegments.push({
              text: seg.text.substring(idx, idx + phrase.length),
              highlighted: true,
            });
            idx += phrase.length;
          }
        });
      });
      segments = newSegments;
    });

    return (
      <>
        {segments.map((seg, i) =>
          seg.highlighted ? (
            <mark key={i} style={styles.highlight}>
              {seg.text}
            </mark>
          ) : (
            <span key={i}>{seg.text}</span>
          )
        )}
      </>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>📝 Side-by-Side Comparison</h3>
      </div>

      <div style={styles.columns}>
        <div style={styles.col}>
          <div style={styles.colHeader}>
            <span style={styles.dot1} />
            Source Text
          </div>
          <div style={styles.textBox}>
            {highlightText(text1, true)}
          </div>
        </div>

        <div style={styles.divider} />

        <div style={styles.col}>
          <div style={styles.colHeader}>
            <span style={styles.dot2} />
            Comparison Text
          </div>
          <div style={styles.textBox}>
            {highlightText(text2, false)}
          </div>
        </div>
      </div>

      {sentenceComparison.length > 0 && (
        <div style={styles.sentenceSection}>
          <h4 style={styles.sentenceTitle}>📋 Sentence-wise Matches</h4>
          {sentenceComparison.slice(0, 10).map((sc, i) => (
            <div key={i} style={styles.sentenceCard} className="glass-card">
              <div style={styles.sentenceRow}>
                <span style={styles.sentenceLabel}>Source:</span>
                <span style={styles.sentenceText}>"{sc.sourceSentence}"</span>
              </div>
              <div style={styles.sentenceRow}>
                <span style={styles.sentenceLabel}>Match:</span>
                <span style={styles.sentenceText}>"{sc.matchedSentence}"</span>
              </div>
              <div style={{
                ...styles.simBadge,
                background: sc.similarity > 70
                  ? 'rgba(231,76,60,0.15)'
                  : sc.similarity > 40
                  ? 'rgba(243,156,18,0.15)'
                  : 'rgba(46,204,113,0.15)',
                color: sc.similarity > 70
                  ? '#e74c3c'
                  : sc.similarity > 40
                  ? '#f39c12'
                  : '#2ecc71',
              }}>
                {sc.similarity}% match
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    marginTop: 24,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: '1.1rem',
    fontWeight: 700,
    color: '#fff',
  },
  columns: {
    display: 'flex',
    gap: 0,
    borderRadius: 16,
    overflow: 'hidden',
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(0,0,0,0.15)',
  },
  col: {
    flex: 1,
    minWidth: 0,
  },
  colHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '14px 20px',
    fontSize: '0.85rem',
    fontWeight: 600,
    color: 'rgba(255,255,255,0.7)',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    background: 'rgba(0,0,0,0.1)',
  },
  dot1: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: '#4CA1AF',
  },
  dot2: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: '#00D4FF',
  },
  divider: {
    width: 1,
    background: 'rgba(255,255,255,0.06)',
  },
  textBox: {
    padding: 20,
    fontSize: '0.9rem',
    lineHeight: 1.8,
    color: 'rgba(255,255,255,0.8)',
    maxHeight: 400,
    overflowY: 'auto',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  highlight: {
    background: 'rgba(231, 76, 60, 0.25)',
    color: '#ff6b6b',
    padding: '2px 4px',
    borderRadius: 4,
    borderBottom: '2px solid rgba(231,76,60,0.5)',
  },
  sentenceSection: {
    marginTop: 24,
  },
  sentenceTitle: {
    fontSize: '0.95rem',
    fontWeight: 700,
    color: '#fff',
    marginBottom: 12,
  },
  sentenceCard: {
    padding: 16,
    marginBottom: 10,
    borderRadius: 12,
  },
  sentenceRow: {
    display: 'flex',
    gap: 8,
    marginBottom: 6,
    fontSize: '0.85rem',
  },
  sentenceLabel: {
    fontWeight: 700,
    color: 'rgba(255,255,255,0.6)',
    minWidth: 55,
  },
  sentenceText: {
    color: 'rgba(255,255,255,0.8)',
    fontStyle: 'italic',
  },
  simBadge: {
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: 50,
    fontSize: '0.75rem',
    fontWeight: 700,
    marginTop: 4,
  },
};
