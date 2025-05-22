// Firebase initialization and helper functions
const admin = require("firebase-admin");
const { getFirestore } = require("firebase-admin/firestore");
const { getAuth } = require("firebase-admin/auth");

// Use environment variables in production
const firebaseConfig = {
  apiKey:
    process.env.FIREBASE_API_KEY || "AIzaSyB_Xl0uY7RTIcEps1ZPOmh2SuFURwCUlaw",
  authDomain: "aeroleaf-742db.firebaseapp.com",
  projectId: "aeroleaf-742db",
  storageBucket: "aeroleaf-742db.firebasestorage.app",
  messagingSenderId: "354286712486",
  appId: "1:354286712486:web:332babb6c6e29ff58d6667",
  measurementId: "G-BLW11ZYFLH",
};

// Firebase Admin is initialized in the auth middleware
// This file provides helper functions for interacting with Firebase

/**
 * Add a user to Firestore database
 * @param {string} uid - Firebase user ID
 * @param {object} userData - User data to store
 */
exports.createUserProfile = async (uid, userData) => {
  try {
    const db = getFirestore();
    await db
      .collection("users")
      .doc(uid)
      .set({
        ...userData,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    return true;
  } catch (error) {
    console.error("Error creating user profile:", error);
    return false;
  }
};

/**
 * Get user profile from Firestore
 * @param {string} uid - Firebase user ID
 */
exports.getUserProfile = async (uid) => {
  try {
    const db = getFirestore();
    const doc = await db.collection("users").doc(uid).get();
    if (doc.exists) {
      return doc.data();
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};

/**
 * Store verification results in Firestore
 * @param {string} siteId - Site ID
 * @param {object} verificationData - Verification data
 */
exports.storeVerificationResult = async (siteId, verificationData) => {
  try {
    const db = getFirestore();
    await db.collection("verifications").add({
      siteId,
      ...verificationData,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error("Error storing verification:", error);
    return false;
  }
};
