const express = require("express");
const router = express.Router();
const { getFirestore } = require("../config/firebase");
const {
  authMiddleware,
  requireRole,
} = require("../middleware/auth.middleware");
const { validateInput } = require("../config/security");
const logger = require("../config/logger");

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

    logger.info("User credits retrieved", {
      userId: uid,
      creditCount: credits.length,
    });

    res.status(200).json(credits);
  } catch (error) {
    logger.error("Error fetching user credits:", {
      userId: req.user.uid,
      error: error.message,
    });
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
router.post(
  "/mint",
  authMiddleware,
  requireRole(["landowner", "verifier"]),
  validateInput.validateBody({
    siteId: { required: true, type: "string" },
    amount: { required: true, type: "string" },
    vintage: { required: true, type: "string" },
  }),
  async (req, res) => {
    try {
      const { siteId, amount, vintage } = req.body;
      const ownerUid = req.user.uid;

      const db = getFirestore();
      const { admin } = require("../config/firebase");

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

      logger.info("Carbon credit minted", {
        creditId: creditRef.id,
        siteId,
        amount,
        ownerUid,
      });

      res.status(201).json({
        success: true,
        message: "Carbon credit minted successfully",
        creditId: creditRef.id,
      });
    } catch (error) {
      logger.error("Error minting carbon credit:", {
        userId: req.user.uid,
        siteId: req.body.siteId,
        error: error.message,
      });
      res.status(500).json({ error: "Failed to mint carbon credit" });
    }
  }
);

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
