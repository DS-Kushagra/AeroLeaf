const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const { getFirestore } = require("firebase-admin/firestore");
const authMiddleware = require("../middleware/auth.middleware");

// Get all marketplace listings
router.get("/listings", async (req, res) => {
  try {
    const db = getFirestore();
    const listingsSnapshot = await db
      .collection("marketplace_listings")
      .where("is_active", "==", true)
      .orderBy("created_at", "desc")
      .get();

    const listings = [];
    listingsSnapshot.forEach((doc) => {
      listings.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    res.status(200).json(listings);
  } catch (error) {
    console.error("Error fetching marketplace listings:", error);
    res.status(500).json({ error: "Failed to fetch listings" });
  }
});

// Create a new listing
router.post("/list", authMiddleware, async (req, res) => {
  try {
    const { tokenId, price, projectId, isAuction, auctionEndDate } = req.body;
    const ownerUid = req.user.uid;

    const db = getFirestore();
    const listingRef = db.collection("marketplace_listings").doc();

    // Basic validation
    if (!tokenId || !price || !projectId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (isAuction && !auctionEndDate) {
      return res
        .status(400)
        .json({ error: "Auction end date is required for auctions" });
    }

    await listingRef.set({
      token_id: tokenId,
      project_id: projectId,
      owner_uid: ownerUid,
      current_price: price,
      price_history: [
        { timestamp: admin.firestore.FieldValue.serverTimestamp(), price },
      ],
      is_active: true,
      status: "listed",
      buyer_uid: null,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
      is_auction: isAuction || false,
      auction_end: isAuction ? auctionEndDate : null,
    });

    res.status(201).json({ success: true, id: listingRef.id });
  } catch (error) {
    console.error("Error creating listing:", error);
    res.status(500).json({ error: "Failed to create listing" });
  }
});

// Buy a carbon credit
router.post("/buy", authMiddleware, async (req, res) => {
  try {
    const { listingId } = req.body;
    const buyerUid = req.user.uid;

    const db = getFirestore();
    const listingRef = db.collection("marketplace_listings").doc(listingId);

    await db.runTransaction(async (transaction) => {
      const listingDoc = await transaction.get(listingRef);

      if (!listingDoc.exists) {
        throw new Error("Listing not found");
      }

      const listing = listingDoc.data();

      if (!listing.is_active) {
        throw new Error("Listing is no longer active");
      }

      // Update the listing
      transaction.update(listingRef, {
        is_active: false,
        status: "sold",
        buyer_uid: buyerUid,
        sold_at: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Log the transaction
      const txRef = db.collection("transactions").doc();
      transaction.set(txRef, {
        listing_id: listingId,
        token_id: listing.token_id,
        seller_uid: listing.owner_uid,
        buyer_uid: buyerUid,
        price: listing.current_price,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });

      // In real implementation, we'd also transfer the token ownership
    });

    res.status(200).json({ success: true, message: "Purchase successful" });
  } catch (error) {
    console.error("Error purchasing carbon credit:", error);
    res.status(400).json({ error: error.message });
  }
});

// Place a bid on an auction
router.post("/bid", authMiddleware, async (req, res) => {
  try {
    const { listingId, bidAmount } = req.body;
    const bidderUid = req.user.uid;

    if (!listingId || !bidAmount) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const db = getFirestore();
    const listingRef = db.collection("marketplace_listings").doc(listingId);

    await db.runTransaction(async (transaction) => {
      const listingDoc = await transaction.get(listingRef);

      if (!listingDoc.exists) {
        throw new Error("Listing not found");
      }

      const listing = listingDoc.data();

      // Check if listing is an auction
      if (!listing.is_auction) {
        throw new Error("This listing is not an auction");
      }

      // Check if auction is still active
      if (!listing.is_active) {
        throw new Error("This auction is no longer active");
      }

      // Check if auction has ended
      if (listing.auction_end && new Date(listing.auction_end) < new Date()) {
        throw new Error("This auction has ended");
      }

      // Check if bid is higher than current price
      if (bidAmount <= listing.current_price) {
        throw new Error("Bid must be higher than current price");
      }

      // Update the listing with the new bid
      transaction.update(listingRef, {
        current_price: bidAmount,
        price_history: [
          ...listing.price_history,
          {
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            price: bidAmount,
            bidder_uid: bidderUid,
          },
        ],
        high_bidder_uid: bidderUid,
      });

      // Log the bid
      const bidRef = db.collection("bids").doc();
      transaction.set(bidRef, {
        listing_id: listingId,
        bidder_uid: bidderUid,
        amount: bidAmount,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });
    });

    res.status(200).json({ success: true, message: "Bid placed successfully" });
  } catch (error) {
    console.error("Error placing bid:", error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
