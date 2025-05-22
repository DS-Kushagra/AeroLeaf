import { useState, useEffect } from "react";

/**
 * StatusBanner component displays a configurable banner at the top of pages
 * to inform users about the application's status (e.g., development mode, API connection issues)
 */
export default function StatusBanner() {
  const [apiStatus, setApiStatus] = useState("unknown");
  const [showBanner, setShowBanner] = useState(true);
  const [pulse, setPulse] = useState(false);
  const [blockchainStatus, setBlockchainStatus] = useState("connected");
  const [mlStatus, setMlStatus] = useState("connected");

  // Simulate pulse effect
  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setPulse((prev) => !prev);
    }, 2000);

    return () => clearInterval(pulseInterval);
  }, []);

  useEffect(() => {
    // Check API connectivity on component mount
    async function checkApiStatus() {
      try {
        console.log("Checking API connection status...");
        const response = await fetch("/api/sites");
        if (response.ok) {
          console.log("API connection successful");
          setApiStatus("connected");

          // Simulate different status for blockchain and ML services
          if (Math.random() > 0.9) {
            setBlockchainStatus("syncing");
          } else {
            setBlockchainStatus("connected");
          }

          if (Math.random() > 0.9) {
            setMlStatus("processing");
          } else {
            setMlStatus("connected");
          }
        } else {
          console.warn("API returned error status:", response.status);
          setApiStatus("error");
        }
      } catch (err) {
        console.error("API connection failed:", err);
        setApiStatus("offline");
      }
    }

    checkApiStatus();

    // Check API status periodically
    const intervalId = setInterval(checkApiStatus, 30000);
    return () => clearInterval(intervalId);
  }, []);
  if (!showBanner) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case "connected":
        return "bg-green-500";
      case "syncing":
        return "bg-blue-500";
      case "processing":
        return "bg-indigo-500";
      case "error":
        return "bg-yellow-500";
      case "offline":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "connected":
        return "Connected";
      case "syncing":
        return "Syncing";
      case "processing":
        return "Processing";
      case "error":
        return "Error";
      case "offline":
        return "Offline";
      default:
        return "Unknown";
    }
  };

  const StatusIndicator = ({ status, label }) => (
    <div className="flex items-center">
      <div
        className={`relative w-2 h-2 rounded-full ${getStatusColor(
          status
        )} mr-1.5`}
      >
        {(status === "syncing" || status === "processing") && (
          <span
            className={`absolute w-full h-full rounded-full ${
              pulse ? "opacity-60" : "opacity-0"
            } bg-white animate-ping`}
          ></span>
        )}
      </div>
      <span className="text-xs text-gray-700 font-medium mr-1">{label}:</span>
      <span className="text-xs">{getStatusText(status)}</span>
    </div>
  );

  return (
    <div className="w-full bg-gradient-to-r from-gray-50 to-white border-b border-gray-200 px-4 py-1">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <StatusIndicator status={apiStatus} label="API" />
          </div>
          <div className="h-3 w-px bg-gray-300"></div>
          <div className="flex items-center">
            <StatusIndicator status={blockchainStatus} label="Blockchain" />
          </div>
          <div className="h-3 w-px bg-gray-300"></div>
          <div className="flex items-center">
            <StatusIndicator status={mlStatus} label="ML Service" />
          </div>
        </div>

        <div className="flex items-center">
          <span className="text-xs text-gray-500 mr-3">Development Mode</span>
          <button
            onClick={() => setShowBanner(false)}
            className="text-gray-400 hover:text-gray-700 transition-colors"
            aria-label="Close banner"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
