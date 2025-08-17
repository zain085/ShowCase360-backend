const mongoose = require("mongoose");

const bookmarkSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session", 
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Bookmark = mongoose.model("Bookmark", bookmarkSchema);
module.exports = {
  Bookmark,
};
