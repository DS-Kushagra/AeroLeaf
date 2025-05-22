/**
 * AeroLeaf - Main application launcher
 * This script helps coordinate the launching of all services
 */

const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

console.log("🌱 Starting AeroLeaf platform...");

// Create directory for logs
const logsDir = path.join(__dirname, "logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Start backend server
const backend = spawn("node", ["app.js"], {
  cwd: path.join(__dirname, "backend"),
  stdio: [
    "ignore",
    fs.openSync(path.join(logsDir, "backend.log"), "a"),
    fs.openSync(path.join(logsDir, "backend-error.log"), "a"),
  ],
});

console.log("✅ Backend server started on port 5000");

// Start frontend dev server
const frontend = spawn("npm", ["run", "dev"], {
  cwd: path.join(__dirname, "frontend", "aeroleaf-frontend"),
  stdio: [
    "ignore",
    fs.openSync(path.join(logsDir, "frontend.log"), "a"),
    fs.openSync(path.join(logsDir, "frontend-error.log"), "a"),
  ],
});

console.log("✅ Frontend development server started");

// Handle shutdown gracefully
process.on("SIGINT", () => {
  console.log("🛑 Shutting down AeroLeaf services...");
  backend.kill();
  frontend.kill();
  process.exit(0);
});

// Also handle Windows-specific signals
process.on("SIGTERM", () => {
  console.log("🛑 Shutting down AeroLeaf services...");
  backend.kill();
  frontend.kill();
  process.exit(0);
});

// Log when processes exit
backend.on("close", (code) => {
  console.log(`Backend server exited with code ${code}`);
});

frontend.on("close", (code) => {
  console.log(`Frontend server exited with code ${code}`);
});

console.log("\n🚀 AeroLeaf is running!");
console.log("📋 Access the following services:");
console.log("   - Frontend: http://localhost:5173");
console.log("   - Backend API: http://localhost:5000/api");
console.log("   - API Documentation: http://localhost:5000/docs");
console.log("\nPress Ctrl+C to stop all services.");
