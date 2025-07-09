import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy API requests to the backend during development
      "/api": {
        target: "http://localhost:5001",
        changeOrigin: true,
        secure: false,
      },
      // Proxy WebSocket connections
      "/socket.io": {
        target: "ws://localhost:5001",
        ws: true,
        changeOrigin: true,
        secure: false,
      },
    },
  },
  // Improve error overlay for React components
  build: {
    sourcemap: true,
  },
});
