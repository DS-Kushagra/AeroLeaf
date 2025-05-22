const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Import routes
const apiRoutes = require("./routes/api.routes");
const marketplaceRoutes = require("./routes/marketplace");
const buyCreditsRoute = require("./api/buyCredit");
const creditsRoutes = require("./routes/credits.routes");

// Apply routes
app.use("/api", apiRoutes);
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
    },
  },
  apis: ["./routes/*.js", "./api/*.js"],
};

const specs = swaggerJsdoc(options);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({
    message: "Internal server error",
    error: process.env.NODE_ENV === "production" ? {} : err.message,
  });
});

// 404 handler
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

// This part has been moved up earlier in the file
