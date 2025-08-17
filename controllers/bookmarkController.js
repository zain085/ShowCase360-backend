const { Bookmark } = require("../models/bookmarkModel");
const asyncHandler = require("express-async-handler");

// Controller to bookmark a session for an authenticated user
const bookmarkSession = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { sessionId } = req.body;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized. No user found in request." });
  }

  if (!sessionId) {
    return res.status(400).json({ message: "Session ID is required." });
  }

  const alreadyBookmarked = await Bookmark.findOne({ userId, sessionId });

  if (alreadyBookmarked) {
    return res.status(409).json({ message: "Session already bookmarked." });
  }

  const newBookmark = await Bookmark.create({ userId, sessionId });

  res.status(201).json({
    message: "Session bookmarked",
    success: true,
    bookmark: newBookmark,
  });
});

// Controller to retrieve all bookmarked sessions for an authenticated user
const getAttendeeBookmarks = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized. No user found in request." });
  }

  const bookmarks = await Bookmark.find({ userId }).populate("sessionId");

  res.status(200).json({
    message: "Bookmarked sessions",
    success: true,
    bookmarks,
  });
});

// Controller to remove a bookmarked session
const unbookmarkSession = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { sessionId } = req.params;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized. No user found in request." });
  }

  const removed = await Bookmark.findOneAndDelete({ userId, sessionId });

  if (!removed) {
    return res.status(404).json({ message: "Bookmark not found." });
  }

  res.status(200).json({
    message: "Bookmark removed",
    success: true,
  });
});

module.exports = {
  bookmarkSession,
  getAttendeeBookmarks,
  unbookmarkSession,
};
