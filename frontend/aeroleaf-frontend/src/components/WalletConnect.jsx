import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWeb3 } from "../contexts/Web3Context";

export default function WalletConnect() {
  const {
    account,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet,
    isMetaMaskInstalled,
  } = useWeb3();

  const [menuOpen, setMenuOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const handleConnect = async () => {
    await connectWallet();
  };

  const handleDisconnect = () => {
    disconnectWallet();
    setMenuOpen(false);
  };

  const copyAddress = async () => {
    if (account) {
      try {
        await navigator.clipboard.writeText(account);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        setMenuOpen(false);
      } catch (err) {
        console.error("Failed to copy address:", err);
      }
    }
  };

  // Format address for display (0x1234...5678)
  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // If MetaMask is not installed
  if (!isMetaMaskInstalled()) {
    return (
      <motion.button
        onClick={() => window.open("https://metamask.io/download/", "_blank")}
        className="flex items-center space-x-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm border border-orange-400/20"
        whileHover={{ scale: 1.02, y: -1 }}
        whileTap={{ scale: 0.98 }}
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        <span>Install MetaMask</span>
      </motion.button>
    );
  }

  // If we have an error
  if (error) {
    return (
      <motion.button
        onClick={handleConnect}
        className="flex items-center space-x-2 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm border border-red-400/20"
        whileHover={{ scale: 1.02, y: -1 }}
        whileTap={{ scale: 0.98 }}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
        <span>Retry Connection</span>
      </motion.button>
    );
  }

  // If we're connecting
  if (isConnecting) {
    return (
      <motion.div
        className="flex items-center space-x-2 px-4 py-2.5 bg-gray-100 text-gray-600 font-semibold rounded-xl border border-gray-200/50"
        initial={{ opacity: 0.8 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <span>Connecting...</span>
      </motion.div>
    );
  }

  // If connected
  if (account) {
    return (
      <div className="relative">
        <motion.button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center space-x-2 bg-white/80 backdrop-blur-md rounded-lg border border-gray-200/60 px-2.5 py-1.5 shadow-md hover:shadow-lg transition-all duration-300 hover:bg-white/90"
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Polygon/Ethereum Icon */}
          <div className="w-4 h-4 rounded-md bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-sm">
            <svg
              className="w-2.5 h-2.5 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12.7 2.7L19.3 6.9C19.7 7.1 20 7.5 20 8V16C20 16.5 19.7 16.9 19.3 17.1L12.7 21.3C12.3 21.5 11.7 21.5 11.3 21.3L4.7 17.1C4.3 16.9 4 16.5 4 16V8C4 7.5 4.3 7.1 4.7 6.9L11.3 2.7C11.7 2.5 12.3 2.5 12.7 2.7Z" />
            </svg>
          </div>

          {/* Address Display */}
          <div className="text-xs font-mono font-semibold text-gray-800 tracking-tight">
            {formatAddress(account)}
          </div>

          {/* Dropdown Arrow */}
          <motion.svg
            className="w-3 h-3 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            animate={{ rotate: menuOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M19 9l-7 7-7-7"
            />
          </motion.svg>
        </motion.button>

        {/* Enhanced Dropdown Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-200/60 overflow-hidden z-50"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {/* Wallet Info Header */}
              <div className="px-4 py-3 bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-sm">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12.7 2.7L19.3 6.9C19.7 7.1 20 7.5 20 8V16C20 16.5 19.7 16.9 19.3 17.1L12.7 21.3C12.3 21.5 11.7 21.5 11.3 21.3L4.7 17.1C4.3 16.9 4 16.5 4 16V8C4 7.5 4.3 7.1 4.7 6.9L11.3 2.7C11.7 2.5 12.3 2.5 12.7 2.7Z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-900">
                      Connected
                    </div>
                    <div className="text-xs text-gray-500 font-mono">
                      Polygon Network
                    </div>
                  </div>
                </div>
              </div>

              <div className="py-1">
                {/* Full Address Display */}
                <div className="px-4 py-2 text-xs text-gray-600">
                  <div className="font-mono bg-gray-50 rounded-lg px-3 py-2 break-all">
                    {account}
                  </div>
                </div>

                <motion.button
                  onClick={copyAddress}
                  className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-all duration-200 group"
                  whileHover={{ x: 2 }}
                >
                  <svg
                    className="mr-3 h-4 w-4 text-gray-400 group-hover:text-purple-500 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="font-medium">
                    {copied ? "Copied!" : "Copy Address"}
                  </span>
                </motion.button>

                <div className="border-t border-gray-100 my-1" />

                <motion.button
                  onClick={handleDisconnect}
                  className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-all duration-200 group"
                  whileHover={{ x: 2 }}
                >
                  <svg
                    className="mr-3 h-4 w-4 text-red-400 group-hover:text-red-500 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  <span className="font-medium">Disconnect</span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Click outside handler */}
        {menuOpen && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setMenuOpen(false)}
          />
        )}
      </div>
    );
  }

  // If not connected
  return (
    <motion.button
      onClick={handleConnect}
      className="flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:from-purple-700 hover:via-indigo-700 hover:to-purple-800 backdrop-blur-sm border border-purple-500/20 text-sm"
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
    >
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.7 2.7L19.3 6.9C19.7 7.1 20 7.5 20 8V16C20 16.5 19.7 16.9 19.3 17.1L12.7 21.3C12.3 21.5 11.7 21.5 11.3 21.3L4.7 17.1C4.3 16.9 4 16.5 4 16V8C4 7.5 4.3 7.1 4.7 6.9L11.3 2.7C11.7 2.5 12.3 2.5 12.7 2.7Z" />
      </svg>
      <span>Connect</span>
    </motion.button>
  );
}
