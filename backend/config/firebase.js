/**
 * Firebase Admin SDK Configuration
 * Centralized Firebase initialization for production
 */
const admin = require("firebase-admin");
require("dotenv").config();

let firebaseApp = null;

/**
 * Initialize Firebase Admin SDK
 * @returns {admin.app.App} Firebase Admin App instance
 */
function initializeFirebase() {
  if (firebaseApp) {
    return firebaseApp;
  }

  try {
    let credential;

    // Check if we have environment variables for Firebase config
    if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
      // Use environment variables (production)
      const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n");

      credential = admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID,
        privateKey: privateKey,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        clientId: process.env.FIREBASE_CLIENT_ID,
        authUri: process.env.FIREBASE_AUTH_URI,
        tokenUri: process.env.FIREBASE_TOKEN_URI,
      });
    } else {
      // Fallback to service account file (development)
      try {
        const serviceAccount = require("../firebaseServiceKey.json");
        credential = admin.credential.cert(serviceAccount);
      } catch (error) {
        throw new Error(
          "Firebase service account file not found and environment variables not set"
        );
      }
    }

    firebaseApp = admin.initializeApp({
      credential: credential,
      projectId: process.env.FIREBASE_PROJECT_ID || "aeroleaf-742db",
    });

    console.log("✅ Firebase Admin SDK initialized successfully");
    return firebaseApp;
  } catch (error) {
    console.error("❌ Firebase initialization failed:", error.message);
    throw error;
  }
}

/**
 * Get Firebase Admin Auth instance
 * @returns {admin.auth.Auth}
 */
function getAuth() {
  const app = initializeFirebase();
  return admin.auth(app);
}

/**
 * Get Firestore instance
 * @returns {admin.firestore.Firestore}
 */
function getFirestore() {
  const app = initializeFirebase();
  return admin.firestore(app);
}

module.exports = {
  initializeFirebase,
  getAuth,
  getFirestore,
  admin,
};
