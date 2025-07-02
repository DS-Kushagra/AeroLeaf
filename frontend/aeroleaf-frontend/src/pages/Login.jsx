import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("investor");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();
  const { signIn, signUp, resetPassword, clearError, currentUser } = useAuth();

  // Animation and transition effect
  const [animate, setAnimate] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (currentUser) {
      navigate("/dashboard");
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    setAnimate(true);

    // Add page entrance animation
    document.querySelector(".login-container")?.classList.add("fade-in");

    return () => setAnimate(false);
  }, [isLogin]);

  const toggleForm = () => {
    setAnimate(false);
    setError("");
    setSuccess("");
    clearError();

    setTimeout(() => {
      setIsLogin(!isLogin);
      setAnimate(true);
    }, 300);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    clearError();

    try {
      // Client-side validation
      if (!email || !password) {
        setError("All fields are required");
        setLoading(false);
        return;
      }

      if (!isLogin && !name) {
        setError("Name is required for signup");
        setLoading(false);
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError("Please enter a valid email address");
        setLoading(false);
        return;
      }

      // Password validation for signup
      if (!isLogin) {
        if (password.length < 8) {
          setError("Password must be at least 8 characters long");
          setLoading(false);
          return;
        }

        const passwordRegex =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
        if (!passwordRegex.test(password)) {
          setError(
            "Password must contain uppercase, lowercase, number and special character"
          );
          setLoading(false);
          return;
        }
      }

      if (isLogin) {
        // Handle login with Firebase
        const result = await signIn(email, password, rememberMe);
        setSuccess("Login successful! Redirecting to dashboard...");

        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else {
        // Handle signup with Firebase
        await signUp(email, password, name, role);
        setSuccess(
          "Account created successfully! Please check your email for verification."
        );

        setTimeout(() => {
          setIsLogin(true);
          setEmail("");
          setPassword("");
          setName("");
        }, 2000);
      }
    } catch (error) {
      console.error("Authentication error:", error);
      setError(error.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email address first");
      return;
    }

    try {
      setError("");
      setLoading(true);
      await resetPassword(email);
      setSuccess("Password reset email sent! Check your inbox.");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="login-container min-h-screen flex flex-col lg:flex-row">
      {/* Left panel with image and information */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-700 via-green-600 to-teal-500 text-white p-12 flex-col justify-between relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="leaf-1 absolute top-10 left-10 w-32 h-32 opacity-10 rotate-12" />
          <div className="leaf-2 absolute bottom-40 right-10 w-40 h-40 opacity-10 -rotate-12" />
          <div className="circle-1 absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-white opacity-5" />
          <div className="circle-2 absolute bottom-1/4 right-1/3 w-80 h-80 rounded-full bg-white opacity-5" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-12">
            <div className="w-12 h-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center shadow-glow">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
            </div>
            <span className="text-2xl font-bold tracking-tight">AeroLeaf</span>
          </div>

          <div className="space-y-8 mt-16 fade-in">
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
              {isLogin ? "Welcome Back" : "Join Our Community"}
            </h1>
            <p className="text-xl opacity-90 max-w-md">
              {isLogin
                ? "Access your dashboard to monitor carbon credit projects and their impact."
                : "Create an account to start investing in verified carbon credits with real impact."}
            </p>

            <div className="space-y-5 mt-12">
              <div className="flex items-start transform transition-all duration-300 hover:translate-x-2">
                <div className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex-shrink-0 flex items-center justify-center mr-4 shadow-glow">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="text-lg">
                  Satellite verified reforestation projects
                </p>
              </div>
              <div className="flex items-start transform transition-all duration-300 hover:translate-x-2">
                <div className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex-shrink-0 flex items-center justify-center mr-4 shadow-glow">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="text-lg">Blockchain-backed carbon credits</p>
              </div>
              <div className="flex items-start transform transition-all duration-300 hover:translate-x-2">
                <div className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex-shrink-0 flex items-center justify-center mr-4 shadow-glow">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="text-lg">Real-time transparency and reporting</p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-sm opacity-80 relative z-10">
          &copy; {new Date().getFullYear()} AeroLeaf. All rights reserved.
        </p>
      </div>

      {/* Right panel with form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div>
            <div className="flex justify-center lg:hidden mb-8">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-teal-400 flex items-center justify-center shadow-lg pulse-animation">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                    />
                  </svg>
                </div>
                <span className="text-2xl font-bold text-green-600 tracking-tight">
                  AeroLeaf
                </span>
              </div>
            </div>

            <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-2">
              {isLogin ? "Sign in to your account" : "Create a new account"}
            </h2>
            <p className="text-center text-sm text-gray-600">
              {isLogin ? "New to AeroLeaf?" : "Already have an account?"}{" "}
              <button
                type="button"
                className="font-medium text-green-600 hover:text-green-500 cursor-pointer hover:underline transition-colors"
                onClick={toggleForm}
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>

          {error && (
            <div
              className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md flex items-center fade-in"
              role="alert"
            >
              <svg
                className="h-5 w-5 mr-2 flex-shrink-0 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div
              className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-md flex items-center fade-in"
              role="alert"
            >
              <svg
                className="h-5 w-5 mr-2 flex-shrink-0 text-green-500 checkmark"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p>{success}</p>
            </div>
          )}

          <form
            className={`mt-8 space-y-6 transition-all duration-300 transform ${
              animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            onSubmit={handleSubmit}
          >
            <div className="space-y-4">
              {!isLogin && (
                <div className="form-field">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Full Name
                  </label>
                  <div className="mt-1 relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
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
                    </span>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-400 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 transition-all sm:text-sm"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
              )}

              <div className="form-field">
                <label
                  htmlFor="email-address"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <div className="mt-1 relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                  </span>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-400 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 transition-all sm:text-sm"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="form-field">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="mt-1 relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </span>
                  <input
                    id="password"
                    name="password"
                    type={passwordVisible ? "text" : "password"}
                    autoComplete={isLogin ? "current-password" : "new-password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full pl-10 pr-10 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 transition-all sm:text-sm"
                    placeholder={
                      isLogin ? "Your password" : "Create a password"
                    }
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {passwordVisible ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                {!isLogin && (
                  <p className="mt-1 text-xs text-gray-500">
                    Password should be at least 8 characters long
                  </p>
                )}
              </div>

              {!isLogin && (
                <div className="form-field">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Type
                  </label>
                  <div className="mt-1 grid grid-cols-3 gap-3">
                    <div
                      className={`flex items-center justify-center rounded-md border ${
                        role === "investor"
                          ? "border-green-500 bg-green-50 text-green-700 ring-2 ring-green-200"
                          : "border-gray-300 text-gray-700"
                      } px-3 py-2 text-sm font-medium cursor-pointer hover:bg-gray-50 transition-all`}
                      onClick={() => setRole("investor")}
                    >
                      <span className="flex items-center">
                        {role === "investor" && (
                          <svg
                            className="w-4 h-4 mr-1 text-green-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                        Investor
                      </span>
                    </div>
                    <div
                      className={`flex items-center justify-center rounded-md border ${
                        role === "landowner"
                          ? "border-green-500 bg-green-50 text-green-700 ring-2 ring-green-200"
                          : "border-gray-300 text-gray-700"
                      } px-3 py-2 text-sm font-medium cursor-pointer hover:bg-gray-50 transition-all`}
                      onClick={() => setRole("landowner")}
                    >
                      <span className="flex items-center">
                        {role === "landowner" && (
                          <svg
                            className="w-4 h-4 mr-1 text-green-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                        Landowner
                      </span>
                    </div>
                    <div
                      className={`flex items-center justify-center rounded-md border ${
                        role === "verifier"
                          ? "border-green-500 bg-green-50 text-green-700 ring-2 ring-green-200"
                          : "border-gray-300 text-gray-700"
                      } px-3 py-2 text-sm font-medium cursor-pointer hover:bg-gray-50 transition-all`}
                      onClick={() => setRole("verifier")}
                    >
                      <span className="flex items-center">
                        {role === "verifier" && (
                          <svg
                            className="w-4 h-4 mr-1 text-green-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                        Verifier
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>{" "}
            {isLogin && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded transition-colors"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    disabled={loading}
                    className="font-medium text-green-600 hover:text-green-500 hover:underline transition-colors disabled:opacity-50"
                  >
                    Forgot your password?
                  </button>
                </div>
              </div>
            )}{" "}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transform transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
              >
                {loading ? (
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : null}
                {isLogin ? "Sign in" : "Create account"}
              </button>
            </div>
            <div className="text-center text-sm mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-gray-600 font-medium mb-1">
                For demo purposes, you can:
              </p>
              <div className="flex flex-col sm:flex-row sm:justify-center sm:space-x-6 text-gray-500">
                <p>• Create a new account with any email</p>
                <p>• Use real Firebase authentication</p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
