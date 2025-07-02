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

  const deleteAccount = async (password) => {
    try {
      setError(null);
      setLoading(true);
      await authService.deleteAccount(password);
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
    signUp,
    signOut,
    resetPassword,
    getCurrentToken,
    deleteAccount,
    clearError,
    isAuthenticated: !!currentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
