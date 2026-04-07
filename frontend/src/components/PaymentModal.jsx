import { useState, useEffect, useRef } from 'react';

/* ─── Main component ──────────────────────────────────────────────────────── */
export default function PaymentModal({ isOpen, onClose, initialSuccess, initialEmail, hasError }) {
  const [email,    setEmail]    = useState(initialEmail || '');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(hasError ? 'Payment failed or cancelled. Please try again.' : '');
  const [success,  setSuccess]  = useState(initialSuccess || false);
  const emailRef = useRef(null);

  // ESC to close
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape' && isOpen) { if (!success) onClose(); } };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, success, onClose]);

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Focus email on open
  useEffect(() => {
    if (isOpen && emailRef.current && !success) {
      setTimeout(() => emailRef.current?.focus(), 180);
    }
    // Set props correctly when opened through App redirects
    if (isOpen) {
        if (initialSuccess) setSuccess(true);
        if (initialEmail) setEmail(initialEmail);
        if (hasError) setError('Payment failed or cancelled. Please try again.');
    } else {
        // Reset when closed
        if (!initialSuccess) {
            setEmail(''); setError(''); setSuccess(false); setLoading(false);
        }
    }
  }, [isOpen, success, initialSuccess, initialEmail, hasError]);

  // Overlay click → close
  const handleOverlay = (e) => { if (e.target === e.currentTarget && !success) onClose(); };

  /* ── Initiate payment ──────────────────────────────────────────────────── */
  const handlePay = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      // 1. Fetch PayU hash and transaction details from backend
      const res = await fetch('/api/pay/hash', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email }),
      });
      
      const payuData = await res.json();
      if (!res.ok) throw new Error(payuData.error || 'Failed to initialize payment.');

      // 2. Create an invisible form and submit it to PayU
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = payuData.payu_url;
      
      const appendField = (name, value) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = value;
        form.appendChild(input);
      };

      appendField('key', payuData.key);
      appendField('txnid', payuData.txnid);
      appendField('amount', payuData.amount);
      appendField('productinfo', payuData.productinfo);
      appendField('firstname', payuData.firstname);
      appendField('email', payuData.email);
      appendField('phone', '9999999999'); // Fallback placeholder
      appendField('surl', payuData.surl);
      appendField('furl', payuData.furl);
      appendField('hash', payuData.hash);

      document.body.appendChild(form);
      form.submit();
      
      // Note: We don't setLoading(false) here because the page is navigating away.
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  /* ── Success state ─────────────────────────────────────────────────────── */
  if (isOpen && success) {
    return (
      <div className="modal-overlay active" onClick={handleOverlay}>
        <div className="modal-box">
          <button className="modal-close" id="modal-close-success" onClick={onClose} aria-label="Close">✕</button>
          <div className="modal-success">
            <span className="success-emoji">🫦</span>
            <h2 className="success-title">YOUR LAPTOP IS<br />ABOUT TO GET LOUD</h2>
            <p className="success-sub">
              Your download link is headed to{' '}
              <em>{email}</em>.<br /><br />
              Check your inbox (and spam).<br />
              Install it. Press a key. Regret nothing.
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ── Checkout form ─────────────────────────────────────────────────────── */
  return (
    <div
      className={`modal-overlay ${isOpen ? 'active' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Purchase aahhWindows"
      onClick={handleOverlay}
    >
      <div className="modal-box">
        <button className="modal-close" id="modal-close-btn" onClick={onClose} aria-label="Close">✕</button>

        {/* Product summary */}
        <div className="modal-product">
          <div>
            <div className="modal-p-name">AAHHWINDOWS</div>
            <div className="modal-p-detail">One-time license · Instant download · No subscription</div>
          </div>
          <div className="modal-p-price">₹99</div>
        </div>

        <h2 className="modal-heading">YOUR DETAILS</h2>

        <form onSubmit={handlePay} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="checkout-email">Email Address</label>
            <input
              id="checkout-email"
              type="email"
              className="form-input"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              ref={emailRef}
              required
              autoComplete="email"
            />
          </div>

          {/* Info box */}
          <div className="rzp-info-box">
            <span className="rzp-info-icon">🔒</span>
            <p>
              Secure payment via <strong>PayU</strong> — supports UPI, Cards,
              Net Banking, Wallets &amp; more.
            </p>
          </div>

          {error && <p className="card-errors" role="alert">{error}</p>}

          <button
            className="pay-btn"
            id="payu-pay-btn"
            type="submit"
            disabled={loading}
          >
            {loading
              ? <><span className="spinner" />REDIRECTING...</>
              : 'PAY ₹99 — GET LOUD 🫦'}
          </button>

          <p className="pay-secure">
            🔒 Secured by PayU · UPI · Cards · Net Banking · Wallets
          </p>
        </form>
      </div>
    </div>
  );
}
