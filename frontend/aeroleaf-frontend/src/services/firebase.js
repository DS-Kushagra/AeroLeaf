/**
 * Firebase configuration and initialization for the AeroLeaf frontend
 */
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY ||
    "AIzaSyB_Xl0uY7RTIcEps1ZPOmh2SuFURwCUlaw",
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "aeroleaf-app.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "aeroleaf-app",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "aeroleaf-app.appspot.com",
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ||
    "1:123456789012:web:abc123def456ghi789jkl",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-ABCDEFGHIJ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
