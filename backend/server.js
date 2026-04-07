require('dotenv').config();
const express   = require('express');
const cors      = require('cors');
const crypto    = require('crypto');

const payuRoutes  = require('./routes/payu');
const emailRoutes = require('./routes/email');

const app  = express();
const PORT = process.env.PORT || 3001;

// ─── CORS ─────────────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

// ─── PARSERS ──────────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Required for PayU POST callbacks

// ─── ROUTES ───────────────────────────────────────────────────────────────────
app.use('/api', payuRoutes);
app.use('/api', emailRoutes);

// ─── HEALTH CHECK ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), gateway: 'payu' });
});

// ─── START ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 aahhWindows backend running at http://localhost:${PORT}`);
  console.log(`💳 Payment gateway: PayU`);
  console.log(`💰 Price: ₹99`);
});

// ─── EMAIL HTML ───────────────────────────────────────────────────────────────
function buildEmailHtml(downloadUrl) {
  return `
    <!DOCTYPE html><html><head><meta charset="UTF-8"/>
    <style>
      body{background:#0a0a0a;color:#fff;font-family:Arial,sans-serif;margin:0;padding:40px 20px;}
      .card{max-width:560px;margin:0 auto;border:2px solid #e01c2e;padding:48px;}
      h1{font-size:32px;color:#f5ff4b;margin:0 0 16px;letter-spacing:2px;}
      p{color:rgba(255,255,255,0.7);line-height:1.7;margin:0 0 24px;}
      .btn{display:inline-block;background:#e01c2e;color:#fff;text-decoration:none;
           font-weight:700;font-size:18px;padding:16px 40px;letter-spacing:1px;}
      .footer{margin-top:32px;font-size:12px;color:rgba(255,255,255,0.3);}
    </style></head>
    <body>
      <div class="card">
        <div style="font-size:64px;margin-bottom:16px;">🫦</div>
        <h1>YOUR LAPTOP IS ABOUT TO GET LOUD</h1>
        <p>Thanks for purchasing <strong style="color:#e01c2e">aahhWindows</strong>!
        Your download link is below. Don't blame us for what happens next.</p>
        <a class="btn" href="${downloadUrl}">⬇️ DOWNLOAD AAHHWINDOWS</a>
        <p style="margin-top:24px;font-size:13px;color:rgba(255,255,255,0.4);">
          Personal use only. Questions? Reply to this email.
        </p>
        <div class="footer">
          aahhWindows™ — Not responsible for workplace incidents.<br/>
          Made with 🫦 and questionable judgment.
        </div>
      </div>
    </body></html>
  `;
}
