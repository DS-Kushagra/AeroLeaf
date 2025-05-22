// Carbon credit model for MongoDB
const mongoose = require("mongoose");

const CreditSchema = new mongoose.Schema({
  creditId: {
    type: String,
    required: true,
    unique: true,
  },
  siteId: {
    type: String,
    required: true,
  },
  owner: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number, // tons of CO2
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "available", "sold", "retired"],
    default: "pending",
  },
  vintage: {
    type: Number, // Year
    required: true,
  },
  region: {
    type: String,
    required: true,
  },
  history: [
    {
      event: {
        type: String,
        enum: ["Created", "Listed", "Sold", "Retired"],
      },
      price: Number,
      date: {
        type: Date,
        default: Date.now,
      },
      buyer: String,
      seller: String,
    },
  ],
  verifiedBy: String,
  verifiedDate: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  tokenId: String, // Reference to blockchain token ID
});

module.exports = mongoose.model("Credit", CreditSchema);
