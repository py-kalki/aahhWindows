export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-brand">
        aahh<span>Windows</span>™
      </div>
      <p className="footer-disclaimer">
        Not responsible for workplace incidents, awkward silences,<br />
        or the look your coworkers give you.
      </p>

      <nav className="footer-links" aria-label="Footer navigation">
        <a href="https://github.com/py-kalki" target="_blank" rel="noopener" className="footer-link-btn">
          GitHub
        </a>
        <a href="https://vedanshh.dev" target="_blank" rel="noopener" className="footer-link-btn">
          vedanshh.dev
        </a>
        <a href="https://github.com/py-kalki/aahhWindows/releases/download/v0.1.0/aahhWindows-Setup-0.1.0.exe" download className="footer-link-btn">
          Download
        </a>
        <a href="#faq" className="footer-link-btn">FAQ</a>
      </nav>

      <p className="footer-made">
        Made with 🫦 and questionable judgment
      </p>
      <p style={{ marginTop: '12px', fontSize: '13px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.5px' }}>
        Designed and Developed by <a href="https://www.vedanshh.dev" target="_blank" rel="noopener" style={{ color: 'var(--yellow)', textDecoration: 'none', fontWeight: 'bold' }}>Vedanshh.dev</a>
      </p>
      <p style={{ marginTop: '8px', fontSize: '12px', color: 'rgba(255,255,255,0.2)', letterSpacing: '1px' }}>
        © {new Date().getFullYear()}{' '}
        <a href="https://github.com/py-kalki" target="_blank" rel="noopener" style={{ color: '#ff2d6b', textDecoration: 'none' }}>
          py-kalki
        </a>
      </p>
    </footer>
  );
}
