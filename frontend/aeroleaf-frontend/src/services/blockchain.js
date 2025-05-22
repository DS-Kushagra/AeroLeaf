/**
 * Blockchain Service for AeroLeaf
 * Provides functions for interacting with blockchain contracts
 */
import { ethers } from "ethers";
import CarbonCreditABI from "../contracts/CarbonCreditABI";

// The address where the CarbonCredit contract is deployed on the network
const CONTRACT_ADDRESS =
  import.meta.env.VITE_CARBON_CREDIT_CONTRACT_ADDRESS ||
  "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Example address

// Create a blockchain service with utility functions
const BlockchainService = {
  /**
   * Get contract instance using the given provider and signer
   */
  getContract: (provider, signer, withSigner = true) => {
    if (!provider) {
      throw new Error("Provider is required");
    }

    // Connect to the contract using either the signer or provider
    return new ethers.Contract(
      CONTRACT_ADDRESS,
      CarbonCreditABI,
      withSigner && signer ? signer : provider
    );
  },
  /**
   * Mint a new carbon credit token
   * @param {string} siteId - ID of the reforestation site
   * @param {number} amount - Amount of carbon in tons
   * @param {number} vintage - Year of vintage
   * @param {string} region - Geographic region
   * @param {string} metadataUri - URI for the token metadata (IPFS)
   * @param {object} provider - Ethers provider
   * @param {object} signer - Ethers signer
   * @returns {Promise<Object>} - Transaction receipt
   */
  mintCarbonCredit: async (
    siteId,
    amount,
    vintage,
    region,
    metadataUri,
    provider,
    signer
  ) => {
    try {
      const contract = BlockchainService.getContract(provider, signer, true);

      // Convert amount to proper format (wei)
      const amountWei = ethers.utils.parseEther(amount.toString());

      // Call the mint function on the contract
      const tx = await contract.mintCredit(
        siteId,
        amountWei,
        vintage,
        region,
        metadataUri
      );

      // Wait for transaction to be mined
      const receipt = await tx.wait();

      // Get the token ID from the event emitted
      const event = receipt.events.find((e) => e.event === "CreditMinted");
      const tokenId = event.args.tokenId.toString();

      return {
        success: true,
        tokenId,
        transactionHash: receipt.transactionHash,
      };
    } catch (error) {
      console.error("Error minting carbon credit:", error);
      throw error;
    }
  },
  /**
   * Transfer carbon credit token
   * @param {string} to - Recipient address
   * @param {string} tokenId - ID of the token
   * @param {object} provider - Ethers provider
   * @param {object} signer - Ethers signer
   * @returns {Promise<Object>} - Transaction receipt
   */
  transferToken: async (to, tokenId, provider, signer) => {
    try {
      const contract = BlockchainService.getContract(provider, signer, true);
      const tx = await contract.transferFrom(
        await signer.getAddress(),
        to,
        tokenId
      );

      const receipt = await tx.wait();
      return {
        success: true,
        transactionHash: receipt.transactionHash,
      };
    } catch (error) {
      console.error("Error transferring token:", error);
      throw error;
    }
  },
  /**
   * Retire a carbon credit token
   * @param {string} tokenId - ID of the token to retire
   * @param {string} reason - Reason for retirement
   * @param {object} provider - Ethers provider
   * @param {object} signer - Ethers signer
   * @returns {Promise<Object>} - Transaction receipt
   */
  retireCredit: async (tokenId, reason, provider, signer) => {
    try {
      const contract = BlockchainService.getContract(provider, signer, true);
      const tx = await contract.retireCredit(tokenId, reason || "");

      const receipt = await tx.wait();

      // Get the event data
      const event = receipt.events.find((e) => e.event === "CreditRetired");

      return {
        success: true,
        tokenId: event.args.tokenId.toString(),
        transactionHash: receipt.transactionHash,
      };
    } catch (error) {
      console.error("Error retiring carbon credit:", error);
      throw error;
    }
  },
  /**
   * Get carbon credit details from the blockchain
   * @param {string} tokenId - ID of the token
   * @param {object} provider - Ethers provider
   * @returns {Promise<Object>} - Carbon credit data
   */
  getCreditDetails: async (tokenId, provider) => {
    try {
      const contract = BlockchainService.getContract(provider, null, false);
      const creditData = await contract.credits(tokenId);

      // Format the response data
      return {
        tokenId: creditData.tokenId.toString(),
        siteId: creditData.siteId,
        amount: ethers.utils.formatEther(creditData.amount),
        vintage: creditData.vintage.toString(),
        region: creditData.region,
        status: ["Pending", "Verified", "Retired"][creditData.status],
        verifiedDate: creditData.verifiedDate.toString() * 1000, // Convert to milliseconds
      };
    } catch (error) {
      console.error("Error getting credit details:", error);
      throw error;
    }
  },
  /**
   * Get user's carbon credit balance
   * @param {string} userAddress - User's wallet address
   * @param {object} provider - Ethers provider
   * @returns {Promise<Array>} - Array of token IDs owned by the user
   */
  getUserCredits: async (userAddress, provider) => {
    try {
      const contract = BlockchainService.getContract(provider, null, false);

      // Get balance
      const balance = await contract.balanceOf(userAddress);
      const tokenCount = balance.toNumber();

      // Get all token IDs
      const tokenIds = [];
      for (let i = 0; i < tokenCount; i++) {
        const tokenId = await contract.tokenOfOwnerByIndex(userAddress, i);
        tokenIds.push(tokenId.toString());
      }
      // Get details for each token
      const creditsPromises = tokenIds.map((id) =>
        BlockchainService.getCreditDetails(id, provider)
      );
      const credits = await Promise.all(creditsPromises);

      return credits;
    } catch (error) {
      console.error("Error getting user credits:", error);
      throw error;
    }
  },
};

export default BlockchainService;
