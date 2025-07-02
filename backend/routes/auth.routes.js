/**
 * Authentication Routes
 * Production-ready authentication endpoints
 */
const express = require("express");
const {
  authMiddleware,
  requireRole,
} = require("../middleware/auth.middleware");
const { validateInput } = require("../config/security");
const firebaseService = require("../firebase");
const logger = require("../config/logger");

const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - displayName
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 8
 *               displayName:
 *                 type: string
 *                 minLength: 2
 *               role:
 *                 type: string
 *                 enum: [investor, landowner, verifier]
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 *       409:
 *         description: User already exists
 */
router.post(
  "/register",
  validateInput.validateBody({
    email: {
      required: true,
      type: "email",
    },
    password: {
      required: true,
      type: "string",
      minLength: 8,
      custom: validateInput.validatePassword,
      customMessage:
        "Password must contain at least 8 characters with uppercase, lowercase, number and special character",
    },
    displayName: {
      required: true,
      type: "string",
      minLength: 2,
      maxLength: 50,
    },
    role: {
      required: true,
      type: "string",
      custom: (value) => ["investor", "landowner", "verifier"].includes(value),
      customMessage: "Role must be one of: investor, landowner, verifier",
    },
  }),
  async (req, res) => {
    const clientIp = req.ip || req.connection.remoteAddress;
    const userAgent = req.get("User-Agent") || "Unknown";

    try {
      const { email, password, displayName, role } = req.body;

      // Create Firebase user and profile
      const userRecord = await firebaseService.createFirebaseUser({
        email,
        password,
        displayName,
        role,
      });

      logger.logAuth("USER_REGISTERED", userRecord.uid, clientIp, userAgent, {
        email,
        role,
        method: "email_password",
      });

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        user: {
          uid: userRecord.uid,
          email: userRecord.email,
          displayName: userRecord.displayName,
          role,
        },
      });
    } catch (error) {
      logger.error("Registration failed", {
        email: req.body.email,
        error: error.message,
        ip: clientIp,
      });

      // Handle Firebase specific errors
      if (error.code === "auth/email-already-exists") {
        return res.status(409).json({
          error: "User already exists",
          code: "EMAIL_EXISTS",
          message: "An account with this email already exists",
        });
      }

      res.status(500).json({
        error: "Registration failed",
        code: "REGISTRATION_ERROR",
        message:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Internal server error",
      });
    }
  }
);

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Get current user profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const userProfile = await firebaseService.getUserProfile(req.user.uid);

    if (!userProfile) {
      return res.status(404).json({
        error: "Profile not found",
        code: "PROFILE_NOT_FOUND",
      });
    }

    res.json({
      success: true,
      profile: {
        uid: req.user.uid,
        email: req.user.email,
        ...userProfile,
      },
    });
  } catch (error) {
    logger.error("Profile fetch failed", {
      userId: req.user.uid,
      error: error.message,
    });

    res.status(500).json({
      error: "Failed to fetch profile",
      code: "PROFILE_FETCH_ERROR",
    });
  }
});

/**
 * @swagger
 * /auth/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               displayName:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Unauthorized
 */
router.put(
  "/profile",
  authMiddleware,
  validateInput.validateBody({
    displayName: {
      type: "string",
      minLength: 2,
      maxLength: 50,
    },
    phone: {
      type: "string",
      maxLength: 20,
    },
  }),
  async (req, res) => {
    try {
      const updateData = {};

      // Only include allowed fields
      if (req.body.displayName) updateData.displayName = req.body.displayName;
      if (req.body.phone) updateData.phone = req.body.phone;

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({
          error: "No valid fields to update",
          code: "NO_UPDATE_DATA",
        });
      }

      await firebaseService.updateUserProfile(req.user.uid, updateData);

      logger.logAuth(
        "PROFILE_UPDATED",
        req.user.uid,
        req.ip,
        req.get("User-Agent"),
        {
          updatedFields: Object.keys(updateData),
        }
      );

      res.json({
        success: true,
        message: "Profile updated successfully",
      });
    } catch (error) {
      logger.error("Profile update failed", {
        userId: req.user.uid,
        error: error.message,
      });

      res.status(500).json({
        error: "Failed to update profile",
        code: "PROFILE_UPDATE_ERROR",
      });
    }
  }
);

/**
 * @swagger
 * /auth/credits:
 *   get:
 *     summary: Get user's carbon credits
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Credits retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/credits", authMiddleware, async (req, res) => {
  try {
    const credits = await firebaseService.getUserCredits(req.user.uid);

    res.json({
      success: true,
      credits,
      count: credits.length,
    });
  } catch (error) {
    logger.error("Credits fetch failed", {
      userId: req.user.uid,
      error: error.message,
    });

    res.status(500).json({
      error: "Failed to fetch credits",
      code: "CREDITS_FETCH_ERROR",
    });
  }
});

/**
 * @swagger
 * /auth/admin/users:
 *   get:
 *     summary: Get all users (admin only)
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (admin only)
 */
router.get(
  "/admin/users",
  authMiddleware,
  requireRole("admin"),
  async (req, res) => {
    // This would be implemented based on your admin requirements
    res.status(501).json({
      error: "Not implemented",
      message: "Admin user management not yet implemented",
    });
  }
);

/**
 * @swagger
 * /auth/admin/users/{uid}/disable:
 *   post:
 *     summary: Disable a user account (admin only)
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User disabled successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (admin only)
 */
router.post(
  "/admin/users/:uid/disable",
  authMiddleware,
  requireRole("admin"),
  async (req, res) => {
    try {
      const { uid } = req.params;

      await firebaseService.disableUser(uid);

      logger.logAuth("USER_DISABLED", uid, req.ip, req.get("User-Agent"), {
        adminUid: req.user.uid,
      });

      res.json({
        success: true,
        message: "User disabled successfully",
      });
    } catch (error) {
      logger.error("User disable failed", {
        targetUid: req.params.uid,
        adminUid: req.user.uid,
        error: error.message,
      });

      res.status(500).json({
        error: "Failed to disable user",
        code: "USER_DISABLE_ERROR",
      });
    }
  }
);

/**
 * @swagger
 * /auth/delete-account:
 *   delete:
 *     summary: Delete user account
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account deleted successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to delete account
 */
router.delete("/delete-account", authMiddleware, async (req, res) => {
  const clientIp = req.ip || req.connection.remoteAddress;
  const userAgent = req.get("User-Agent") || "Unknown";

  try {
    const uid = req.user.uid;

    logger.logSecurity("ACCOUNT_DELETION_REQUEST", clientIp, userAgent, {
      userId: uid,
      email: req.user.email,
    });

    // In a production environment, you might want to:
    // 1. Mark the account as deleted instead of actually deleting it
    // 2. Archive user data for compliance/audit purposes
    // 3. Send confirmation emails
    // 4. Clean up related resources

    // For now, we'll disable the account instead of deleting it
    // This preserves data integrity while making the account inaccessible
    await firebaseService.disableUser(uid);

    logger.logAuth("ACCOUNT_DELETED", uid, clientIp, userAgent, {
      method: "user_request",
    });

    res.json({
      message: "Account has been successfully disabled",
      code: "ACCOUNT_DISABLED",
    });
  } catch (error) {
    logger.error("Account deletion failed", {
      userId: req.user.uid,
      error: error.message,
    });

    res.status(500).json({
      error: "Failed to delete account",
      code: "ACCOUNT_DELETE_ERROR",
    });
  }
});

module.exports = router;
