// Report model for MongoDB
const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema({
  siteId: {
    type: String,
    required: true,
    ref: "Site",
  },
  reportDate: {
    type: Date,
    default: Date.now,
  },
  submittedBy: {
    type: String,
    required: true,
  },
  reportType: {
    type: String,
    enum: [
      "initial_verification",
      "monitoring",
      "damage_report",
      "growth_update",
    ],
    default: "monitoring",
  },
  ndviData: {
    preValue: Number,
    postValue: Number,
    change: Number,
  },
  carbonEstimate: {
    tons: Number,
    confidence: Number,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  verificationData: {
    satelliteImageUrl: String,
    verificationDate: Date,
    verifierNotes: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Report", ReportSchema);
