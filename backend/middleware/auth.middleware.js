/**
 * Production-ready Authentication Middleware
 * Handles Firebase token verification with enhanced security and logging
 */
const { getAuth } = require("../config/firebase");
const logger = require("../config/logger");
const jwt = require("jsonwebtoken");

/**
 * Extract token from request headers
 * @param {Object} req - Express request object
 * @returns {string|null} - Extracted token or null
 */
function extractToken(req) {
  const authHeader = req.headers.authorization;

  if (!authHeader) return null;

  // Support both "Bearer token" and "token" formats
  if (authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }

  return authHeader;
}

/**
 * Validate token format and basic structure
 * @param {string} token - Token to validate
 * @returns {boolean} - True if token format is valid
 */
function isValidTokenFormat(token) {
  if (!token || typeof token !== "string") return false;
  if (token.length < 10) return false; // Minimum reasonable token length
  return true;
}

/**
 * Main authentication middleware
 */
async function authMiddleware(req, res, next) {
  const startTime = Date.now();
  const clientIp =
    req.ip || req.connection.remoteAddress || req.headers["x-forwarded-for"];
  const userAgent = req.get("User-Agent") || "Unknown";

  try {
    // Extract token
    const token = extractToken(req);

    if (!token) {
      logger.logSecurity("AUTH_NO_TOKEN", clientIp, userAgent, {
        url: req.originalUrl,
        method: req.method,
      });

      return res.status(401).json({
        error: "Authentication required",
        code: "NO_TOKEN",
        message: "Authorization token is missing",
      });
    }

    // Validate token format
    if (!isValidTokenFormat(token)) {
      logger.logSecurity("AUTH_INVALID_TOKEN_FORMAT", clientIp, userAgent, {
        tokenLength: token.length,
        url: req.originalUrl,
      });

      return res.status(401).json({
        error: "Invalid token format",
        code: "INVALID_TOKEN_FORMAT",
        message: "Authorization token format is invalid",
      });
    }

    // Verify Firebase ID token
    const auth = getAuth();
    const decoded = await auth.verifyIdToken(token, true); // checkRevoked = true

    // Additional security checks
    if (!decoded.uid) {
      throw new Error("Token missing required claims");
    }

    // Check if token is too old (optional additional security)
    const tokenAge = Date.now() / 1000 - decoded.iat;
    const maxTokenAge = 24 * 60 * 60; // 24 hours

    if (tokenAge > maxTokenAge) {
      logger.logSecurity("AUTH_TOKEN_TOO_OLD", clientIp, userAgent, {
        userId: decoded.uid,
        tokenAge,
        maxTokenAge,
      });

      return res.status(401).json({
        error: "Token expired",
        code: "TOKEN_TOO_OLD",
        message: "Token is too old, please re-authenticate",
      });
    }

    // Get additional user info from Firestore if needed
    try {
      const { getFirestore } = require("../config/firebase");
      const db = getFirestore();
      const userDoc = await db.collection("users").doc(decoded.uid).get();

      if (userDoc.exists) {
        const userData = userDoc.data();
        decoded.role = userData.role;
        decoded.profile = userData;
      }
    } catch (firestoreError) {
      // Log but don't fail authentication if Firestore lookup fails
      logger.warn("Failed to fetch user profile from Firestore", {
        userId: decoded.uid,
        error: firestoreError.message,
      });
    }

    // Attach user to request
    req.user = decoded;
    req.authTime = Date.now() - startTime;

    // Log successful authentication
    logger.logAuth("AUTH_SUCCESS", decoded.uid, clientIp, userAgent, {
      email: decoded.email,
      authTime: req.authTime,
      url: req.originalUrl,
      method: req.method,
    });

    next();
  } catch (error) {
    const authTime = Date.now() - startTime;

    // Determine error type and log appropriately
    let errorCode = "AUTH_FAILED";
    let statusCode = 401;
    let message = "Authentication failed";

    if (error.code === "auth/id-token-expired") {
      errorCode = "TOKEN_EXPIRED";
      message = "Token has expired, please re-authenticate";
    } else if (error.code === "auth/id-token-revoked") {
      errorCode = "TOKEN_REVOKED";
      message = "Token has been revoked, please re-authenticate";
    } else if (error.code === "auth/invalid-id-token") {
      errorCode = "INVALID_TOKEN";
    } else if (error.code === "auth/user-disabled") {
      errorCode = "USER_DISABLED";
      message = "User account has been disabled";
      statusCode = 403;
    }

    logger.logSecurity(errorCode, clientIp, userAgent, {
      error: error.message,
      errorCode: error.code,
      authTime,
      url: req.originalUrl,
      method: req.method,
    });

    return res.status(statusCode).json({
      error: message,
      code: errorCode,
      ...(process.env.NODE_ENV === "development" && {
        debug: {
          originalError: error.message,
          errorCode: error.code,
        },
      }),
    });
  }
}

/**
 * Optional authentication middleware (doesn't fail if no token)
 */
async function optionalAuthMiddleware(req, res, next) {
  const token = extractToken(req);

  if (!token) {
    req.user = null;
    return next();
  }

  // If token exists, validate it
  return authMiddleware(req, res, next);
}

/**
 * Role-based authorization middleware
 * @param {string|string[]} allowedRoles - Role(s) that are allowed
 */
function requireRole(allowedRoles) {
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: "Authentication required",
        code: "NO_AUTH",
      });
    }

    const userRole = req.user.role;

    if (!userRole || !roles.includes(userRole)) {
      logger.logSecurity("ROLE_UNAUTHORIZED", req.ip, req.get("User-Agent"), {
        userId: req.user.uid,
        userRole,
        requiredRoles: roles,
        url: req.originalUrl,
      });

      return res.status(403).json({
        error: "Insufficient permissions",
        code: "ROLE_UNAUTHORIZED",
        message: `Required role: ${roles.join(" or ")}`,
      });
    }

    next();
  };
}

module.exports = {
  authMiddleware,
  optionalAuthMiddleware,
  requireRole,
  extractToken,
};
