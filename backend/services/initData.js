/**
 * Data initialization script for AeroLeaf
 * This script loads test data into Firebase/Firestore
 */

const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

// Initialize Firebase Admin SDK with service account
const serviceAccount = require("../firebaseServiceKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Function to load site data from JSON
async function loadSites() {
  try {
    // Read sites data
    const sitesPath = path.join(
      __dirname,
      "../../data/reforestation_sites.json"
    );
    const sitesData = JSON.parse(fs.readFileSync(sitesPath, "utf8"));

    console.log(`Loading ${sitesData.length} sites...`);

    // Batch write to Firestore
    const batch = db.batch();

    for (const site of sitesData) {
      const siteRef = db.collection("sites").doc(site.site_id);

      // Prepare site data with additional fields
      const siteData = {
        ...site,
        verificationStatus: "pending",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        area_hectares: Math.floor(Math.random() * 50) + 10, // Random area between 10-60 hectares
        owner: "system",
        milestones: [
          { name: "Site Registered", status: "completed" },
          { name: "Initial Verification", status: "pending" },
          { name: "Carbon Credits Issued", status: "pending" },
        ],
      };

      batch.set(siteRef, siteData);
    }

    // Commit the batch
    await batch.commit();
    console.log("✅ Sites loaded successfully");
  } catch (error) {
    console.error("Error loading sites:", error);
  }
}

// Function to create test carbon credits
async function createTestCredits() {
  try {
    const batch = db.batch();

    // Create 5 test credits
    for (let i = 1; i <= 5; i++) {
      const creditRef = db.collection("credits").doc(`credit_00${i}`);

      const creditData = {
        creditId: `credit_00${i}`,
        siteId: `site_00${Math.min(i, 3)}`, // Map to one of our 3 sites
        owner: "system",
        price: Math.floor(Math.random() * 50) + 10, // Random price between 10-60 USD
        amount: Math.floor(Math.random() * 100) + 20, // Random CO2 tons between 20-120
        status: "available",
        vintage: 2022 + Math.floor(Math.random() * 3), // Random year 2022-2024
        region: ["Brazil", "India", "Kenya"][Math.min(i - 1, 2)],
        history: [
          {
            event: "Created",
            date: admin.firestore.FieldValue.serverTimestamp(),
          },
          {
            event: "Listed",
            price: Math.floor(Math.random() * 50) + 10,
            date: admin.firestore.FieldValue.serverTimestamp(),
          },
        ],
        verifiedBy: "verifier_001",
        verifiedDate: admin.firestore.FieldValue.serverTimestamp(),
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        tokenId: `token_00${i}`,
      };

      batch.set(creditRef, creditData);
    }

    await batch.commit();
    console.log("✅ Test credits created successfully");
  } catch (error) {
    console.error("Error creating test credits:", error);
  }
}

// Function to create test users
async function createTestUsers() {
  try {
    const batch = db.batch();

    const users = [
      {
        uid: "user_001",
        email: "alice@example.com",
        displayName: "Alice Johnson",
        role: "investor",
      },
      {
        uid: "user_002",
        email: "bob@example.com",
        displayName: "Bob Smith",
        role: "landowner",
      },
      {
        uid: "verifier_001",
        email: "charlie@example.com",
        displayName: "Charlie Davis",
        role: "verifier",
      },
    ];

    for (const user of users) {
      const userRef = db.collection("users").doc(user.uid);
      batch.set(userRef, {
        ...user,
        credits: [],
        wallet_balance: 1000, // Starting balance
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    await batch.commit();
    console.log("✅ Test users created successfully");
  } catch (error) {
    console.error("Error creating test users:", error);
  }
}

// Run initialization
async function initializeData() {
  console.log("🌱 Initializing AeroLeaf database...");

  try {
    await loadSites();
    await createTestUsers();
    await createTestCredits();

    console.log("✅ Database initialization complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Initialization failed:", error);
    process.exit(1);
  }
}

// Start initialization
initializeData();
