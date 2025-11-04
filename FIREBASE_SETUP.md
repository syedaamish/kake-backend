# 🔥 Firebase Admin SDK Setup Guide

## Your Firebase Configuration
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyAQTGmUu2YIFUKjrFi6zLWCljIHouOU6Mg",
  authDomain: "kake-bakery.firebaseapp.com",
  projectId: "kake-bakery",
  storageBucket: "kake-bakery.firebasestorage.app",
  messagingSenderId: "547764940276",
  appId: "1:547764940276:web:e25bbe792b512946d6dda1",
  measurementId: "G-6FGQCQ97E2"
};
```

## Steps to Get Firebase Admin SDK Credentials

### 1. Go to Firebase Console
- Visit: https://console.firebase.google.com/
- Select your project: **kake-bakery**

### 2. Generate Service Account Key
1. Go to **Project Settings** (gear icon)
2. Click **Service accounts** tab
3. Click **Generate new private key**
4. Download the JSON file

### 3. Extract Required Values
From the downloaded JSON file, extract these values for your `.env` file:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb+srv://ulearn:wOukwxsNd4txQUsy@cluster0-scgcs.gcp.mongodb.net/kake-bakery?authSource=admin&replicaSet=Cluster0-shard-0&readPreference=primary&retryWrites=false&ssl=true

# Firebase Admin SDK Configuration
FIREBASE_PROJECT_ID=kake-bakery
FIREBASE_PRIVATE_KEY_ID=your-private-key-id-from-json
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key from JSON (replace \\n with actual newlines)\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@kake-bakery.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your-client-id-from-json
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40kake-bakery.iam.gserviceaccount.com

# JWT Configuration
JWT_SECRET=kake-bakery-super-secret-jwt-key-2024
JWT_EXPIRES_IN=7d

# CORS Configuration
FRONTEND_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 4. Enable Authentication
1. In Firebase Console, go to **Authentication**
2. Click **Sign-in method** tab
3. Enable **Phone** provider
4. Add your domain to authorized domains

### 5. Set Up Billing (Required for SMS)
1. Go to **Usage and billing**
2. Upgrade to **Blaze** plan (pay-as-you-go)
3. SMS costs: ~₹0.50-1.00 per message in India

## Quick Setup Commands

```bash
# Copy environment template
cp .env.example .env

# Edit with your values
nano .env

# Install dependencies (already done)
npm install

# Build and seed data
npm run build
npm run seed

# Start development server
npm run dev
```

## Testing Firebase Integration

Once configured, test the Firebase connection:

```bash
# Check health endpoint
curl http://localhost:5000/health

# Test Firebase token verification (you'll need a real token from frontend)
curl -X POST http://localhost:5000/api/auth/verify-token \
  -H "Content-Type: application/json" \
  -d '{"idToken": "your-firebase-id-token"}'
```

## Next Steps

1. ✅ Download Firebase service account JSON
2. ✅ Extract values to `.env` file
3. ✅ Enable Phone authentication in Firebase
4. ✅ Set up billing for SMS
5. ✅ Test backend connection
6. ✅ Integrate with frontend
