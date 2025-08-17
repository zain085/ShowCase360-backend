const mongoose = require("mongoose");

const boothSchema = new mongoose.Schema(
  {
    expoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Expo",
      required: true,
    },
    boothNumber: {
      type: String,
      required: true,
      unique: true,
    },
    exhibitorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exhibitor",
      default: null,
    },
    location: {
      type: String,
      enum: ['First Floor', 'Second Floor', 'Third Floor', 'Basement'],
      required: true,
    },
    status: {
      type: String,
      enum: ["available", "reserved"],
      default: "available",
    },
  },
  {
    timestamps: true,
  }
);

const Booth = mongoose.model("Booth", boothSchema);
module.exports = { Booth };
