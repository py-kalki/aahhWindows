require('dotenv').config();
const express = require('express');
const crypto  = require('crypto');
const router  = express.Router();

const PAYU_KEY   = process.env.PAYU_MERCHANT_KEY || 'gtKFFx'; // gtKFFx is PayU test key
const PAYU_SALT  = process.env.PAYU_MERCHANT_SALT || 'eCwWELxi'; // eCwWELxi is PayU test salt
const PAYU_URL   = process.env.PAYU_URL || 'https://test.payu.in/_payment';

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/pay/hash
// Generates a PayU hash sequence and returns required form fields to frontend
// ─────────────────────────────────────────────────────────────────────────────
router.post('/hash', (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email is required.' });
  }

  const txnid       = `txnid_${Date.now()}`;
  const amount      = '99.00'; // ₹99
  const productinfo = 'aahhWindows';
  const firstname   = 'Customer'; // Hardcoded as we only collect email
  const surl        = `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/pay/success`;
  const furl        = `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/pay/failure`;
  
  // Hash sequence: key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||SALT
  const hashString = `${PAYU_KEY}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${PAYU_SALT}`;
  const hash = crypto.createHash('sha512').update(hashString).digest('hex');

  res.json({
    key: PAYU_KEY,
    txnid,
    amount,
    productinfo,
    firstname,
    email,
    surl,
    furl,
    hash,
    payu_url: PAYU_URL
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/pay/success
// User is redirected here by PayU on success (SURL)
// ─────────────────────────────────────────────────────────────────────────────
router.post('/success', async (req, res) => {
  const { status, email, amount, txnid, hash, productinfo, firstname } = req.body;
  
  // PayU Reverse Hash sequence: SALT|status|||||||||||email|firstname|productinfo|amount|txnid|key
  const reverseHashString = `${PAYU_SALT}|${status}|||||||||||${email}|${firstname}|${productinfo}|${amount}|${txnid}|${PAYU_KEY}`;
  const expectedHash = crypto.createHash('sha512').update(reverseHashString).digest('hex');

  if (expectedHash !== hash) {
    console.error('❌ PayU hash verification FAILED', { txnid, expectedHash, hash });
    return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}?payment=error&reason=invalid_hash`);
  }

  if (status === 'success') {
    console.log(`✅ PayU Payment successful: ${txnid} | Email: ${email}`);
    
    // Trigger download email
    try {
      const { Resend } = require('resend');
      const resend     = new Resend(process.env.RESEND_API_KEY);
      const downloadUrl = process.env.DOWNLOAD_URL || 'https://example.com/aahhwindows-setup.exe';

      if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 'your_resend_key_here') {
        await resend.emails.send({
          from: 'aahhWindows <noreply@yourdomain.com>',
          to:   [email],
          subject: '🫦 Your aahhWindows download is ready',
          html: `<p>Download: <a href="${downloadUrl}">${downloadUrl}</a></p>`,
        });
        console.log('📧 Download email sent to:', email);
      } else {
        console.log('📧 [DEV] Download email simulated for:', email);
        console.log('🔗 [DEV] Download URL:', downloadUrl);
      }
    } catch (err) {
      console.error('❌ Post-payment email error:', err.message);
    }
    
    // Redirect to frontend UI with success flag
    return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}?payment=success&email=${encodeURIComponent(email)}`);
  } else {
    // Edge case if status isn't success but it hit SURL somehow
    return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}?payment=error&reason=failed`);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/pay/failure
// User is redirected here by PayU on failure (FURL)
// ─────────────────────────────────────────────────────────────────────────────
router.post('/failure', (req, res) => {
  console.log('❌ PayU Payment failed or cancelled');
  res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}?payment=error`);
});

module.exports = router;
