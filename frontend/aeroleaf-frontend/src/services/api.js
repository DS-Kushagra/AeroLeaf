/**
 * API Service for AeroLeaf Frontend
 * This file provides a centralized way to make API requests to the backend
 */

// Using relative path for API requests, which will be proxied by Vite during development
const API_BASE_URL = "/api";

/**
 * Generic API request handler with error handling
 * @param {string} endpoint - API endpoint to call
 * @param {Object} options - Fetch options
 * @returns {Promise<any>} Response data
 */
async function apiRequest(endpoint, options = {}) {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    // Default headers
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      // Try to get error message from response
      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || `HTTP error ${response.status}`;
      } catch (e) {
        errorMessage = `HTTP error ${response.status}`;
      }

      throw new Error(errorMessage);
    }

    // For 204 No Content responses
    if (response.status === 204) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
}

// Sites API
export const sitesApi = {
  getSites: () => apiRequest("/sites"),
  getSiteById: (id) => apiRequest(`/sites/${id}`),
  getSitesForReview: () => apiRequest("/sites?manual_review_required=true"),
  verifySite: (id) => apiRequest(`/sites/${id}/verify`, { method: "POST" }),
  reportSite: (siteData) =>
    apiRequest("/report", {
      method: "POST",
      body: JSON.stringify(siteData),
    }),
};

// Credits API
export const creditsApi = {
  getListings: () => apiRequest("/marketplace/listings"),
  buyCredit: (listingId) =>
    apiRequest("/marketplace/buy", {
      method: "POST",
      body: JSON.stringify({ listingId }),
    }),
  listCredit: (creditData) =>
    apiRequest("/marketplace/list", {
      method: "POST",
      body: JSON.stringify(creditData),
    }),
  placeBid: (listingId, bidAmount) =>
    apiRequest("/marketplace/bid", {
      method: "POST",
      body: JSON.stringify({ listingId, bidAmount }),
    }),
  getUserCredits: () => apiRequest("/credits/user-credits"),
  getCreditById: (id) => apiRequest(`/credits/${id}`),
  mintCredit: (creditData) =>
    apiRequest("/credits/mint", {
      method: "POST",
      body: JSON.stringify(creditData),
    }),
  transferCredit: (creditId, receiverUid) =>
    apiRequest("/credits/transfer", {
      method: "POST",
      body: JSON.stringify({ creditId, receiverUid }),
    }),
  retireCredit: (creditId) =>
    apiRequest(`/credits/${creditId}/retire`, {
      method: "POST",
    }),
};

// Reports API
export const reportsApi = {
  getReports: () => apiRequest("/reports"),
};

// Export a default API object with all the API namespaces
export default {
  sites: sitesApi,
  credits: creditsApi,
  reports: reportsApi,
};
