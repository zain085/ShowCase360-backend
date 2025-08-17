const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      lowercase: true,
    },
    profileImg: {
      type: String,
      default:
        "https://img.freepik.com/premium-vector/male-face-avatar-icon-set-flat-design-social-media-profiles_1281173-3806.jpg?semt=ais_hybrid&w=740",
    },
    role: {
      type: String,
      enum: ["admin", "exhibitor", "attendee"],
      default: "attendee",
      required: true,
      lowercase: true
    },
    resetToken: {
      type: String,
    },
    resetTokenExpiry: {
      type: Date,
    },
    registeredExpos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Expo",
      },
    ],
    registeredSessions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Session",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = { User };
