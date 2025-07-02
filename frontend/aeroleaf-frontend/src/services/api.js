/**
 * Production-ready API Service for AeroLeaf Frontend
 * Handles all API communications with proper error handling and token management
 */
import authService from "./firebase";

class ApiService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";
    this.timeout = 30000; // 30 seconds
  }

  /**
   * Make authenticated API request
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Request options
   * @returns {Promise<any>} Response data
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    // Get authentication token
    const token = await authService.getCurrentToken();

    // Default headers
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    // Add authentication header if token exists
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    // Request configuration
    const config = {
      method: "GET",
      headers,
      ...options,
    };

    // Add timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);
    config.signal = controller.signal;

    try {
      const response = await fetch(url, config);
      clearTimeout(timeoutId);

      // Handle different response types
      if (!response.ok) {
        await this.handleErrorResponse(response);
      }

      // Parse response based on content type
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return await response.json();
      }

      return await response.text();
    } catch (error) {
      clearTimeout(timeoutId);

      if (error.name === "AbortError") {
        throw new Error("Request timeout");
      }

      throw this.handleRequestError(error);
    }
  }

  /**
   * Handle error responses
   * @param {Response} response - Fetch response object
   */
  async handleErrorResponse(response) {
    let errorData;

    try {
      errorData = await response.json();
    } catch {
      errorData = { message: "Unknown error occurred" };
    }

    // Handle authentication errors
    if (response.status === 401) {
      // Token might be expired, try to refresh
      try {
        const newToken = await authService.getCurrentToken(true);
        if (!newToken) {
          // Redirect to login
          window.location.href = "/login";
          throw new Error("Authentication required");
        }
      } catch {
        window.location.href = "/login";
        throw new Error("Authentication required");
      }
    }

    const error = new Error(errorData.message || `HTTP ${response.status}`);
    error.status = response.status;
    error.code = errorData.code;
    error.details = errorData.details;

    throw error;
  }

  /**
   * Handle request errors
   * @param {Error} error - Request error
   * @returns {Error} Formatted error
   */
  handleRequestError(error) {
    if (error.message === "Failed to fetch") {
      return new Error("Network error. Please check your connection.");
    }

    return error;
  }

  // Legacy method for backward compatibility
  async apiRequest(endpoint, options = {}) {
    return this.request(endpoint, options);
  }

  // Authentication endpoints
  async register(userData) {
    return this.request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async getProfile() {
    return this.request("/api/auth/profile");
  }

  async updateProfile(userData) {
    return this.request("/api/auth/profile", {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  }

  async deleteAccount() {
    return this.request("/api/auth/delete-account", {
      method: "DELETE",
    });
  }

  // Carbon credits endpoints
  async getCarbonCredits() {
    return this.request("/api/credits/user-credits");
  }

  async getCreditDetails(creditId) {
    return this.request(`/api/credits/${creditId}`);
  }

  async mintCredit(creditData) {
    return this.request("/api/credits/mint", {
      method: "POST",
      body: JSON.stringify(creditData),
    });
  }

  async transferCredit(creditId, transferData) {
    return this.request(`/api/credits/${creditId}/transfer`, {
      method: "POST",
      body: JSON.stringify(transferData),
    });
  }

  async retireCredit(creditId) {
    return this.request(`/api/credits/${creditId}/retire`, {
      method: "POST",
    });
  }

  // Marketplace endpoints (legacy compatibility)
  async getMarketplaceBids() {
    return this.request("/api/marketplace/bids");
  }

  async getMarketplaceListings() {
    return this.request("/api/marketplace/listings");
  }

  async createListing(listingData) {
    return this.request("/api/marketplace/list", {
      method: "POST",
      body: JSON.stringify(listingData),
    });
  }

  async placeBid(listingId, bidData) {
    return this.request(`/api/marketplace/listings/${listingId}/bid`, {
      method: "POST",
      body: JSON.stringify(bidData),
    });
  }

  async buyCredit(creditId) {
    return this.request("/api/credits/buy", {
      method: "POST",
      body: JSON.stringify({ creditId }),
    });
  }

  // Site verification endpoints
  async getSites() {
    return this.request("/api/sites");
  }

  async getSiteDetails(siteId) {
    return this.request(`/api/sites/${siteId}`);
  }

  async submitVerification(siteId, verificationData) {
    return this.request(`/api/sites/${siteId}/verify`, {
      method: "POST",
      body: JSON.stringify(verificationData),
    });
  }

  // Health check
  async healthCheck() {
    return this.request("/health");
  }

  // Legacy exports for existing code
  async getCarbonCreditsBid() {
    return this.getMarketplaceBids();
  }

  async getSiteVerification(siteId) {
    return this.getSiteDetails(siteId);
  }
}

// Create singleton instance
const apiService = new ApiService();

// Backward compatibility exports
export const creditsApi = {
  getUserCredits: () => apiService.getCarbonCredits(),
  getListings: () => apiService.getMarketplaceListings(),
  placeBid: (listingId, bidAmount) =>
    apiService.placeBid(listingId, { amount: bidAmount }),
  retireCredit: (creditId) => apiService.retireCredit(creditId),
  listCredit: (listingData) => apiService.createListing(listingData),
  buyCredit: (creditId) => apiService.buyCredit(creditId),
  mintCredit: (creditData) => apiService.mintCredit(creditData),
  transferCredit: (creditId, transferData) =>
    apiService.transferCredit(creditId, transferData),
};

export const sitesApi = {
  getSitesForReview: () => apiService.getSites(),
  getSiteById: (siteId) => apiService.getSiteDetails(siteId),
  verifySite: (siteId) =>
    apiService.submitVerification(siteId, { verified: true }),
  escalateSite: (siteId) =>
    apiService.submitVerification(siteId, { escalated: true }),
};

// Export both the class and instance for backward compatibility
export { ApiService };
export default apiService;
