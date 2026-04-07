export default function Footer({ onPrivacyClick, onTermsClick }) {
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
        <button
          className="footer-link-btn"
          onClick={onPrivacyClick}
          id="footer-privacy-btn"
        >
          Privacy Policy
        </button>
        <button
          className="footer-link-btn"
          onClick={onTermsClick}
          id="footer-terms-btn"
        >
          Terms of Service
        </button>
        <a href="mailto:support@aahhwindows.com" className="footer-link-btn">
          Contact
        </a>
        <a href="#faq" className="footer-link-btn">
          FAQ
        </a>
      </nav>

      <p className="footer-made">
        Made with 🫦 and questionable judgment &nbsp;·&nbsp; © {new Date().getFullYear()} aahhWindows
      </p>
    </footer>
  );
}
