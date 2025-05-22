const fs = require("fs");
const path = require("path");
const axios = require("axios");

/**
 * Basic rule: If NDVI has increased consistently over 6 months, it's healthy.
 */
function isNDVIVerified(ndviHistory) {
  if (ndviHistory.length < 6) return false;

  let positiveGrowth = 0;
  for (let i = 1; i < ndviHistory.length; i++) {
    if (ndviHistory[i].ndvi > ndviHistory[i - 1].ndvi) positiveGrowth++;
  }

  return positiveGrowth >= 4; // e.g., at least 4 of 6 months showing improvement
}

/**
 * Function to check NDVI values for a specific site
 * This connects to our ML service or loads cached results
 * @param {string} siteId - The ID of the site to check
 * @returns {Promise<object>} - The NDVI verification results
 */
async function checkSiteNDVI(siteId) {
  // First check if we have cached results
  const resultPath = path.join(__dirname, "../../ml/results", `${siteId}.json`);

  try {
    if (fs.existsSync(resultPath)) {
      const data = fs.readFileSync(resultPath, "utf8");
      return JSON.parse(data);
    }

    // If no cache, call ML service
    // This would be a real API call in production
    const response = await axios.post("http://localhost:5001/calculate-ndvi", {
      site_id: siteId,
    });

    return response.data;
  } catch (error) {
    console.error(`Error checking NDVI for site ${siteId}:`, error);
    return {
      error: true,
      message: "Failed to check NDVI values",
      site_id: siteId,
    };
  }
}

/**
 * Function to determine if a site passes verification based on NDVI change
 * @param {object} ndviData - The NDVI data for the site
 * @returns {boolean} - Whether the site passes verification
 */
function verifyNDVIChange(ndviData) {
  // We consider a site verified if NDVI has improved by at least 0.1
  const threshold = 0.1;

  if (!ndviData || !ndviData.satellite_data || ndviData.error) {
    return false;
  }

  return ndviData.satellite_data.ndvi_change >= threshold;
}

module.exports = {
  isNDVIVerified,
  checkSiteNDVI,
  verifyNDVIChange,
};
