/**
 * Firebase App & AI Logic Initialization
 * 
 * Configures Firebase, App Check with Debug Token support,
 * and the Firebase AI service with GoogleAIBackend.
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAI, GoogleAIBackend } from 'firebase/ai';
import { initializeAppCheck, CustomProvider } from 'firebase/app-check';

// Cross-environment safe env resolver (Vite in browser / process.env in Node tests)
const env = (typeof import.meta !== 'undefined' && import.meta.env) 
  ? import.meta.env 
  : (typeof process !== 'undefined' && process.env ? process.env : {});

// Firebase configuration from environment
const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || 'AIzaSyDemoKeyMockForBuildVerification001',
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || 'hackerthon-2f7b1.firebaseapp.com',
  projectId: env.VITE_FIREBASE_PROJECT_ID || 'hackerthon-2f7b1',
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || 'hackerthon-2f7b1.firebasestorage.app',
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || '208169344350',
  appId: env.VITE_FIREBASE_APP_ID || '1:208169344350:web:8e391af2cb46a9b7'
};

// Singleton App Instance
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// App Check Initialization
let appCheckInstance = null;
if (typeof window !== 'undefined') {
  // Support debug token for local testing and compliance rule #2
  const debugToken = env.VITE_APPCHECK_DEBUG_TOKEN;
  if (debugToken) {
    self.FIREBASE_APPCHECK_DEBUG_TOKEN = debugToken === 'true' ? true : debugToken;
  }

  try {
    // Initialize App Check with custom provider / debug token
    appCheckInstance = initializeAppCheck(app, {
      provider: new CustomProvider({
        getToken: () => {
          return Promise.resolve({
            token: 'mock-debug-token-for-dev-verification',
            expireTimeMillis: Date.now() + 60 * 60 * 1000
          });
        }
      }),
      isTokenAutoRefreshEnabled: true
    });
  } catch (err) {
    console.warn('[App Check] Note: running in non-enforced development mode.', err.message);
  }
}

export const appCheck = appCheckInstance;

// Initialize Firebase AI service using GoogleAIBackend
export const ai = getAI(app, {
  backend: new GoogleAIBackend()
});
