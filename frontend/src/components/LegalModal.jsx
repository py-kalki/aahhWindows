import { useEffect } from 'react';

export default function LegalModal({ isOpen, onClose, type }) {
  // Close on ESC
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape' && isOpen) onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleOverlay = (e) => { if (e.target === e.currentTarget) onClose(); };

  const isPrivacy = type === 'privacy';

  return (
    <div
      className={`modal-overlay ${isOpen ? 'active' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label={isPrivacy ? 'Privacy Policy' : 'Terms of Service'}
      onClick={handleOverlay}
    >
      <div className="modal-box legal-modal-box">
        <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>

        {isPrivacy ? <PrivacyContent /> : <TermsContent />}
      </div>
    </div>
  );
}

/* ── PRIVACY POLICY ─────────────────────────────────────────────────── */
function PrivacyContent() {
  return (
    <div className="legal-content">
      <div className="legal-badge">PRIVACY POLICY</div>
      <h2 className="legal-title">We're not creepy.<br /><span>We promise.</span></h2>
      <p className="legal-date">Last updated: April 2026</p>

      <div className="legal-section">
        <h3>What we collect</h3>
        <p>
          When you purchase aahhWindows, we collect your <strong>email address</strong> solely to
          send you your download link. That's it. We use Stripe for payments — we never see,
          store, or touch your card details.
        </p>
      </div>

      <div className="legal-section">
        <h3>What we don't collect</h3>
        <p>
          aahhWindows (the desktop app) collects <strong>zero data</strong>. Zero. It doesn't phone
          home, it doesn't track which keys you press, it doesn't know your name, location, or how
          many times you've pressed the spacebar. We genuinely don't care.
        </p>
      </div>

      <div className="legal-section">
        <h3>Third-party services</h3>
        <p>
          We use <strong>Stripe</strong> for payment processing (their privacy policy applies to
          payment data) and <strong>Resend</strong> for transactional email. Both are GDPR-compliant.
        </p>
      </div>

      <div className="legal-section">
        <h3>Cookies</h3>
        <p>
          This website uses no tracking cookies. We may use basic session cookies for the checkout
          flow. We don't run analytics, retargeting, or any ad tracking. Your browsing is your
          business.
        </p>
      </div>

      <div className="legal-section">
        <h3>Your rights</h3>
        <p>
          You can request deletion of your email from our records at any time by emailing{' '}
          <a href="mailto:support@aahhwindows.com">support@aahhwindows.com</a>. We'll handle it
          within 48 hours, no questions asked.
        </p>
      </div>

      <div className="legal-section">
        <h3>Contact</h3>
        <p>
          Questions? Concerns? Just want to chat?{' '}
          <a href="mailto:support@aahhwindows.com">support@aahhwindows.com</a>
        </p>
      </div>
    </div>
  );
}

/* ── TERMS OF SERVICE ───────────────────────────────────────────────── */
function TermsContent() {
  return (
    <div className="legal-content">
      <div className="legal-badge">TERMS OF SERVICE</div>
      <h2 className="legal-title">The boring stuff.<br /><span>Read it anyway.</span></h2>
      <p className="legal-date">Last updated: April 2026</p>

      <div className="legal-section">
        <h3>1. What you're buying</h3>
        <p>
          aahhWindows is a one-time-purchase desktop application. You pay $4.99 once and receive
          a personal, non-transferable license to install and use the software on your own devices.
          No subscription. No recurring charges. No surprises.
        </p>
      </div>

      <div className="legal-section">
        <h3>2. Acceptable use</h3>
        <p>
          You may use aahhWindows for personal use, for pranks on consenting friends, for chaos,
          and for fun. You may NOT redistribute, resell, reverse-engineer, or use aahhWindows in
          any commercial product without written permission from us.
        </p>
      </div>

      <div className="legal-section">
        <h3>3. Refund policy</h3>
        <p>
          If aahhWindows doesn't work on your device and we can't fix it within 7 days of your
          report, we'll refund you in full. If you just changed your mind — that happens, but
          digital goods are generally non-refundable. Email us anyway and we'll be reasonable.
        </p>
      </div>

      <div className="legal-section">
        <h3>4. Disclaimer of liability</h3>
        <p>
          aahhWindows is provided "as is." We are not responsible for: lost jobs, broken
          relationships, confiscated laptops, noise complaints, HR investigations, or any other
          consequences resulting from pressing keys in public. You knew what this was.
        </p>
      </div>

      <div className="legal-section">
        <h3>5. Updates</h3>
        <p>
          We may update aahhWindows with new sounds, features, or bug fixes. Updates are free for
          life for all purchasers. We reserve the right to add sounds that are weirder than the
          current ones.
        </p>
      </div>

      <div className="legal-section">
        <h3>6. Governing law</h3>
        <p>
          These terms are governed by and construed in accordance with applicable law. Any disputes
          should first be attempted to be resolved via email at{' '}
          <a href="mailto:support@aahhwindows.com">support@aahhwindows.com</a>.
        </p>
      </div>

      <div className="legal-section">
        <h3>7. Changes to these terms</h3>
        <p>
          We may update these Terms occasionally. Continued use of the software after changes
          constitutes acceptance. We'll try to keep it human-readable.
        </p>
      </div>
    </div>
  );
}
