import { useState } from 'react';
import { NavLink } from 'react-router-dom';

const navLinks = [
  { path: '/', label: 'Home', icon: '🏠' },
  { path: '/plagiarism-checker', label: 'Plagiarism Checker', icon: '🔍' },
  { path: '/ai-detector', label: 'AI Detector', icon: '🤖' },
  { path: '/ai-humanizer', label: 'AI Humanizer', icon: '✍️' },
  { path: '/report', label: 'Report', icon: '📊' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <NavLink to="/" style={styles.logo}>
          <span style={styles.logoIcon}>◈</span>
          <span style={styles.logoText}>Replica Detector</span>
        </NavLink>

        <div style={{ ...styles.links, ...(isOpen ? styles.linksMobile : {}) }}>
          {navLinks.map(link => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              style={({ isActive }) => ({
                ...styles.link,
                ...(isActive ? styles.linkActive : {}),
              })}
            >
              <span style={styles.linkIcon}>{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </div>

        <button
          style={styles.hamburger}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <span style={{
            ...styles.hamburgerLine,
            transform: isOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none',
          }} />
          <span style={{
            ...styles.hamburgerLine,
            opacity: isOpen ? 0 : 1,
          }} />
          <span style={{
            ...styles.hamburgerLine,
            transform: isOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none',
          }} />
        </button>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    background: 'rgba(26, 38, 52, 0.85)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    padding: '0 20px',
  },
  container: {
    maxWidth: 1400,
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 72,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    textDecoration: 'none',
    color: '#fff',
  },
  logoIcon: {
    fontSize: '1.6rem',
    color: '#00D4FF',
    filter: 'drop-shadow(0 0 8px rgba(0,212,255,0.5))',
  },
  logoText: {
    fontSize: '1.2rem',
    fontWeight: 800,
    letterSpacing: '-0.02em',
    background: 'linear-gradient(135deg, #fff, #00D4FF)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
  linksMobile: {
    position: 'absolute',
    top: 72,
    left: 0,
    right: 0,
    flexDirection: 'column',
    background: 'rgba(26, 38, 52, 0.95)',
    backdropFilter: 'blur(20px)',
    padding: '16px 20px',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    gap: 4,
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '8px 16px',
    borderRadius: 10,
    color: 'rgba(255,255,255,0.65)',
    textDecoration: 'none',
    fontSize: '0.88rem',
    fontWeight: 500,
    transition: 'all 0.3s ease',
    whiteSpace: 'nowrap',
  },
  linkActive: {
    color: '#00D4FF',
    background: 'rgba(0, 212, 255, 0.1)',
  },
  linkIcon: {
    fontSize: '0.95rem',
  },
  hamburger: {
    display: 'none',
    flexDirection: 'column',
    gap: 4,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 8,
  },
  hamburgerLine: {
    width: 22,
    height: 2,
    background: '#fff',
    borderRadius: 2,
    transition: 'all 0.3s ease',
  },
};

// Add CSS media query for hamburger via style tag
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @media (max-width: 768px) {
      nav button[aria-label="Toggle menu"] { display: flex !important; }
      nav > div > div:nth-child(2) { display: none; }
      nav > div > div:nth-child(2)[style*="position: absolute"] { display: flex !important; }
    }
  `;
  if (!document.head.querySelector('[data-navbar-styles]')) {
    style.setAttribute('data-navbar-styles', '');
    document.head.appendChild(style);
  }
}
