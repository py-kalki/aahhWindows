require('dotenv').config();
const express = require('express');
const { Resend } = require('resend');
const router = express.Router();

/**
 * POST /api/send-download-email
 * Manually trigger a download email. Called by webhook handler OR
 * can be called after frontend payment confirmation as fallback.
 *
 * Body: { email: string, paymentIntentId: string }
 * Returns: { success: boolean }
 *
 * NOTE: In production, trigger this ONLY from the Stripe webhook
 * (payment_intent.succeeded event) to guarantee payment was received.
 * Do NOT trust frontend calls alone for download delivery.
 */
router.post('/send-download-email', async (req, res) => {
  const { email, paymentIntentId } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }

  const downloadUrl = process.env.DOWNLOAD_URL || 'https://example.com/aahhwindows-setup.exe';

  // ── Simulate email for development (no API key needed) ─────────────────
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'your_resend_key_here') {
    console.log('📧 [DEV MODE] Simulated email send:');
    console.log(`   To: ${email}`);
    console.log(`   PaymentIntent: ${paymentIntentId}`);
    console.log(`   Download URL: ${downloadUrl}`);
    // TODO: Replace with real email send when RESEND_API_KEY is configured
    // POST /api/send-download-email needs a real backend endpoint with Resend/Nodemailer
    return res.json({ success: true, simulated: true });
  }

  // ── Real Resend send ────────────────────────────────────────────────────
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: 'aahhWindows <noreply@yourdomain.com>',
      to: [email],
      subject: '🫦 Your aahhWindows download is ready',
      html: buildEmailHtml(downloadUrl),
    });

    console.log(`📨 Download email sent to: ${email} (PaymentIntent: ${paymentIntentId})`);
    res.json({ success: true });
  } catch (err) {
    console.error('❌ Email send error:', err.message);
    res.status(500).json({ error: 'Failed to send email. Check RESEND_API_KEY.' });
  }
});

function buildEmailHtml(downloadUrl) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <style>
        body { background: #0a0a0a; color: #fff; font-family: Arial, sans-serif; margin: 0; padding: 40px 20px; }
        .card { max-width: 560px; margin: 0 auto; border: 2px solid #ff2d6b; padding: 48px; }
        h1 { font-size: 36px; color: #f5ff4b; margin: 0 0 16px; letter-spacing: 2px; }
        p { color: rgba(255,255,255,0.7); line-height: 1.7; margin: 0 0 24px; }
        .btn { display: inline-block; background: #ff2d6b; color: #0a0a0a; text-decoration: none;
               font-weight: 700; font-size: 18px; padding: 16px 40px; letter-spacing: 1px; }
        .footer { margin-top: 32px; font-size: 12px; color: rgba(255,255,255,0.3); }
      </style>
    </head>
    <body>
      <div class="card">
        <div style="font-size:64px; margin-bottom:16px;">🫦</div>
        <h1>YOUR LAPTOP IS ABOUT TO GET LOUD</h1>
        <p>Thanks for purchasing <strong style="color:#ff2d6b">aahhWindows</strong>! Your one-time download link is waiting below. Don't blame us for what happens next.</p>
        <a class="btn" href="${downloadUrl}">⬇️ DOWNLOAD AAHHWINDOWS</a>
        <p style="margin-top:24px; font-size:13px; color:rgba(255,255,255,0.4);">
          This link is for your personal use only. Share wisely (or don't — we're not your mom). Questions? Reply to this email.
        </p>
        <div class="footer">
          aahhWindows™ — Not responsible for workplace incidents.<br />
          Made with 🫦 and questionable judgment.
        </div>
      </div>
    </body>
    </html>
  `;
}

module.exports = router;
