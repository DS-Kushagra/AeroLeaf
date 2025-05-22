import React, { createContext, useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";

// Create the context
export const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  // Function to check if MetaMask is installed
  const isMetaMaskInstalled = useCallback(() => {
    return typeof window !== "undefined" && window.ethereum !== undefined;
  }, []);

  // Function to connect to MetaMask
  const connectWallet = useCallback(async () => {
    if (!isMetaMaskInstalled()) {
      setError(
        "MetaMask is not installed. Please install MetaMask to continue."
      );
      return false;
    }

    setIsConnecting(true);
    setError(null);

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      }); // Get the first account
      const account = ethers.getAddress(accounts[0]);
      setAccount(account);

      // Set up provider and signer
      const provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(provider);

      const signer = await provider.getSigner();
      setSigner(signer);

      // Get the current network
      const network = await provider.getNetwork();
      setChainId(network.chainId);

      return true;
    } catch (error) {
      console.error("Failed to connect to wallet:", error);
      setError("Failed to connect to wallet. Please try again.");
      return false;
    } finally {
      setIsConnecting(false);
    }
  }, [isMetaMaskInstalled]);

  // Function to disconnect wallet
  const disconnectWallet = useCallback(() => {
    setAccount(null);
    setProvider(null);
    setSigner(null);
    setChainId(null);
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (isMetaMaskInstalled()) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
          // User disconnected their wallet
          disconnectWallet();
        } else {
          // Account changed, update the state
          setAccount(ethers.utils.getAddress(accounts[0]));
        }
      };

      const handleChainChanged = (chainIdHex) => {
        // Chain changed, update the state and refresh the page
        const newChainId = parseInt(chainIdHex, 16);
        setChainId(newChainId);
        window.location.reload();
      };

      const handleDisconnect = (error) => {
        // Provider disconnected
        console.log("Provider disconnected:", error);
        disconnectWallet();
      };

      // Subscribe to events
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);
      window.ethereum.on("disconnect", handleDisconnect);

      // Try to connect automatically if the user previously connected
      if (localStorage.getItem("walletConnected") === "true") {
        connectWallet();
      }

      // Cleanup function
      return () => {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
        window.ethereum.removeListener("chainChanged", handleChainChanged);
        window.ethereum.removeListener("disconnect", handleDisconnect);
      };
    }
  }, [connectWallet, disconnectWallet, isMetaMaskInstalled]);

  // Function to check and switch to the required network
  const switchNetwork = useCallback(
    async (targetChainId) => {
      if (!isMetaMaskInstalled() || !provider) return false;

      try {
        // Convert to hex for MetaMask
        const targetChainIdHex = `0x${targetChainId.toString(16)}`;

        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: targetChainIdHex }],
        });

        return true;
      } catch (error) {
        // This error code indicates that the chain has not been added to MetaMask
        if (error.code === 4902) {
          // You could implement adding the network here
          setError("Please add this network to your MetaMask.");
        } else {
          setError("Failed to switch network. Please try again.");
        }
        return false;
      }
    },
    [provider, isMetaMaskInstalled]
  );

  // Save connection state to localStorage when account changes
  useEffect(() => {
    if (account) {
      localStorage.setItem("walletConnected", "true");
    } else {
      localStorage.removeItem("walletConnected");
    }
  }, [account]);

  // Context value
  const value = {
    account,
    provider,
    signer,
    chainId,
    isConnecting,
    error,
    isMetaMaskInstalled,
    connectWallet,
    disconnectWallet,
    switchNetwork,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};

// Custom hook to use the Web3 context
export const useWeb3 = () => {
  const context = React.useContext(Web3Context);
  if (context === undefined) {
    throw new Error("useWeb3 must be used within a Web3Provider");
  }
  return context;
};
