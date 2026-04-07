# AahhWindows Website Deployment Guide

This guide covers deploying the React + Vite frontend and the Node.js + Express backend.

## 🏗 Architecture
- **Frontend**: React, Vite, GSAP, Three.js
- **Backend**: Node.js, Express, PayU (payments), Resend (emails)

## 1. Deploying the Backend
The backend serves the API for order creation, payment hashing, and handles the PayU payment success callback for sending the download email and redirecting to the frontend.

### Recommended Providers
- [Render](https://render.com)
- [Railway](https://railway.app)
- [DigitalOcean App Platform](https://digitalocean.com)

### Steps
1. Push your code (including the `backend` folder) to GitHub.
2. In your hosting provider, create a new **Web Service**.
3. Set the **Root Directory** to `backend`.
4. Set the **Build Command** to `npm install`.
5. Set the **Start Command** to `npm start`.
6. Configure the following Environment Variables in the hosting dashboard:
   - `PORT`: (Usually auto-assigned by provider, defaults to 3001)
   - `PAYU_MERCHANT_KEY`: Your PayU Merchant Key
   - `PAYU_MERCHANT_SALT`: Your PayU Merchant Salt
   - `PAYU_URL`: Set to `https://secure.payu.in/_payment` for production. Omit for testing.
   - `RESEND_API_KEY`: Your Resend API Key
   - `DOWNLOAD_URL`: Direct link to your final `aahhWindows-setup.exe` (e.g. hosted on AWS S3, Google Drive direct link, or static hosting)
   - `FRONTEND_URL`: The final production URL of your frontend (e.g., `https://aahhwindows.com`). **Crucial for CORS and Redirects**.
   - `BACKEND_URL`: The final production URL of your backend (e.g., `https://api.aahhwindows.com`). **Required for PayU SURL/FURL callbacks.**

## 2. Deploying the Frontend
The frontend is a static React application built with Vite.

### Recommended Providers
- [Vercel](https://vercel.com)
- [Netlify](https://netlify.com)

### Steps (Example using Vercel)
1. In Vercel, import your GitHub repository.
2. Set the **Root Directory** to `frontend`.
3. The framework should be automatically detected as Vite.
4. **Build Command**: `npm run build`
5. **Output Directory**: `dist`
6. (Optional) Remove any old `.env` variables from frontend; PayU is handled purely on the backend.
7. **Important: API Rewrites**
   Because the frontend makes calls directly to `/api/...`, you must tell Vercel to route those to your live backend. Create a `vercel.json` file inside the `frontend` folder with this content:
   ```json
   {
     "rewrites": [
       {
         "source": "/api/:path*",
         "destination": "https://<YOUR_BACKEND_URL>/api/:path*"
       }
     ]
   }
   ```
   *(Be sure to replace `<YOUR_BACKEND_URL>` with the live backend URL from Step 1)*

## 3. Final Testing
1. Re-deploy the frontend once your backend is up so the rewrites take effect.
2. Go to your live frontend URL.
3. Click "Buy Now".
4. Verify that the PayU transaction begins when you enter an email and submit.
5. Perform a test transaction.
6. Verify that you are redirected back to your frontend with a success modal.
7. Check your email to verify that Resend delivered the download link properly.
