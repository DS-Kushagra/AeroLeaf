import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import WalletConnect from "./WalletConnect";
import GoogleSignInButton from "./GoogleSignInButton";

// Enhanced keyframe animations for premium navbar
const navbarAnimations = `
  @keyframes fadeInScale {
    from { 
      opacity: 0; 
      transform: translateY(-12px) scale(0.95); 
    }
    to { 
      opacity: 1; 
      transform: translateY(0) scale(1); 
    }
  }
  
  @keyframes slideDownBounce {
    0% { 
      opacity: 0;
      transform: translateY(-20px);
      max-height: 0;
    }
    60% {
      transform: translateY(5px);
    }
    100% { 
      opacity: 1;
      transform: translateY(0);
      max-height: 100vh;
    }
  }
  
  @keyframes slideUpSmooth {
    from { 
      opacity: 1;
      transform: translateY(0);
      max-height: 100vh;
    }
    to { 
      opacity: 0;
      transform: translateY(-20px);
      max-height: 0;
    }
  }

  @keyframes shimmer {
    0% { background-position: -200px 0; }
    100% { background-position: calc(200px + 100%) 0; }
  }

  @keyframes glow {
    0%, 100% { box-shadow: 0 0 5px rgba(16, 185, 129, 0.3); }
    50% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.6), 0 0 30px rgba(16, 185, 129, 0.4); }
  }

  .shimmer-effect {
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
    background-size: 200px 100%;
    animation: shimmer 2s infinite;
  }

  /* Smooth body padding transitions */
  body {
    transition: padding-top 0.2s ease-out;
    will-change: padding-top;
  }
`;

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const navigate = useNavigate();
  const userMenuRef = useRef(null);
  const location = useLocation();

  const { currentUser, signOut, loading, signInWithGoogle } = useAuth();

  // Enhanced keyboard navigation
  const handleKeyDown = (e, action) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      action();
    }
    if (e.key === "Escape") {
      setUserMenuOpen(false);
      setMenuOpen(false);
    }
  };

  // Handle scroll events and update UI accordingly
  useEffect(() => {
    // Enhanced scroll handler with smooth transitions
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Update scrolled state
      setScrolled(scrollY > 20);

      // Calculate scroll progress
      const maxScroll = documentHeight - windowHeight;
      const progress = Math.min((scrollY / maxScroll) * 100, 100);
      setScrollProgress(progress);
    };

    // Outside click handler
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    // Set up scroll and click listeners
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("mousedown", handleClickOutside);

    // Initial scroll check
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  // Handle body padding updates separately to prevent flickering
  useEffect(() => {
    const navbarHeight = scrolled ? 70 : 80; // Fixed navbar heights
    
    // Update body padding
    document.body.style.paddingTop = `${navbarHeight}px`;
    
    // Handle resize events
    const handleResize = () => {
      document.body.style.paddingTop = `${navbarHeight}px`;
    };
    
    window.addEventListener("resize", handleResize);
    window.addEventListener("load", handleResize);
    
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("load", handleResize);
      // Reset body padding when component unmounts
      document.body.style.paddingTop = "0px";
    };
  }, [scrolled]);

  // Close menus on route change
  useEffect(() => {
    setMenuOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/");
      setUserMenuOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const isActive = (path) => location.pathname === path;

  // Premium Logo Component with enhanced animations
  const Logo = () => (
    <motion.div
      className="relative flex items-center cursor-pointer"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Enhanced floating particles */}
      <motion.div
        className="absolute -top-2 -left-2 w-3 h-3 bg-emerald-400 rounded-full"
        animate={{
          scale: isHovered ? [1, 1.5, 1] : [1, 1.2, 1],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-2 -right-2 w-2 h-2 bg-blue-400 rounded-full"
        animate={{
          scale: isHovered ? [1, 1.3, 1] : [1, 1.1, 1],
          opacity: [0.4, 0.8, 0.4],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      />
      <motion.div
        className="absolute -bottom-1 left-2 w-1.5 h-1.5 bg-yellow-400 rounded-full"
        animate={{
          scale: isHovered ? [1, 1.4, 1] : [1, 1.15, 1],
          opacity: [0.5, 0.9, 0.5],
        }}
        transition={{
          duration: 1.8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      {/* Premium logo icon with glassmorphism */}
      <motion.div
        className="relative backdrop-blur-md bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 w-11 h-11 rounded-xl flex items-center justify-center shadow-xl border border-white/20"
        style={{
          boxShadow: scrolled
            ? "0 8px 32px rgba(16, 185, 129, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)"
            : "0 12px 40px rgba(16, 185, 129, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.15)",
        }}
        whileHover={{
          rotate: [0, -10, 10, 0],
          boxShadow:
            "0 15px 50px rgba(16, 185, 129, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.2)",
        }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <span className="text-white font-black text-xl tracking-tight">A</span>

        {/* Shimmer effect overlay */}
        <div className="absolute inset-0 rounded-xl shimmer-effect opacity-30" />
      </motion.div>

      {/* Enhanced logo text with gradient animation */}
      <motion.span
        className="ml-3 font-black text-2xl bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 tracking-tight"
        animate={{
          backgroundPosition: isHovered
            ? ["0% 50%", "100% 50%", "0% 50%"]
            : ["0% 50%"],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        style={{
          backgroundSize: "200% 200%",
        }}
      >
        AeroLeaf
      </motion.span>

      {/* Subtle glow effect */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-400/20 to-teal-400/20 blur-xl"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1.1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  );
  // Premium Navigation Link Component
  const NavLink = ({ to, children, icon: Icon, hasNotification = false }) => {
    const active = isActive(to);
    return (
      <Link to={to} className="relative group">
        <motion.div
          className={`
            relative px-4 py-2.5 rounded-xl font-semibold text-sm tracking-wide transition-all duration-300 ease-out
            ${
              active
                ? "text-emerald-600 bg-emerald-50 shadow-lg shadow-emerald-500/25"
                : "text-gray-700 hover:text-emerald-600 hover:bg-emerald-50/50"
            }
          `}
          whileHover={{ y: -2, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center space-x-2">
            {Icon && <Icon className="w-4 h-4" />}
            <span>{children}</span>
            {hasNotification && (
              <motion.div
                className="absolute -top-1 -right-1 w-2.5 h-2.5"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </motion.div>
            )}
          </div>

          {/* Active indicator with enhanced animation */}
          {active && (
            <motion.div
              className="absolute bottom-0 left-1/2 w-8 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
              layoutId="activeIndicator"
              initial={{ opacity: 0, x: "-50%" }}
              animate={{ opacity: 1, x: "-50%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}

          {/* Hover effect background */}
          <motion.div
            className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            initial={false}
          />
        </motion.div>
      </Link>
    );
  };

  return (
    <>
      <style>{navbarAnimations}</style>

      {/* Premium Navbar with enhanced glassmorphism */}
      <motion.nav
        className={`
          fixed left-0 right-0 z-50 transition-all duration-300 ease-out
          ${
            scrolled
              ? "bg-white/90 backdrop-blur-2xl shadow-lg border-b border-gray-200/60 py-2"
              : "bg-white/75 backdrop-blur-xl py-2.5"
          }
        `}
        style={{
          top: 0,
          background: scrolled
            ? "linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)"
            : "linear-gradient(180deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.7) 100%)",
          boxShadow: scrolled
            ? "0 4px 16px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.8)"
            : "0 2px 8px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.6)",
          backdropFilter: "blur(16px) saturate(1.5)",
          WebkitBackdropFilter: "blur(16px) saturate(1.5)",
          height: scrolled ? "70px" : "80px",
        }}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Enhanced scroll progress indicator */}
        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 origin-left"
          style={{
            scaleX: scrollProgress / 100,
            opacity: scrolled ? 1 : 0,
          }}
          transition={{
            scaleX: { type: "spring", stiffness: 100, damping: 15 },
          }}
        />

        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo Section */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex-shrink-0"
            >
              <Link to="/" className="flex items-center">
                <Logo />
              </Link>
            </motion.div>

            {/* Desktop Navigation - Moved closer to logo */}
            <motion.div
              className="hidden lg:flex lg:items-center lg:space-x-2 lg:ml-8"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <NavLink
                to="/"
                icon={() => (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                )}
              >
                Home
              </NavLink>

              <NavLink
                to="/dashboard"
                icon={() => (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                )}
              >
                Dashboard
              </NavLink>

              <NavLink
                to="/marketplace"
                icon={() => (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                )}
              >
                Marketplace
              </NavLink>

              <NavLink
                to="/analytics"
                icon={() => (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                )}
              >
                Analytics
              </NavLink>

              <NavLink
                to="/report"
                icon={() => (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                )}
              >
                Report
              </NavLink>
            </motion.div>

            {/* User Actions */}
            <motion.div
              className="flex items-center space-x-3"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <motion.div
                    className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                </div>
              ) : currentUser ? (
                <>
                  {/* User Menu */}
                  <div className="relative" ref={userMenuRef}>
                    <motion.button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      onKeyDown={(e) =>
                        handleKeyDown(e, () => setUserMenuOpen(!userMenuOpen))
                      }
                      className="flex items-center space-x-2.5 bg-white/60 backdrop-blur-md rounded-xl border border-gray-200/50 px-3 py-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/80"
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      aria-expanded={userMenuOpen}
                      aria-haspopup="true"
                      aria-label="User menu"
                    >
                      <motion.div
                        className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold shadow-lg"
                        whileHover={{ rotate: [0, -5, 5, 0] }}
                        transition={{ duration: 0.5 }}
                      >
                        {(currentUser.displayName || currentUser.email)
                          .charAt(0)
                          .toUpperCase()}
                      </motion.div>

                      <div className="hidden md:block text-left">
                        <div className="text-sm font-semibold text-gray-900">
                          {currentUser.displayName || "User"}
                        </div>
                        <div className="text-xs text-gray-500 truncate max-w-20">
                          {currentUser.email}
                        </div>
                      </div>

                      <motion.svg
                        className="w-4 h-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        animate={{ rotate: userMenuOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </motion.svg>
                    </motion.button>

                    {/* Enhanced User Menu Dropdown */}
                    <AnimatePresence>
                      {userMenuOpen && (
                        <motion.div
                          className="absolute right-0 mt-3 w-72 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden z-50"
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                        >
                          {/* User Info Header */}
                          <div className="px-6 py-4 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-gray-100">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                {(currentUser.displayName || currentUser.email)
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-semibold text-gray-900 truncate">
                                  {currentUser.displayName || "User"}
                                </div>
                                <div className="text-sm text-gray-500 truncate">
                                  {currentUser.email}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Menu Items */}
                          <div className="py-2">
                            <Link
                              to="/profile"
                              className="flex items-center px-6 py-3 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-all duration-200 group"
                              onClick={() => setUserMenuOpen(false)}
                            >
                              <svg
                                className="mr-3 h-5 w-5 text-gray-400 group-hover:text-emerald-500 transition-colors"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                              </svg>
                              My Profile
                            </Link>

                            <Link
                              to="/dashboard"
                              className="flex items-center px-6 py-3 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-all duration-200 group"
                              onClick={() => setUserMenuOpen(false)}
                            >
                              <svg
                                className="mr-3 h-5 w-5 text-gray-400 group-hover:text-emerald-500 transition-colors"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                />
                              </svg>
                              Dashboard
                            </Link>

                            <div className="border-t border-gray-100 my-2" />

                            <motion.button
                              onClick={handleLogout}
                              onKeyDown={(e) => handleKeyDown(e, handleLogout)}
                              className="flex items-center w-full px-6 py-3 text-sm text-red-600 hover:bg-red-50 transition-all duration-200 group"
                              whileHover={{ x: 4 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <svg
                                className="mr-3 h-5 w-5 text-red-400 group-hover:text-red-500 transition-colors"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                />
                              </svg>
                              Sign out
                            </motion.button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Wallet Connect */}
                  <div className="hidden md:block">
                    <WalletConnect />
                  </div>
                </>
              ) : (
                <>
                  {/* Sign In Button */}
                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to="/login"
                      className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white font-semibold px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:from-emerald-700 hover:via-green-700 hover:to-teal-700 backdrop-blur-sm border border-emerald-500/20 text-sm"
                    >
                      Sign in
                    </Link>
                  </motion.div>

                  <div className="hidden md:block">
                    <WalletConnect />
                  </div>
                </>
              )}

              {/* Mobile Menu Button */}
              <motion.button
                onClick={() => setMenuOpen(!menuOpen)}
                onKeyDown={(e) =>
                  handleKeyDown(e, () => setMenuOpen(!menuOpen))
                }
                className="lg:hidden p-2 rounded-xl bg-white/60 backdrop-blur-md border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/80"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-expanded={menuOpen}
                aria-label="Toggle mobile menu"
              >
                <motion.div
                  animate={{ rotate: menuOpen ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {menuOpen ? (
                    <svg
                      className="w-6 h-6 text-gray-700"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-6 h-6 text-gray-700"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  )}
                </motion.div>
              </motion.button>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* Enhanced Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="lg:hidden fixed inset-x-0 z-40"
            style={{
              top: scrolled ? "70px" : "80px", // Fixed navbar heights
              background:
                "linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.95) 100%)",
              backdropFilter: "blur(16px) saturate(1.5)",
              WebkitBackdropFilter: "blur(16px) saturate(1.5)",
              boxShadow:
                "0 4px 16px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.8)",
              borderTop: "1px solid rgba(229, 231, 235, 0.6)",
            }}
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="max-w-7xl mx-auto px-6 py-6">
              {/* Mobile Navigation Links */}
              <div className="space-y-2 mb-6">
                {[
                  {
                    to: "/",
                    label: "Home",
                    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
                  },
                  {
                    to: "/dashboard",
                    label: "Dashboard",
                    icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
                  },
                  {
                    to: "/marketplace",
                    label: "Marketplace",
                    icon: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z",
                  },
                  {
                    to: "/analytics",
                    label: "Analytics",
                    icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
                  },
                  {
                    to: "/report",
                    label: "Report",
                    icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={item.to}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Link
                      to={item.to}
                      className={`
                        flex items-center justify-between px-4 py-4 rounded-2xl font-semibold transition-all duration-300
                        ${
                          isActive(item.to)
                            ? "bg-emerald-50 text-emerald-600 shadow-lg shadow-emerald-500/25"
                            : "text-gray-700 hover:bg-emerald-50/50 hover:text-emerald-600"
                        }
                      `}
                      onClick={() => setMenuOpen(false)}
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`p-2 rounded-xl ${
                            isActive(item.to) ? "bg-emerald-100" : "bg-gray-100"
                          }`}
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d={item.icon}
                            />
                          </svg>
                        </div>
                        <span className="text-base">{item.label}</span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Mobile User Section */}
              <div className="border-t border-gray-200 pt-6">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <motion.div
                      className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  </div>
                ) : currentUser ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 }}
                    className="space-y-4"
                  >
                    {/* User Info */}
                    <div className="flex items-center space-x-4 px-4 py-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {(currentUser.displayName || currentUser.email)
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900 truncate">
                          {currentUser.displayName || "User"}
                        </div>
                        <div className="text-sm text-gray-500 truncate">
                          {currentUser.email}
                        </div>
                      </div>
                    </div>

                    {/* Wallet Connect */}
                    <div className="px-2">
                      <WalletConnect />
                    </div>

                    {/* Sign Out Button */}
                    <motion.button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center space-x-3 px-4 py-4 bg-red-50 text-red-600 rounded-2xl font-semibold hover:bg-red-100 transition-all duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      <span>Sign out</span>
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 }}
                    className="space-y-4"
                  >
                    {/* Sign In Button */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link
                        to="/login"
                        className="flex items-center justify-center space-x-3 w-full px-6 py-4 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                        onClick={() => setMenuOpen(false)}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                          />
                        </svg>
                        <span>Sign in</span>
                      </Link>
                    </motion.div>

                    {/* Wallet Connect */}
                    <div className="px-2">
                      <WalletConnect />
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
