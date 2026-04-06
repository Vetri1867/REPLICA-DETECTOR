import { useState } from 'react';
import FileUpload from '../components/FileUpload';
import LoadingOverlay from '../components/LoadingOverlay';
import { SimilarityDoughnut, SimilarityBar } from '../components/SimilarityChart';
import TextHighlighter from '../components/TextHighlighter';

export default function PlagiarismChecker() {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [algorithm, setAlgorithm] = useState('rabin-karp');
  const [threshold, setThreshold] = useState(20);
  const [ngramSize, setNgramSize] = useState(4);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleCompare = async () => {
    if (!text1.trim() || !text2.trim()) {
      alert('Please enter or upload text in both fields.');
      return;
    }

    setLoading(true);
    setResults(null);
    setError(null);

    // Minimum 2s loading so user sees the animation
    const minLoadTime = new Promise(resolve => setTimeout(resolve, 2000));

    try {
      const fetchPromise = fetch('http://localhost:5000/api/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text1, text2, algorithm, threshold, ngramSize }),
      });

      const [res] = await Promise.all([fetchPromise, minLoadTime]);
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      // Store in localStorage for Report page
      localStorage.setItem('lastResults', JSON.stringify(data));
      localStorage.setItem('lastText1', text1);
      localStorage.setItem('lastText2', text2);

      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setText1('');
    setText2('');
    setResults(null);
    setError(null);
  };

  // Safe data accessors
  const simLevel = results?.similarityLevel || {};
  const simColor = simLevel.color || '#2ecc71';

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 20px 60px' }}>
      <LoadingOverlay visible={loading} />

      <div className="animate-in">
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: '1.8rem' }}>🔍</span> Plagiarism Checker
        </h1>
        <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.55)', marginBottom: 32 }}>
          Compare two documents using advanced pattern matching algorithms
        </p>
      </div>

      {/* Controls */}
      <div className="glass-card" style={{ padding: '24px 28px', marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: '1 1 200px' }}>
            <label className="label">Algorithm</label>
            <select className="select" value={algorithm} onChange={e => setAlgorithm(e.target.value)}>
              <option value="rabin-karp">Rabin-Karp</option>
              <option value="kmp">KMP (Knuth-Morris-Pratt)</option>
            </select>
          </div>
          <div style={{ flex: '1 1 200px' }}>
            <label className="label">Threshold: {threshold}%</label>
            <input type="range" min="5" max="95" value={threshold}
              onChange={e => setThreshold(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#EB0000', height: 6, cursor: 'pointer' }}
            />
          </div>
          <div style={{ flex: '1 1 200px' }}>
            <label className="label">N-gram Size: {ngramSize}</label>
            <input type="range" min="2" max="8" value={ngramSize}
              onChange={e => setNgramSize(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#EB0000', height: 6, cursor: 'pointer' }}
            />
          </div>
        </div>
      </div>

      {/* Input Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10, color: '#fff' }}>
            <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: '#95008A' }} /> Source Document
          </h3>
          <textarea className="textarea" placeholder="Paste your source text here..."
            value={text1} onChange={e => setText1(e.target.value)} style={{ minHeight: 200 }} />
          <FileUpload label="Or upload source file" onFileLoaded={(txt) => setText1(txt)} />
          <div style={{ marginTop: 8, fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', textAlign: 'right' }}>{text1.length} characters</div>
        </div>

        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10, color: '#fff' }}>
            <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: '#EB0000' }} /> Comparison Document
          </h3>
          <textarea className="textarea" placeholder="Paste comparison text here..."
            value={text2} onChange={e => setText2(e.target.value)} style={{ minHeight: 200 }} />
          <FileUpload label="Or upload comparison file" onFileLoaded={(txt) => setText2(txt)} />
          <div style={{ marginTop: 8, fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', textAlign: 'right' }}>{text2.length} characters</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 40 }}>
        <button className="btn btn-primary" onClick={handleCompare}
          style={{ padding: '14px 44px', fontSize: '1rem' }}>
          ⚡ Compare Documents
        </button>
        <button className="btn btn-secondary" onClick={clearAll}>
          🗑️ Clear All
        </button>
      </div>

      {/* Error */}
      {error && (
        <div style={{ padding: 20, background: 'rgba(231,76,60,0.15)', border: '1px solid rgba(231,76,60,0.3)', borderRadius: 12, marginBottom: 24, textAlign: 'center', color: '#ff6b6b' }}>
          ⚠️ {error}
        </div>
      )}

      {/* Results */}
      {results && (
        <div className="animate-in" style={{ paddingTop: 20 }}>
          {/* Score Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 20, marginBottom: 24 }}>
            <div className="glass-card" style={{ padding: 32, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
              <SimilarityDoughnut value={results.combinedSimilarity || 0} label="Combined" />
              <div style={{
                padding: '6px 16px', borderRadius: 50, fontSize: '0.82rem', fontWeight: 700,
                border: '1px solid',
                background: simColor + '22', color: simColor, borderColor: simColor + '44',
              }}>
                {simLevel.label || 'N/A'}
              </div>
              {results.isPlagiarized && (
                <div style={{
                  padding: '6px 16px', borderRadius: 50, fontSize: '0.82rem', fontWeight: 700,
                  background: 'rgba(231,76,60,0.15)', color: '#e74c3c', border: '1px solid rgba(231,76,60,0.3)',
                }}>
                  ⚠️ Plagiarism Detected
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { label: 'Overall Similarity', value: (results.overallSimilarity || 0) + '%', color: (results.overallSimilarity || 0) > 50 ? '#e74c3c' : '#2ecc71' },
                { label: 'Algorithm (' + (results.algorithm || 'N/A') + ')', value: (results.algorithmSimilarity || 0) + '%', color: '#95008A' },
                { label: 'N-gram Overlap', value: (results.ngramSimilarity || 0) + '%', color: '#f39c12' },
                { label: 'Execution Time', value: (results.executionTime || 0) + 'ms', color: '#EB0000' },
              ].map((m, i) => (
                <div key={i} className="glass-card" style={{ padding: '20px 24px' }}>
                  <span style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>
                    {m.label}
                  </span>
                  <span style={{ fontSize: '1.8rem', fontWeight: 800, color: m.color }}>
                    {m.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bar Chart */}
          <div className="glass-card" style={{ padding: 28, marginBottom: 24 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 20, color: '#fff' }}>📊 Similarity Breakdown</h3>
            <SimilarityBar data={[
              { label: 'Overall', value: results.overallSimilarity || 0 },
              { label: results.algorithm || 'Algorithm', value: results.algorithmSimilarity || 0 },
              { label: 'N-gram', value: results.ngramSimilarity || 0 },
              { label: 'Combined', value: results.combinedSimilarity || 0 },
            ]} />
          </div>

          {/* Keyword Matches */}
          {results.keywordMatches && results.keywordMatches.length > 0 && (
            <div className="glass-card" style={{ padding: 28, marginBottom: 24 }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 20, color: '#fff' }}>🔑 Keyword Matches ({results.keywordMatches.length})</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {results.keywordMatches.map((k, i) => (
                  <span key={i} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px',
                    borderRadius: 50, background: 'rgba(149, 0, 138, 0.12)', border: '1px solid rgba(149, 0, 138, 0.3)',
                    color: '#d946ef', fontSize: '0.82rem', fontWeight: 600,
                  }}>
                    {k.word}
                    <span style={{ background: 'rgba(149,0,138,0.2)', padding: '1px 7px', borderRadius: 10, fontSize: '0.72rem', fontWeight: 700 }}>{k.count}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Matched Patterns */}
          {results.matches && results.matches.length > 0 && (
            <div className="glass-card" style={{ padding: 28, marginBottom: 24 }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 20, color: '#fff' }}>🎯 Matched Patterns ({results.matchCount || 0})</h3>
              <div style={{ display: 'grid', gap: 8 }}>
                {results.matches.slice(0, 15).map((m, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px',
                    borderRadius: 10, background: 'rgba(0,0,0,0.15)', border: '1px solid rgba(255,255,255,0.04)',
                  }}>
                    <span style={{ fontWeight: 700, color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', minWidth: 30 }}>#{i + 1}</span>
                    <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', fontStyle: 'italic' }}>"{m.text}"</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Side-by-Side Comparison */}
          <TextHighlighter
            text1={text1}
            text2={text2}
            matches={results.matches || []}
            sentenceComparison={results.sentenceComparison || []}
          />
        </div>
      )}
    </div>
  );
}
