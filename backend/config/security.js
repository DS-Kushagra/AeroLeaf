/**
 * Security Configuration Middleware
 * Implements security best practices for production
 */
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const validator = require("validator");

/**
 * Configure CORS settings
 */
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = process.env.CORS_ORIGIN?.split(",") || [
      "http://localhost:3000",
    ];

    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

/**
 * Rate limiting configuration
 */
const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs:
      windowMs || parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: max || parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    message: message || {
      error: "Too many requests from this IP, please try again later.",
      retryAfter: Math.ceil(windowMs / 1000),
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json(
        message || {
          error: "Too many requests from this IP, please try again later.",
          retryAfter: Math.ceil(windowMs / 1000),
        }
      );
    },
  });
};

/**
 * General rate limiter
 */
const generalLimiter = createRateLimiter();

/**
 * Stricter rate limiter for authentication endpoints
 */
const authLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  5, // 5 requests per window
  {
    error: "Too many authentication attempts, please try again later.",
    retryAfter: 900, // 15 minutes in seconds
  }
);

/**
 * Input validation middleware
 */
const validateInput = {
  /**
   * Sanitize string input
   */
  sanitizeString: (str) => {
    if (typeof str !== "string") return "";
    return validator.escape(str.trim());
  },

  /**
   * Validate email
   */
  validateEmail: (email) => {
    return validator.isEmail(email);
  },

  /**
   * Validate password strength
   */
  validatePassword: (password) => {
    return (
      validator.isLength(password, { min: 8, max: 128 }) &&
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(
        password
      )
    );
  },

  /**
   * Validate request body middleware
   */
  validateBody: (rules) => {
    return (req, res, next) => {
      const errors = [];

      for (const [field, rule] of Object.entries(rules)) {
        const value = req.body[field];

        if (rule.required && (!value || value.toString().trim() === "")) {
          errors.push(`${field} is required`);
          continue;
        }

        if (value) {
          if (rule.type === "email" && !validator.isEmail(value)) {
            errors.push(`${field} must be a valid email`);
          }

          if (rule.type === "string" && typeof value !== "string") {
            errors.push(`${field} must be a string`);
          }

          if (rule.minLength && value.length < rule.minLength) {
            errors.push(
              `${field} must be at least ${rule.minLength} characters`
            );
          }

          if (rule.maxLength && value.length > rule.maxLength) {
            errors.push(
              `${field} must not exceed ${rule.maxLength} characters`
            );
          }

          if (rule.custom && !rule.custom(value)) {
            errors.push(rule.customMessage || `${field} is invalid`);
          }
        }
      }

      if (errors.length > 0) {
        return res.status(400).json({
          error: "Validation failed",
          details: errors,
        });
      }

      // Sanitize inputs
      for (const [field, rule] of Object.entries(rules)) {
        if (req.body[field] && rule.type === "string") {
          req.body[field] = validateInput.sanitizeString(req.body[field]);
        }
      }

      next();
    };
  },
};

/**
 * Security headers configuration
 */
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: [
        "'self'",
        "https://firestore.googleapis.com",
        "https://identitytoolkit.googleapis.com",
      ],
    },
  },
  crossOriginEmbedderPolicy: false,
});

module.exports = {
  corsOptions,
  generalLimiter,
  authLimiter,
  validateInput,
  securityHeaders,
};
