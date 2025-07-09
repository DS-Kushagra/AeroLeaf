const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const { getFirestore } = require("firebase-admin/firestore");
const { authMiddleware } = require("../middleware/auth.middleware");

/**
 * @swagger
 * /api/credits/buy:
 *   post:
 *     summary: Purchase a carbon credit
 *     tags: [Credits]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - creditId
 *             properties:
 *               creditId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Credit purchased successfully
 *       400:
 *         description: Credit already sold or other error
 *       401:
 *         description: Unauthorized
 */
router.post("/buy", authMiddleware, async (req, res) => {
  try {
    const { creditId } = req.body;
    const buyerId = req.user.uid;

    const db = getFirestore();

    // Start a transaction for atomicity
    await db.runTransaction(async (transaction) => {
      const creditRef = db.collection("credits").doc(creditId);
      const creditDoc = await transaction.get(creditRef);

      if (!creditDoc.exists) {
        throw new Error("Credit not found");
      }

      const credit = creditDoc.data();

      if (credit.status !== "available") {
        throw new Error("Credit already sold");
      }

      // Update the credit
      transaction.update(creditRef, {
        owner: buyerId,
        status: "sold",
        history: admin.firestore.FieldValue.arrayUnion({
          event: "Sold",
          price: credit.price,
          date: admin.firestore.FieldValue.serverTimestamp(),
          buyer: buyerId,
        }),
      });

      // Create transaction record
      const txRef = db.collection("transactions").doc();
      transaction.set(txRef, {
        creditId,
        buyer: buyerId,
        seller: credit.owner,
        price: credit.price,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        type: "credit_purchase",
      });
    });

    return res.status(200).json({
      success: true,
      message: "Transaction completed successfully",
    });
  } catch (error) {
    console.error("Error buying credit:", error);
    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /api/credits/list:
 *   get:
 *     summary: Get list of available carbon credits
 *     tags: [Credits]
 *     responses:
 *       200:
 *         description: List of credits
 */
router.get("/list", async (req, res) => {
  try {
    const db = getFirestore();
    const creditsSnapshot = await db
      .collection("credits")
      .where("status", "==", "available")
      .get();

    const credits = [];
    creditsSnapshot.forEach((doc) => {
      credits.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return res.status(200).json({ credits });
  } catch (error) {
    console.error("Error listing credits:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
