const mongoose = require("mongoose");

const exhibitorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, 
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    productsOrServices: {
      type: String,
      required: true,
    },
    contactInfo: {
      type: String, 
      required: true,
    },
    logo: {
      type: String,
      default:
        "https://www.shutterstock.com/image-vector/image-icon-trendy-flat-style-600nw-643080895.jpg",
    },
    description: {
      type: String,
    },
    documents: [
      {
        type: String, 
      },
    ],
    applicationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
);

const Exhibitor = mongoose.model("Exhibitor", exhibitorSchema);
module.exports = { Exhibitor };
