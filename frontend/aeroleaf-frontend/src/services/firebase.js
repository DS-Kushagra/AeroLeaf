/**
 * Firebase configuration and initialization for the AeroLeaf frontend
 * Production-ready Firebase client configuration
 */
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY ||
    "AIzaSyB_Xl0uY7RTIcEps1ZPOmh2SuFURwCUlaw",
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ||
    "aeroleaf-742db.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "aeroleaf-742db",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    "aeroleaf-742db.firebasestorage.app",
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "354286712486",
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ||
    "1:354286712486:web:332babb6c6e29ff58d6667",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-BLW11ZYFLH",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Production-ready authentication service
class AuthService {
  constructor() {
    this.auth = auth;
    this.currentUser = null;
    this.authListeners = [];

    // Set up auth state listener
    onAuthStateChanged(this.auth, (user) => {
      this.currentUser = user;
      this.notifyAuthListeners(user);
    });
  }

  /**
   * Register auth state change listener
   * @param {Function} callback - Callback function to execute on auth state change
   * @returns {Function} Unsubscribe function
   */
  onAuthStateChange(callback) {
    this.authListeners.push(callback);

    // Return unsubscribe function
    return () => {
      this.authListeners = this.authListeners.filter(
        (listener) => listener !== callback
      );
    };
  }

  /**
   * Notify all auth listeners of state change
   * @param {Object|null} user - Current user object or null
   */
  notifyAuthListeners(user) {
    this.authListeners.forEach((callback) => callback(user));
  }

  /**
   * Sign in with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} User credential
   */
  async signIn(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );

      // Get user token for API calls
      const token = await userCredential.user.getIdToken();

      // Store token securely
      this.storeToken(token);

      return {
        user: userCredential.user,
        token,
      };
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Create new user account
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {string} displayName - User display name
   * @param {string} role - User role
   * @returns {Promise<Object>} User credential
   */
  async signUp(email, password, displayName, role = "investor") {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );

      // Update user profile
      await updateProfile(userCredential.user, {
        displayName: displayName,
      });

      // Get user token
      const token = await userCredential.user.getIdToken();

      // Create user profile in backend
      await this.createUserProfile(
        userCredential.user.uid,
        {
          email,
          displayName,
          role,
        },
        token
      );

      this.storeToken(token);

      return {
        user: userCredential.user,
        token,
      };
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Sign out current user
   * @returns {Promise<void>}
   */
  async signOut() {
    try {
      await signOut(this.auth);
      this.clearToken();

      // Clear any stored user data
      localStorage.removeItem("user");
      sessionStorage.removeItem("user");
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Send password reset email
   * @param {string} email - User email
   * @returns {Promise<void>}
   */
  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(this.auth, email);
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Get current user's ID token
   * @param {boolean} forceRefresh - Force token refresh
   * @returns {Promise<string|null>} ID token or null
   */
  async getCurrentToken(forceRefresh = false) {
    if (!this.currentUser) return null;

    try {
      const token = await this.currentUser.getIdToken(forceRefresh);
      this.storeToken(token);
      return token;
    } catch (error) {
      console.error("Error getting token:", error);
      return null;
    }
  }

  /**
   * Store authentication token securely
   * @param {string} token - JWT token
   */
  storeToken(token) {
    try {
      // Store in sessionStorage for better security (expires when browser closes)
      sessionStorage.setItem("auth_token", token);

      // Optional: Store in localStorage for persistence (less secure)
      if (localStorage.getItem("remember_me") === "true") {
        localStorage.setItem("auth_token", token);
      }
    } catch (error) {
      console.error("Error storing token:", error);
    }
  }

  /**
   * Get stored authentication token
   * @returns {string|null} Stored token or null
   */
  getStoredToken() {
    return (
      sessionStorage.getItem("auth_token") || localStorage.getItem("auth_token")
    );
  }

  /**
   * Clear stored authentication token
   */
  clearToken() {
    sessionStorage.removeItem("auth_token");
    localStorage.removeItem("auth_token");
  }

  /**
   * Create user profile in backend
   * @param {string} uid - User ID
   * @param {Object} userData - User data
   * @param {string} token - Auth token
   */
  async createUserProfile(uid, userData, token) {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL || "http://localhost:5000"
        }/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(userData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create user profile");
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating user profile:", error);
      // Don't throw here - user account was created successfully in Firebase
    }
  }

  /**
   * Delete user account
   * @param {string} password - Current password for reauthentication
   * @returns {Promise<void>}
   */
  async deleteAccount(password) {
    if (!this.currentUser) {
      throw new Error("No user logged in");
    }

    try {
      // Re-authenticate user before deletion
      const credential = EmailAuthProvider.credential(
        this.currentUser.email,
        password
      );
      await reauthenticateWithCredential(this.currentUser, credential);

      // Delete user account
      await deleteUser(this.currentUser);

      this.clearToken();
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Handle Firebase authentication errors
   * @param {Error} error - Firebase auth error
   * @returns {Error} Formatted error
   */
  handleAuthError(error) {
    let message = "An authentication error occurred";

    switch (error.code) {
      case "auth/user-not-found":
        message = "No account found with this email address";
        break;
      case "auth/wrong-password":
        message = "Incorrect password";
        break;
      case "auth/email-already-in-use":
        message = "An account with this email already exists";
        break;
      case "auth/weak-password":
        message = "Password should be at least 6 characters";
        break;
      case "auth/invalid-email":
        message = "Invalid email address";
        break;
      case "auth/user-disabled":
        message = "This account has been disabled";
        break;
      case "auth/too-many-requests":
        message = "Too many failed attempts. Please try again later";
        break;
      case "auth/network-request-failed":
        message = "Network error. Please check your connection";
        break;
      default:
        message = error.message || message;
    }

    return new Error(message);
  }

  /**
   * Get current user
   * @returns {Object|null} Current user or null
   */
  getCurrentUser() {
    return this.currentUser;
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} Authentication status
   */
  isAuthenticated() {
    return !!this.currentUser;
  }
}

// Create singleton instance
const authService = new AuthService();

export { app, auth, db, authService };
export default authService;
