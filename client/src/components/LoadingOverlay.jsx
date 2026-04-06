export default function LoadingOverlay({ visible }) {
  if (!visible) return null;

  return (
    <div style={overlayStyle}>
      {/* Spinner */}
      <div style={spinnerWrapStyle}>
        <svg width="120" height="120" viewBox="0 0 120 120" style={{ animation: 'loSpin 1.2s linear infinite' }}>
          <defs>
            <linearGradient id="loGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3300FC" />
              <stop offset="50%" stopColor="#95008A" />
              <stop offset="100%" stopColor="#EB0000" />
            </linearGradient>
          </defs>
          <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
          <circle cx="60" cy="60" r="50" fill="none" stroke="url(#loGrad)" strokeWidth="8"
            strokeLinecap="round" strokeDasharray="200 314" />
        </svg>
        <div style={innerIconStyle}>◈</div>
      </div>

      <p style={textStyle}>Analyzing documents...</p>
      <p style={subtextStyle}>Running pattern matching algorithms</p>

      {/* Progress bar */}
      <div style={barContainerStyle}>
        <div style={barFillStyle} />
      </div>

      <style>{`
        @keyframes loSpin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes loSlide { 0% { transform: translateX(-100%); } 100% { transform: translateX(400%); } }
      `}</style>
    </div>
  );
}

const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  width: '100vw',
  height: '100vh',
  background: 'rgba(10, 5, 30, 0.96)',
  backdropFilter: 'blur(14px)',
  WebkitBackdropFilter: 'blur(14px)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 999999,
};

const spinnerWrapStyle = {
  position: 'relative',
  width: 120,
  height: 120,
  marginBottom: 28,
};

const innerIconStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  fontSize: '2rem',
  color: '#fff',
  opacity: 0.9,
};

const textStyle = {
  fontSize: '1.3rem',
  color: 'rgba(255,255,255,0.9)',
  fontWeight: 600,
  letterSpacing: '0.03em',
  marginBottom: 6,
};

const subtextStyle = {
  fontSize: '0.85rem',
  color: 'rgba(255,255,255,0.4)',
  marginBottom: 24,
};

const barContainerStyle = {
  width: 220,
  height: 4,
  borderRadius: 2,
  background: 'rgba(255,255,255,0.08)',
  overflow: 'hidden',
  position: 'relative',
};

const barFillStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '25%',
  height: '100%',
  borderRadius: 2,
  background: 'linear-gradient(90deg, #3300FC, #95008A, #EB0000)',
  animation: 'loSlide 1.2s ease-in-out infinite',
};
