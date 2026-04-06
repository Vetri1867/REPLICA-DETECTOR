import { useState, useEffect } from 'react';
import { SimilarityDoughnut, SimilarityBar } from '../components/SimilarityChart';
import jsPDF from 'jspdf';

export default function Report() {
  const [results, setResults] = useState(null);
  const [reportText, setReportText] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('lastResults');
    if (saved) {
      try {
        setResults(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (results) {
      generateReport(results);
    }
  }, [results]);

  const generateReport = async (data) => {
    try {
      const res = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ results: data }),
      });
      const json = await res.json();
      if (json.report) setReportText(json.report);
    } catch (err) {
      // Generate locally if server unavailable
      setReportText(generateLocalReport(data));
    }
  };

  const generateLocalReport = (data) => {
    const lines = [
      '═══════════════════════════════════════════',
      '      REPLICA DETECTOR - SIMILARITY REPORT',
      '═══════════════════════════════════════════',
      '',
      `Date: ${new Date().toLocaleString()}`,
      `Algorithm: ${data.algorithm || 'N/A'}`,
      `Threshold: ${data.threshold || 20}%`,
      '',
      '── SIMILARITY SCORES ──',
      `Overall:    ${data.overallSimilarity || 0}%`,
      `Algorithm:  ${data.algorithmSimilarity || 0}%`,
      `N-gram:     ${data.ngramSimilarity || 0}%`,
      `Combined:   ${data.combinedSimilarity || 0}%`,
      '',
      `Status: ${data.similarityLevel?.label || 'N/A'}`,
      `Plagiarism: ${data.isPlagiarized ? 'DETECTED' : 'Not detected'}`,
      `Time: ${data.executionTime || 0}ms`,
    ];
    return lines.join('\n');
  };

  const exportPDF = () => {
    if (!results) return;
    const doc = new jsPDF();
    const margin = 20;
    let y = margin;

    doc.setFontSize(18);
    doc.setTextColor(44, 62, 80);
    doc.text('Replica Detector - Similarity Report', margin, y);
    y += 12;

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated: ${new Date().toLocaleString()}`, margin, y);
    y += 16;

    doc.setFontSize(13);
    doc.setTextColor(0, 0, 0);
    doc.text('Similarity Scores', margin, y);
    y += 10;

    doc.setFontSize(10);
    const scores = [
      ['Overall Similarity', `${results.overallSimilarity || 0}%`],
      ['Algorithm Similarity', `${results.algorithmSimilarity || 0}%`],
      ['N-gram Overlap', `${results.ngramSimilarity || 0}%`],
      ['Combined Score', `${results.combinedSimilarity || 0}%`],
      ['Algorithm', results.algorithm || 'N/A'],
      ['Execution Time', `${results.executionTime || 0}ms`],
      ['Plagiarism Detected', results.isPlagiarized ? 'Yes' : 'No'],
      ['Status', results.similarityLevel?.label || 'N/A'],
    ];

    scores.forEach(([label, value]) => {
      doc.text(`${label}: ${value}`, margin, y);
      y += 7;
    });

    y += 8;

    if (results.matches && results.matches.length > 0) {
      doc.setFontSize(13);
      doc.text('Matched Patterns', margin, y);
      y += 10;
      doc.setFontSize(9);
      results.matches.slice(0, 15).forEach((m, i) => {
        if (y > 270) { doc.addPage(); y = margin; }
        doc.text(`${i + 1}. "${m.text}"`, margin, y);
        y += 6;
      });
    }

    y += 8;
    if (results.keywordMatches && results.keywordMatches.length > 0) {
      doc.setFontSize(13);
      doc.text('Keyword Matches', margin, y);
      y += 10;
      doc.setFontSize(9);
      doc.text(results.keywordMatches.map(k => k.word).join(', '), margin, y, { maxWidth: 170 });
    }

    doc.save('replica-detector-report.pdf');
  };

  const exportText = () => {
    if (!reportText) return;
    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'replica-detector-report.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!results) {
    return (
      <div style={styles.page}>
        <div className="animate-in" style={styles.empty}>
          <div style={styles.emptyIcon}>📊</div>
          <h2 style={styles.emptyTitle}>No Report Available</h2>
          <p style={styles.emptyDesc}>
            Run a plagiarism comparison first, then come back here to view and export the report.
          </p>
          <a href="/plagiarism-checker" className="btn btn-primary">
            Go to Plagiarism Checker →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div className="animate-in">
        <h1 style={styles.title}>
          <span>📊</span> Similarity Report
        </h1>
        <p style={styles.subtitle}>
          Detailed analysis results from your last comparison
        </p>
      </div>

      {/* Export Buttons */}
      <div style={styles.exportBar} className="animate-in">
        <button className="btn btn-primary" onClick={exportPDF}>
          📥 Export PDF
        </button>
        <button className="btn btn-secondary" onClick={exportText}>
          📄 Export Text
        </button>
      </div>

      {/* Summary Cards */}
      <div style={styles.summaryGrid} className="animate-slide">
        <div style={styles.mainScore} className="glass-card">
          <SimilarityDoughnut value={results.combinedSimilarity} label="Combined Score" />
          <div style={{
            ...styles.statusBadge,
            background: (results.similarityLevel?.color || '#2ecc71') + '18',
            color: results.similarityLevel?.color || '#2ecc71',
            borderColor: (results.similarityLevel?.color || '#2ecc71') + '44',
          }}>
            {results.similarityLevel?.label || 'Unknown'}
          </div>
        </div>

        <div style={styles.detailsCol}>
          {[
            { label: 'Overall Similarity', value: `${results.overallSimilarity}%`, icon: '📈' },
            { label: `Algorithm (${results.algorithm})`, value: `${results.algorithmSimilarity}%`, icon: '⚡' },
            { label: 'N-gram Overlap', value: `${results.ngramSimilarity}%`, icon: '🔗' },
            { label: 'Execution Time', value: `${results.executionTime}ms`, icon: '⏱️' },
            { label: 'Matches Found', value: results.matchCount, icon: '🎯' },
            { label: 'Plagiarism', value: results.isPlagiarized ? '⚠️ Detected' : '✅ None', icon: '🔍' },
          ].map((item, i) => (
            <div key={i} style={styles.detailCard} className="glass-card">
              <span style={styles.detailIcon}>{item.icon}</span>
              <div>
                <span style={styles.detailLabel}>{item.label}</span>
                <span style={styles.detailValue}>{item.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div style={styles.chartSection} className="glass-card animate-slide">
        <h3 style={styles.sectionTitle}>Score Breakdown</h3>
        <SimilarityBar
          data={[
            { label: 'Overall', value: results.overallSimilarity },
            { label: results.algorithm, value: results.algorithmSimilarity },
            { label: 'N-gram', value: results.ngramSimilarity },
            { label: 'Combined', value: results.combinedSimilarity },
          ]}
        />
      </div>

      {/* Text Report */}
      <div style={styles.reportSection} className="glass-card animate-slide">
        <h3 style={styles.sectionTitle}>📝 Full Text Report</h3>
        <pre style={styles.reportPre}>{reportText}</pre>
      </div>
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
    marginBottom: 16,
  },
  exportBar: {
    display: 'flex',
    gap: 12,
    marginBottom: 32,
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: '260px 1fr',
    gap: 20,
    marginBottom: 24,
  },
  mainScore: {
    padding: 32,
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
  },
  statusBadge: {
    padding: '6px 18px',
    borderRadius: 50,
    fontSize: '0.85rem',
    fontWeight: 700,
    border: '1px solid',
  },
  detailsCol: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: 10,
  },
  detailCard: {
    padding: '16px 18px',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  detailIcon: {
    fontSize: '1.3rem',
  },
  detailLabel: {
    display: 'block',
    fontSize: '0.72rem',
    fontWeight: 600,
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  detailValue: {
    display: 'block',
    fontSize: '1.1rem',
    fontWeight: 800,
    color: '#fff',
  },
  chartSection: {
    padding: 28,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: '1rem',
    fontWeight: 700,
    marginBottom: 20,
    color: '#fff',
  },
  reportSection: {
    padding: 28,
    marginBottom: 24,
  },
  reportPre: {
    background: 'rgba(0,0,0,0.2)',
    padding: 24,
    borderRadius: 12,
    fontSize: '0.82rem',
    lineHeight: 1.6,
    color: 'rgba(255,255,255,0.7)',
    overflow: 'auto',
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    whiteSpace: 'pre-wrap',
  },
  empty: {
    textAlign: 'center',
    padding: '80px 20px',
  },
  emptyIcon: {
    fontSize: '3rem',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: '1.4rem',
    fontWeight: 700,
    marginBottom: 8,
    color: '#fff',
  },
  emptyDesc: {
    fontSize: '0.95rem',
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 24,
    maxWidth: 400,
    margin: '0 auto 24px',
  },
};
