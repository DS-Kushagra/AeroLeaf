import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import WalletConnect from "./WalletConnect";

// Add keyframe animations for navbar elements
const navbarAnimations = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes slideDown {
    from { max-height: 0; opacity: 0; }
    to { max-height: 100vh; opacity: 1; }
  }
  
  @keyframes slideUp {
    from { max-height: 100vh; opacity: 1; }
    to { max-height: 0; opacity: 0; }
  }
`;


export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // Demo notification state - in a real app, this would come from a notification system
  const [hasNotifications, setHasNotifications] = useState(true);
  const navigate = useNavigate();
  const userMenuRef = useRef(null);
  const location = useLocation();
  
  // For accessibility - handle keyboard navigation
  const handleKeyDown = (e, action) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  // Use AuthContext instead of localStorage
  const { currentUser, signOut, loading } = useAuth();

  useEffect(() => {
    // Close dropdown when clicking outside
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    
    // Add scroll listener for navbar appearance change
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close mobile menu when changing routes
  useEffect(() => {
    setMenuOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  // Check if a link is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Logo with floating particles effect
  const Logo = () => {
    return (
      <div className="relative flex items-center">
        {/* Animated circles around logo */}
        <div className="absolute -top-1 -left-1 w-2 h-2 bg-green-400 rounded-full animate-ping opacity-75"></div>
        <div className="absolute top-1 -right-1 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse opacity-60"></div>
        <div className="absolute -bottom-1 left-1 w-1 h-1 bg-blue-400 rounded-full animate-pulse opacity-60"></div>

        {/* Logo icon */}
        <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 w-9 h-9 rounded-lg flex items-center justify-center shadow-lg transform transition hover:rotate-12 hover:scale-110">
          <span className="text-white font-bold text-xl">A</span>
        </div>

        {/* Logo text */}
        <span className="ml-2 font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-emerald-600">
          AeroLeaf
        </span>
      </div>
    );
  };
  // Calculate scroll progress safely
  const [scrollProgress, setScrollProgress] = useState(0);
  
  // Update scroll progress in the scroll handler
  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollPx = document.documentElement.scrollTop;
      const winHeightPx = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = scrollPx / winHeightPx;
      setScrollProgress(scrolled * 100);
    };
    
    window.addEventListener('scroll', updateScrollProgress);
    return () => window.removeEventListener('scroll', updateScrollProgress);
  }, []);
  
  return (
    <>
      <style>{navbarAnimations}</style>
      <nav 
        className={`${scrolled ? 'bg-white shadow-lg' : 'bg-white/90'} backdrop-blur-md sticky top-0 z-50 transition-all duration-300 border-b border-green-100/80`}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Subtle scroll progress indicator */}
        <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-green-500 to-teal-500" 
          style={{ 
            width: `${Math.min(scrollProgress, 100)}%`, 
            opacity: scrolled ? 1 : 0, 
            transition: 'width 0.3s, opacity 0.3s' 
          }}
        ></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-18">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <Logo />
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link
              to="/"
              className={`px-3 py-2 text-sm font-medium transition-all hover:text-green-600 border-b-2 tracking-wide ${
                isActive("/")
                  ? "border-green-500 text-green-600 font-semibold"
                  : "border-transparent text-gray-700"
              }`}
            >
              Home
            </Link>
            <Link
              to="/dashboard"
              className={`px-3 py-2 text-sm font-medium transition-all hover:text-green-600 border-b-2 ${
                isActive("/dashboard")
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-gray-700"
              }`}
            >
              Dashboard
            </Link>
            <div className="relative">
                <Link
                  to="/marketplace"
                  className={`px-3 py-2 text-sm font-medium transition-all hover:text-green-600 border-b-2 tracking-wide ${
                    isActive("/marketplace")
                      ? "border-green-500 text-green-600 font-semibold"
                      : "border-transparent text-gray-700"
                  }`}
                >
                  Marketplace
                  {hasNotifications && (
                    <span className="absolute -top-1 -right-1 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                  )}
                </Link>
              </div>
            <Link
              to="/analytics"
              className={`px-3 py-2 text-sm font-medium transition-all hover:text-green-600 border-b-2 ${
                isActive("/analytics")
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-gray-700"
              }`}
            >
              Analytics
            </Link>
            <Link
              to="/report"
              className={`px-3 py-2 text-sm font-medium transition-all hover:text-green-600 border-b-2 ${
                isActive("/report")
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-gray-700"
              }`}
            >
              Report
            </Link>

            {loading ? (
              // Show loading spinner while auth state is being determined
              <div className="flex items-center space-x-2 ml-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
              </div>
            ) : currentUser ? (
              <>
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    onKeyDown={(e) => handleKeyDown(e, () => setUserMenuOpen(!userMenuOpen))}
                    className="flex items-center space-x-2 bg-white/90 rounded-full text-gray-700 hover:text-green-600 px-3 py-2 text-sm font-medium ml-4 border border-gray-100 shadow-sm hover:shadow transition-all duration-200"
                    aria-expanded={userMenuOpen}
                    aria-haspopup="true"
                    aria-label="User menu"
                    tabIndex="0"
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-green-100 to-emerald-200 text-green-800 font-semibold shadow-inner">
                      {(currentUser.displayName || currentUser.email)
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                    <span className="hidden sm:inline">
                      {currentUser.displayName || "User"}
                    </span>
                    <svg
                      className={`h-5 w-5 transition-transform duration-200 ${
                        userMenuOpen ? "transform rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {userMenuOpen && (
                    <div 
                      className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl py-1 ring-1 ring-black ring-opacity-5 focus:outline-none z-50 transform origin-top-right transition-all duration-200 ease-in-out border border-gray-100"
                      style={{
                        animation: 'fadeIn 0.2s ease-out forwards',
                      }}
                    >
                      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                        <p className="text-sm text-gray-500 font-medium">Signed in as</p>
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {currentUser.email}
                        </p>
                      </div>
                      <Link
                        to="/dashboard"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <svg
                          className="mr-3 h-5 w-5 text-gray-400"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                          />
                        </svg>
                        Dashboard
                      </Link>
                      <button
                          onClick={handleLogout}
                          onKeyDown={(e) => handleKeyDown(e, handleLogout)}
                          className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600 transition-colors duration-150"
                          tabIndex="0"
                        >
                        <svg
                          className="mr-3 h-5 w-5 text-gray-400"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        Sign out{" "}
                      </button>
                    </div>
                  )}
                </div>
                <div className="ml-4">
                  <WalletConnect />
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="bg-gradient-to-r from-green-600 to-teal-500 text-white hover:opacity-90 px-5 py-2.5 rounded-md text-sm font-medium transition shadow-md hover:shadow-lg transform hover:translate-y-[-1px]"
                >
                  Sign in
                </Link>
                <div className="ml-3">
                  <WalletConnect />
                </div>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            {currentUser && (
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-800 font-semibold mr-2">
                {(currentUser.displayName || currentUser.email)
                  .charAt(0)
                  .toUpperCase()}
              </div>
            )}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              onKeyDown={(e) => handleKeyDown(e, () => setMenuOpen(!menuOpen))}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-green-600 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-green-600 transition-colors duration-200"
              aria-expanded={menuOpen}
              aria-label="Toggle mobile menu"
              tabIndex="0"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${menuOpen ? "hidden" : "block"} h-6 w-6`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className={`${menuOpen ? "block" : "hidden"} h-6 w-6`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>{" "}
      {/* Mobile menu - animated slide-down */}
      <div
        className={`${
          menuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        } md:hidden overflow-hidden transition-all duration-300 ease-in-out`}
        aria-hidden={!menuOpen}
        style={{
          animation: menuOpen ? 'slideDown 0.3s ease-out forwards' : 'slideUp 0.3s ease-out forwards',
        }}
      >
        <div className="px-3 pt-2 pb-3 space-y-1 border-t border-gray-200 bg-white/95 shadow-inner rounded-b-lg">
          <Link
            to="/"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive("/")
                ? "bg-green-50 text-green-600"
                : "text-gray-700 hover:text-green-600 hover:bg-gray-50"
            }`}
            onClick={() => setMenuOpen(false)}
          >
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Home
            </div>
          </Link>
          <Link
            to="/dashboard"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive("/dashboard")
                ? "bg-green-50 text-green-600"
                : "text-gray-700 hover:text-green-600 hover:bg-gray-50"
            }`}
            onClick={() => setMenuOpen(false)}
          >
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
                />
              </svg>
              Dashboard
            </div>
          </Link>
          <Link
            to="/marketplace"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive("/marketplace")
                ? "bg-green-50 text-green-600"
                : "text-gray-700 hover:text-green-600 hover:bg-gray-50"
            }`}
            onClick={() => setMenuOpen(false)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                Marketplace
              </div>
              {hasNotifications && (
                <span className="flex h-2 w-2 ml-2">
                  <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
              )}
            </div>
          </Link>
          <Link
            to="/analytics"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive("/analytics")
                ? "bg-green-50 text-green-600"
                : "text-gray-700 hover:text-green-600 hover:bg-gray-50"
            }`}
            onClick={() => setMenuOpen(false)}
          >
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              Analytics
            </div>
          </Link>
          <Link
            to="/report"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive("/report")
                ? "bg-green-50 text-green-600"
                : "text-gray-700 hover:text-green-600 hover:bg-gray-50"
            }`}
            onClick={() => setMenuOpen(false)}
          >
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Report
            </div>
          </Link>

          <div className="pt-2 border-t border-gray-200">
            {loading ? (
              // Show loading in mobile menu
              <div className="flex items-center justify-center px-3 py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
              </div>
            ) : currentUser ? (
              <>
                <div className="flex items-center px-3 py-2 text-sm text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span className="text-gray-900 font-medium">
                    {currentUser.displayName || "User"}
                  </span>
                </div>
                <WalletConnect />
                <button
                    onClick={handleLogout}
                    onKeyDown={(e) => handleKeyDown(e, handleLogout)}
                    className="w-full flex items-center px-3 py-2 mt-1 rounded-md text-base font-medium text-red-600 hover:bg-red-50 transition-colors duration-150"
                    tabIndex="0"
                  >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center justify-center w-full px-3 py-2.5 rounded-md text-base font-medium bg-gradient-to-r from-green-600 to-teal-500 text-white hover:opacity-90 shadow-md hover:shadow-lg transition-all duration-200 transform hover:translate-y-[-1px]"
                  onClick={() => setMenuOpen(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                  Sign in
                </Link>
                <div className="mt-3">
                  <WalletConnect />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
    </>
  );
}
