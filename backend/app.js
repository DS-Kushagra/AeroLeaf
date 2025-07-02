/**
 * AeroLeaf Backend Application
 * Production-ready Express.js server with enhanced security and logging
 */
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
require("dotenv").config();

// Import configuration
const {
  corsOptions,
  generalLimiter,
  securityHeaders,
} = require("./config/security");
const logger = require("./config/logger");

// Initialize Express app
const app = express();

// Trust proxy for accurate IP addresses
app.set("trust proxy", 1);

// Security middleware
app.use(securityHeaders);
app.use(cors(corsOptions));

// Rate limiting
app.use(generalLimiter);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// HTTP request logging
app.use(
  morgan("combined", {
    stream: logger.stream,
    skip: (req, res) => {
      // Skip logging for health checks and static assets
      return req.url === "/health" || req.url.startsWith("/static");
    },
  })
);

// Initialize Firebase
const { initializeFirebase } = require("./config/firebase");
try {
  initializeFirebase();
} catch (error) {
  logger.error("Failed to initialize Firebase:", error.message);
  process.exit(1);
}

// Import routes
const apiRoutes = require("./routes/api.routes");
const authRoutes = require("./routes/auth.routes");
const marketplaceRoutes = require("./routes/marketplace");
const buyCreditsRoute = require("./api/buyCredit");
const creditsRoutes = require("./routes/credits.routes");

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version || "1.0.0",
  });
});

// Apply routes
app.use("/api", apiRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/marketplace", marketplaceRoutes);
app.use("/api/credits", creditsRoutes);
app.use("/api/legacy/credits", buyCreditsRoute); // Keep original for backward compatibility

const PORT = process.env.PORT || 5000;

// Load Swagger documentation
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "AeroLeaf API",
      version: "1.0.0",
      description: "Production-ready API for AeroLeaf carbon credit platform",
    },
    servers: [
      {
        url:
          process.env.NODE_ENV === "production"
            ? "https://api.aeroleaf.com"
            : `http://localhost:${PORT}`,
        description:
          process.env.NODE_ENV === "production"
            ? "Production server"
            : "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./routes/*.js", "./api/*.js"],
};

const specs = swaggerJsdoc(options);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.logRequest(req, res, duration);
  });

  next();
});

// Global error handling middleware
app.use((err, req, res, next) => {
  const errorId =
    Date.now().toString(36) + Math.random().toString(36).substr(2);

  logger.error("Server error:", {
    errorId,
    error: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
    userId: req.user?.uid || "anonymous",
  });

  // Don't leak error details in production
  const errorResponse = {
    error: "Internal server error",
    errorId,
    timestamp: new Date().toISOString(),
  };

  if (process.env.NODE_ENV === "development") {
    errorResponse.details = {
      message: err.message,
      stack: err.stack,
    };
  }

  res.status(err.status || 500).json(errorResponse);
});

// 404 handler
app.use("*", (req, res) => {
  logger.warn("404 Not Found", {
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
  });

  res.status(404).json({
    error: "Not Found",
    message: "The requested resource was not found",
    timestamp: new Date().toISOString(),
  });
});

// Graceful shutdown handling
process.on("SIGTERM", () => {
  logger.info("SIGTERM received, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  logger.info("SIGINT received, shutting down gracefully");
  process.exit(0);
});

// Unhandled promise rejection handling
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Promise Rejection:", {
    reason,
    promise,
  });
});

// Uncaught exception handling
process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception:", {
    error: error.message,
    stack: error.stack,
  });
  process.exit(1);
});

// Start server
app.listen(PORT, () => {
  logger.info(`🚀 AeroLeaf backend server running on port ${PORT}`, {
    environment: process.env.NODE_ENV,
    port: PORT,
    timestamp: new Date().toISOString(),
  });

  if (process.env.NODE_ENV === "development") {
    logger.info(`📚 API Documentation: http://localhost:${PORT}/docs`);
    logger.info(`🏥 Health Check: http://localhost:${PORT}/health`);
  }
});

module.exports = app;
app.use((req, res) => {
  res.status(404).json({ message: "API endpoint not found" });
});

// Start server with WebSocket support
try {
  const server = require("http").createServer(app);
  const io = require("socket.io")(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  // Socket.io events
  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });

    // Example of marketplace update event
    socket.on("marketplace:update", (data) => {
      io.emit("marketplaceUpdated", data);
    });

    // Example of bid placement event
    socket.on("bid:place", (data) => {
      io.emit("bidPlaced", data);
    });

    // Example of credit retirement event
    socket.on("credit:retire", (data) => {
      io.emit("creditRetired", data);
    });

    // Example of credit transfer event
    socket.on("credit:transfer", (data) => {
      io.emit("creditTransferred", data);
    });
  });

  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📚 API Documentation: http://localhost:${PORT}/docs`);
    console.log(`🔌 WebSocket server running on port ${PORT}`);
  });
} catch (error) {
  console.error("Failed to start server:", error);
  process.exit(1);
}
