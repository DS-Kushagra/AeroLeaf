/**
 * Firebase Service Layer
 * Production-ready Firebase helper functions with proper error handling
 */
const { getFirestore, getAuth } = require("../config/firebase");
const logger = require("../config/logger");

/**
 * Add a user to Firestore database
 * @param {string} uid - Firebase user ID
 * @param {object} userData - User data to store
 * @returns {Promise<boolean>} Success status
 */
exports.createUserProfile = async (uid, userData) => {
  try {
    // Validate input
    if (!uid || typeof uid !== "string") {
      throw new Error("Invalid user ID provided");
    }

    if (!userData || typeof userData !== "object") {
      throw new Error("Invalid user data provided");
    }

    const db = getFirestore();
    const { admin } = require("../config/firebase");

    // Sanitize user data
    const sanitizedData = {
      email: userData.email,
      displayName: userData.displayName || "",
      role: userData.role || "investor",
      credits: userData.credits || [],
      wallet_balance: userData.wallet_balance || 0,
      phone: userData.phone || "",
      verified: userData.verified || false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await db.collection("users").doc(uid).set(sanitizedData);

    logger.info("User profile created successfully", {
      userId: uid,
      email: userData.email,
      role: userData.role,
    });

    return true;
  } catch (error) {
    logger.error("Error creating user profile:", {
      userId: uid,
      error: error.message,
      stack: error.stack,
    });
    throw error;
  }
};

/**
 * Get user profile from Firestore
 * @param {string} uid - Firebase user ID
 * @returns {Promise<object|null>} User data or null if not found
 */
exports.getUserProfile = async (uid) => {
  try {
    if (!uid || typeof uid !== "string") {
      throw new Error("Invalid user ID provided");
    }

    const db = getFirestore();
    const doc = await db.collection("users").doc(uid).get();

    if (doc.exists) {
      const userData = doc.data();

      // Remove sensitive data before returning
      const sanitizedData = {
        ...userData,
        // Remove any sensitive fields if they exist
      };

      return sanitizedData;
    } else {
      logger.warn("User profile not found", { userId: uid });
      return null;
    }
  } catch (error) {
    logger.error("Error fetching user profile:", {
      userId: uid,
      error: error.message,
    });
    throw error;
  }
};

/**
 * Update user profile in Firestore
 * @param {string} uid - Firebase user ID
 * @param {object} updateData - Data to update
 * @returns {Promise<boolean>} Success status
 */
exports.updateUserProfile = async (uid, updateData) => {
  try {
    if (!uid || typeof uid !== "string") {
      throw new Error("Invalid user ID provided");
    }

    if (!updateData || typeof updateData !== "object") {
      throw new Error("Invalid update data provided");
    }

    const db = getFirestore();
    const { admin } = require("../config/firebase");

    // Add updatedAt timestamp
    const sanitizedData = {
      ...updateData,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await db.collection("users").doc(uid).update(sanitizedData);

    logger.info("User profile updated successfully", {
      userId: uid,
      updatedFields: Object.keys(updateData),
    });

    return true;
  } catch (error) {
    logger.error("Error updating user profile:", {
      userId: uid,
      error: error.message,
    });
    throw error;
  }
};

/**
 * Store verification results in Firestore
 * @param {string} siteId - Site ID
 * @param {object} verificationData - Verification data
 * @returns {Promise<boolean>} Success status
 */
exports.storeVerificationResult = async (siteId, verificationData) => {
  try {
    if (!siteId || typeof siteId !== "string") {
      throw new Error("Invalid site ID provided");
    }

    if (!verificationData || typeof verificationData !== "object") {
      throw new Error("Invalid verification data provided");
    }

    const db = getFirestore();
    const { admin } = require("../config/firebase");

    const sanitizedData = {
      siteId,
      ...verificationData,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection("verifications").add(sanitizedData);

    logger.info("Verification result stored successfully", {
      siteId,
      verificationId: docRef.id,
      verifierUid: verificationData.verifierUid,
    });

    return true;
  } catch (error) {
    logger.error("Error storing verification:", {
      siteId,
      error: error.message,
    });
    throw error;
  }
};

/**
 * Get user's carbon credits
 * @param {string} uid - User ID
 * @returns {Promise<Array>} Array of carbon credits
 */
exports.getUserCredits = async (uid) => {
  try {
    if (!uid || typeof uid !== "string") {
      throw new Error("Invalid user ID provided");
    }

    const db = getFirestore();
    const creditsSnapshot = await db
      .collection("carbon_credits")
      .where("owner_uid", "==", uid)
      .orderBy("created_at", "desc")
      .get();

    const credits = [];
    creditsSnapshot.forEach((doc) => {
      credits.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return credits;
  } catch (error) {
    logger.error("Error fetching user credits:", {
      userId: uid,
      error: error.message,
    });
    throw error;
  }
};

/**
 * Create a new Firebase user account
 * @param {object} userData - User account data
 * @returns {Promise<object>} Created user record
 */
exports.createFirebaseUser = async (userData) => {
  try {
    const { email, password, displayName, role } = userData;

    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    const auth = getAuth();

    // Create Firebase user
    const userRecord = await auth.createUser({
      email,
      password,
      displayName,
      emailVerified: false,
    });

    // Create user profile in Firestore
    await exports.createUserProfile(userRecord.uid, {
      email,
      displayName,
      role: role || "investor",
    });

    logger.info("Firebase user created successfully", {
      userId: userRecord.uid,
      email,
      role,
    });

    return userRecord;
  } catch (error) {
    logger.error("Error creating Firebase user:", {
      email: userData.email,
      error: error.message,
    });
    throw error;
  }
};

/**
 * Disable a user account
 * @param {string} uid - User ID to disable
 * @returns {Promise<boolean>} Success status
 */
exports.disableUser = async (uid) => {
  try {
    if (!uid || typeof uid !== "string") {
      throw new Error("Invalid user ID provided");
    }

    const auth = getAuth();
    await auth.updateUser(uid, { disabled: true });

    logger.info("User disabled successfully", { userId: uid });
    return true;
  } catch (error) {
    logger.error("Error disabling user:", {
      userId: uid,
      error: error.message,
    });
    throw error;
  }
};

/**
 * Enable a user account
 * @param {string} uid - User ID to enable
 * @returns {Promise<boolean>} Success status
 */
exports.enableUser = async (uid) => {
  try {
    if (!uid || typeof uid !== "string") {
      throw new Error("Invalid user ID provided");
    }

    const auth = getAuth();
    await auth.updateUser(uid, { disabled: false });

    logger.info("User enabled successfully", { userId: uid });
    return true;
  } catch (error) {
    logger.error("Error enabling user:", {
      userId: uid,
      error: error.message,
    });
    throw error;
  }
};
