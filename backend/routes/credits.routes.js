const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const { getFirestore } = require("firebase-admin/firestore");
const authMiddleware = require("../middleware/auth.middleware");

// Get user's carbon credits
router.get("/user-credits", authMiddleware, async (req, res) => {
  try {
    const uid = req.user.uid;
    const db = getFirestore();

    // In production, fetch from Firestore or DB
    const creditsSnapshot = await db
      .collection("carbon_credits")
      .where("owner_uid", "==", uid)
      .get();

    const credits = [];
    creditsSnapshot.forEach((doc) => {
      credits.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    res.status(200).json(credits);
  } catch (error) {
    console.error("Error fetching user credits:", error);
    res.status(500).json({ error: "Failed to fetch user credits" });
  }
});

// Get credit details by ID
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const db = getFirestore();

    const creditDoc = await db.collection("carbon_credits").doc(id).get();

    if (!creditDoc.exists) {
      return res.status(404).json({ error: "Carbon credit not found" });
    }

    res.status(200).json({
      id: creditDoc.id,
      ...creditDoc.data(),
    });
  } catch (error) {
    console.error("Error fetching credit details:", error);
    res.status(500).json({ error: "Failed to fetch credit details" });
  }
});

// Mint new carbon credit (would connect to blockchain in production)
router.post("/mint", authMiddleware, async (req, res) => {
  try {
    const { siteId, amount, vintage } = req.body;
    const ownerUid = req.user.uid;

    if (!siteId || !amount || !vintage) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const db = getFirestore();

    // Check if site exists
    const siteDoc = await db.collection("sites").doc(siteId).get();

    if (!siteDoc.exists) {
      return res.status(404).json({ error: "Site not found" });
    }

    // In production, this would call the blockchain to mint the token
    // and store transaction details

    // For now, just create a record in Firestore
    const creditRef = db.collection("carbon_credits").doc();
    await creditRef.set({
      token_id: `CC${Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, "0")}`,
      site_id: siteId,
      amount: parseFloat(amount),
      vintage: vintage,
      status: "pending",
      owner_uid: ownerUid,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(201).json({
      success: true,
      id: creditRef.id,
      message: "Carbon credit minted successfully",
    });
  } catch (error) {
    console.error("Error minting carbon credit:", error);
    res.status(500).json({ error: "Failed to mint carbon credit" });
  }
});

// Transfer credit ownership
router.post("/transfer", authMiddleware, async (req, res) => {
  try {
    const { creditId, receiverUid } = req.body;
    const senderUid = req.user.uid;

    if (!creditId || !receiverUid) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const db = getFirestore();
    const creditRef = db.collection("carbon_credits").doc(creditId);
    const creditDoc = await creditRef.get();

    if (!creditDoc.exists) {
      return res.status(404).json({ error: "Carbon credit not found" });
    }

    if (creditDoc.data().owner_uid !== senderUid) {
      return res
        .status(403)
        .json({ error: "You don't own this carbon credit" });
    }

    // In production, this would call the blockchain to transfer the token

    // Update ownership
    await creditRef.update({
      owner_uid: receiverUid,
      transferred_at: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({
      success: true,
      message: "Carbon credit transferred successfully",
    });
  } catch (error) {
    console.error("Error transferring carbon credit:", error);
    res.status(500).json({ error: "Failed to transfer carbon credit" });
  }
});

// Retire carbon credit
router.post("/:id/retire", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const ownerUid = req.user.uid;

    const db = getFirestore();
    const creditRef = db.collection("carbon_credits").doc(id);
    const creditDoc = await creditRef.get();

    if (!creditDoc.exists) {
      return res.status(404).json({ error: "Carbon credit not found" });
    }

    if (creditDoc.data().owner_uid !== ownerUid) {
      return res
        .status(403)
        .json({ error: "You don't own this carbon credit" });
    }

    if (creditDoc.data().status === "retired") {
      return res
        .status(400)
        .json({ error: "Carbon credit is already retired" });
    }

    // In production, this would call the blockchain to retire the token

    await creditRef.update({
      status: "retired",
      retired_at: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({
      success: true,
      message: "Carbon credit retired successfully",
    });
  } catch (error) {
    console.error("Error retiring carbon credit:", error);
    res.status(500).json({ error: "Failed to retire carbon credit" });
  }
});

module.exports = router;
