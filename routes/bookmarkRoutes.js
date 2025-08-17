const express = require("express");
const {
  bookmarkSession,
  getAttendeeBookmarks,
  unbookmarkSession,
} = require("../controllers/bookmarkController");

const authenticate = require("../middlewares/authMiddleware");
const { authorizeRole } = require("../middlewares/roleMiddleware");

const bookmarkRouter = express.Router();

/**
 * @route   POST /bookmarks
 * @desc    Bookmark a session
 * @access  Attendee only
 */
bookmarkRouter.post("/", authenticate, authorizeRole("attendee"), bookmarkSession);

/**
 * @route   GET /bookmarks
 * @desc    Get all bookmarked sessions for the attendee
 * @access  Attendee only
 */
bookmarkRouter.get("/", authenticate, authorizeRole("attendee"), getAttendeeBookmarks);

/**
 * @route   DELETE /bookmarks/:sessionId
 * @desc    Remove a bookmarked session
 * @access  Attendee only
 */
bookmarkRouter.delete("/:sessionId", authenticate, authorizeRole("attendee"), unbookmarkSession);

module.exports = bookmarkRouter;
