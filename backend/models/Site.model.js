// Site model for MongoDB
const mongoose = require("mongoose");

const SiteSchema = new mongoose.Schema({
  siteId: {
    type: String,
    required: true,
    unique: true,
  },
  location: {
    lat: {
      type: Number,
      required: true,
    },
    lon: {
      type: Number,
      required: true,
    },
  },
  planting_date: {
    type: Date,
    required: true,
  },
  region: {
    type: String,
    required: true,
  },
  area_hectares: {
    type: Number,
    default: 10, // Default area
  },
  verificationStatus: {
    type: String,
    enum: ["pending", "verified", "rejected", "uncertain"],
    default: "pending",
  },
  lastVerified: Date,
  owner: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Site", SiteSchema);
