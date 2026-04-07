export default function Footer() {
  return (
    <footer style={{
      marginTop: 60,
      padding: '40px 20px 32px',
      borderTop: '1px solid rgba(255,255,255,0.08)',
      background: 'rgba(0,0,0,0.25)',
      backdropFilter: 'blur(12px)',
      textAlign: 'center',
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
      }}>
        <p style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '0.02em' }}>
          Vetri Vendhan M
        </p>
        <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.55)', margin: 0 }}>
          Reg No: <span style={{ color: 'rgba(255,255,255,0.75)', fontWeight: 600 }}>2117240020404</span>
        </p>
        <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.55)', margin: 0 }}>
          Dept: <span style={{ color: 'rgba(255,255,255,0.75)', fontWeight: 600 }}>CSE</span>
        </p>

        <a
          href="https://www.instagram.com/vetri_x_x_1867?igsh=MTRkeDVlbG5jMm0yag=="
          target="_blank"
          rel="noopener noreferrer"
          title="Follow on Instagram"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            marginTop: 10,
            padding: '8px 18px',
            borderRadius: 50,
            background: 'linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
            color: '#fff',
            textDecoration: 'none',
            fontSize: '0.85rem',
            fontWeight: 600,
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'scale(1.07)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(225,48,108,0.45)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          {/* Instagram SVG Logo */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="2" width="20" height="20" rx="5" stroke="white" strokeWidth="2" />
            <circle cx="12" cy="12" r="5" stroke="white" strokeWidth="2" />
            <circle cx="17.5" cy="6.5" r="1.5" fill="white" />
          </svg>
          @vetri_x_x_1867
        </a>
      </div>

      <p style={{
        marginTop: 20,
        fontSize: '0.75rem',
        color: 'rgba(255,255,255,0.25)',
      }}>
        © 2026 Replica Detector — All rights reserved
      </p>
    </footer>
  );
}
