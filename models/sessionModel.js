const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    expoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Expo",
      required: true,
    },
    topic: {
      type: String,
      required: true,
    },
    speaker: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    time: {
      start: {
        type: Date,
        required: true,
      },
      end: {
        type: Date,
        required: true,
      },
    },
    location: {
      type: String,
      required: true,
    },
    category: {
      type: String,
    },
    capacity: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["upcoming", "live", "completed"],
      default: "upcoming",
    },
  },
  {
    timestamps: true,
  }
);

const Session = mongoose.model("Session", sessionSchema);
module.exports = { Session };
