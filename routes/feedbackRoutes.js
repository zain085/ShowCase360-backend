const express = require("express");
const {
  submitFeedback,
  getAllFeedback,
  deleteFeedback,
} = require("../controllers/feedbackController");

const authenticate = require("../middlewares/authMiddleware");
const { authorizeRole } = require("../middlewares/roleMiddleware");

const feedbackRouter = express.Router();

/**
 * @route   POST /feedback
 * @desc    Submit feedback
 * @access  Authenticated users (attendee only)
 */
feedbackRouter.post("/", authenticate, submitFeedback);

/**
 * @route   GET /feedback
 * @desc    Get all submitted feedback
 * @access  Admin/Organizer only
 */
feedbackRouter.get("/", authenticate, authorizeRole("admin"), getAllFeedback);

/**
 * @route   DELETE /feedback/:id
 * @desc    Delete feedback by ID
 * @access  Admin/Organizer only
 */
feedbackRouter.delete("/:id", authenticate, authorizeRole("admin"), deleteFeedback);

module.exports = feedbackRouter;
