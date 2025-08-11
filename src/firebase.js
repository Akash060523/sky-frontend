// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyA1d9kwSxZQx4ZXQCxmOyrEV4-Tnl8MEzc",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "skybook-e9086.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "skybook-e9086",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "skybook-e9086.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "912429212944",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:912429212944:web:19da580cf932672454f195",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-9YHQ8012RJ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);