import { Link } from 'react-router-dom';

const features = [
  {
    icon: '🔍', title: 'Plagiarism Detection',
    desc: 'Advanced pattern matching with Rabin-Karp and KMP algorithms for precise text similarity analysis.',
    link: '/plagiarism-checker',
  },
  {
    icon: '🤖', title: 'AI Content Detector',
    desc: 'Detect AI-generated content using perplexity and burstiness analysis with probability scoring.',
    link: '/ai-detector',
  },
  {
    icon: '✍️', title: 'AI Humanizer',
    desc: 'Transform AI-generated text into natural human-like writing with intelligent restructuring.',
    link: '/ai-humanizer',
  },
  {
    icon: '📊', title: 'Detailed Reports',
    desc: 'Comprehensive similarity reports with visual charts, matched content, and exportable results.',
    link: '/report',
  },
];

const stats = [
  { value: '99%', label: 'Detection Accuracy' },
  { value: '<1s', label: 'Processing Speed' },
  { value: '3+', label: 'File Formats' },
  { value: '2', label: 'Algorithms' },
];

export default function Home() {
  return (
    <div style={styles.page}>
      {/* Hero Section */}
      <section style={styles.hero} className="animate-in">
        <div style={styles.heroBadge}>
          <span style={styles.heroBadgeDot} />
          Powered by Rabin-Karp & KMP Algorithms
        </div>
        <h1 style={styles.heroTitle}>
          Detect Plagiarism{' '}
          <span style={styles.heroAccent}>with Precision</span>
        </h1>
        <p style={styles.heroSubtitle}>
          Advanced text similarity analysis tool that compares documents using state-of-the-art
          pattern matching algorithms. Upload files, paste text, and get instant results.
        </p>
        <div style={styles.heroBtns}>
          <Link to="/plagiarism-checker" className="btn btn-primary" style={{ fontSize: '1rem', padding: '16px 36px' }}>
            Start Checking →
          </Link>
          <Link to="/ai-detector" className="btn btn-secondary" style={{ fontSize: '1rem', padding: '16px 36px' }}>
            Try AI Detector
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section style={styles.statsGrid} className="grid-4 animate-slide">
        {stats.map((s, i) => (
          <div key={i} style={styles.statCard} className="glass-card">
            <span style={styles.statValue}>{s.value}</span>
            <span style={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </section>

      {/* Features */}
      <section style={styles.features} className="animate-slide">
        <h2 style={styles.sectionTitle}>Powerful Features</h2>
        <p style={styles.sectionSub}>Everything you need for comprehensive content analysis</p>
        <div style={styles.featureGrid} className="grid-2">
          {features.map((f, i) => (
            <Link key={i} to={f.link} style={{ textDecoration: 'none' }}>
              <div style={styles.featureCard} className="glass-card">
                <div style={styles.featureIcon}>{f.icon}</div>
                <h3 style={styles.featureTitle}>{f.title}</h3>
                <p style={styles.featureDesc}>{f.desc}</p>
                <span style={styles.featureLink}>
                  Explore →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={styles.howSection} className="animate-slide">
        <h2 style={styles.sectionTitle}>How It Works</h2>
        <div style={styles.stepsGrid} className="grid-4">
          {[
            { step: '01', title: 'Input Text', desc: 'Paste your text or upload documents in .txt, .pdf, or .docx format' },
            { step: '02', title: 'Choose Algorithm', desc: 'Select Rabin-Karp or KMP algorithm for pattern matching' },
            { step: '03', title: 'Analyze', desc: 'Our engine preprocesses text, removes stop words, and runs n-gram analysis' },
            { step: '04', title: 'Get Results', desc: 'View similarity scores, highlighted matches, charts, and export reports' },
          ].map((item, i) => (
            <div key={i} style={styles.stepCard} className="glass-card">
              <span style={styles.stepNum}>{item.step}</span>
              <h4 style={styles.stepTitle}>{item.title}</h4>
              <p style={styles.stepDesc}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={styles.cta} className="glass-card animate-slide">
        <h2 style={styles.ctaTitle}>Ready to detect plagiarism?</h2>
        <p style={styles.ctaDesc}>Start analyzing your documents with professional-grade detection tools.</p>
        <Link to="/plagiarism-checker" className="btn btn-primary" style={{ fontSize: '1.05rem', padding: '16px 44px' }}>
          Get Started Free →
        </Link>
      </section>
    </div>
  );
}

const styles = {
  page: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '40px 20px 60px',
  },
  hero: {
    textAlign: 'center',
    padding: '60px 0 50px',
  },
  heroBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '6px 18px',
    borderRadius: 50,
    background: 'rgba(0, 212, 255, 0.08)',
    border: '1px solid rgba(0, 212, 255, 0.2)',
    fontSize: '0.8rem',
    fontWeight: 600,
    color: '#00D4FF',
    marginBottom: 28,
  },
  heroBadgeDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: '#00D4FF',
    boxShadow: '0 0 8px rgba(0,212,255,0.5)',
  },
  heroTitle: {
    fontSize: '3.5rem',
    fontWeight: 900,
    lineHeight: 1.1,
    color: '#fff',
    marginBottom: 20,
    letterSpacing: '-0.02em',
  },
  heroAccent: {
    background: 'linear-gradient(135deg, #4CA1AF, #00D4FF)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  heroSubtitle: {
    fontSize: '1.15rem',
    color: 'rgba(255,255,255,0.6)',
    maxWidth: 640,
    margin: '0 auto 36px',
    lineHeight: 1.7,
  },
  heroBtns: {
    display: 'flex',
    justifyContent: 'center',
    gap: 16,
    flexWrap: 'wrap',
  },
  statsGrid: {
    marginBottom: 80,
  },
  statCard: {
    textAlign: 'center',
    padding: '28px 16px',
  },
  statValue: {
    display: 'block',
    fontSize: '2rem',
    fontWeight: 800,
    background: 'linear-gradient(135deg, #4CA1AF, #00D4FF)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  statLabel: {
    fontSize: '0.82rem',
    color: 'rgba(255,255,255,0.5)',
    fontWeight: 500,
  },
  features: {
    marginBottom: 80,
  },
  sectionTitle: {
    fontSize: '2rem',
    fontWeight: 800,
    textAlign: 'center',
    marginBottom: 8,
    color: '#fff',
  },
  sectionSub: {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 40,
    fontSize: '1.05rem',
  },
  featureGrid: {
  },
  featureCard: {
    padding: '32px 28px',
    cursor: 'pointer',
  },
  featureIcon: {
    fontSize: '2.2rem',
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: '1.15rem',
    fontWeight: 700,
    color: '#fff',
    marginBottom: 8,
  },
  featureDesc: {
    fontSize: '0.9rem',
    color: 'rgba(255,255,255,0.55)',
    lineHeight: 1.6,
    marginBottom: 16,
  },
  featureLink: {
    fontSize: '0.85rem',
    fontWeight: 600,
    color: '#00D4FF',
  },
  howSection: {
    marginBottom: 80,
  },
  stepsGrid: {
  },
  stepCard: {
    padding: '28px 24px',
    textAlign: 'center',
  },
  stepNum: {
    display: 'inline-block',
    fontSize: '1.8rem',
    fontWeight: 900,
    background: 'linear-gradient(135deg, #4CA1AF, #00D4FF)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: 12,
  },
  stepTitle: {
    fontSize: '1rem',
    fontWeight: 700,
    color: '#fff',
    marginBottom: 8,
  },
  stepDesc: {
    fontSize: '0.82rem',
    color: 'rgba(255,255,255,0.5)',
    lineHeight: 1.5,
  },
  cta: {
    textAlign: 'center',
    padding: '60px 40px',
    borderRadius: 20,
    background: 'linear-gradient(135deg, rgba(76,161,175,0.1), rgba(0,212,255,0.05))',
    border: '1px solid rgba(0,212,255,0.15)',
  },
  ctaTitle: {
    fontSize: '1.8rem',
    fontWeight: 800,
    marginBottom: 12,
    color: '#fff',
  },
  ctaDesc: {
    fontSize: '1rem',
    color: 'rgba(255,255,255,0.55)',
    marginBottom: 28,
  },
};
