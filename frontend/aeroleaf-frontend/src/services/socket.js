/**
 * Socket Service for real-time updates
 * This service handles WebSocket connections for real-time updates in the application
 */
import { io } from "socket.io-client";

// Socket instance
let socket = null;
let socketReady = false;

// Event listeners
const listeners = {
  marketplaceUpdated: [],
  bidPlaced: [],
  creditRetired: [],
  creditTransferred: [],
};

// Queue for events that need to be sent when socket reconnects
let eventQueue = [];

/**
 * Initialize WebSocket connection
 */
export const initializeSocket = () => {
  if (socket) return;
  try {
    // Use absolute URL with current hostname for better local development
    const socketUrl =
      import.meta.env.VITE_SOCKET_URL ||
      `${window.location.protocol}//${window.location.hostname}:5000`;
    console.log(`Connecting to socket at: ${socketUrl}`);
    // Connect to the specified URL
    socket = io(socketUrl, {
      path: "/socket.io",
      transports: ["websocket", "polling"],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    }); // Add connection event handlers
    socket.on("connect", () => {
      console.log("Connected to WebSocket server:", socket.id);
      socketReady = true;

      // Process any queued events
      while (eventQueue.length > 0) {
        const { event, data } = eventQueue.shift();
        socket.emit(event, data);
      }
    });

    socket.on("connect_error", (error) => {
      console.warn("WebSocket connection error:", error.message);
      console.info("WebSocket will automatically try to reconnect");
    });
    socket.on("disconnect", () => {
      console.log("Socket disconnected");
      socketReady = false;
    });

    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });

    // Listen for marketplace updates
    socket.on("marketplace:updated", (data) => {
      notifyListeners("marketplaceUpdated", data);
    });

    // Listen for new bids
    socket.on("bid:placed", (data) => {
      notifyListeners("bidPlaced", data);
    });

    // Listen for credit retirements
    socket.on("credit:retired", (data) => {
      notifyListeners("creditRetired", data);
    });

    // Listen for credit transfers
    socket.on("credit:transferred", (data) => {
      notifyListeners("creditTransferred", data);
    });
  } catch (error) {
    console.error("Failed to initialize socket:", error);
  }
};

/**
 * Add event listener
 * @param {string} event - Event name to listen for
 * @param {function} callback - Callback function
 */
export const addEventListener = (event, callback) => {
  if (!listeners[event]) {
    listeners[event] = [];
  }

  listeners[event].push(callback);

  // If socket doesn't exist or isn't connected, we'll still register the listener,
  // but we won't see events until the socket reconnects
  if (!socket) {
    console.warn(
      `Socket isn't initialized yet. Listener for ${event} is registered but won't receive events until connection is established.`
    );
  }

  return () => removeEventListener(event, callback);
};

/**
 * Remove event listener
 * @param {string} event - Event name
 * @param {function} callback - Callback function to remove
 */
export const removeEventListener = (event, callback) => {
  if (!listeners[event]) return;

  const index = listeners[event].indexOf(callback);
  if (index !== -1) {
    listeners[event].splice(index, 1);
  }
};

/**
 * Notify all listeners for an event
 * @param {string} event - Event name
 * @param {any} data - Event data
 */
const notifyListeners = (event, data) => {
  if (!listeners[event]) return;

  listeners[event].forEach((callback) => {
    try {
      callback(data);
    } catch (error) {
      console.error(`Error in ${event} event listener:`, error);
    }
  });
};

/**
 * Disconnect socket
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

/**
 * Safely emit a socket event, with fallback to queue if socket is not ready
 * @param {string} event - Event name to emit
 * @param {any} data - Event data
 */
export const emitEvent = (event, data) => {
  if (socket && socketReady) {
    socket.emit(event, data);
  } else {
    console.warn(`Socket not ready, queueing ${event} event`);
    eventQueue.push({ event, data });
  }
};

export default {
  initializeSocket,
  addEventListener,
  removeEventListener,
  disconnectSocket,
  emitEvent,
};
