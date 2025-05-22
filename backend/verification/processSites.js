const {
  isNDVIVerified,
  checkSiteNDVI,
  verifyNDVIChange,
} = require("./checkNDVI");
const admin = require("firebase-admin");
const { getFirestore } = require("firebase-admin/firestore");
const fs = require("fs");
const path = require("path");

/**
 * Process all pending sites for verification
 */
async function processSiteVerifications() {
  try {
    const db = getFirestore();
    const snapshot = await db
      .collection("sites")
      .where("verificationStatus", "==", "pending")
      .get();

    console.log(`Processing ${snapshot.size} pending sites for verification`);

    for (const doc of snapshot.docs) {
      const site = doc.data();
      console.log(`Checking site: ${site.siteId}`);

      // Get NDVI data
      const ndviData = await checkSiteNDVI(site.siteId);

      // Check if site passes verification
      let verified = false;

      if (ndviData && !ndviData.error) {
        // Try both verification methods
        verified =
          site.ndvi_history && site.ndvi_history.length >= 6
            ? isNDVIVerified(site.ndvi_history)
            : verifyNDVIChange(ndviData);

        // Update site in database
        await doc.ref.update({
          verificationStatus: verified ? "verified" : "uncertain",
          lastVerified: admin.firestore.FieldValue.serverTimestamp(),
          "milestones.0.status": "completed",
          "milestones.1.status": verified ? "completed" : "pending",
        });

        console.log(
          `Site ${site.siteId} verification complete. Result: ${
            verified ? "Verified" : "Uncertain"
          }`
        );
      } else {
        console.error(`Failed to get NDVI data for site ${site.siteId}`);
      }
    }

    return { success: true, processedCount: snapshot.size };
  } catch (error) {
    console.error("Error processing site verifications:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Load all site data from the JSON file
 */
async function loadSitesFromJSON() {
  try {
    const dataPath = path.join(
      __dirname,
      "../../data/reforestation_sites.json"
    );
    const sitesData = JSON.parse(fs.readFileSync(dataPath, "utf8"));

    const db = getFirestore();
    const batch = db.batch();
    const sitesRef = db.collection("sites");

    for (const site of sitesData) {
      const docRef = sitesRef.doc(site.site_id);
      batch.set(docRef, {
        ...site,
        verificationStatus: "pending",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        owner: "system",
        milestones: [
          { name: "Site Registered", status: "completed" },
          { name: "Initial Verification", status: "pending" },
          { name: "Carbon Credits Issued", status: "pending" },
        ],
      });
    }

    await batch.commit();
    return { success: true, siteCount: sitesData.length };
  } catch (error) {
    console.error("Error loading sites:", error);
    return { success: false, error: error.message };
  }
}

module.exports = {
  processSiteVerifications,
  loadSitesFromJSON,
};
