# 🚀 Production Deployment Guide

## 🎯 Current Status
- ✅ Frontend: Working locally
- ✅ Backend: Deployed on Render
- ✅ SMS: Working (you received SMS)
- ⏳ Frontend: Need to deploy to Vercel

## 🌐 Step 1: Deploy Frontend to Vercel

### 1. Prepare for Deployment
1. Make sure all changes are committed to git
2. Ensure the app works locally
3. Check that backend URL is correct

### 2. Deploy to Vercel
1. Go to [Vercel.com](https://vercel.com)
2. Sign up/Login with GitHub
3. Click **"New Project"**
4. Import your GitHub repository
5. Configure build settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### 3. Environment Variables on Vercel
Add these environment variables in Vercel:
```
VITE_FIREBASE_API_KEY=AIzaSyA1d9kwSxZQx4ZXQCxmOyrEV4-Tnl8MEzc
VITE_FIREBASE_AUTH_DOMAIN=skybook-e9086.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=skybook-e9086
VITE_BACKEND_URL=https://skybook-backend.onrender.com
```

### 4. Deploy
1. Click **"Deploy"**
2. Wait for build to complete
3. Your app will be live at: `https://your-app-name.vercel.app`

## 🔧 Step 2: Configure Production Backend

### 1. Update Backend Environment Variables
On Render, add these variables:

**For Twilio (Real SMS):**
```
TWILIO_ACCOUNT_SID=ACyour_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1your_twilio_phone_number
```

**For Firebase Admin (Full Auth):**
```
FIREBASE_PRIVATE_KEY_ID=your_private_key_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour Private Key Here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@skybook-e9086.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your_client_id
FIREBASE_CLIENT_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40skybook-e9086.iam.gserviceaccount.com
```

### 2. Update Frontend Backend URL
Make sure your frontend is pointing to the correct backend URL:
```javascript
// In your frontend code, ensure this URL is correct:
const BACKEND_URL = "https://skybook-backend.onrender.com";
```

## 🧪 Step 3: Test Production

### 1. Test Frontend
- ✅ Visit your Vercel URL
- ✅ Test login functionality
- ✅ Test flight search
- ✅ Test SMS sending

### 2. Test Backend
- ✅ Visit: https://skybook-backend.onrender.com
- ✅ Check status page
- ✅ Test SMS endpoint

### 3. Test Complete Flow
- ✅ Login with Firebase
- ✅ Search for flights
- ✅ Send SMS alerts
- ✅ Receive real SMS messages

## 📊 Production Checklist

| Component | Status | URL |
|-----------|--------|-----|
| **Frontend** | ⏳ Deploy to Vercel | https://your-app.vercel.app |
| **Backend** | ✅ Deployed on Render | https://skybook-backend.onrender.com |
| **Firebase Auth** | ✅ Working | skybook-e9086 |
| **SMS (Simulation)** | ✅ Working | No credentials needed |
| **SMS (Real)** | ⏳ Add Twilio | Real SMS delivery |
| **Full Auth** | ⏳ Add Firebase Admin | Complete security |

## 🔗 Quick Links
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Render Dashboard](https://dashboard.render.com/)
- [Firebase Console](https://console.firebase.google.com/project/skybook-e9086)
- [Twilio Console](https://console.twilio.com/)

## 🎯 Next Steps After Deployment

1. **Deploy frontend to Vercel** - Get production URL
2. **Add Twilio credentials** - Real SMS delivery
3. **Add Firebase Admin** - Complete authentication
4. **Test everything** - Ensure production works
5. **Share your app** - Ready for users!

## 💡 Pro Tips
- Vercel gives you free hosting
- Render gives you free backend hosting
- Twilio gives you free SMS credits
- Firebase gives you free authentication
- Perfect for MVP and small scale apps



