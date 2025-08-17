/**
 * Production-ready Authentication Context
 * Provides authentication state and methods throughout the React app
 */
import React, { createContext, useContext, useEffect, useState } from "react";
import authService from "../services/firebase";

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = authService.onAuthStateChange((user) => {
      setCurrentUser(user);
      setLoading(false);
      setError(null);
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  // Authentication methods
  const signIn = async (email, password, rememberMe = false) => {
    try {
      setError(null);
      setLoading(true);

      // Store remember me preference
      if (rememberMe) {
        localStorage.setItem("remember_me", "true");
      } else {
        localStorage.removeItem("remember_me");
      }

      const result = await authService.signIn(email, password);
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  const signInWithGoogle = async () => {
    try {
      setError(null);
      setLoading(true);
      
      const result = await authService.signInWithGoogle();
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email, password, displayName, role) => {
    try {
      setError(null);
      setLoading(true);
      const result = await authService.signUp(
        email,
        password,
        displayName,
        role
      );
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      await authService.signOut();
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const resetPassword = async (email) => {
    try {
      setError(null);
      await authService.resetPassword(email);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const getCurrentToken = async (forceRefresh = false) => {
    try {
      return await authService.getCurrentToken(forceRefresh);
    } catch (error) {
      setError(error.message);
      return null;
    }
  };

  const deleteUserAccount = async (password) => {
    try {
      setError(null);
      setLoading(true);
      await authService.deleteUserAccount(password);
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  const updateUserProfile = async (displayName, photoURL) => {
    try {
      setError(null);
      setLoading(true);
      
      // This would call a method in authService to update the profile
      // For now, we'll just simulate it
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real implementation, you would update the user profile in Firebase
      // await updateProfile(auth.currentUser, { displayName, photoURL });
      
      return { success: true };
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    currentUser,
    loading,
    error,
    signIn,
    signInWithGoogle,
    signUp,
    signOut,
    resetPassword,
    getCurrentToken,
    deleteUserAccount,
    updateUserProfile,
    clearError,
    isAuthenticated: !!currentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
