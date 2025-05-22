import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "leaflet/dist/leaflet.css";
import { initializeSocket } from "./services/socket";
import "./services/firebase"; // Import Firebase initialization

// Initialize WebSocket for real-time updates
initializeSocket();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
